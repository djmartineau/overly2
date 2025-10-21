"use client";

import React from "react";
import GlassLens from "./GlassLens";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const handleNav = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    (window as any).__skipHeroIntercept = Date.now() + 1500; // bypass first-scroll logic for 1.5s
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed top-4 inset-x-0 z-[9999] flex justify-center pointer-events-none h-16">
      <div
        className="relative pointer-events-auto rounded-full px-6 bg-white/10 ring-1 ring-white/20 shadow-[0_8px_24px_rgba(2,6,23,0.25)] overflow-hidden h-16 flex items-center"
        style={{ width: "min(92vw, 1000px)" }}
      >
        {/* WebGL lens behind the nav content */}
        <GlassLens enableHover enableRipple magnify={2.6} />

        {/* Nav content above the lens */}
        <div className="relative z-10 w-full">
          <div className="flex h-full w-full items-center justify-between gap-4 sm:gap-8">
            <div className="flex items-center">
              <Link href="/" className="inline-flex items-center" aria-label="Overly">
                <Image
                  src="/OverlyLogo.svg"
                  alt="Overly logo"
                  width={110}
                  height={40}
                  className="invert block"
                  priority
                />
              </Link>
            </div>
            <nav
              role="navigation"
              aria-label="Primary"
              className="flex items-center gap-6 sm:gap-8 text-sm leading-none"
            >
              <Link
                className="text-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded font-medium transition-transform hover:scale-110"
                href="/#process"
                onClick={handleNav("process")}
              >
                Work
              </Link>
              <Link
                className="text-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded font-medium transition-transform hover:scale-110"
                href="/#capabilities"
                onClick={handleNav("capabilities")}
              >
                Services
              </Link>
              <Link
                className="text-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded font-medium transition-transform hover:scale-110"
                href="/#about"
                onClick={handleNav("about")}
              >
                About
              </Link>
              <Link
                className="text-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded font-medium transition-transform hover:scale-110"
                href="/#contact"
                onClick={handleNav("contact")}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}