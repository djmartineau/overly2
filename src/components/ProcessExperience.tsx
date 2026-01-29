"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Section from "./Section";

const STRATEGY = [
  { label: "Competition research", blurb: "Map category players, pricing, messaging, and gaps.", image: "/process/competition.png" },
  { label: "Brand affinity index", blurb: "Score what actually drives preference for your audience.", image: "/process/affinity.png" },
  { label: "Regression analytics", blurb: "Quantify which variables move conversion and LTV.", image: "/process/regression.png" },
  { label: "Consumer psychographics", blurb: "Attitudes, identity, and jobs‑to‑be‑done—not just demos.", image: "/process/psych.png" },
  { label: "KPI targets", blurb: "Define the scoreboard and thresholds for success.", image: "/process/kpi.png" },
  { label: "Channel integrations", blurb: "Attribution, pixels, CRM, and data hygiene.", image: "/process/channels.png" },
  { label: "Campaign positioning", blurb: "Own a contrast point that’s memorable and monetizable.", image: "/process/positioning.png" },
];

const PILLARS = [
  { tag: "OverlyOnline",      title: "Web development",      blurb: "High‑performance sites that convert." },
  { tag: "OverlySocial",       title: "Social media",         blurb: "Audience rhythm, content series, community." },
  { tag: "OverlyRecognized",   title: "Branding & identity",  blurb: "Distinct systems that scale across touchpoints." },
  { tag: "OverlyVisual",       title: "Design & video",       blurb: "Graphic design, motion, and production." },
  { tag: "OverlyAmplified",    title: "Advertising",          blurb: "Paid media engineered for growth." },
];

// Discriminated union for steps
type Step =
  | { kind: "strategy"; label: string; blurb?: string; image?: string }
  | { kind: "exec"; tag: string; title: string; blurb?: string; image?: string };

// Each step now has a kind and appropriate fields
const STEPS: Step[] = [
  ...STRATEGY.map((s) => ({ kind: "strategy", label: s.label, blurb: s.blurb, image: s.image } as const)),
  ...PILLARS.map((p) => ({ kind: "exec", tag: p.tag, title: p.title, blurb: p.blurb } as const)),
];

// Child component so we can safely call hooks like useTransform per-step
type StepItemProps = {
  i: number;
  item: { kind: "strategy"; label: string; blurb?: string };
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
};

