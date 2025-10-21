// src/components/Hero3.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import HeroWord3 from "./HeroWord3";
import Button from "./Button";
import BackgroundSwitcher, { type BgVariant } from "@/components/backgrounds/Switcher";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Change this to try different backgrounds: "ambient" | "dot" | "parallax" | "particles"
const BG_VARIANT: BgVariant = "ambient";

export default function Hero3() {
  return (
    <section className="relative isolate w-full">
      {/* Background */}
      <BackgroundSwitcher variant={BG_VARIANT} />

      {/* Centered content container */}
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

          {/* CTAs */}
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