import type { ComponentType, CSSProperties } from "react";

/** Compatible with SVG icon components, including Lucide icons. */
export type IconComponent = ComponentType<{
  color?: string;
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}>;

export interface ColorProps {
  bgColor?: string;
  fgColor?: string;
}

export type ComponentStyle = CSSProperties & {
  [property: `--ziqx-${string}`]: string | number | undefined;
};
