"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const BackgroundFX = dynamic(() => import("@/components/BackgroundFX"), { ssr: false });
const MusicPlayer  = dynamic(() => import("@/components/MusicPlayer"),  { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


function Splash({ ready, onEnter }: { ready: boolean; onEnter: () => void }) {
  const [progress, setProgress] = useState(0);
  const DURATION = 3000; // ms, keep in sync with SPLASH_MS

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const pct = Math.min(((t - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const showButton = progress >= 100;

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-neutral-950">
      <div className="grid place-items-center gap-5">
        {/* White disc with spinning logo */}
        <div className="w-32 h-32 rounded-full bg-white grid place-items-center shadow-[0_0_40px_rgba(59,130,246,0.25)]">
          <Image
            src="/Overly.svg"
            alt="Overly Logo"
            width={100}
            height={100}
            sizes="100px"
            priority
            className="select-none pointer-events-none"
            style={{ animation: `splash-spin ${DURATION}ms linear` }}
          />
        </div>

        {/* Progress or Enter (fixed height to prevent vertical shift) */}
        <div className="w-44 h-10 flex items-center justify-center">
          {!showButton ? (
            <div aria-hidden className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : ready ? (
            <span
              role="button"
              tabIndex={0}
              onClick={onEnter}
              className="text-blue-500 cursor-pointer hover:text-white hover:scale-105 transition-transform font-medium tracking-wide"
            >
              Enter
            </span>
          ) : (
            <span className="text-blue-500 opacity-50 cursor-not-allowed font-medium tracking-wide">
              Enter
            </span>
          )}
        </div>
      </div>
    </div>
  );
}



export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [isReady, setReady] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const ENTER_HOLD_MS = 1200; // keep splash visible this long after clicking Enter

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();

    function preloadImage(src: string) {
      return new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });
    }

    // MIN_SPLASH_MS includes delay for gateOpen to allow background visibility before content animates in
    const MIN_SPLASH_MS = 1200;
    const MAX_SPLASH_MS = 5000;

    const critical: Promise<unknown>[] = [
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready ?? Promise.resolve(),
      preloadImage("/Overly.svg"),
    ];

    const timeoutMax = new Promise((resolve) => setTimeout(resolve, MAX_SPLASH_MS));

    Promise.race([Promise.allSettled(critical), timeoutMax]).then(async () => {
      const elapsed = performance.now() - start;
      const leftToMin = Math.max(0, MIN_SPLASH_MS - elapsed);
      if (leftToMin > 0) {
        await new Promise((r) => setTimeout(r, leftToMin));
      }
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" as="image" href="/Overly.svg" />
        <meta name="apple-mobile-web-app-title" content="Overly" />

        {/* Recommended favicon links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {/* Optional: Safari pinned tab */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0b0f19" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-100 min-h-screen relative`}
      >
        <BackgroundFX />
        {/* Fullscreen splash overlay while booting */}
        {isSplashVisible && (
          <Splash
            ready={isReady}
            onEnter={() => {
              // Keep splash on-screen a bit longer for a smoother handoff
              setTimeout(() => {
                setSplashVisible(false);
                // tiny idle so background is visible before content animates in
                setTimeout(() => setGateOpen(true), 120);
              }, ENTER_HOLD_MS);
            }}
          />
        )}
        {/* SVG filters for liquid glass effects (available globally) */}
        <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
          {/* Stronger liquid glass (blur + turbulence + displacement) */}
          <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="3" seed="3" result="noise" />
            <feDisplacementMap in="blur" in2="noise" scale="32" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Wavy displacement (more pronounced ripple) */}
          <filter id="wavy" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="4" seed="7" result="turb" />
            <feDisplacementMap in="SourceGraphic" in2="turb" scale="40" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Glass ripple (specular highlights for curved glass feel) */}
          <filter id="glass-ripple" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="gb" />
            <feSpecularLighting in="gb" surfaceScale="6" specularConstant="1" specularExponent="20" lightingColor="#ffffff" result="spec">
              <fePointLight x="-4000" y="-8000" z="20000" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" operator="in" result="lit" />
            <feBlend in="SourceGraphic" in2="lit" mode="screen" />
          </filter>
        </svg>


        {/* Render header only after splash + delay */}
        {gateOpen && <Header />}

        {gateOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              className="will-change-transform"
            >
              {children}
            </motion.div>
            <MusicPlayer />
          </>
        )}

        <style jsx global>{`
          @keyframes splash-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(720deg); }
          }
        `}</style>
      </body>
    </html>
  );
}