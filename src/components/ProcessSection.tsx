"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles, Target, Pencil, Code2, Rocket } from "lucide-react";

type Step = {
  id: string;
  title: string;
  summary: string;
  icon: React.ReactNode;
};

const STEPS: Step[] = [
  {
    id: "discover",
    title: "Discover",
    summary: "We align on goals, audience, and success metrics. No fluff—just clarity.",
    icon: <Target className="h-5 w-5" />,
  },
  {
    id: "plan",
    title: "Plan",
    summary: "We map a pragmatic, ROI-first plan: scope, milestones, and responsibilities.",
    icon: <Pencil className="h-5 w-5" />,
  },
  {
    id: "design",
    title: "Design",
    summary: "We explore directions and converge on a magnetic, on-brand system.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: "build",
    title: "Build",
    summary: "We ship fast in iterative slices—code, content, and integrations.",
    icon: <Code2 className="h-5 w-5" />,
  },
  {
    id: "launch",
    title: "Launch",
    summary: "We QA, optimize, launch, and monitor. Then we keep improving.",
    icon: <Rocket className="h-5 w-5" />,
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ProcessSection() {
  const [active, setActive] = useState(STEPS[0].id);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) {
          const id = visible.target.getAttribute("data-id");
          if (id) setActive(id);
        }
      },
      { root: null, rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.33, 0.66, 1] }
    );

    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // progress fill (based on which step is active)
  const progress = Math.max(0, STEPS.findIndex((s) => s.id === active)) / (STEPS.length - 1);

  return (
    <section id="process" className="relative w-full">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:grid-cols-[280px_1fr]">
        {/* Sticky left rail */}
        <aside className="relative">
          <div className="sticky top-24">
            <h2 className="text-2xl font-semibold text-white">Our process</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Transparent, iterative, and built to convert.
            </p>

            <div className="relative mt-6">
              {/* Rail background */}
              <div className="absolute left-[10px] top-0 h-full w-[2px] bg-white/10" aria-hidden />
              {/* Rail progress */}
              <div
                ref={railRef}
                className="absolute left-[10px] top-0 w-[2px] bg-gradient-to-b from-blue-400 to-cyan-300"
                style={{ height: `calc(${progress * 100}% + 8px)` }}
                aria-hidden
              />
              {/* Steps list */}
              <ol className="space-y-5">
                {STEPS.map((s, i) => {
                  const isActive = s.id === active;
                  return (
                    <li key={s.id} className="relative pl-8">
                      <span
                        className={`absolute left-0 top-1 grid h-5 w-5 place-items-center rounded-full ring-1 ring-white/20 ${
                          isActive ? "bg-blue-500 text-white" : "bg-white/5 text-white/70"
                        }`}
                        aria-hidden
                      >
                        {isActive ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-white/50" />}
                      </span>
                      <button
                        onClick={() => {
                          const el = sectionsRef.current[i];
                          el?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
                        }}
                        className={`text-left transition-colors ${
                          isActive ? "text-white" : "text-neutral-300 hover:text-white"
                        }`}
                        aria-current={isActive ? "step" : undefined}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`rounded-md p-1.5 ring-1 ring-white/10 ${isActive ? "bg-white/10" : "bg-white/5"}`}>
                            {s.icon}
                          </span>
                          <span className="font-medium">{s.title}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </aside>

        {/* Right column steps */}
        <div className="space-y-8">
          {STEPS.map((s, i) => {
            const isActive = s.id === active;
            return (
              <motion.div
                key={s.id}
                ref={(el) => (sectionsRef.current[i] = el)}
                data-id={s.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
                transition={{ duration: 0.5, ease: EASE }}
                className={`rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md ${
                  isActive ? "ring-1 ring-blue-400/40" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-md bg-white/10 p-2 ring-1 ring-white/10">{s.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{s.title}</h3>
                    <p className="mt-1 text-neutral-300">{s.summary}</p>
                  </div>
                </div>

                {/* Optional detail bullets per step */}
                <ul className="mt-4 grid gap-2 text-sm text-neutral-400 sm:grid-cols-2">
                  {i === 0 && (
                    <>
                      <li>• Stakeholder intake & goals</li>
                      <li>• Audience & positioning</li>
                      <li>• Competitive scan</li>
                      <li>• Success metrics</li>
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <li>• Roadmap & scope</li>
                      <li>• Milestones & owners</li>
                      <li>• KPI alignment</li>
                      <li>• Content plan</li>
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <li>• Style exploration</li>
                      <li>• Components & tokens</li>
                      <li>• Copy & tone</li>
                      <li>• Prototyping</li>
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <li>• Next.js + Tailwind</li>
                      <li>• CMS / data hookups</li>
                      <li>• Performance & SEO</li>
                      <li>• QA & accessibility</li>
                    </>
                  )}
                  {i === 4 && (
                    <>
                      <li>• Launch checklist</li>
                      <li>• Analytics & heatmaps</li>
                      <li>• Iteration plan</li>
                      <li>• Training / handoff</li>
                    </>
                  )}
                </ul>
              </motion.div>
            );
          })}

          {/* CTA */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-neutral-400">
              Ready to move? We can start with a quick discovery session.
            </p>
            <a
              href="#contact"
              className="rounded-full bg-blue-500 px-5 py-2.5 font-medium text-white shadow hover:bg-blue-400 transition"
            >
              Book a call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}