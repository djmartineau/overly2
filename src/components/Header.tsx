"use client";

import React from "react";
import GlassLens from "./GlassLens";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-4 inset-x-0 z-[9999] flex justify-center pointer-events-none">
      <div
        className="relative pointer-events-auto rounded-full px-6 py-3 bg-white/10 backdrop-blur-none ring-1 ring-white/20 shadow-[0_8px_24px_rgba(2,6,23,0.25)] overflow-hidden"
        style={{ width: "min(92vw, 1000px)" }}
      >
        {/* WebGL lens behind the nav content */}
        <GlassLens enableHover enableRipple magnify={2.6} />

        {/* Nav content above the lens */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4 sm:gap-8 max-w-[1000px] mx-auto">
            <Link href="/" className="inline-flex items-center" aria-label="Overly">
              <img
                src="/Overly.svg"
                alt="Overly logo"
                className="h-12 w-auto invert"
                draggable={false}
              />
            </Link>
            <nav
              role="navigation"
              aria-label="Primary"
              className="flex items-center gap-6 sm:gap-8 text-sm"
            >
              <Link className="text-blue-600/90 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded" href="/#work">Work</Link>
              <Link className="text-blue-600/90 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded" href="/#services">Services</Link>
              <Link className="text-blue-600/90 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded" href="/#about">About</Link>
              <Link className="text-blue-600/90 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded" href="/#contact">Contact</Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}