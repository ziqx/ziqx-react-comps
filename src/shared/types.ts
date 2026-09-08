import type { CSSProperties } from "react";

export type LoaderSize = "sm" | "md" | "lg";
export type LoaderTone = "default" | "inverse";
export type LoaderStyle = CSSProperties & {
  [property: `--ziqx-loader-${string}`]: string | number | undefined;
};

export interface LoaderProps {
  /** Accessible announcement, even when the visible label is hidden. */
  label?: string;
  size?: LoaderSize;
  tone?: LoaderTone;
  showLabel?: boolean;
  className?: string;
  style?: LoaderStyle;
}
