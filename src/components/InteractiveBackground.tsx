"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import HeroPrismBurst from "@/components/HeroPrismBurst";

type Props = {
  showPrism?: boolean;
  intensity?: number;    // mouse movement strength
  className?: string;    // to tweak z-index/position when needed
};

export default function InteractiveBackground({
  showPrism = true,
  intensity = 1,
  className = "",
}: Props) {
  const xMv = useMotionValue(0);
  const yMv = useMotionValue(0);
  // subtle parallax transforms (scaled by intensity)
  const blobX = useTransform(xMv, (v) => v * 36 * intensity);
  const blobY = useTransform(yMv, (v) => v * 28 * intensity);
  const blobR = useTransform(xMv, (v) => v * 10 * intensity);

  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5); // -0.5..0.5
      const ny = ((e.clientY - rect.top) / rect.height - 0.5);
      xMv.set(nx);
      yMv.set(ny);
    };

    // Track mouse only while inside the section (cheap!)
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [xMv, yMv]);

  return (
    <div
      ref={hostRef}
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
      aria-hidden
    >
      {/* Prism burst (SVG) behind */}
      {showPrism && (
        <HeroPrismBurst
          className="absolute inset-0"
          width={1200}
          height={680}
          centerBias={{ x: 0, y: -0.45 }}
        />
      )}

      {/* Mouse-reactive glow blob */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-[40%] opacity-70"
        style={{
          x: blobX,
          y: blobY,
          rotate: blobR,
          background:
            "radial-gradient(35% 40% at 50% 45%, rgba(96,165,250,0.55) 0%, rgba(96,165,250,0.25) 35%, rgba(167,139,250,0.25) 55%, rgba(34,211,238,0.18) 75%, rgba(0,0,0,0) 100%)",
          filter: "blur(20px) saturate(120%)",
          willChange: "transform",
        }}
      />

      {/* Ambient washes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(50,140,255,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(190,120,255,0.22),transparent_55%)] blur-2xl" />

      {/* Optional subtle grain (pure CSS; cheap) */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:3px_3px]" />
    </div>
  );
}