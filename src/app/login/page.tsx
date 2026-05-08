"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { sendMagicLink } from "@/app/actions/auth";

const ERROR_COPY: Record<string, string> = {
  not_authorized: "Email not on allowlist. Ask Dave to add you.",
  callback_failed: "Magic link expired or already used. Send a fresh one.",
  admin_check_failed: "Couldn't verify allowlist — try again.",
};

export default function LoginPage() {
  const params = useSearchParams();
  const errorParam = params.get("error");
  const [state, formAction, pending] = useActionState(sendMagicLink, undefined);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="text-xs tracking-[0.3em] text-cyan-400 font-mono mb-1 text-center">
          CENTRIPETAL // COS COCKPIT
        </div>
        <h1 className="text-3xl font-light tracking-tight text-center mb-8">Sign in</h1>

        {errorParam && ERROR_COPY[errorParam] && (
          <div className="mb-4 p-3 rounded bg-amber-950/40 border border-amber-700/60 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-xs text-amber-300">{ERROR_COPY[errorParam]}</span>
          </div>
        )}

        {state?.ok ? (
          <div className="p-6 rounded-lg bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-700/60">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-3" />
            <div className="text-emerald-300 font-semibold mb-1">Check your email</div>
            <div className="text-xs text-slate-400 italic">
              Magic link sent to {state.sentTo}. Click it to sign in.
            </div>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 mb-2 block">
                email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-700"
                placeholder="dave@dm3consulting.com"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full p-3 rounded font-medium text-sm bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-700/60 text-cyan-300 hover:border-cyan-500 hover:text-cyan-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {pending ? "Sending..." : "Send magic link"}
            </button>
            {state?.error && (
              <div className="text-xs text-rose-400 italic font-mono">{state.error}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
