"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Track = { title: string; artist: string; src: string };

const TRACK: Track = {
  title: "House Song",
  artist: "Overly",
  src: "/Audio/HouseSong.mp3",
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
    <>
      <div className="fixed bottom-6 left-6 z-[60] select-none" aria-label="Music player">
        {/* circle with Overly record image */}
        <div className="relative grid place-items-center">
          <div className="w-[120px] h-[120px] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.35)] grid place-items-center z-10">
            <Image
              src="/ui/overlyrecord.webp"
              alt="Overly record"
              width={120}
              height={120}
              className="pointer-events-none rounded-full"
              style={{ animation: "spin-record 6s linear infinite", animationPlayState: isPlaying ? "running" : "paused" }}
            />
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
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin-record {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}