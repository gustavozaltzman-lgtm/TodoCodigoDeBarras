"use server";

import { compare } from "bcryptjs";
import { and, eq, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { loginAttempts, users } from "@/lib/db/schema";
import { createSession, destroySession } from "./session";

const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return headersList.get("x-real-ip") ?? "unknown";
}

export type LoginState = { error: string | null };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa email y contraseña" };
  }

  const ipAddress = await getClientIp();
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(loginAttempts)
    .where(
      and(eq(loginAttempts.ipAddress, ipAddress), gt(loginAttempts.createdAt, windowStart))
    );

  if (count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return {
      error: "Demasiados intentos fallidos. Probá de nuevo en unos minutos.",
    };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const valid = user ? await compare(password, user.passwordHash) : false;

  if (!user || !valid) {
    await db.insert(loginAttempts).values({ ipAddress, email });
    return { error: "Credenciales invalidas" };
  }

  await createSession(user.id, user.email);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
