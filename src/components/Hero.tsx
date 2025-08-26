"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import Button from "./Button";

const words = ["bold", "creative", "profitable", "magnetic", "good"];

// If you want the first scroll to snap to a specific word, set this to its index
// (e.g. 0 for "bold"). Set to `null` to simply freeze whatever word is showing.
const LOCK_TO_INDEX: number | null = 1; // 'creative'
const STEP_RATIO = 0.8; // each word takes 80% of viewport height to advance
const IDLE_MS = 1800;   // how quickly we cycle when idling

export default function Hero() {
  const [i, setI] = useState(0);
  const [stepPx, setStepPx] = useState<number>(0); // how many px per word step
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const lastIdxRef = useRef(-1);
  const snappedRef = useRef(false); // snap to LOCK_TO_INDEX the first time we enter the hero

  // compute step height in px and keep it fresh on resize
  useEffect(() => {
    const compute = () => setStepPx(Math.max(1, Math.round(window.innerHeight * STEP_RATIO)));
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const startIdle = () => {
    if (idleTimerRef.current != null) return;
    idleTimerRef.current = window.setInterval(() => {
      setI((prev) => (prev + 1) % words.length);
    }, IDLE_MS);
  };

  const stopIdle = () => {
    if (idleTimerRef.current != null) {
      window.clearInterval(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  // Drive index by scroll while inside hero; auto-cycle when above or past hero
  useEffect(() => {
    const onScroll = () => {
      const host = wrapperRef.current;
      if (!host || stepPx === 0) return;

      const start = host.offsetTop;
      const total = Math.max(1, host.offsetHeight - window.innerHeight);
      const yRaw = window.scrollY - start;

      const atTop = yRaw <= 0;
      const atEnd = yRaw >= total;
      const inside = !atTop && !atEnd;

      if (atTop || atEnd) {
        // Idle auto-cycle when not inside the hero window
        startIdle();
        snappedRef.current = false; // allow snap again next time we re-enter
      } else if (inside) {
        // On first entry into the hero, snap to a chosen word index
        stopIdle();
        if (!snappedRef.current && LOCK_TO_INDEX !== null) {
          snappedRef.current = true;
          const snapTop = start + LOCK_TO_INDEX * stepPx;
          window.scrollTo({ top: snapTop });
        }
        const y = Math.min(Math.max(yRaw, 0), total);
        const idx = Math.max(0, Math.min(words.length - 1, Math.floor(y / stepPx)));
        if (idx !== lastIdxRef.current) {
          lastIdxRef.current = idx;
          setI(idx);
        }
      }
    };

    const onResize = () => onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Decide initial mode
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      stopIdle();
    };
  }, [stepPx]);

  const totalHeightPx = stepPx > 0 ? stepPx * words.length : undefined;

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={totalHeightPx ? { height: `${totalHeightPx}px` } : { height: `${words.length * 100}svh` }}
    >
      {/* Sticky viewport-height hero */}
      <div className="sticky top-0 min-h-[100svh] overflow-hidden">
        {/* Background placeholder — replace with video or 3D scene later */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_left,rgba(50,140,255,0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(190,120,255,0.22),transparent_55%)] blur-2xl" />
        </div>

        {/* Hero content */}
        <Section id="hero" className="relative z-10 flex min-h-[100svh] items-center justify-center text-center py-28">
          <div className="max-w-5xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white"
            >
              <span className="block">Make your brand</span>
              <span className="block mt-2">
                OVERLY{" "}
                <motion.span
                  key={i}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1, color: ["#60a5fa", "#a78bfa", "#22d3ee", "#60a5fa"] }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{
                    y: { type: "spring", stiffness: 400, damping: 28 },
                    opacity: { type: "spring", stiffness: 300, damping: 32 },
                    color: { duration: 6, ease: "easeInOut", repeat: Infinity },
                  }}
                  className="inline-block min-w-[9ch] -ml-1 will-change-[transform,color]"
                >
                  {words[i]}
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 text-lg text-white/70 mx-auto"
            >
              Strategy, design, web, and content — built to convert.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 flex justify-center gap-3"
            >
              <Button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                Work with us
              </Button>
              <Button variant="ghost" onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}>
                See our work
              </Button>
            </motion.div>
          </div>
        </Section>
      </div>
    </div>
  );
}