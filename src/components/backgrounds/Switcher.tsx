// src/components/backgrounds/Switcher.tsx
"use client";
import Ambient from "./Ambient";
import DotLens from "./DotLens";
import Parallax from "./Parallax";
// import Particles from "./Particles";

export type BgVariant = "ambient" | "dot" | "parallax" | "particles";

export default function BackgroundSwitcher({ variant }: { variant: BgVariant }) {
  if (variant === "dot") return <DotLens />;
  if (variant === "parallax") return <Parallax />;
  // if (variant === "particles") return <Particles />;
  return <Ambient />; // default
}