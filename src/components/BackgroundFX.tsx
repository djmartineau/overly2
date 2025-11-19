// src/components/BackgroundFX.tsx
"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export default function BackgroundFX({ progress }: { progress?: MotionValue<number> }) {
  const { scrollYProgress } = useScroll();
  const source = progress ?? scrollYProgress;

  // subtle opacity choreography across the page
  const glow1Opacity = useTransform(source, [0.00, 0.25, 0.50], [0.6, 0.4, 0.2]);
  const glow2Opacity = useTransform(source, [0.30, 0.60, 1.00], [0.0, 0.5, 0.3]);
  const vignetteOpacity = useTransform(source, [0, 1], [0.35, 0.45]);

  const overallOpacity = useTransform(
    source,
    [0, 0.22, 0.35],
    [1, 1, 0]
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity: overallOpacity }}
    >
      {/* base color & grain (CSS handles grain) */}
      <div className="absolute inset-0 bg-neutral-950 bg-grain" />

      {/* AI waves (CSS animated gradient) */}
      <div className="absolute inset-0 ai-waves" />

      {/* far radial glow (cool) */}
      <motion.div
        style={{ opacity: glow1Opacity }}
        className="absolute -top-1/3 -left-1/4 h-[120vh] w-[120vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,97,255,0.35),transparent_60%)] blur-3xl mix-blend-screen"
      />

      {/* mid radial glow (warm) */}
      <motion.div
        style={{ opacity: glow2Opacity }}
        className="absolute -bottom-1/3 -right-1/4 h-[120vh] w-[120vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,88,100,0.35),transparent_60%)] blur-3xl mix-blend-screen"
      />

      {/* top “highlight sweep” (soft white) */}
      <motion.div
        style={{ opacity: 0.15 }}
        className="absolute top-[-20vh] left-1/2 -translate-x-1/2 h-[60vh] w-[120vw] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),transparent_60%)] blur-[80px] mix-blend-screen"
      />

      {/* vignette to keep edges rich */}
      <motion.div
        style={{ opacity: vignetteOpacity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6))]"
      />
    </motion.div>
  );
}