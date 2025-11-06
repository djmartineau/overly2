"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** Real logos placed in /public/brands */
const brands: { name: string; src: string }[] = [
  { name: "Arcane", src: "/brands/arcane_logo.svg" },
  { name: "Ardent Labs", src: "/brands/ardentlabs_logo.svg" },
  { name: "Driftline Coffee", src: "/brands/driftlinecoffee_logo.svg" },
  { name: "F6 Safegaurd", src: "/brands/f6safegaurd_logo.svg" },
  { name: "Flowstack", src: "/brands/flowstack_logo.svg" },
  { name: "Sienna & Co.", src: "/brands/siennaandco_logo.svg" },
];

function BrandPill({ logo }: { logo: { name: string; src: string } }) {
  return (
    <div
      className="group relative overflow-hidden inline-flex items-center justify-center rounded-[24px] border border-white/10 h-[100px] w-[100px] p-2 bg-white/5 transition-transform duration-300 hover:z-50 hover:scale-[1.22] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full before:skew-x-12 before:transition-transform before:duration-700 group-hover:before:translate-x-[200%]"
    >
      <Image
        src={logo.src}
        alt=""
        width={140}
        height={40}
        className="h-[80px] w-auto object-contain opacity-30 hover:opacity-50 transition-opacity duration-300"
        priority
        aria-hidden
      />
      <span className="sr-only">{logo.name}</span>
    </div>
  );
}

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);

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
      if (!seqRef.current) return;
      const w = seqRef.current.scrollWidth; // ignores transform scaling of children
      seqWidthRef.current = w;
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
    <section className="relative py-12 bg-neutral-950 text-white">
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
            {brands.map((b, i) => (
              <BrandPill key={`a-${i}`} logo={b} />
            ))}
          </div>

          {/* Two additional clones ensure coverage during wrap */}
          <div className="flex whitespace-nowrap gap-14" aria-hidden>
            {brands.map((b, i) => (
              <BrandPill key={`b-${i}`} logo={b} />
            ))}
          </div>
          <div className="flex whitespace-nowrap gap-14" aria-hidden>
            {brands.map((b, i) => (
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