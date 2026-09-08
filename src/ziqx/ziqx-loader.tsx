"use client";

import type { LoaderProps } from "../shared/types.js";
import { ZiqxLoaderMark } from "./ziqx-loader-mark.js";

export type ZiqxLoaderProps = LoaderProps;

/** Indeterminate loading: hollow square → outline → rising fill → reset. */
export function ZiqxLoader({
  label = "Loading…",
  size = "md",
  tone = "default",
  showLabel = true,
  className = "",
  style,
}: ZiqxLoaderProps) {
  return (
    <span
      className={`ziqx-loader ${className}`.trim()}
      data-size={size}
      data-tone={tone}
      role="status"
      aria-label={label}
      style={style}
    >
      <ZiqxLoaderMark />
      {showLabel && (
        <span className="ziqx-loader-label" aria-hidden="true">
          {label}
        </span>
      )}
    </span>
  );
}
