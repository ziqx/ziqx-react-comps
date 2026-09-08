"use client";

import type { LoaderProps } from "../shared/types.js";

export type BeatLoaderProps = LoaderProps;

/** Three staggered dots that pulse in place. */
export function BeatLoader({
  label = "Loading…",
  size = "md",
  tone = "default",
  showLabel = false,
  className = "",
  style,
}: BeatLoaderProps) {
  return (
    <span
      className={`ziqx-beat-loader ${className}`.trim()}
      data-size={size}
      data-tone={tone}
      role="status"
      aria-label={label}
      style={style}
    >
      <span className="ziqx-beat-loader-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {showLabel && <span aria-hidden="true">{label}</span>}
    </span>
  );
}
