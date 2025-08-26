

"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Section from "@/components/Section";
import Image from "next/image";

export default function CaseStudyScroller() {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll progress through this section only
  const { scrollYProgress } = useScroll({
    target: ref,
    // When the top of the section hits the center of viewport (start),
    // to when the bottom hits the center (end)
    offset: ["start center", "end center"],
  });

  // Opacity curves for each device
  const phoneOpacity = useTransform(scrollYProgress, [0.0, 0.15, 0.30], [1, 1, 0]);
  const tabletOpacity = useTransform(scrollYProgress, [0.25, 0.45, 0.60], [0, 1, 0]);
  const desktopOpacity = useTransform(scrollYProgress, [0.55, 0.78, 1.0], [0, 1, 1]);

  // Gentle position/scale to add life
  const phoneY = useTransform(scrollYProgress, [0, 0.3], [20, -10]);
  const tabletY = useTransform(scrollYProgress, [0.25, 0.6], [30, -10]);
  const desktopY = useTransform(scrollYProgress, [0.6, 1], [40, 0]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.3], [0.98, 1]);
  const tabletScale = useTransform(scrollYProgress, [0.25, 0.6], [0.98, 1]);
  const desktopScale = useTransform(scrollYProgress, [0.6, 1], [0.98, 1]);

  return (
    <Section id="case" className="py-36">
      <div ref={ref} className="relative">
        {/* Sticky stage background */}
        <div className="sticky top-[120px] z-0 h-[70svh] w-full rounded-3xl bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 ring-1 ring-white/10 shadow-inner" />

        {/* PHONE */}
        <motion.div
          className="sticky top-[140px] z-10"
          style={{ opacity: phoneOpacity, y: phoneY, scale: phoneScale }}
        >
          <DeviceFrame label="Phone" aspect="aspect-[9/19]" notch>
            <Image
              src="/screens/phone.svg"
              alt="Overly mobile screen"
              fill
              className="object-cover"
              priority
            />
          </DeviceFrame>
        </motion.div>

        {/* TABLET */}
        <motion.div
          className="sticky top-[120px] z-10"
          style={{ opacity: tabletOpacity, y: tabletY, scale: tabletScale }}
        >
          <DeviceFrame label="Tablet" aspect="aspect-[4/3]">
            <Image
              src="/screens/tablet.svg"
              alt="Overly tablet screen"
              fill
              className="object-cover"
            />
          </DeviceFrame>
        </motion.div>

        {/* DESKTOP */}
        <motion.div
          className="sticky top-[100px] z-10"
          style={{ opacity: desktopOpacity, y: desktopY, scale: desktopScale }}
        >
          <DeviceFrame label="Desktop" aspect="aspect-[16/10]">
            <Image
              src="/screens/desktop.svg"
              alt="Overly desktop screen"
              fill
              className="object-cover"
            />
          </DeviceFrame>
        </motion.div>

        {/* Spacer to create scroll distance */}
        <div className="h-[220svh]" />
      </div>
    </Section>
  );
}

function DeviceFrame({
  label,
  aspect,
  notch = false,
  children,
}: {
  label: string;
  aspect: string; // e.g., "aspect-[16/10]"
  notch?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className={`mx-auto w-full ${aspect}`}>
        <div className="relative mx-auto w-full max-w-5xl">
          {/* Frame */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-lg">
            {/* Notch for phone */}
            {notch && (
              <div className="pointer-events-none absolute left-1/2 top-2 h-5 w-28 -translate-x-1/2 rounded-full bg-black/40" />
            )}
            {/* Screen area */}
            <div className={`relative ${aspect}`}>
              <div className="absolute inset-0 flex items-center justify-center text-white/50">
                {children}
              </div>
            </div>
          </div>
          {/* Label */}
          <div className="mt-3 text-center text-sm text-white/50">{label}</div>
        </div>
      </div>
    </div>
  );
}
