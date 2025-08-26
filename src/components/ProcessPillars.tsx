

import Section from "./Section";

const pillars = [
  {
    tag: "OverlyOnline",
    title: "Web development",
    copy: "Fast, animated, conversion‑driven builds on modern stacks.",
  },
  {
    tag: "OverlySocial",
    title: "Social strategy",
    copy: "Narratives, calendars, and growth loops that compound.",
  },
  {
    tag: "OverlyDesign",
    title: "Brand & design",
    copy: "Identity systems with rules, range, and real utility.",
  },
  {
    tag: "OverlyCreative",
    title: "Content & production",
    copy: "Sprints that ship striking content — fast.",
  },
];

export default function ProcessPillars() {
  return (
    <Section id="process-execution">
      <h2 className="text-3xl md:text-4xl font-bold">Our process: Execution</h2>
      <p className="mt-3 max-w-2xl text-white/70">
        Strategy becomes systems. We design, build, and distribute — then iterate.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {pillars.map((p) => (
          <div
            key={p.tag}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg/20"
          >
            <div className="text-xs uppercase tracking-[.2em] text-white/50">{p.tag}</div>
            <div className="mt-2 text-xl font-semibold text-white">{p.title}</div>
            <p className="mt-2 text-white/70">{p.copy}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}