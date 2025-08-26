"use client";
import React, { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const discRef = useRef<HTMLDivElement | null>(null);
  const circleWrapRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // seconds
  const [current, setCurrent] = useState(0); // seconds
  const [volume, setVolume] = useState(0.5); // 0..1, default 50%
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [pulse, setPulse] = useState(0); // increments to re-trigger play pulse
  // Pulse effect: retrigger pulse ring when play toggles to true
  useEffect(() => {
    if (isPlaying && !isScrubbing) {
      // bump a counter to retrigger CSS keyframe
      setPulse((n) => (n + 1) % 1000);
    }
  }, [isPlaying, isScrubbing]);
  // Format seconds as mm:ss
  const toMMSS = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, "0");
    return `${m}:${ss}`;
  };
  const isScrubbingRef = useRef(false);
  const [dragAngle, setDragAngle] = useState(0); // degrees
  const wasPlayingRef = useRef(false);
  const rafMoveRef = useRef<number | null>(null);
  const pendingDegRef = useRef<number | null>(null);
  // If user scrubs before duration is known, remember desired fraction (0..1)
  const pendingFracRef = useRef<number | null>(null);
  const durationRef = useRef(0);
  const previousVolumeRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Load metadata + keep time in sync
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;

    const onLoaded = () => {
      const dur = Number.isFinite(a.duration) ? a.duration : 0;
      setDuration(dur);
      durationRef.current = dur;
      if (dur > 0 && pendingFracRef.current != null) {
        const f = Math.min(1, Math.max(0, pendingFracRef.current));
        seekTo(f * dur);
        pendingFracRef.current = null;
      }
    };
    const onTime = () => setCurrent(a.currentTime || 0);
    const onEnded = () => setIsPlaying(false);

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
    };
  }, [volume]);

  // Load volume and mute state from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem("musicPlayerVolume");
    const savedMuted = localStorage.getItem("musicPlayerMuted");
    let initialVolume = 0.5;
    let initialMuted = false;

    if (savedVolume !== null) {
      const vol = parseFloat(savedVolume);
      if (!isNaN(vol) && vol >= 0 && vol <= 1) {
        initialVolume = vol;
      }
    }
    if (savedMuted !== null) {
      initialMuted = savedMuted === "true";
    }

    setVolume(initialVolume);
    setIsMuted(initialMuted);
    previousVolumeRef.current = initialMuted ? 0 : initialVolume;

    if (audioRef.current) {
      audioRef.current.volume = initialMuted ? 0 : initialVolume;
    }
  }, []);

  // Save volume and mute state to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("musicPlayerVolume", volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("musicPlayerMuted", isMuted.toString());
  }, [isMuted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const a = audioRef.current;
      if (!a) return;

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement || e.isComposing || e.repeat) {
        // Ignore if typing in inputs or composing text or key repeat
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (isPlaying) {
            a.pause();
            setIsPlaying(false);
          } else {
            a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          seekTo((a.currentTime || 0) + 5);
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekTo((a.currentTime || 0) - 5);
          break;
        case "ArrowUp":
          e.preventDefault();
          {
            let newVol = Math.min(1, volume + 0.05);
            setVolume(newVol);
            if (audioRef.current) audioRef.current.volume = newVol;
            if (newVol > 0) {
              setIsMuted(false);
              previousVolumeRef.current = newVol;
            }
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          {
            let newVol = Math.max(0, volume - 0.05);
            setVolume(newVol);
            if (audioRef.current) audioRef.current.volume = newVol;
            if (newVol === 0) {
              setIsMuted(true);
            } else {
              setIsMuted(false);
              previousVolumeRef.current = newVol;
            }
          }
          break;
        case "KeyM":
          e.preventDefault();
          if (isMuted) {
            // Unmute: restore previous volume or default 0.5
            const restoreVol = previousVolumeRef.current && previousVolumeRef.current > 0 ? previousVolumeRef.current : 0.5;
            setVolume(restoreVol);
            if (audioRef.current) audioRef.current.volume = restoreVol;
            setIsMuted(false);
          } else {
            // Mute: save current volume and set volume to 0
            previousVolumeRef.current = volume;
            setVolume(0);
            if (audioRef.current) audioRef.current.volume = 0;
            setIsMuted(true);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, volume, isMuted]);

  useEffect(() => {
    return () => {
      if (rafMoveRef.current != null) cancelAnimationFrame(rafMoveRef.current);
    };
  }, []);

  // Controls
  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };
  const seekTo = (sec: number) => {
    const a = audioRef.current;
    if (!a) return;
    const dur = Number.isFinite(a.duration) ? a.duration : durationRef.current || 0;
    const clamped = dur > 0 ? Math.min(Math.max(0, sec), dur) : Math.max(0, sec);
    try { a.currentTime = clamped; } catch {}
    setCurrent(a.currentTime || clamped);
  };
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
      previousVolumeRef.current = v;
    }
  };

  const angleFromEvent = (e: PointerEvent | MouseEvent | TouchEvent) => {
    const wrap = circleWrapRef.current;
    if (!wrap) return null;

    // Get client point safely for Pointer/Mouse/Touch events
    const getPoint = (
      ev: PointerEvent | MouseEvent | TouchEvent
    ): { x: number; y: number } | null => {
      if ("clientX" in ev) {
        // PointerEvent | MouseEvent
        return { x: ev.clientX, y: ev.clientY };
      }
      // TouchEvent branches
      const te = ev as TouchEvent;
      if (te.touches && te.touches.length > 0) {
        const t = te.touches[0];
        return { x: t.clientX, y: t.clientY };
      }
      if (te.changedTouches && te.changedTouches.length > 0) {
        const t = te.changedTouches[0];
        return { x: t.clientX, y: t.clientY };
      }
      return null;
    };

    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const pt = getPoint(e);
    if (!pt) return null;

    const rad = Math.atan2(pt.y - cy, pt.x - cx);
    let deg = (rad * 180) / Math.PI;
    deg = (deg + 90 + 360) % 360; // 0 at 12 o'clock, clockwise
    return deg;
  };

  const progressFromAngle = (deg: number) => {
    return Math.min(1, Math.max(0, deg / 360));
  };

  const scheduleMove = (deg: number) => {
    pendingDegRef.current = deg;
    if (rafMoveRef.current == null) {
      rafMoveRef.current = requestAnimationFrame(() => {
        rafMoveRef.current = null;
        const d = pendingDegRef.current;
        pendingDegRef.current = null;
        if (d == null) return;
        setDragAngle(d);
        const frac = progressFromAngle(d);
        const dur = durationRef.current;
        if (dur > 0) {
          seekTo(frac * dur);
        } else {
          pendingFracRef.current = frac;
        }
      });
    }
  };

  const onMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
    if (!isScrubbingRef.current) return;
    e.preventDefault?.();
    const deg = angleFromEvent(e);
    if (deg == null) return;
    scheduleMove(deg);
  };

  const onPointerMove = (e: PointerEvent) => {
    onMove(e);
  };

  const endScrub = (ev?: PointerEvent | MouseEvent | TouchEvent) => {
    if (!isScrubbing) return;
    setIsScrubbing(false);
    isScrubbingRef.current = false;

    if (rafMoveRef.current != null) {
      cancelAnimationFrame(rafMoveRef.current);
      rafMoveRef.current = null;
    }
    pendingDegRef.current = null;

    const wrap = circleWrapRef.current;
    if (wrap) {
      // Remove element-scoped listeners & release capture
      wrap.removeEventListener('pointermove', onPointerMove as unknown as EventListener);
      wrap.removeEventListener('pointerup', endScrub as unknown as EventListener);
      wrap.removeEventListener('pointercancel', endScrub as unknown as EventListener);
      try {
        // If we had capture, release it
        // @ts-ignore – releasePointerCapture exists on HTMLElement for pointer events
        if ((ev as PointerEvent)?.pointerId != null) wrap.releasePointerCapture((ev as PointerEvent).pointerId);
      } catch {}
    }

    const a = audioRef.current;
    if (a && wasPlayingRef.current) {
      a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const startScrub = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    e.preventDefault?.();
    e.stopPropagation?.();

    wasPlayingRef.current = isPlaying;
    const a = audioRef.current;
    if (a) a.pause();
    setIsPlaying(false);
    setIsScrubbing(true);
    isScrubbingRef.current = true;

    const wrap = circleWrapRef.current;
    if (wrap && 'pointerId' in (e as any)) {
      try {
        // Capture all subsequent pointer events on the element so dragging feels immediate
        wrap.setPointerCapture((e as React.PointerEvent).pointerId);
      } catch {}
      wrap.addEventListener('pointermove', onPointerMove as unknown as EventListener, { passive: false });
      wrap.addEventListener('pointerup', endScrub as unknown as EventListener, { passive: false });
      wrap.addEventListener('pointercancel', endScrub as unknown as EventListener, { passive: false });
    }

    const nativeEvt = ("nativeEvent" in (e as object) ? (e as any).nativeEvent : e) as
      | PointerEvent
      | MouseEvent
      | TouchEvent;
    const deg = angleFromEvent(nativeEvt);
    if (deg != null) {
      setDragAngle(deg);
      const frac = progressFromAngle(deg);
      const dur = durationRef.current;
      if (dur > 0) {
        seekTo(frac * dur);
      } else {
        pendingFracRef.current = frac;
      }
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <div className="relative w-[340px] h-[110px]">
        {/* Pill container */}
        <div
          className="absolute inset-0 rounded-[16px] bg-white/8 ring-1 ring-white/15 backdrop-blur-md shadow-[0_8px_24px_rgba(2,6,23,0.25)] px-4 pt-3 pb-3 flex items-center gap-4"
          aria-label="Music player"
        >
          {/* Spinning Overly record with circular progress */}
          <div
            ref={circleWrapRef}
            className="relative shrink-0 select-none touch-none cursor-pointer w-16 h-16 grid place-items-center rounded-full transition-shadow hover:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
            onPointerDown={startScrub}
            onMouseDown={startScrub}
            onTouchStart={startScrub}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={current}
            style={{ touchAction: 'none', userSelect: 'none' }}
          >
            {/* Pulse ring */}
            <div
              key={pulse}
              className={(isPlaying && !isScrubbing) ? "absolute inset-0 rounded-full pointer-events-none animate-[pulseGlow_900ms_ease-out_forwards]" : "hidden"}
              aria-hidden
            />
            <div
              ref={discRef}
              className={
                "h-14 w-14 rounded-full bg-white overflow-hidden grid place-items-center " +
                ((isPlaying && !isScrubbing) ? "animate-spin" : "") +
                " " + (isPlaying ? "scale-[1.01]" : "scale-100")
              }
              style={{
                animationDuration: "9s",
                animationPlayState: isPlaying && !isScrubbing ? "running" : "paused",
                transform: isScrubbing ? `rotate(${dragAngle}deg)` : undefined
              }}
              aria-hidden
            >
              <img src="/Overly.svg" alt="" className="h-full w-full object-contain select-none" draggable={false} />
            </div>
            {(() => {
              // Use a 64×64 viewbox so the ring sits outside the 56px disc
              const BOX = 64;
              const R = 28; // radius so ring hugs the disc (56px) with a little clearance
              const STROKE = 4;
              const C = 2 * Math.PI * R;
              // While scrubbing, show progress based on the drag angle so feedback is instant.
              // Otherwise, use audio time if duration is known; fall back to any pending target.
              const rawFrac = isScrubbing
                ? progressFromAngle(dragAngle)
                : (durationRef.current > 0
                    ? Math.min(1, current / durationRef.current)
                    : (pendingFracRef.current ?? 0));
              const frac = Math.max(0, Math.min(1, rawFrac));
              const dash = C * frac;
              return (
                <>
                  <svg
                    className="pointer-events-none absolute inset-0"
                    viewBox={`0 0 ${BOX} ${BOX}`}
                    width={BOX}
                    height={BOX}
                    aria-hidden
                  >
                    <circle
                      cx={BOX/2}
                      cy={BOX/2}
                      r={R}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth={STROKE}
                      fill="none"
                    />
                    <circle
                      cx={BOX/2}
                      cy={BOX/2}
                      r={R}
                      stroke="#3b82f6"
                      strokeWidth={STROKE}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${dash} ${C - dash}`}
                      transform={`rotate(-90 ${BOX/2} ${BOX/2})`}
                      style={{ transition: isScrubbing ? undefined : "stroke-dasharray 120ms linear" }}
                    />
                  </svg>
                  {isScrubbing && (() => {
                    const rad = ((dragAngle - 90) * Math.PI) / 180; // inverse of our rotate(-90)
                    const cx = BOX/2, cy = BOX/2;
                    const px = cx + R * Math.cos(rad);
                    const py = cy + R * Math.sin(rad);
                    const frac = progressFromAngle(dragAngle);
                    const target = (durationRef.current || 0) * frac;
                    return (
                      <div
                        className="pointer-events-none absolute text-[10px] font-medium text-white bg-black/70 px-1.5 py-0.5 rounded-md shadow"
                        style={{ left: `${(px / BOX) * 100}%`, top: `${(py / BOX) * 100}%`, transform: "translate(-50%, -160%)" }}
                      >
                        {toMMSS(target)}
                      </div>
                    );
                  })()}
                </>
              );
            })()}
          </div>

          {/* Middle column: title + artist */}
          <div className="min-w-0 flex-1 text-white">
            <div className="truncate text-[13px] font-semibold leading-tight">92 Thing</div>
            <div className="truncate text-[12px] text-white/70 leading-tight">Eli Brown</div>
          </div>

          {/* Right column: volume + play/pause */}
          <div className="flex items-center gap-3">
            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2 w-24 group">
              <svg className="h-7 w-7 text-white/70 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M3 10v4h3l4 4V6L6 10H3z" />
              </svg>
              <input
                type="range"
                min={0}
                max={1}
                step="0.01"
                value={volume}
                onChange={handleVolume}
                className="w-full h-2 rounded-full cursor-pointer appearance-none group-hover:shadow-[0_0_0_2px_rgba(59,130,246,0.25)]"
                aria-label="Volume"
                style={{
                  background: "linear-gradient(to right, #3b82f6 " + (volume * 100) + "%, rgba(255,255,255,0.2) " + (volume * 100) + "%)",
                }}
              />
              <style>{`
                input[type='range'].appearance-none::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; height:16px; width:16px; border-radius:9999px; background:#fff; box-shadow:0 0 0 1px rgba(255,255,255,.5); margin-top:-3px; }
                input[type='range'].appearance-none::-moz-range-thumb{ height:16px; width:16px; border-radius:9999px; background:#fff; border:1px solid rgba(255,255,255,.5); margin-top:-3px; }
                input[type='range'].appearance-none::-webkit-slider-runnable-track{ height:8px; border-radius:9999px; }
                input[type='range'].appearance-none::-moz-range-track{ height:8px; border-radius:9999px; background:transparent; }
              `}</style>
            </div>

            {/* Play/Pause */}
            <button
              onClick={toggle}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-900 ring-1 ring-white/50 transition hover:scale-[1.04] hover:shadow-[0_0_0_6px_rgba(255,255,255,0.12)] active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M7 5v14l12-7L7 5z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src="/audio/92%20Thing.mp3"
          preload="auto"
          onLoadedMetadata={() => {
            const a = audioRef.current;
            if (a && Number.isFinite(a.duration)) {
              setDuration(a.duration);
              durationRef.current = a.duration;
              if (pendingFracRef.current != null) {
                const f = Math.min(1, Math.max(0, pendingFracRef.current));
                seekTo(f * a.duration);
                pendingFracRef.current = null;
              }
            }
          }}
        />
        <style jsx global>{`
          @keyframes pulseGlow {
            from { box-shadow: 0 0 0 0 rgba(59,130,246,.45);}
            to { box-shadow: 0 0 0 24px rgba(59,130,246,0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-spin { animation: none !important; }
          }
        `}</style>
      </div>
    </div>
  );
}