function StepItem({ i, item, total, scrollYProgress }: StepItemProps) {
  const start = i / total;
  const end = (i + 1) / total;
  const mid = (start + end) / 2;
  const span = end - start;
  const inA = start + span * 0.15;   // reach full opacity earlier
  const outB = end   - span * 0.15;   // stay readable longer
  // Special handoff: wait for the first item to fully reach the top before #2 appears
  const handoffStart = i === 1 ? start + span * 0.12 : start;
  const opacity = useTransform(
    scrollYProgress,
    i === 0 ? [0, inA, outB, end] : [handoffStart, inA, outB, end],
    i === 0 ? [1, 1, 1, 0]         : [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    i === 0 ? [0, inA, outB, end] : [handoffStart, inA, outB, end],
    i === 0 ? [20, 0, 0, -20] : i === 1 ? [0, 0, 0, -20] : [20, 0, 0, -20]
  );

  const active = useTransform(scrollYProgress, [start, mid, end], [0, 1, 0]);
  const scale = useTransform(active, [0, 1], [0.99, 1.03]);
  const shadow = useTransform(active, (a) => `0 10px 30px rgba(0,0,0,${0.25 + a * 0.2})`);
  const ring = useTransform(active, (a) => `rgba(255,255,255,${0.08 + a * 0.2})`);

  return (
    <motion.div style={{ opacity, y, scale }} className="sticky top-1/3 z-20 relative mx-auto max-w-3xl lg:max-w-4xl px-6">
      <motion.div
        style={{ boxShadow: shadow, borderColor: ring as unknown as string }}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-lg transition-all"
      >
        <div className="text-lg md:text-xl font-semibold text-white">{item.label}</div>
        {item.blurb && (
          <p className="mt-2 text-sm md:text-base text-white/70">{item.blurb}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

function CanvasFrame({ i, total, item, scrollYProgress }: { i: number; total: number; item: Step; scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]; }) {
  const start = i / total;
  const end = (i + 1) / total;
  const mid = (start + end) / 2;
  const span = end - start;
  const inA = start + span * 0.18;
  const outB = end   - span * 0.18;
  // Mirror the handoff delay for the second strategy frame so the image doesn’t switch early
  const handoffStart = i === 1 ? start + span * 0.12 : start;
  const opacity = useTransform(scrollYProgress, [handoffStart, inA, outB, end], [0, 1, 1, 0]);
  if (!item.image) return null;
  const altText = item.kind === "strategy" ? (item as { kind: "strategy"; label: string }).label : (item as { kind: "exec"; title: string }).title;
  return (
    <motion.img
      key={`vis-${i}`}
      src={item.image}
      alt={altText}
      style={{ opacity }}
      className="absolute inset-0 h-full w-full object-contain"
    />
  );
}

function StrategyChip({ i, total, label, image, scrollYProgress }: { i: number; total: number; label: string; image?: string; scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]; }) {
  const start = i / total;
  const end = (i + 1) / total;
  const mid = (start + end) / 2;
  const span = end - start;
  // Faster appear window so chips come in sooner
  const appear = useTransform(scrollYProgress, [start, start + span * 0.10], [0, 1]);
  const active = useTransform(scrollYProgress, [start + span * 0.05, mid, end], [0, 1, 0]);
  const glow = useTransform(active, (a) => `0 0 0 ${4 * a}px rgba(255,255,255,0.10), 0 0 ${24 * a}px rgba(59,130,246,${0.35 * a})`);
  const border = useTransform(active, (a) => `rgba(255,255,255,${0.12 + a * 0.28})`);
  const labelOpacity = useTransform(active, [0, 1], [0.75, 1]);
  return (
    <motion.div
      style={{ opacity: appear, scale: 1, boxShadow: glow, borderColor: border as unknown as string }}
      className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3 shadow-sm transition-shadow"
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        {image && <img src={image} alt={label} className="h-10 w-10 object-contain" />}
        <motion.div style={{ opacity: labelOpacity }} className="text-sm font-medium text-white/90">{label}</motion.div>
      </div>
    </motion.div>
  );
}

function ExecCard({ j, scrollYProgress, total, strategyCount, p }: { j: number; scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]; total: number; strategyCount: number; p: { tag: string; title: string; blurb?: string } }) {
  const idx = strategyCount + j;
  const start = idx / total;
  const end = (idx + 1) / total;
  const span = end - start;
  const appear = useTransform(scrollYProgress, [start, start + span * 0.12], [0, 1]);
  const mid = (start + end) / 2;
  const active = useTransform(scrollYProgress, [start + span * 0.2, mid, end], [0, 1, 1]);
  const x = useTransform(appear, [0, 1], [24, 0]);
  const rotate = useTransform(appear, [0, 1], [2.5, 0]);
  const scale = useTransform(appear, [0, 0.9, 1], [0.98, 1.015, 1]);
  const blur = useTransform(appear, [0, 1], ["blur(8px)", "blur(0px)"]);
  const shadow = useTransform(appear, v => `0 8px 24px rgba(0,0,0,${0.15 + (typeof v === 'number' ? v : 1) * 0.25})`);
  const ring = useTransform(active, a => `rgba(59,130,246,${0.15 + a * 0.35})`);
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      style={{
        opacity: appear,
        x: prefersReduced ? 0 : x,
        rotate: prefersReduced ? 0 : rotate,
        scale: prefersReduced ? 1 : scale,
        filter: prefersReduced ? "none" : blur,
        boxShadow: shadow,
        borderColor: ring as unknown as string,
      }}
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.8 }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3 shadow-sm w-full max-w-md"
    >
      <motion.div aria-hidden style={{ opacity: active }} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 via-transparent to-white/5 [mask-image:linear-gradient(90deg,transparent,black,transparent)] translate-x-[-30%]" />
      </motion.div>
      <div className="text-[11px] font-semibold text-white/90">{p.tag}</div>
      <div className="text-sm font-semibold text-white leading-tight">{p.title}</div>
      {p.blurb && (
        <div className="text-[11px] text-white/70 leading-snug mt-0.5">{p.blurb}</div>
      )}
    </motion.div>
  );
}

