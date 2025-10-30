"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** Replace with your real data later */
const brands = ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"];

function BrandPill({ label }: { label: string }) {
  return (
    <div
      className="group relative overflow-hidden inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 min-w-[160px] bg-white/5 transition-transform duration-300 hover:scale-105
                 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full before:skew-x-12 before:transition-transform before:duration-700 group-hover:before:translate-x-[200%]"
    >
      <Image
        src="/globe.svg"
        alt=""
        width={22}
        height={22}
        className="opacity-80"
        priority
        aria-hidden
      />
      <span className="text-white/90">{label}</span>
    </div>
  );
}

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);

  // Speeds in px/frame (RAF ~60fps). Tune as you like.
  const baseSpeed = 0.18;
  const hoverSpeed = 0.05;

  const speedRef = useRef(baseSpeed);
  const targetSpeedRef = useRef(baseSpeed);
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
      const w = seqRef.current.getBoundingClientRect().width;
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
        // ease current speed toward target
        speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;

        // advance and wrap using modulo of single sequence width
        offsetRef.current = (offsetRef.current - speedRef.current) % seqW;

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
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
        onMouseEnter={() => (targetSpeedRef.current = hoverSpeed)}
        onMouseLeave={() => (targetSpeedRef.current = baseSpeed)}
      >
        {/* We translate this whole track. It contains 3 sequences:
            [A][A][A] so wrapping by the width of ONE [A] is seamless. */}
        <div
          ref={trackRef}
          className="flex whitespace-nowrap gap-12 will-change-transform select-none"
          style={{ transform: "translate3d(0,0,0)" }}
          aria-hidden
        >
          {/* ONE canonical sequence to measure */}
          <div ref={seqRef} className="flex whitespace-nowrap gap-12">
            {brands.map((b, i) => (
              <BrandPill key={`a-${i}`} label={b} />
            ))}
          </div>

          {/* Two additional clones ensure coverage during wrap */}
          <div className="flex whitespace-nowrap gap-12" aria-hidden>
            {brands.map((b, i) => (
              <BrandPill key={`b-${i}`} label={b} />
            ))}
          </div>
          <div className="flex whitespace-nowrap gap-12" aria-hidden>
            {brands.map((b, i) => (
              <BrandPill key={`c-${i}`} label={b} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-center mt-6 text-white/40">
        (Demo brands for now — replace with client logos or names)
      </div>
    </section>
  );
}