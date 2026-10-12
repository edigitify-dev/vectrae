"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { signIn, type ActionState } from "@/lib/admin/actions";
import { BRAND_GRADIENT } from "@/lib/brand";
import { BUTTON_PRIMARY, INPUT, LABEL } from "./tokens";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{ backgroundImage: BRAND_GRADIENT }}
      className={`${BUTTON_PRIMARY} w-full`}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Signing in…
        </>
      ) : (
        <>
          Sign in
          <ArrowRight className="h-4 w-4" aria-hidden />
        </>
      )}
    </button>
  );
}

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(signIn, {});

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {next && <input type="hidden" name="next" value={next} />}

      <div className="space-y-2">
        <label className={LABEL} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          required
          maxLength={254}
          className={INPUT}
          placeholder="Your admin username"
        />
      </div>

      <div className="space-y-2">
        <label className={LABEL} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={INPUT}
          placeholder="••••••••••"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
