"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  words?: string[];
  className?: string;
  durationMs?: number; // total time each word stays (including in/out)
  inMs?: number;
  outMs?: number;
  stayMs?: number; // time fully visible between in/out
  shimmer?: boolean;
  shimmerOpacity?: number;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HeroWord3({
  words = ["MEMORABLE", "CREATIVE", "INNOVATIVE", "BOLD"],
  className = "block text-5xl md:text-6xl font-extrabold tracking-tight text-blue-500",
  inMs = 400,
  stayMs = 1400,
  outMs = 400,
  shimmer = true,
  shimmerOpacity = 0.6,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [display, setDisplay] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 500);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const current = words[idx];
    const atEnd = charIndex === current.length;
    const atStart = charIndex === 0;

    // Speeds (ms)
    const TYPE_MS = 120;     // typing speed per char (slower)
    const DELETE_MS = 80;    // deleting speed per char (slower)
    const HOLD_MS = 1600;    // pause when fully typed (longer hold)
    const GAP_MS = 400;      // pause before starting next word

    let timeout: number;

    if (!isDeleting) {
      if (!atEnd) {
        timeout = window.setTimeout(() => setCharIndex((c) => c + 1), TYPE_MS);
      } else {
        // hold, then start deleting
        timeout = window.setTimeout(() => setIsDeleting(true), HOLD_MS);
      }
    } else {
      if (!atStart) {
        timeout = window.setTimeout(() => setCharIndex((c) => c - 1), DELETE_MS);
      } else {
        // move to next word
        timeout = window.setTimeout(() => {
          setIsDeleting(false);
          setIdx((i) => (i + 1) % words.length);
        }, GAP_MS);
      }
    }

    setDisplay(current.slice(0, charIndex));

    return () => window.clearTimeout(timeout);
  }, [charIndex, isDeleting, idx, words]);

  return (
    <motion.span
      className={`relative inline-block leading-none whitespace-nowrap ${className} ${
        shimmer ? "bg-gradient-to-r from-[#e0f3ff] via-blue-400 via-60% to-[#122b5a] bg-clip-text text-transparent" : ""
      }`}
      style={shimmer ? { perspective: 900, backgroundSize: "250% 100%" } : { perspective: 900 }}
      initial={shimmer ? { backgroundPosition: "0% 50%" } : undefined}
      animate={shimmer ? { backgroundPosition: "100% 50%" } : undefined}
      transition={shimmer ? { duration: 5, ease: EASE, repeat: Infinity, repeatType: "mirror" } : undefined}
    >
      <span style={{ display: "inline-block", transformOrigin: "50% 50%" }}>{display}</span>
      <span
        className={`ml-[0.06em] select-none align-baseline ${showCursor ? "opacity-100" : "opacity-0"} text-blue-400`}
        aria-hidden
      >
        |
      </span>
    </motion.span>
  );
}
