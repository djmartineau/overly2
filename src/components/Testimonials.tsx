

"use client";
import Section from "./Section";
import { motion } from "framer-motion";

const quotes = [
  {
    name: "Jordan, CMO at Atlas Lab",
    blurb:
      "Overly rebuilt our brand and site in weeks. The motion, the clarity — our demo bookings doubled.",
  },
  {
    name: "Mia, Founder at Volt & Vine",
    blurb:
      "They think strategically and design for conversion. We finally have a system we can grow with.",
  },
  {
    name: "Samir, Growth at Northline",
    blurb:
      "Structured experiments + standout creative. Traffic quality went up and CAC went down.",
  },
];

export default function Testimonials() {
  return (
    <Section id="testimonials">
      <h2 className="text-3xl md:text-4xl font-bold">What partners say</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {quotes.map((q, i) => (
          <motion.blockquote
            key={q.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05 * i, ease: "easeOut" }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6"
          >
            <p className="text-white/80">“{q.blurb}”</p>
            <footer className="mt-4 text-sm text-white/60">— {q.name}</footer>
          </motion.blockquote>
        ))}
      </div>
    </Section>
  );
}