"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Section from "./Section";

const STRATEGY = [
  "Competition research",
  "Brand affinity index",
  "Regression analytics",
  "Consumer psychographics",
  "KPI targets",
  "Channel integrations",
  "Campaign positioning",
];

const PILLARS = [
  { tag: "OverlyOnline", title: "Web development" },
  { tag: "OverlySocial", title: "Social strategy" },
  { tag: "OverlyDesign", title: "Brand & design" },
  { tag: "OverlyCreative", title: "Content & production" },
];

// Discriminated union for steps
type Step =
  | { kind: "strategy"; label: string }
  | { kind: "exec"; tag: string; title: string };

// Each step now has a kind and appropriate fields
const STEPS: Step[] = [
  ...STRATEGY.map((s) => ({ kind: "strategy", label: s } as const)),
  ...PILLARS.map((p) => ({ kind: "exec", tag: p.tag, title: p.title } as const)),
];

// Child component so we can safely call hooks like useTransform per-step
type StepItemProps = {
  i: number;
  item: { kind: "strategy"; label: string } | { kind: "exec"; tag: string; title: string };
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
};

function StepItem({ i, item, total, scrollYProgress }: StepItemProps) {
  const start = i / total;
  const end = (i + 1) / total;
  const mid = (start + end) / 2;
  const opacity = useTransform(scrollYProgress, [start, mid, end], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [start, mid, end], [40, 0, -40]);
  const isLeft = i % 2 === 0;

  return (
    <motion.div style={{ opacity, y }} className="sticky top-1/3 mx-auto max-w-2xl px-6">
      {item.kind === "strategy" ? (
        <div
          className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-lg transition-all ${
            isLeft ? "ml-0 md:mr-auto" : "mr-0 md:ml-auto"
          }`}
        >
          <div className="text-lg md:text-xl font-semibold text-white">{item.label}</div>
        </div>
      ) : (
        <div
          className={`aspect-square w-40 md:w-48 flex flex-col justify-center items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-lg transition-all ${
            isLeft ? "ml-0 md:mr-auto" : "mr-0 md:ml-auto"
          }`}
        >
          <div className="text-base md:text-lg font-bold text-white mb-1">{item.tag}</div>
          <div className="text-sm md:text-base font-medium text-white/80">{item.title}</div>
        </div>
      )}
    </motion.div>
  );
}

export default function ProcessExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.1", "end 0.9"] });
  const progressW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const total = STEPS.length;
  const strategyCount = STRATEGY.length;
  const execStart = strategyCount / total; // fraction where execution begins

  // Fade the header label from Strategy -> Execution around the boundary
  const strategyOpacity = useTransform(scrollYProgress, [0, execStart - 0.02, execStart + 0.02], [1, 1, 0]);
  const execOpacity = useTransform(scrollYProgress, [execStart - 0.02, execStart + 0.02, 1], [0, 1, 1]);

  return (
    <Section id="process" className="py-32">
      <div ref={ref} className="relative">
        {/* Sticky header + progress */}
        <div className="sticky top-[84px] z-20 mb-10 bg-neutral-950/60 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/40">
          <div className="mx-auto max-w-4xl px-6 py-6">
            <div className="w-full text-center">
              <motion.h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <motion.span style={{ opacity: strategyOpacity, scale: strategyOpacity }} className="text-blue-400 inline-block">
                  Strategy
                </motion.span>
                <span className="mx-2 text-white/80">→</span>
                <motion.span style={{ opacity: execOpacity, scale: execOpacity }} className="text-blue-400 inline-block">
                  Execution
                </motion.span>
              </motion.h2>
            </div>
            <div className="mt-6 h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div style={{ width: progressW }} className="h-full bg-blue-500" />
            </div>
          </div>
        </div>

        {/* Steps container, tall enough for all */}
        <div className="relative h-[600vh]">
          {STEPS.map((step, i) => (
            <StepItem key={i} i={i} item={step} total={total} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </Section>
  );
}