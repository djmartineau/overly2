"use client";

import { useEffect, useRef } from "react";

// 1. Describe what fbq looks like
type FbqFn = (...args: unknown[]) => void;

interface FbqStub extends FbqFn {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push: unknown[];
}

// 2. Extend window so TS is happy
declare global {
  interface Window {
    fbq?: FbqStub;
    _fbq?: FbqStub;
  }
}

export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const initializedRef = useRef(false);

  useEffect(() => {
    // no pixel id -> do nothing
    if (!pixelId) return;

    // avoid double init in dev / hot reload
    if (initializedRef.current) return;
    initializedRef.current = true;

    // if fbq isn't defined yet, create it and inject the script
    if (!window.fbq) {
      // create stub function with queue, etc.
      const stub: FbqStub = function (...args: unknown[]) {
        // if real callMethod exists, use it; otherwise push to queue
        if (stub.callMethod) {
          stub.callMethod(...args);
        } else {
          stub.queue.push(args);
        }
      } as FbqStub;

      stub.queue = [];
      stub.loaded = true;
      stub.version = "2.0";
      stub.push = stub.queue;

      window.fbq = stub;
      window._fbq = stub;

      // now inject the real pixel script
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
    }

    // tell Meta our pixel ID
    window.fbq?.("init", pixelId);

    // record first page view
    window.fbq?.("track", "PageView");
  }, [pixelId]);

  // noscript fallback for browsers with JS disabled
  return pixelId ? (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  ) : null;
}