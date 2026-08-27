import "dotenv/config";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { users } from "./schema";

async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Definir SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD como variables de entorno antes de correr el seed"
    );
  }

  const passwordHash = await hash(password, 12);

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, existing.id));
    console.log(`Usuario admin actualizado: ${email}`);
  } else {
    await db.insert(users).values({
      email,
      passwordHash,
      name: "Admin",
      role: "admin",
    });
    console.log(`Usuario admin creado: ${email}`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
