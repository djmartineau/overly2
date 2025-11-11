// src/components/About.tsx
"use client";

export default function About() {
  return (
    <section className="bg-neutral-950 text-white py-24 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-sm uppercase tracking-[.2em] text-white/50 mb-2">
          Our Approach
        </h2>
        <h3 className="text-3xl md:text-4xl font-semibold mb-8">
          A partner invested in your long-term momentum.
        </h3>

        <p className="text-white/70 max-w-3xl mb-16">
          Overly exists on the belief that modern brands need more than a marketing
          agency—they need a growth partner that thinks creatively, moves fast, and
          executes with precision. We build flexible, performance-driven systems
          around your brand’s DNA, bringing the power of a full creative team with
          the focus of an in-house partner. We meet you where you are—startup to
          scaleup—with modular scopes and pricing, from rapid launches to
          fully custom builds.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h4 className="font-semibold mb-2">Accessibility</h4>
            <p className="text-white/60 text-sm">
              Direct collaboration with our creative team keeps momentum high and
              turnarounds quick—your brand never stalls.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Agility & Adaptability</h4>
            <p className="text-white/60 text-sm">
              Built to pivot fast—blending design, content, and data in real time to
              meet your goals (not someone else’s template).
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Audience & Strategic Insight</h4>
            <p className="text-white/60 text-sm">
              We dig into audience behavior and your competitive landscape to uncover
              what truly differentiates you.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Return on Investment</h4>
            <p className="text-white/60 text-sm">
              Creative that looks incredible and drives measurable impact—campaigns
              and sites tied to KPIs that matter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}