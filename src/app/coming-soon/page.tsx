"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ComingSoon() {
  const sp = useSearchParams();
  const err = sp.get("err");
  const [busy, setBusy] = useState(false);
  const [showErr, setShowErr] = useState<boolean>(false);

  useEffect(() => {
    if (err) setShowErr(true);
  }, [err]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 grid place-items-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md shadow-[0_20px_60px_-30px_rgba(0,0,0,.6)]">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Coming soon</h1>
          <p className="mt-2 text-sm text-neutral-400">
            This site is in pre-launch. Enter the access password to continue.
          </p>
        </div>

        <form
          action="/api/auth"
          method="POST"
          className="mt-6 space-y-4"
          onSubmit={() => {
            setBusy(true);
            setShowErr(false);
          }}
        >
          {/* If you later want to redirect to the original page, you can pass next here and read it in the API */}
          {/* <input type="hidden" name="next" value={sp.get('next') ?? '/'} /> */}

          <label className="block text-sm font-medium text-neutral-300">
            Access password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg bg-neutral-900/70 px-4 py-2.5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </label>

          {showErr && (
            <p className="text-sm text-red-400">Incorrect password. Try again.</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-blue-500 px-4 py-2.5 font-semibold text-white shadow hover:bg-blue-400 transition disabled:opacity-60"
          >
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} OVERLY
        </p>
      </div>
    </main>
  );
}