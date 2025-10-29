"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  useEffect(() => {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
    if (!GA_ID) return;

    // 1. Inject the gtag <script async src="...">
    // Only add it once.
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src*="https://www.googletagmanager.com/gtag/js?id="]`
    );

    if (!existing) {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      script.async = true;
      document.head.appendChild(script);
    }

    // 2. Init the global dataLayer + gtag function
    //    (this matches the GA snippet Google gives you)
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }

    gtag("js", new Date());
    gtag("config", GA_ID, {
      // optional extras:
      page_path: window.location.pathname,
    });

    // 3. (optional) listen for route changes to send pageviews
    //    If/when you add client-side routing between pages (/privacy, /terms, etc.)
    //    we can hook into next/navigation router events here and fire another gtag('config', GA_ID, { page_path: newPath })
    //    For now your site is basically one main page, so we don't need that yet.
  }, []);

  return null;
}