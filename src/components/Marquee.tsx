"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const brands = [
  "Company 1",
  "Company 2",
  "Company 3",
  "Company 4",
  "Company 5",
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const baseSpeed = 0.18; // slower default
  const hoverSpeed = 0.05; // slow-down on hover
  const speedRef = useRef(baseSpeed);
  const targetSpeedRef = useRef(baseSpeed);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let offset = 0;
    let raf = 0;

    const loop = () => {
      if (track) {
        // ease current speed toward target
        const eased = speedRef.current + (targetSpeedRef.current - speedRef.current) * 0.08;
        speedRef.current = eased;
        offset -= eased;
        const half = track.scrollWidth / 2;
        if (offset <= -half) offset += half;
        track.style.transform = `translate3d(${offset}px,0,0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative py-12 bg-neutral-950 text-white">
      <div className="text-sm uppercase tracking-[.2em] text-white/50 text-center mb-6">
        Brands we’ve elevated
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => (targetSpeedRef.current = hoverSpeed)}
        onMouseLeave={() => (targetSpeedRef.current = baseSpeed)}
      >
        <div
          ref={trackRef}
          className="flex whitespace-nowrap gap-12 will-change-transform"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="group relative overflow-hidden inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 min-w-[160px] bg-white/5 transition-transform duration-300 hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:skew-x-12 before:transition-transform before:duration-700 hover:before:translate-x-[200%]"
            >
              <Image
                src="/globe.svg"
                alt="Globe icon"
                width={22}
                height={22}
                className="opacity-80"
                priority
              />
              <span className="text-white/90">{brand}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-center mt-6 text-white/40">
        (Demo brands for now — replace with client logos or names)
      </div>
    </div>
  );
}