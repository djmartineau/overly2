// src/components/Hero2.tsx
"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import HeroWord3 from "./HeroWord3";
import Button from "./Button";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function AmbientBackground({ intensity = 1 }: { intensity?: number }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const xMv = useMotionValue(0);
  const yMv = useMotionValue(0);
  const blobX = useTransform(xMv, (v) => v * 56 * intensity);
  const blobY = useTransform(yMv, (v) => v * 40 * intensity);
  const blobR = useTransform(xMv, (v) => v * 10 * intensity);
  const rotMv = useMotionValue(0);

  const smoothX = useSpring(blobX, { stiffness: 100, damping: 20, mass: 0.8 });
  const smoothY = useSpring(blobY, { stiffness: 100, damping: 20, mass: 0.8 });
  const smoothR = useSpring(rotMv, { stiffness: 100, damping: 20, mass: 0.8 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
      const ny = e.clientY / window.innerHeight - 0.5; // -0.5..0.5
      xMv.set(nx);
      yMv.set(ny);
      const angle = Math.atan2(ny, nx) * (180 / Math.PI);
      rotMv.set(angle);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [xMv, yMv, rotMv]);

  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {/* Mouse-reactive glow blob */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-[40%] opacity-80"
        style={{
          x: smoothX,
          y: smoothY,
          rotate: smoothR,
          background:
            "radial-gradient(35% 40% at 50% 45%, rgba(96,165,250,0.65) 0%, rgba(96,165,250,0.35) 35%, rgba(167,139,250,0.35) 55%, rgba(34,211,238,0.22) 75%, rgba(0,0,0,0) 100%)",
          filter: "blur(22px) saturate(120%)",
          willChange: "transform",
        }}
      />
      {/* Ambient washes (boosted a bit so they show on dark bg) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(50,140,255,0.32),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(190,120,255,0.28),transparent_55%)] blur-2xl" />
      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:3px_3px]" />
    </div>
  );
}

export default function Hero2() {
  return (
    <section className="relative isolate w-full">
      <AmbientBackground intensity={1} />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <motion.div
          className="relative z-10 flex min-h-[100vh] flex-col items-center justify-center gap-3 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}
        >
          {/* Tagline */}
          <p className={`${playfair.className} text-neutral-200 font-light tracking-tight text-3xl md:text-4xl`}>
            Make your brand
          </p>

          {/* OVERLY logo */}
          <Image
            src="/overlylogo.svg"
            alt="OVERLY"
            width={780}
            height={210}
            className="h-auto invert w-[clamp(260px,70vw,820px)]"
            priority
          />

          {/* Rotating word */}
          <HeroWord3
            words={["MEMORABLE", "CREATIVE", "INNOVATIVE", "BOLD"]}
            className="leading-none text-blue-500 font-extrabold tracking-tight text-[clamp(2.8rem,12vw,12rem)] mt-1"
            inMs={450}
            stayMs={1600}
            outMs={450}
          />

          {/* Subcopy */}
          <p className="mt-4 max-w-2xl text-neutral-300">
            Strategy, design, web, and content — built to convert.
          </p>

          {/* CTAs (reuse your Button component) */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <Button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
              Work with us
            </Button>
            <button
              onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              <span>★</span> See our work
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}