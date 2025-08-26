

"use client";
import Section from "./Section";

const items = [
  { title: "Brand Systems", copy: "Identity, art direction, voice, and guidelines that scale." },
  { title: "Web & Product", copy: "Next.js, animations, performance, analytics, A/B testing." },
  { title: "Content Engines", copy: "Pipelines for production, distribution, & repurposing." },
  { title: "Paid & Growth", copy: "Funnels, creative testing, landing systems that convert." },
  { title: "Social Strategy", copy: "Narratives, calendars, hooks, and loops that compound." },
  { title: "Data & Insight", copy: "Dashboards, KPI mapping, attribution, regression reads." },
];

export default function Capabilities() {
  return (
    <Section id="capabilities">
      <h2 className="text-3xl md:text-4xl font-bold">Capabilities</h2>
      <p className="mt-3 max-w-2xl text-white/70">
        From first impression to lasting system — we design, build, and grow.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg/20 transition"
          >
            <div className="text-lg font-semibold text-white">{it.title}</div>
            <p className="mt-2 text-white/70">{it.copy}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}