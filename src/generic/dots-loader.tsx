"use client";

import type { LoaderProps } from "../shared/types.js";

export type DotsLoaderProps = LoaderProps;

/** A neutral, indeterminate three-dot loader for buttons and compact surfaces. */
export function DotsLoader({
  label = "Loading…",
  size = "md",
  tone = "default",
  showLabel = false,
  className = "",
  style,
}: DotsLoaderProps) {
  return (
    <span
      className={`ziqx-dots-loader ${className}`.trim()}
      data-size={size}
      data-tone={tone}
      role="status"
      aria-label={label}
      style={style}
    >
      <span className="ziqx-dots-loader-mark" aria-hidden="true" />
      {showLabel && (
        <span className="ziqx-dots-loader-label" aria-hidden="true">
          {label}
        </span>
      )}
    </span>
  );
}
