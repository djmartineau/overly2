

import Section from "./Section";

const items = [
  "Competition research",
  "Brand affinity index",
  "Regression analytics",
  "Consumer psychographics",
  "KPI targets",
  "Channel integrations",
  "Campaign positioning",
];

export default function ProcessStrategy() {
  return (
    <Section id="process-strategy">
      <h2 className="text-3xl md:text-4xl font-bold">Our process: Strategy</h2>
      <p className="mt-3 max-w-2xl text-white/70">
        We pair quant with taste — models that predict, creative that persuades.
      </p>

      <ul className="mt-8 grid gap-3 md:grid-cols-2">
        {items.map((x) => (
          <li
            key={x}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4"
          >
            <span className="font-semibold text-white">{x}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}