"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import type { MotionValue } from "framer-motion";

import BackgroundFX from "@/components/BackgroundFX";
import Hero3 from "@/components/Hero3";

export default function HeroStage() {
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Scroll progress relative to the hero only
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  return (
    <section ref={heroRef} className="relative">
      {/* Background pinned to viewport, driven by hero scroll */}
      <BackgroundFX progress={scrollYProgress as MotionValue<number>} />

      {/* Hero content sits above the background */}
      <div className="relative z-10">
        <Hero3 />
      </div>
    </section>
  );
}