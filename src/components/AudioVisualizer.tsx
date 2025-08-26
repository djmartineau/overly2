"use client";

import { useEffect, useRef } from "react";

type Mode = "bars" | "plasma";

type Props = {
  audioRef?: React.RefObject<HTMLAudioElement>;
  className?: string;
  style?: React.CSSProperties;
  /** how many bars to draw (bars mode only) */
  bars?: number;
  /** analyser resolution */
  fftSize?: 32 | 64 | 128 | 256 | 512;
  /** visual style */
  mode?: Mode;
};

/** Small helper */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

export default function AudioVisualizer({
  audioRef,
  className,
  style,
  bars = 32,
  fftSize = 256,
  mode = "plasma",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const audio = audioRef?.current ?? null;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    // ---- Create or reuse AudioContext (typed, no any) -----------------------
    interface WindowAudio extends Window {
      AudioContext?: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    }
    const W = window as WindowAudio;
    const Ctor = W.AudioContext ?? W.webkitAudioContext;
    if (!Ctor) return; // no WebAudio
    if (!acRef.current) {
      acRef.current = new Ctor();
    }
    const ac = acRef.current!;

    // ---- Hook up analyser once per element ----------------------------------
    if (!sourceRef.current) {
      const src = ac.createMediaElementSource(audio);
      const analyser = ac.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = 0.85;

      src.connect(analyser);
      analyser.connect(ac.destination);

      sourceRef.current = src;
      analyserRef.current = analyser;

      const resume = () => {
        if (ac.state === "suspended") ac.resume().catch(() => {});
      };
      audio.addEventListener("play", resume);
      audio.addEventListener("seeking", resume);
    } else {
      // keep fftSize in sync if prop changes
      analyserRef.current!.fftSize = fftSize;
    }

    const analyser = analyserRef.current!;
    const ctx = canvas.getContext("2d")!;
    const freq = new Uint8Array(analyser.frequencyBinCount);
    const wave = new Uint8Array(analyser.fftSize);

    const drawBars = (w: number, h: number) => {
      analyser.getByteFrequencyData(freq);
      const step = Math.max(1, Math.floor(freq.length / bars));
      const barW = (w / bars) * 0.6;

      for (let i = 0; i < bars; i++) {
        const v = freq[i * step] / 255;
        const bh = v * (h * 0.9);
        const x = i * (w / bars) + (w / bars - barW) / 2;
        const y = h - bh;

        const g = ctx.createLinearGradient(0, y, 0, h);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(1, "rgba(255,255,255,0.18)");
        ctx.fillStyle = g;

        const r = Math.min(6 * devicePixelRatio, barW / 2, bh / 2);
        roundRect(ctx, x, y, barW, bh, r);
        ctx.fill();
      }
    };

    const drawPlasma = (w: number, h: number) => {
      analyser.getByteTimeDomainData(wave);

      // trail / persistence
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, w, h);

      // colorful gradient based on hue that slowly rotates
      const t = performance.now() * 0.0002;
      const hue = (t * 360) % 360;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, `hsl(${(hue + 0) % 360}, 90%, 65%)`);
      g.addColorStop(0.5, `hsl(${(hue + 80) % 360}, 90%, 65%)`);
      g.addColorStop(1, `hsl(${(hue + 160) % 360}, 90%, 65%)`);

      // shadow "bloom"
      ctx.shadowBlur = 20 * devicePixelRatio;
      ctx.shadowColor = "rgba(255,255,255,0.35)";
      ctx.lineWidth = Math.max(2, 2 * devicePixelRatio);
      ctx.strokeStyle = g;

      ctx.beginPath();
      for (let i = 0; i < wave.length; i++) {
        const v = wave[i] / 255; // 0..1
        const x = (i / (wave.length - 1)) * w;
        const y = (0.5 + (v - 0.5) * 0.9) * h; // expand vertical range a bit
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // soft highlight layer on top
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = Math.max(1, 1 * devicePixelRatio);
      ctx.stroke();

      ctx.globalCompositeOperation = "source-over";
    };

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      // HiDPI size sync
      const w = (canvas.width = Math.max(1, canvas.clientWidth * devicePixelRatio));
      const h = (canvas.height = Math.max(1, canvas.clientHeight * devicePixelRatio));

      if (mode === "bars") {
        ctx.clearRect(0, 0, w, h);
        drawBars(w, h);
      } else {
        drawPlasma(w, h);
      }
    };

    loop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Keep graph connected for seamless resume.
    };
  }, [audioRef, bars, fftSize, mode]);

  return <canvas ref={canvasRef} className={className} style={style} />;
}