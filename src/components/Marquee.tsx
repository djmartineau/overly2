"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/** Real logos placed in /public/brands */
const brands: { name: string; src: string }[] = [
  { name: "Aura", src: "/brands/aura_logo.svg" },
  { name: "Benji Box", src: "/brands/benjibox_logo.svg" },
  { name: "Early Hour", src: "/brands/earlyhour_logo.svg" },
  { name: "Hopper", src: "/brands/hopper_logo.svg" },
  { name: "Klyro", src: "/brands/klyro_logo.svg" },
  { name: "Koba", src: "/brands/koba_logo.svg" },
  { name: "Le Petite Cafe", src: "/brands/lepetitecafe_logo.svg" },
  { name: "Redwood Supply", src: "/brands/redwoodsupply_logo.svg" },
  { name: "Arcane", src: "/brands/arcane_logo.svg" },
  { name: "Ardent Labs", src: "/brands/ardentlabs_logo.svg" },
  { name: "Driftline Coffee", src: "/brands/driftlinecoffee_logo.svg" },
  { name: "F6 Safegaurd", src: "/brands/f6safegaurd_logo.svg" },
  { name: "Flowstack", src: "/brands/flowstack_logo.svg" },
  { name: "Sienna & Co.", src: "/brands/siennaandco_logo.svg" },
  { name: "Creturion", src: "/brands/creturion_logo.svg" },
  { name: "Nassau Roofing Co.", src: "/brands/nassau_logo.svg" },
  { name: "North Florida Asphalt", src: "/brands/northfloridaasphalt_logo.svg" },
  { name: "SunCoast", src: "/brands/suncoast_logo.svg" },
];

function BrandPill({ logo }: { logo: { name: string; src: string } }) {
  return (
    <div className="inline-flex items-center justify-center h-[60px] w-[120px]">
      <Image
        src={logo.src}
        alt=""
        width={140}
        height={40}
        className="h-[60px] w-full object-contain opacity-30 transition-opacity duration-300"
        loading="lazy"
        aria-hidden
      />
      <span className="sr-only">{logo.name}</span>
    </div>
  );
}

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);

  // Keep a stable order to avoid SSR/client mismatches
  const [visibleBrands] = useState(brands);

  // Speeds in px/frame (RAF ~60fps). Tune as you like.
  const baseSpeed = 0.6; // faster scroll

  const offsetRef = useRef(0);
  const seqWidthRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);
  const runningRef = useRef(true);

  useEffect(() => {
    // Respect prefers-reduced-motion
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Measure the width of ONE sequence precisely and keep it fresh on resize
    const measure = () => {
      if (!seqRef.current || !trackRef.current) return;
      const w = seqRef.current.scrollWidth; // ignores transform scaling of children

      if (w && w !== seqWidthRef.current) {
        seqWidthRef.current = w;
        // Reset offset when the content width changes to avoid visible jumps
        offsetRef.current = 0;
        trackRef.current.style.transform = "translate3d(0,0,0)";
      }
    };
    measure();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && seqRef.current) {
      ro = new ResizeObserver(measure);
      ro.observe(seqRef.current);
    } else {
      window.addEventListener("resize", measure);
    }

    // Pause animation when tab is hidden
    const onVis = () => {
      runningRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    const loop = () => {
      if (!trackRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const seqW = seqWidthRef.current;
      if (!reduceMotionRef.current && runningRef.current && seqW > 0) {
        // advance at a constant speed and wrap using modulo of single sequence width
        offsetRef.current = (offsetRef.current - baseSpeed) % seqW;

        // Normalize negative modulo result so translate starts in [-seqW, 0)
        const x = offsetRef.current <= 0 ? offsetRef.current : offsetRef.current - seqW;

        trackRef.current.style.transform = `translate3d(${x}px,0,0)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVis);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="relative py-8 sm:py-10 bg-neutral-950 text-white">
      <div className="text-sm uppercase tracking-[.2em] text-white/50 text-center mb-6">
        Brands we’ve elevated
      </div>

      {/* Edge fade mask so the seam is invisible */}
      <div
        className="relative overflow-visible py-2 isolate"
      >
        {/* We translate this whole track. It contains 3 sequences:
            [A][A][A] so wrapping by the width of ONE [A] is seamless. */}
        <div
          ref={trackRef}
          className="flex whitespace-nowrap gap-14 will-change-transform select-none z-0"
          style={{ transform: "translate3d(0,0,0)" }}
          aria-hidden
        >
          {/* ONE canonical sequence to measure */}
          <div ref={seqRef} className="flex whitespace-nowrap gap-14 contain-content">
            {visibleBrands.map((b, i) => (
              <BrandPill key={`a-${i}`} logo={b} />
            ))}
          </div>

          {/* Two additional clones ensure coverage during wrap */}
          <div className="flex whitespace-nowrap gap-14" aria-hidden>
            {visibleBrands.map((b, i) => (
              <BrandPill key={`b-${i}`} logo={b} />
            ))}
          </div>
          <div className="flex whitespace-nowrap gap-14" aria-hidden>
            {visibleBrands.map((b, i) => (
              <BrandPill key={`c-${i}`} logo={b} />
            ))}
          </div>
        </div>

        {/* Edge fades as overlays (not masks) so hover can escape clipping */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent z-10" />
      </div>

    </section>
  );
}