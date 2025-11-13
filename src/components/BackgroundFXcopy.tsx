// src/components/BackgroundFX.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function BackgroundFX() {
  const { scrollYProgress } = useScroll();

  // gentle, low-frequency parallax shifts
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -120]);   // back layer drifts slower
  const yMed  = useTransform(scrollYProgress, [0, 1], [0, -220]);   // middle layer
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -360]);   // top glow

  // subtle opacity choreography across the page
  const glow1Opacity = useTransform(scrollYProgress, [0.00, 0.25, 0.50], [0.6, 0.4, 0.2]);
  const glow2Opacity = useTransform(scrollYProgress, [0.30, 0.60, 1.00], [0.0, 0.5, 0.3]);
  const vignetteOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.45]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* base color & grain (CSS handles grain) */}
      <div className="absolute inset-0 bg-neutral-950 bg-grain" />

      {/* far radial glow (cool) */}
      <motion.div
        style={{ y: ySlow, opacity: glow1Opacity }}
        className="absolute -top-1/3 -left-1/4 h-[120vh] w-[120vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,97,255,0.35),transparent_60%)] blur-3xl mix-blend-screen"
      />

      {/* mid radial glow (warm) */}
      <motion.div
        style={{ y: yMed, opacity: glow2Opacity }}
        className="absolute -bottom-1/3 -right-1/4 h-[120vh] w-[120vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,88,100,0.35),transparent_60%)] blur-3xl mix-blend-screen"
      />

      {/* top “highlight sweep” (soft white) */}
      <motion.div
        style={{ y: yFast, opacity: 0.15 }}
        className="absolute top-[-20vh] left-1/2 -translate-x-1/2 h-[60vh] w-[120vw] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),transparent_60%)] blur-[80px] mix-blend-screen"
      />

      {/* vignette to keep edges rich */}
      <motion.div
        style={{ opacity: vignetteOpacity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6))]"
      />
    </div>
  );
}