"use client";

import Image from "next/image";

const buildTools = [
  { name: "Next.js", file: "nextjs.svg" },
  { name: "WordPress", file: "wordpress.svg" },
  { name: "Shopify", file: "shopify.svg" },
];

const createTools = [
  { name: "Adobe Creative Cloud", file: "adobe.svg" },
  { name: "Figma", file: "figma.svg" },
  { name: "CapCut", file: "capcut.svg" },
  { name: "Instagram", file: "instagram.svg" },
];

const growTools = [
  { name: "Google Ads", file: "google-ads.svg" },
  { name: "Google Analytics 4", file: "google-analytics.svg" },
  { name: "Meta / Facebook", file: "facebook.svg" },
  { name: "Klaviyo", file: "klaviyo.svg" },
  { name: "ManyChat", file: "manychat.svg" },
];

const columnClasses =
  "flex flex-col gap-4";

const logoRowClasses =
  "mt-4 grid grid-cols-2 gap-x-6 gap-y-4";

const logoClasses =
  "h-10 sm:h-11 w-auto opacity-60 hover:opacity-100 transition duration-300 ease-[0.25,1,0.33,1] hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]";

export default function StackSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-10">
      <div className="text-center mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
          Our stack
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-neutral-50">
          The tools behind the work
        </h2>
        <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
          Modern frameworks, creative suites, and growth platforms we live in
          every day.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {/* Build */}
        <div className={columnClasses}>
          <div>
            <h3 className="text-sm font-semibold text-neutral-100">
              Build
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Shipping fast, performant sites and stores.
            </p>
          </div>
          <div className={logoRowClasses}>
            {buildTools.map((tool) => (
              <Image
                key={tool.file}
                src={`/stack/${tool.file}`}
                alt={tool.name}
                width={140}
                height={40}
                className={logoClasses}
              />
            ))}
          </div>
        </div>

        {/* Create */}
        <div className={columnClasses}>
          <div>
            <h3 className="text-sm font-semibold text-neutral-100">
              Create
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Design, motion, and content production.
            </p>
          </div>
          <div className={logoRowClasses}>
            {createTools.map((tool) => (
              <Image
                key={tool.file}
                src={`/stack/${tool.file}`}
                alt={tool.name}
                width={140}
                height={40}
                className={logoClasses}
              />
            ))}
          </div>
        </div>

        {/* Grow */}
        <div className={columnClasses}>
          <div>
            <h3 className="text-sm font-semibold text-neutral-100">
              Grow
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Performance, automation, and reporting.
            </p>
          </div>
          <div className={logoRowClasses}>
            {growTools.map((tool) => (
              <Image
                key={tool.file}
                src={`/stack/${tool.file}`}
                alt={tool.name}
                width={140}
                height={40}
                className={logoClasses}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}