function ExecStack({ scrollYProgress, total, strategyCount }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]; total: number; strategyCount: number; }) {
  return (
    <div className="sticky top-[210px] z-20">
      <div className="flex flex-col gap-3">
        {PILLARS.map((p, j) => (
          <ExecCard key={p.tag} j={j} p={p} scrollYProgress={scrollYProgress} total={total} strategyCount={strategyCount} />
        ))}
      </div>
    </div>
  );
}

export default function ProcessExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end 0.9"] });
  const progressW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const total = STEPS.length;
  const strategyCount = STRATEGY.length;
  const execStart = strategyCount / total; // fraction where execution begins

  // Fade the header label from Strategy -> Execution around the boundary
  const strategyOpacity = useTransform(scrollYProgress, [0, execStart - 0.06, execStart + 0.06], [1, 1, 0]);
  const execOpacity = useTransform(scrollYProgress, [execStart - 0.06, execStart + 0.06, 1], [0, 1, 1]);

  // Fade out the hint text as user scrolls (disappears by 15% scroll progress)
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <Section id="process" className="pt-20 pb-32">
      <div ref={ref} className="relative">
        {/* Sticky header + progress */}
        <div className="sticky top-[84px] z-30 mb-12 bg-neutral-950/60 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/40">
          <div className="mx-auto max-w-4xl px-6 py-6">
            <div className="w-full text-center">
              <motion.h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <motion.span style={{ opacity: strategyOpacity }} className="text-white inline-block">
                  Strategy
                </motion.span>
                <span className="mx-2 text-white/80"></span>
                <motion.span style={{ opacity: execOpacity }} className="text-white inline-block">
                  Execution
                </motion.span>
              </motion.h2>
            </div>
            <div className="mt-6 h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div style={{ width: progressW }} className="h-full bg-blue-500" />
            </div>
            {/* Hint text below progress bar that fades on scroll */}
            <motion.p
              style={{ opacity: hintOpacity }}
              className="mt-4 text-sm sm:text-base text-zinc-400 text-center"
            >
              Scroll through our strategies and how we execute them.
            </motion.p>
          </div>
        </div>

        {/* Split layout: Left = stacking icons, Right = text+image */}
        <div className="relative mx-auto max-w-7xl px-8 grid md:grid-cols-2 gap-12">
          {/* Left: Stacking icons (pinned) */}
          <div className="hidden md:block">
            <div className="sticky top-[260px] z-20">
              <div className="grid grid-cols-1 gap-3">
                {STRATEGY.map((s, i) => (
                  <div
                    key={`chip-wrap-${i}`}
                    className={s.label === "Campaign positioning" ? "col-span-2 flex justify-center" : ""}
                  >
                    <StrategyChip
                      key={`chip-${i}`}
                      i={i}
                      total={total}
                      label={s.label}
                      image={s.image}
                      scrollYProgress={scrollYProgress}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Scrolling text steps with pinned canvas underneath */}
          <div>
            {/* Right: Exec persistent stack after Strategy */}
            <ExecStack scrollYProgress={scrollYProgress} total={total} strategyCount={strategyCount} />
            {/* Right column pinned canvas under text */}
            <div className="pointer-events-none sticky top-[210px] z-10">
              <div className="relative w-full h-[65vh]">
                {STEPS.map((s, i) => (
                  <CanvasFrame key={`vis-${i}`} i={i} total={total} item={s} scrollYProgress={scrollYProgress} />
                ))}
              </div>
            </div>
            {/* Steps container, tall enough for all */}
            <div className="relative h-[900vh]">
              {STEPS.filter((s) => s.kind === "strategy").map((step, i) => (
                <StepItem key={i} i={i} item={step as { kind: "strategy"; label: string; blurb?: string }} total={total} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}