"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
  children: React.ReactNode;
};

export default function SlideOver({ open, onClose, title = "Start a project", initialFocusRef, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Restore focus & set initial focus
  useEffect(() => {
    if (open) {
      lastActiveRef.current = document.activeElement as HTMLElement;
      (initialFocusRef?.current ?? panelRef.current)?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      lastActiveRef.current?.focus();
    }
  }, [open, initialFocusRef]);

  const trapFocus = (e: KeyboardEvent) => {
    if (!panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!open || !mounted || typeof document === "undefined") return null;

  const target = typeof document !== "undefined" ? document.body : null;
  if (!target) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[9999] flex"
      onMouseDown={(e) => {
        // click outside closes
        if (e.target instanceof Element && e.target === e.currentTarget) onClose();
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[1]" />

      {/* panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="ml-auto h-full w-full max-w-lg bg-neutral-950 ring-1 ring-white/10 shadow-2xl outline-none translate-x-0 relative flex flex-col z-[2]"
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10"
          >
            ESC
          </button>
        </header>
        <div className="p-5 overflow-auto">{children}</div>
      </div>
    </div>,
    target
  );
}