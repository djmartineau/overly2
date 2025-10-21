"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type Track = { title: string; artist: string; src: string };

const TRACK: Track = {
  title: "92 Thing",
  artist: "Eli Brown",
  src: "/audio/92%20Thing.mp3",
};

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // create audio once
  useEffect(() => {
    const audio = new Audio(TRACK.src);
    audio.preload = "auto";
    audioRef.current = audio;

    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, []);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      try {
        await a.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60] select-none" aria-label="Music player">
      {/* circle with Overly logo */}
      <div className="relative grid place-items-center">
        <div className="w-[120px] h-[120px] rounded-full bg-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] grid place-items-center z-10">
          <Image src="/Overly.svg" alt="Overly logo" width={90} height={90} className="pointer-events-none" />
        </div>

        {/* play/pause button at bottom-right */}
        <button
          type="button"
          aria-pressed={isPlaying}
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={togglePlay}
          className="absolute -bottom-2 -right-2 grid h-14 w-14 place-items-center rounded-full bg-neutral-900 text-white shadow-[0_6px_24px_rgba(0,0,0,0.35)] outline-none ring-0 hover:scale-105 active:scale-[0.98] transition z-20"
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="3" y="2.5" width="4" height="13" rx="1.2" /><rect x="11" y="2.5" width="4" height="13" rx="1.2" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M4.5 3.5v11l10-5.5-10-5.5z" /></svg>
          )}
        </button>

        {/* slide-out banner from bottom of circle */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, x: -12, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)" }}
              exit={{ opacity: 0, x: -12, clipPath: "inset(0 100% 0 0)" }}
              transition={{ duration: 0.28, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-0 overflow-hidden rounded-xl bg-white/20 border border-white/30 px-4 py-2 text-sm text-white backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
              role="status"
              aria-live="polite"
            >
              <span className="inline-flex items-center gap-2">
                <span className="text-blue-400">♪</span>
                <span className="font-medium">Now Playing:</span>
                <span className="opacity-90">{TRACK.title}</span>
                <span className="opacity-60">— {TRACK.artist}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}