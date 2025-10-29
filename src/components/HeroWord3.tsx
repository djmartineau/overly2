"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  words?: string[];
  className?: string;
  shimmer?: boolean;

  // extra timing knobs that Hero3 can pass down.
  // we’re not using them (yet), but accepting them
  // silences the TS errors.
  stayMs?: number;
  outMs?: number;
  initialDelayMs?: number;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HeroWord3({
  words = ["MEMORABLE", "CREATIVE", "INNOVATIVE", "BOLD"],
  className = "block text-5xl md:text-6xl font-extrabold tracking-tight text-blue-500",
  shimmer = true,

  // harmlessly accept these so parent <HeroWord3 ...stayMs={...} /> doesn’t error
  stayMs,
  outMs,
  initialDelayMs,
}: Props) {
  // which word we're on
  const [idx, setIdx] = useState(0);

  // how many characters of the current word are visible
  const [charIndex, setCharIndex] = useState(0);

  // whether we're deleting instead of typing
  const [isDeleting, setIsDeleting] = useState(false);

  // the actual string we render
  const [display, setDisplay] = useState("");

  // caret blink
  const [showCursor, setShowCursor] = useState(true);

  // NEW: gate that delays starting the type animation at first load
  const [bootDelayDone, setBootDelayDone] = useState(false);

  // cursor blink
  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 500);
    return () => clearInterval(blink);
  }, []);

  // initial landing delay:
  // show the FIRST word fully, do nothing for BOOT_HOLD_MS,
  // then "erase" it to start normal typing loop.
  useEffect(() => {
    const BOOT_HOLD_MS = 2000; // how long first word just sits before typing starts
    setDisplay(words[0]);
    setCharIndex(words[0].length);
    setIsDeleting(false);

    const t = window.setTimeout(() => {
      setBootDelayDone(true);
      setIsDeleting(true);
    }, BOOT_HOLD_MS);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // main typing / deleting loop
  useEffect(() => {
    if (!bootDelayDone) return; // don't do normal loop until after boot delay

    const current = words[idx];
    const atEnd = charIndex === current.length;
    const atStart = charIndex === 0;

    // local timings (these still control behavior)
    const TYPE_MS = 120; // typing speed per char
    const DELETE_MS = 80; // deleting speed per char
    const HOLD_MS = 1600; // pause with full word
    const GAP_MS = 400; // pause before next word

    let timeout: number;

    if (!isDeleting) {
      // typing phase
      if (!atEnd) {
        timeout = window.setTimeout(() => {
          setCharIndex((c) => c + 1);
        }, TYPE_MS);
      } else {
        // finished typing -> hold, then start deleting
        timeout = window.setTimeout(() => {
          setIsDeleting(true);
        }, HOLD_MS);
      }
    } else {
      // deleting phase
      if (!atStart) {
        timeout = window.setTimeout(() => {
          setCharIndex((c) => c - 1);
        }, DELETE_MS);
      } else {
        // finished deleting -> move to next word, start typing
        timeout = window.setTimeout(() => {
          setIsDeleting(false);
          setIdx((i) => (i + 1) % words.length);
        }, GAP_MS);
      }
    }

    setDisplay(current.slice(0, charIndex));

    return () => window.clearTimeout(timeout);
  }, [bootDelayDone, charIndex, isDeleting, idx, words]);

  return (
    <motion.span
      className={`relative inline-block leading-none whitespace-nowrap ${className} ${
        shimmer
          ? "bg-gradient-to-r from-[#d8ebff] via-[#78b9ff] to-[#6a8ed1] bg-clip-text text-transparent"
          : ""
      }`}
      style={
        shimmer
          ? { perspective: 900, backgroundSize: "250% 100%" }
          : { perspective: 900 }
      }
      initial={shimmer ? { backgroundPosition: "0% 50%" } : undefined}
      animate={shimmer ? { backgroundPosition: "100% 50%" } : undefined}
      transition={
        shimmer
          ? { duration: 5, ease: EASE, repeat: Infinity, repeatType: "mirror" }
          : undefined
      }
    >
      <span
        style={{
          display: "inline-block",
          transformOrigin: "50% 50%",
        }}
      >
        {display}
      </span>
      <span
        className={`ml-[0.06em] select-none align-baseline ${
          showCursor ? "opacity-100" : "opacity-0"
        } text-blue-400`}
        aria-hidden
      >
        |
      </span>
    </motion.span>
  );
}