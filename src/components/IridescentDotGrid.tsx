"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  rows?: number;
  cols?: number;
  gap?: number;        // px between dots
  size?: number;       // base dot size (px)
  radius?: number;     // px radius for magnification falloff
  maxScale?: number;   // max scale at cursor center
  className?: string;  // extra classes
};

/** Iridescent dot grid with hover magnification + hue shift */
export default function IridescentDotGrid({
  rows = 22,
  cols = 34,
  gap = 28,
  size = 3,
  radius = 220,
  maxScale = 2.1,
  className = "",
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [hue, setHue] = useState(200);

  // Generate grid positions once
  const dots = useMemo(() => {
    const arr: { x: number; y: number; key: string }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push({ x: c, y: r, key: `${r}-${c}` });
      }
    }
    return arr;
  }, [rows, cols]);

  // Track mouse within host
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const onLeave = () => setMouse(null);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Animate hue for iridescent feel
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setHue((h) => (h + 0.4) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Compute width/height based on grid
  const width = (cols - 1) * gap;
  const height = (rows - 1) * gap;

  return (
    <div
      ref={hostRef}
      className={`pointer-events-auto absolute inset-0 ${className}`}
      aria-hidden
    >
      {/* Center the grid in the container */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width, height }}
      >
        {dots.map(({ x, y, key }) => {
          const px = x * gap;
          const py = y * gap;

          // Magnification falloff
          let scale = 1;
          if (mouse) {
            const dx = mouse.x - (width / 2 + (px - width / 2));
            const dy = mouse.y - (height / 2 + (py - height / 2));
            const d2 = dx * dx + dy * dy;
            const sigma = radius * 0.5;
            const s = Math.exp(-d2 / (2 * sigma * sigma)); // 0..1
            scale = 1 + (maxScale - 1) * s;
          }

          // Soft iridescent color; slight per-dot offset for shimmer
          const localHue = (hue + (x * 3 + y * 2)) % 360;
          const color = `hsl(${localHue}, 80%, 62%)`;

          return (
            <span
              key={key}
              style={{
                position: "absolute",
                left: px,
                top: py,
                width: size,
                height: size,
                borderRadius: 999,
                transform: `translate(-50%, -50%) scale(${scale})`,
                transition: "transform 80ms linear",
                background: color,
                boxShadow: `0 0 10px ${color}55`,
              }}
            />
          );
        })}
      </div>

      {/* Subtle base wash so the dots sit in a “space” */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(50,140,255,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(190,120,255,0.16),transparent_55%)] blur-2xl" />
      </div>
    </div>
  );
}