import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const words = ["Strategy", "Execution"];

export default function ProcessStrategy() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === 0 ? 1 : 0));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section id="process-strategy">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-10 flex overflow-hidden h-[3rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
        <span className="ml-1">→ Execution</span>
      </h2>

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