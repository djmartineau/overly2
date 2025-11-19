"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const PLATFORMS = [
  { name: "Adobe Creative Cloud", file: "adobe.svg" },
  { name: "Facebook / Meta", file: "facebook.svg" },
  { name: "Figma", file: "figma.svg" },
  { name: "Google", file: "google.svg" },
  { name: "Instagram", file: "instagram.svg" },
  { name: "Klaviyo", file: "klaviyo.svg" },
  { name: "LinkedIn", file: "linkedin.svg" },
  { name: "Mailchimp", file: "mailchimp.svg" },
  { name: "ManyChat", file: "manychat.svg" },
  { name: "Meta", file: "meta.svg" },
  { name: "Next.js", file: "nextjs.svg" },
  { name: "Roku", file: "roku.svg" },
  { name: "Shopify", file: "shopify.svg" },
  { name: "TikTok", file: "tiktok.svg" },
  { name: "WordPress", file: "wordpress.svg" },
];

export default function PlatformsSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-8 pt-24">
      <div className="text-center mb-10">
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-400">
          Platforms & partners
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-neutral-50">
          Trusted by the platforms that{" "}
          <span
            className="inline-block"
            style={{
              backgroundImage: "linear-gradient(90deg, #3b82f6, #a855f7)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            power the modern web
          </span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
          We design, build, and grow inside the same ecosystems your team
          already lives in, from creative suites to analytics and automation.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-4 items-center justify-items-center">
        {PLATFORMS.map((platform, index) => (
          <motion.div
            key={platform.file}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
            className="flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300 ease-[0.25,1,0.33,1] hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
          >
            <Image
              src={`/stack/${platform.file}`}
              alt={platform.name}
              width={200}
              height={60}
              className="h-16 sm:h-20 w-auto"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}