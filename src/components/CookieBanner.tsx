"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

type Consent = {
  decided: boolean;
  marketing: boolean;
  ts: number;
};

const STORAGE_KEY = "consent_v1";

function getStored(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function pushDL(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  window.dataLayer.push({ event, ...data });
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [marketing, setMarketing] = useState(true); // default ON (your call)
  const [expanded, setExpanded] = useState(false); // collapsed by default

  const APPEAR_DELAY_MS = 1000; // delay before showing (1 second)

  useEffect(() => {
    const stored = getStored();
    if (!stored?.decided) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, APPEAR_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  function saveConsent(nextMarketing: boolean) {
    const payload: Consent = { decided: true, marketing: nextMarketing, ts: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
    // Always push a general consent event
    pushDL("consent_granted", { marketing: nextMarketing });
    // If they opted in to marketing, push a dedicated marketing event too
    if (nextMarketing) pushDL("marketing_consent_granted");
    setOpen(false);
  }

  function onReject() {
    saveConsent(false);
  }
  function onAccept() {
    saveConsent(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-live="polite"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={[
            "fixed z-[1000] shadow-lg",
            // position bottom-right with safe-area padding
            "right-[max(1rem,env(safe-area-inset-right))]",
            "bottom-[max(1rem,env(safe-area-inset-bottom))]",
            // width depending on state
            expanded ? "w-[min(92vw,540px)]" : "w-[min(92vw,360px)]",
            "rounded-2xl border border-neutral-800 bg-neutral-900/90 backdrop-blur",
            "p-4 md:p-5",
          ].join(" ")}
        >
          {!expanded ? (
        // Collapsed: one-liner + three buttons
        <div className="flex flex-col gap-3">
          <p className="text-xs leading-relaxed text-neutral-300">
            We use cookies for essential site functions and basic analytics. You can manage
            marketing preferences.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800"
            >
              Preferences
            </button>
            <button
              type="button"
              onClick={onReject}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-200"
            >
              Accept
            </button>
          </div>
        </div>
      ) : (
        // Expanded: categories + actions
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-neutral-200">
              Cookies &amp; Preferences
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
              Necessary cookies keep the site running. Marketing helps us personalize outreach.
              Read our{" "}
              <a href="/privacy" className="underline hover:text-neutral-200">
                Privacy Policy
              </a>
              .
            </p>
          </div>
  
          <div className="grid gap-3 md:grid-cols-2">
            {/* Necessary (locked) */}
            <div className="rounded-xl border border-neutral-800 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-neutral-200">Necessary</div>
                  <div className="text-xs text-neutral-400">Always enabled</div>
                </div>
                <div
                  aria-label="Necessary cookies always enabled"
                  className="select-none rounded-full bg-neutral-700 px-2 py-1 text-[10px] uppercase tracking-wide text-neutral-200"
                >
                  On
                </div>
              </div>
            </div>
  
            {/* Marketing (toggle) */}
            <div className="rounded-xl border border-neutral-800 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-neutral-200">Marketing</div>
                  <div className="text-xs text-neutral-400">
                    Allows personalized outreach &amp; promotions.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMarketing((v) => !v)}
                  className={[
                    "relative inline-flex h-6 w-11 items-center rounded-full transition",
                    marketing ? "bg-neutral-100" : "bg-neutral-700",
                  ].join(" ")}
                  aria-pressed={marketing}
                  aria-label="Toggle marketing cookies"
                >
                  <span
                    className={[
                      "inline-block h-5 w-5 transform rounded-full bg-neutral-900 transition",
                      marketing ? "translate-x-5" : "translate-x-1",
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>
          </div>
  
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => saveConsent(false)}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
            >
              Accept necessary only
            </button>
            <button
              type="button"
              onClick={() => saveConsent(marketing)}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200"
            >
              Save preferences
            </button>
            <button
              type="button"
              onClick={() => saveConsent(true)}
              className="rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
            >
              Accept all
            </button>
          </div>
  
          <div className="text-right">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-[11px] text-neutral-400 underline hover:text-neutral-200"
            >
              Collapse
            </button>
          </div>
        </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}