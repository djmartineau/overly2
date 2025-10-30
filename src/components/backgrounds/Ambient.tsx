// src/components/backgrounds/Ambient.tsx
"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

/**
 * Soft iridescent ambient background:
 * - Two gradient washes (top-left blue, bottom-right purple)
 * - Mouse-reactive glow that eases toward the cursor
 * - Very light grain for texture
 */
export default function Ambient() {
  // Track normalized cursor position across the viewport (-0.5..0.5)
  const xMv = useMotionValue(0);
  const yMv = useMotionValue(0);

  // Parallax travel (tweak numbers for more/less movement)
  const rawX = useTransform(xMv, (v) => v * 56);
  const rawY = useTransform(yMv, (v) => v * 40);

  // Smooth motion so it glides instead of snapping
  const x = useSpring(rawX, { stiffness: 100, damping: 20, mass: 0.8 });
  const y = useSpring(rawY, { stiffness: 100, damping: 20, mass: 0.8 });

  // Rotate a touch based on X (purely aesthetic)
  const rot = useSpring(useTransform(xMv, (v) => v * 10), {
    stiffness: 100,
    damping: 20,
    mass: 0.8,
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      xMv.set(nx);
      yMv.set(ny);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [xMv, yMv]);

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden
    >
      {/* Mouse-reactive glow blob */}
      {/*
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-[40%] opacity-80"
        style={{
          x,
          y,
          rotate: rot,
          background:
            "radial-gradient(35% 40% at 50% 45%, rgba(96,165,250,0.65) 0%, rgba(96,165,250,0.35) 35%, rgba(167,139,250,0.35) 55%, rgba(34,211,238,0.22) 75%, rgba(0,0,0,0) 100%)",
          filter: "blur(22px) saturate(120%)",
          willChange: "transform",
        }}
      />
      */}

      {/* Ambient washes (visible on dark bg) */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_20%_10%,rgba(80,150,255,.28),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_90%,rgba(190,120,255,.26),transparent_60%)] blur-2xl" />

      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:3px_3px]" />
    </div>
  );
}