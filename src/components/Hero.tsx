"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import Button from "./Button";

const words = ["bold", "creative", "profitable", "magnetic", "good"];

// If you want the first scroll to snap to a specific word, set this to its index
// (e.g. 0 for "bold"). Set to `null` to simply freeze whatever word is showing.
const LOCK_TO_INDEX: number | null = 1; // 'creative'
const STEP_RATIO = 0.6; // each word takes 60% of viewport height to advance
const IDLE_MS = 1800;   // how quickly we cycle when idling
const FIRST_SNAP_DELAY_PX = 12;

export default function Hero() {
  const [i, setI] = useState(0);
  const [stepPx, setStepPx] = useState<number>(0); // how many px per word step
  const [firstProg, setFirstProg] = useState(0); // 0..1 progress through the first step
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const lastIdxRef = useRef(-1);
  const snappedRef = useRef(false); // snap to LOCK_TO_INDEX the first time we enter the hero

  // Mouse-tracking for hero blob (active before first scroll)
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const blobX = useTransform(mvX, (v) => v * 36); // px translate based on cursor
  const blobY = useTransform(mvY, (v) => v * 28);
  const blobR = useTransform(mvX, (v) => v * 10); // subtle rotate

  const onHeroMouseMove = (e: React.MouseEvent) => {
    // Damp as we start scrolling away from hero
    const damp = 1 - Math.min(1, Math.max(0, firstProg));
    const { innerWidth: w, innerHeight: h } = window;
    const nx = (e.clientX / w - 0.5) * damp; // -0.5..0.5
    const ny = (e.clientY / h - 0.5) * damp;
    mvX.set(nx);
    mvY.set(ny);
  };

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
        if (atTop) setFirstProg(0);
      } else if (inside) {
        // On the very first entry, wait a tiny bit then snap to the configured word,
        // and set the word index immediately so the heading changes in sync with the
        // pill/subtitle/buttons animating out.
        stopIdle();
        if (!snappedRef.current && LOCK_TO_INDEX !== null) {
          if (yRaw > FIRST_SNAP_DELAY_PX) {
            snappedRef.current = true;
            setI(LOCK_TO_INDEX);
            const snapTop = start + LOCK_TO_INDEX * stepPx;
            window.scrollTo({ top: snapTop });
            return; // avoid double-processing on this frame
          }
        }
        const y = Math.min(Math.max(yRaw, 0), total);
        const p = Math.max(0, Math.min(1, y / stepPx));
        setFirstProg(p);
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
      className="relative snap-start"
      style={totalHeightPx ? { height: `${totalHeightPx}px` } : { height: `${words.length * 100}svh` }}
    >
      {/* Sticky viewport-height hero */}
      <div className="sticky top-0 min-h-[100svh] overflow-hidden" onMouseMove={onHeroMouseMove}>
        {/* Background placeholder — replace with video or 3D scene later */}
        <div className="absolute inset-0">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[52vmin] h-[52vmin] rounded-[40%] opacity-70"
            style={{
              x: blobX,
              y: blobY,
              rotate: blobR,
              // shimmering gradient blob
              background:
                "radial-gradient(35% 40% at 50% 45%, rgba(96,165,250,0.55) 0%, rgba(96,165,250,0.25) 35%, rgba(167,139,250,0.25) 55%, rgba(34,211,238,0.18) 75%, rgba(0,0,0,0) 100%)",
              filter: "blur(20px) saturate(120%)",
            }}
          />
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_left,rgba(50,140,255,0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(190,120,255,0.22),transparent_55%)] blur-2xl" />
        </div>

        {/* Hero content */}
        <Section id="hero" className="relative z-10 flex min-h-[100svh] items-center justify-center text-center py-28">
          <div className="max-w-5xl mx-auto">
            <motion.div
              style={{
                transform: `translateY(${-firstProg * 90}px)`,
                opacity: 1 - firstProg,
                pointerEvents: firstProg > 0.98 ? "none" : "auto",
              }}
            >
              {/* Status pill */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-5 w-fit select-none"
              >
                <div
                  className="flex items-center gap-2.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/90 ring-1 ring-white/15 backdrop-blur-sm shadow-[0_6px_20px_rgba(2,6,23,0.18)]"
                >
                  {/* blinking red dot */}
                  <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="absolute inset-0 rounded-full bg-red-500/80 animate-pulse"></span>
                  </span>
                  <span className="font-medium">
                    Taking on <span className="text-white">2</span> more clients this quarter
                  </span>
                </div>
              </motion.div>
            </motion.div>

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

            <motion.div
              style={{
                transform: `translateY(${-firstProg * 90}px)`,
                opacity: 1 - firstProg,
                pointerEvents: firstProg > 0.98 ? "none" : "auto",
              }}
            >
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
                className="mt-8 flex justify-center gap-5"
              >
                <Button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                  Work with us
                </Button>
                <button
                  onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  <span>★</span>
                  See our work
                </button>
              </motion.div>
            </motion.div>
          </div>
        </Section>
      </div>
    </div>
  );
}