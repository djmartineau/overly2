

"use client";
import { ReactNode } from "react";

/**
 * Section
 * -------
 * A simple container that gives every page block consistent
 * vertical rhythm and a centered max-width. Also sets
 * scroll-margin so in-page anchors (e.g. #work) land nicely
 * below the sticky header.
 */
export default function Section({
  id,
  className = "",
  innerClassName = "",
  children,
}: {
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`py-20 md:py-28 ${className}`}
      style={{ scrollMarginTop: "96px" }}
    >
      <div className={`mx-auto max-w-6xl px-6 ${innerClassName}`}>{children}</div>
    </section>
  );
}