"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-primary">
          Panel de administración
        </h1>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-secondary">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-secondary"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>

        {state.error && (
          <p className="text-sm text-destructive" role="alert" aria-live="polite">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
