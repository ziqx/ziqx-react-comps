"use client";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
} from "react";
import type { ColorProps, ComponentStyle } from "../shared/component-types.js";

type GlossyContainerOwnProps = ColorProps & {
  /** CSS length or padding shorthand; numbers are pixels. */
  padding?: CSSProperties["padding"];
  /** CSS length; numbers are pixels. */
  radius?: CSSProperties["borderRadius"];
  /** Visual hover/pressed feedback. Defaults on for native links and buttons. */
  interactive?: boolean;
  className?: string;
  style?: ComponentStyle;
};

export type GlossyContainerProps<E extends ElementType = "div"> =
  GlossyContainerOwnProps & {
    as?: E;
  } & Omit<ComponentPropsWithoutRef<E>, keyof GlossyContainerOwnProps | "as">;

type GlossyContainerComponent = <E extends ElementType = "div">(
  props: GlossyContainerProps<E> & { ref?: ComponentPropsWithRef<E>["ref"] },
) => ReactElement | null;

/** A surface primitive: the chosen element owns semantics, layout and interaction. */
export const GlossyContainer = forwardRef<
  HTMLElement,
  GlossyContainerProps<ElementType>
>(function GlossyContainer(
  {
    as: Component = "div",
    bgColor = "#101010",
    fgColor = "#ffffff",
    padding = 16,
    radius = 12,
    interactive = Component === "button" || Component === "a",
    className = "",
    style,
    ...props
  },
  ref,
) {
  return (
    <Component
      {...(Component === "button" ? { type: "button" } : {})}
      {...props}
      ref={ref}
      className={`ziqx-glossy-container ${className}`.trim()}
      data-interactive={interactive || undefined}
      style={
        {
          "--ziqx-glossy-bg": bgColor,
          "--ziqx-glossy-fg": fgColor,
          "--ziqx-glossy-padding":
            typeof padding === "number" ? `${padding}px` : padding,
          "--ziqx-glossy-radius":
            typeof radius === "number" ? `${radius}px` : radius,
          ...style,
        } as ComponentStyle
      }
    />
  );
}) as GlossyContainerComponent;
