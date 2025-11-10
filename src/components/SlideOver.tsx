"use client";

import React, { useEffect, useRef, useId, useState } from "react";
import { createPortal } from "react-dom";

type Inertable = HTMLElement & { inert?: boolean };

type SlideOverProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function SlideOver({ open, onClose, title, children }: SlideOverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [entered, setEntered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isMounted) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMounted]);

  // Inert background when open for better a11y
  useEffect(() => {
    if (!isMounted) return;
    const rootEl = containerRef.current;
    const siblings = Array.from(document.body.children) as Inertable[];
    const toToggle = siblings.filter((el) => el !== rootEl);
    const prev: Array<{ el: Inertable; inert?: boolean; ariaHidden: string | null }> = [];
    toToggle.forEach((el) => {
      const node = el as Inertable;
      prev.push({ el: node, inert: node.inert, ariaHidden: node.getAttribute("aria-hidden") });
      node.inert = true;
      node.setAttribute("aria-hidden", "true");
    });
    return () => {
      prev.forEach(({ el, inert, ariaHidden }) => {
        el.inert = inert ?? false;
        if (ariaHidden === null) el.removeAttribute("aria-hidden");
        else el.setAttribute("aria-hidden", ariaHidden);
      });
    };
  }, [isMounted]);

  // Mount for enter, keep mounted for exit so we can animate out
  useEffect(() => {
    if (open) {
      // Remember the element that opened us for focus return later
      prevFocusRef.current = (document.activeElement as HTMLElement) ?? null;
      setIsMounted(true);
      setEntered(false);
      const rafId = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(rafId);
    } else {
      if (!isMounted) return;
      // start exit
      setEntered(false);
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const delay = reduce ? 150 : 300; // keep in sync with CSS durations
      const t = setTimeout(() => {
        setIsMounted(false);
        // restore focus to trigger
        prevFocusRef.current?.focus?.();
        prevFocusRef.current = null;
      }, delay);
      return () => clearTimeout(t);
    }
  }, [open, isMounted]);

  // Focus initial element and trap focus within panel
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    // focus first focusable
    const focusable = panel.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = Array.from(
        panel.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((n) => !n.hasAttribute("disabled") && !n.getAttribute("aria-hidden"));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (typeof document === "undefined" || !isMounted) return null;

  return createPortal(
    <div ref={containerRef} className="fixed inset-0 z-[9999] flex" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 motion-reduce:duration-100 ${entered ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative z-10 ml-auto h-full w-full max-w-lg bg-neutral-950 ring-1 ring-white/10 shadow-2xl outline-none flex flex-col transform transition-transform duration-300 motion-reduce:duration-150 motion-reduce:transform-none ${entered ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 id={titleId} className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10"
          >
            Close
          </button>
        </header>
        <div className="p-5 overflow-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}