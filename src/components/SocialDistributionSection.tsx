"use client";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export default function SocialDistributionSection() {
  const [reach, setReach] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const [niches, setNiches] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20% 0px" });

useEffect(() => {
  if (!isInView) return;

  let interval: ReturnType<typeof setInterval> | undefined;

  const startDelay = setTimeout(() => {
    const durationMs = 1200;
    const stepMs = 40;
    const totalSteps = Math.round(durationMs / stepMs);
    let currentStep = 0;

    interval = setInterval(() => {
      currentStep += 1;
      const progress = Math.min(currentStep / totalSteps, 1);

      setReach(Math.round(1_000_000 * progress));
      setCoverage(Math.round(6 * progress));
      setNiches(Math.round(10 * progress));

      if (progress >= 1 && interval) {
        clearInterval(interval);
      }
    }, stepMs);
  }, 300); // 300ms delay before starting the count-up

  return () => {
    clearTimeout(startDelay);
    if (interval) clearInterval(interval);
  };
}, [isInView]);

  return (
    <section
      ref={sectionRef}
      id="social-network"
      className="relative border-t border-white/5 bg-transparent py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Eyebrow */}
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-400">
          Distribution
        </p>

        {/* Heading */}
        <div className="mt-3 space-y-4">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            The Overly Social{" "}
            <span
              className="inline-block"
              style={{
                backgroundImage: "linear-gradient(90deg, #3b82f6, #a855f7)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Distribution Network
            </span>
          </h2>

          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Florida&apos;s most engaged local communities—curated, managed, and
            grown by us.
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Reach
            </p>
            <p className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              {reach.toLocaleString()}+
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Monthly views across the Instagram pages we operate and manage.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Coverage
            </p>
            <p className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              {coverage}+ regions
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Miami, Broward, Palm Beach, Orlando, Tampa, the Gulf Coast, and
              more as the network grows.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Niches
            </p>
            <p className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              {niches}+ verticals
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Travel, food, nightlife, wellness, sports, gaming, and other
              culture-first categories.
            </p>
          </div>
        </div>

        {/* Body copy */}
        <div className="mt-12 space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
          <p>
            Overly&apos;s Social Media Network connects brands with active local
            audiences across Florida. Each page is curated to reflect the real
            culture, humor, and energy of its region—built around content that
            actually gets watched, saved, and shared.
          </p>
          <p>
            Together, these communities generate over{" "}
            <span className="font-semibold text-white">1,000,000</span> monthly
            views, giving brands a direct line to high-intent Floridian
            audiences. Through this ecosystem, we amplify visibility, spark
            authentic growth, and deliver campaigns that reach the right people
            in the right place at the right moment.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <button
            onClick={() => {
              if (typeof window === "undefined") return;
              const buttons = Array.from(
                document.querySelectorAll("button")
              ) as HTMLButtonElement[];
              const heroCta = buttons.find((btn) =>
                btn.textContent?.trim().includes("Work with us")
              );
              heroCta?.click();
            }}
            className="group inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-400"
          >
            Discover how your brand can plug into the network
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}