"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import html2canvas from "html2canvas";

function LensPlane({
  tex,
  magnify,
  showPattern,
  enableRipple,
  rect,
  viewport,
  enableHover,
  uniformsRef,
  opacity,
  showCapture,
}: {
  tex: THREE.Texture | null;
  magnify: number;
  showPattern: boolean;
  enableRipple: boolean;
  rect: { x: number; y: number; w: number; h: number };
  viewport: { w: number; h: number };
  enableHover?: boolean;
  opacity: number;
  showCapture: boolean;
  uniformsRef: React.MutableRefObject<{
    uTex: { value: THREE.Texture | null };
    uTime: { value: number };
    uMagnify: { value: number };
    uShowPattern: { value: number };
    uEnableRipple: { value: number };
    uResolution: { value: THREE.Vector2 };
    uRect: { value: THREE.Vector4 };
    uViewport: { value: THREE.Vector2 };
    uMousePage: { value: THREE.Vector2 };
    uUseHover: { value: number };
    uOpacity: { value: number };
    uShowCapture?: { value: number };
  }>;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { size } = useThree();

  // Initialize uniforms once
  if (!uniformsRef.current) {
    uniformsRef.current = {
      uTex: { value: tex },
      uTime: { value: 0 },
      uMagnify: { value: magnify },
      uShowPattern: { value: showPattern ? 1 : 0 },
      uEnableRipple: { value: enableRipple ? 1 : 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uRect: { value: new THREE.Vector4(rect.x, rect.y, rect.w, rect.h) },
      uViewport: { value: new THREE.Vector2(viewport.w, viewport.h) },
      uMousePage: { value: new THREE.Vector2(0.5, 0.5) },
      uUseHover: { value: enableHover ? 1 : 0 },
      uOpacity: { value: opacity },
      uShowCapture: { value: showCapture ? 1 : 0 },
    };
  }
  if (!uniformsRef.current.uShowCapture) {
    uniformsRef.current.uShowCapture = { value: showCapture ? 1 : 0 };
  }

  // Keep uniforms in sync
  useEffect(() => { uniformsRef.current.uTex.value = tex; }, [tex, uniformsRef]);
  useEffect(() => { uniformsRef.current.uMagnify.value = magnify; }, [magnify, uniformsRef]);
  useEffect(() => { uniformsRef.current.uShowPattern.value = showPattern ? 1 : 0; }, [showPattern, uniformsRef]);
  useEffect(() => { uniformsRef.current.uEnableRipple.value = enableRipple ? 1 : 0; }, [enableRipple, uniformsRef]);
  useEffect(() => { uniformsRef.current.uRect.value.set(rect.x, rect.y, rect.w, rect.h); }, [rect.x, rect.y, rect.w, rect.h, uniformsRef]);
  useEffect(() => { uniformsRef.current.uViewport.value.set(viewport.w, viewport.h); }, [viewport.w, viewport.h, uniformsRef]);
  useEffect(() => { uniformsRef.current.uUseHover.value = enableHover ? 1 : 0; }, [enableHover, uniformsRef]);

  useEffect(() => {
    if (!uniformsRef.current.uShowCapture) {
      uniformsRef.current.uShowCapture = { value: showCapture ? 1 : 0 };
    } else {
      uniformsRef.current.uShowCapture.value = showCapture ? 1 : 0;
    }
  }, [showCapture, uniformsRef]);

  // Guard for HMR: ensure uOpacity exists
  useEffect(() => {
    if (!uniformsRef.current.uOpacity) {
      uniformsRef.current.uOpacity = { value: opacity };
    } else {
      uniformsRef.current.uOpacity.value = opacity;
    }
  }, [opacity, uniformsRef]);

  useFrame((state) => {
    uniformsRef.current.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[size.width, size.height]} />
      <shaderMaterial
        uniforms={uniformsRef.current}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTex;
          uniform float uTime;
          uniform float uMagnify;
          uniform float uShowPattern;
          uniform float uEnableRipple;
          uniform vec2  uResolution;
          uniform vec4  uRect;
          uniform vec2  uViewport;
          uniform vec2  uMousePage;
          uniform float uUseHover;
          uniform float uOpacity;
          uniform float uShowCapture;
          varying vec2  vUv;

          // Helper to make a soft vignette near the edges of the rounded pill plane
          float edgeVignette(vec2 uv) {
            // distance to the closest edge in 0..0.5 (center -> edge)
            float e = min(min(uv.x, uv.y), min(1.0 - uv.x, 1.0 - uv.y));
            // Rim within ~8% of the border
            float rim = smoothstep(0.10, 0.02, e);
            return clamp(rim, 0.0, 1.0);
          }

          void main() {
            vec2 vp = max(uViewport, vec2(1.0));
            vec2 centerPage = (uUseHover > 0.5) ? uMousePage : (uRect.xy + 0.5 * uRect.zw) / vp;
            vec2 pageUV = (uRect.xy + vUv * uRect.zw) / vp;

            // DEBUG: allow showing the captured screenshot directly (no magnification)
            if (uShowCapture > 0.5) {
              // DEBUG: sample the captured screenshot with an obvious offset + tint
              vec2 sampleUV = vec2(pageUV.x, 1.0 - pageUV.y);
              // Push the sample notably so it's obvious when Tex is ON
              vec2 dbgUV = sampleUV + vec2(0.08, -0.06);
              dbgUV = clamp(dbgUV, vec2(0.0), vec2(1.0));
              vec4 c = texture2D(uTex, dbgUV);
              // Magenta tint to make it unmistakable
              c.rgb = mix(c.rgb, vec3(1.0, 0.0, 1.0), 0.35);
              // Thin debug border around the pill (helps verify we’re in capture mode)
              float b = min(min(vUv.x, vUv.y), min(1.0 - vUv.x, 1.0 - vUv.y));
              float frame = smoothstep(0.01, 0.0, b);
              c.rgb = mix(vec3(1.0, 0.3, 0.7), c.rgb, 1.0 - frame);
              c.a = clamp(uOpacity, 0.0, 1.0);
              gl_FragColor = c;
              return;
            }

            // Optional ripple in page space
            if (uEnableRipple > 0.5) {
              float wave = sin(12.0 * pageUV.y + uTime * 2.0) * 0.006;
              pageUV += vec2(wave);
            }

            // Direction from lens center in page space
            vec2 dir = pageUV - centerPage;
            float zoom = max(1.0, uMagnify);

            // Force strong magnification so we can visually confirm the pipeline.
            float weight = 1.0;                      // full strength (for testing)
            float z = 1.0 + (zoom - 1.0) * weight;  // same as mix(1.0, zoom, weight)
            vec2 baseUV = centerPage + dir / z;

            // Stronger chromatic aberration so effect is visible
            float ab = 0.0075 * (zoom - 1.0) * weight;

            baseUV = clamp(baseUV, vec2(0.0), vec2(1.0));

            // Subtle chromatic aberration along the radial direction to make the effect read on text
            vec2 radialDir = normalize(dir + 1e-6);

            // Flip Y for texture sampling
            vec2 baseSample = vec2(baseUV.x, 1.0 - baseUV.y);

            // DEBUG: force a visible UV shift to verify we are sampling the captured texture.
            // This should slide the content inside the pill noticeably to the right.
            vec2 sampleUV = baseSample + vec2(0.20, 0.00);

            vec3 col;
            col.r = texture2D(uTex, sampleUV + ab * radialDir).r;
            col.g = texture2D(uTex, sampleUV).g;
            col.b = texture2D(uTex, sampleUV - ab * radialDir).b;
            vec4 color = vec4(col, 1.0);

            // Debug pattern to verify mapping/zoom
            if (uShowPattern > 0.5) {
              vec2 checkUV = baseUV * 10.0;
              float cx = step(0.5, fract(checkUV.x));
              float cy = step(0.5, fract(checkUV.y));
              float checker = (cx * cy) + ((1.0 - cx) * (1.0 - cy));
              color.rgb = (checker > 0.5) ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 1.0);
              color.a = 1.0;
            }

            // DEBUG: show tiny red dot at lens center in page space
            float d = length(pageUV - centerPage);
            color.rgb = mix(color.rgb, vec3(1.0, 0.2, 0.2), smoothstep(0.002, 0.0, d));

            // DEBUG: show tiny green dot at the magnified sample center (should match centerPage)
            float d2 = length(baseUV - centerPage);
            color.rgb = mix(color.rgb, vec3(0.2, 1.0, 0.2), smoothstep(0.002, 0.0, d2));

            // Subtle inner highlight (top-left bias)
            float highlight = smoothstep(0.85, 0.2, distance(vUv, vec2(0.18, 0.18)));
            color.rgb = mix(color.rgb, vec3(1.0), 0.06 * highlight);

            // Edge vignette for depth
            float rim = edgeVignette(vUv);
            color.rgb = mix(color.rgb, color.rgb * 0.85, 0.6 * rim);

            // Final alpha from uniform -> frosted glass feel
            color.a = clamp(uOpacity, 0.0, 1.0);
            gl_FragColor = color;
          }
        `}
      />
    </mesh>
  );
}

export default function GlassLens({
  magnify = 1.5,
  enableRipple = false,
  enableHover = false,
  overlayOpacity = 0.6,
}: {
  magnify?: number;
  enableRipple?: boolean;
  enableHover?: boolean;
  overlayOpacity?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const fallbackTex = React.useMemo(() => {
    const data = new Uint8Array([255, 255, 255, 255]);
    const dt = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    dt.needsUpdate = true;
    return dt;
  }, []);
  const [showPattern, setShowPattern] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [localMag, setLocalMag] = useState(magnify);
  useEffect(() => { setLocalMag(magnify); }, [magnify]);

  const [rect, setRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  const uniformsRef = useRef<{
    uTex: { value: THREE.Texture | null };
    uTime: { value: number };
    uMagnify: { value: number };
    uShowPattern: { value: number };
    uEnableRipple: { value: number };
    uResolution: { value: THREE.Vector2 };
    uRect: { value: THREE.Vector4 };
    uViewport: { value: THREE.Vector2 };
    uMousePage: { value: THREE.Vector2 };
    uUseHover: { value: number };
    uOpacity: { value: number };
  }>({
    uTex: { value: null },
    uTime: { value: 0 },
    uMagnify: { value: magnify },
    uShowPattern: { value: 0 },
    uEnableRipple: { value: enableRipple ? 1 : 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uRect: { value: new THREE.Vector4(0, 0, 0, 0) },
    uViewport: { value: new THREE.Vector2(1, 1) },
    uMousePage: { value: new THREE.Vector2(0.5, 0.5) },
    uUseHover: { value: enableHover ? 1 : 0 },
    uOpacity: { value: overlayOpacity },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      uniformsRef.current.uResolution.value.set(window.innerWidth, window.innerHeight);
      uniformsRef.current.uViewport.value.set(window.innerWidth, window.innerHeight);
    }
  }, [uniformsRef]);

  const measure = useCallback(() => {
    const pillEl = wrapRef.current?.parentElement as HTMLElement | null;
    if (!pillEl) return;
    const r = pillEl.getBoundingClientRect();
    setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
    setViewport({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  useEffect(() => {
    measure();
    const onResize = () => measure();
    const onScroll = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [measure]);

  const capture = useCallback(async () => {
    const pillEl = wrapRef.current?.parentElement as HTMLElement | null;
    try {
      await new Promise(requestAnimationFrame);
      await new Promise((r) => setTimeout(r, 16));

      // DEBUG: capture only a small crop around the pill so we can clearly see the texture
      const r = pillEl?.getBoundingClientRect();
      const pad = 80; // expand a bit around the pill
      const cropX = Math.max(0, Math.floor((r?.left || 0) + window.scrollX - pad));
      const cropY = Math.max(0, Math.floor((r?.top || 0) + window.scrollY - pad));
      const cropW = Math.ceil((r?.width || window.innerWidth) + pad * 2);
      const cropH = Math.ceil((r?.height || 120) + pad * 2);

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        backgroundColor: null,
        foreignObjectRendering: true,
        logging: true,
        scale: 1, // keep 1:1 for easier UV reasoning
        x: cropX,
        y: cropY,
        width: cropW,
        height: cropH,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (el) => {
          if (!pillEl) return false;
          return el === pillEl || pillEl.contains(el);
        },
        onclone: (doc) => {
          // Replace unsupported color functions so html2canvas does not crash
          const fixCss = (str: string) =>
            str
              .replace(/lab\([^)]*\)/g, "rgb(255,255,255)")
              .replace(/lch\([^)]*\)/g, "rgb(255,255,255)")
              .replace(/oklch\([^)]*\)/g, "rgb(255,255,255)");

          // 1) Inline style attributes
          doc.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
            const s = el.getAttribute("style") || "";
            const safe = fixCss(s);
            if (safe !== s) el.setAttribute("style", safe);
          });

          // 2) <style> tag contents
          doc.querySelectorAll("style").forEach((tag) => {
            const css = tag.innerHTML;
            const safe = fixCss(css);
            if (safe !== css) tag.innerHTML = safe;
          });

          // 3) Stylesheet rules; disable cross‑origin sheets we cannot read
          const ssList = Array.from(doc.styleSheets) as CSSStyleSheet[];
          ssList.forEach((sheet) => {
            const owner = (sheet as CSSStyleSheet).ownerNode as HTMLElement | null;

            try {
              const rules = (sheet as CSSStyleSheet).cssRules; // will throw on CORS
              if (!rules) return;

              // Rebuild the stylesheet with sanitized text
              const sanitized: string[] = [];
              for (let i = 0; i < rules.length; i++) {
                const text = (rules[i] as CSSRule).cssText;
                sanitized.push(fixCss(text));
              }

              if (owner && owner.tagName === "STYLE") {
                (owner as HTMLStyleElement).textContent = sanitized.join("\n");
              } else if (owner && owner.tagName === "LINK") {
                const styleTag = doc.createElement("style");
                styleTag.textContent = sanitized.join("\n");
                owner.parentElement?.insertBefore(styleTag, owner.nextSibling);
                (owner as HTMLLinkElement).disabled = true; // disable original to avoid double applying
              }
            } catch {
              // Cross‑origin stylesheet: disable it so parser never sees lab()/lch()/oklch()
              if (owner) {
                if (owner.tagName === "LINK") (owner as HTMLLinkElement).disabled = true;
                else if (owner.tagName === "STYLE") owner.textContent = "";
              }
            }
          });
        },
      });

      console.log("[GlassLens] capture OK (crop)", canvas.width, "x", canvas.height, {
        cropX, cropY, cropW, cropH,
      });
      const texture = new THREE.Texture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      setTex(texture);
      measure();
    } catch (err) {
      console.warn("[GlassLens] capture failed, using previous/fallback", err);
      // keep previous tex if any; otherwise the fallbackTex will be used
    }
  }, [measure]);

  useEffect(() => {
    capture();
    const onResize = () => capture();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [capture]);

  useEffect(() => {
    uniformsRef.current.uUseHover.value = enableHover ? 1 : 0;
  }, [enableHover, uniformsRef]);

  useEffect(() => {
    if (!enableHover) return;
    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX / window.innerWidth;
      const my = e.clientY / window.innerHeight;
      uniformsRef.current.uMousePage.value.set(mx, my);
    };
    const wrap = wrapRef.current;
    if (wrap) {
      wrap.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (wrap) {
        wrap.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [enableHover, uniformsRef]);

  useEffect(() => {
    const p = wrapRef.current?.parentElement;
    if (!p) return;
    const cs = window.getComputedStyle(p);
    if (cs.position === "static") {
      p.style.position = "relative";
    }
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "9999px",
        backdropFilter: "blur(12px) contrast(1.2) saturate(1.2)",
        WebkitBackdropFilter: "blur(12px) contrast(1.2) saturate(1.2)",
        backgroundColor: "rgba(255,255,255,0.06)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 24px rgba(0,0,0,0.10)",
        pointerEvents: "none",
        zIndex: 1
      }}
    />
  );
}