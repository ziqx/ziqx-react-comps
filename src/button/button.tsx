"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { DotsLoader } from "../generic/dots-loader.js";
import type {
  ColorProps,
  ComponentStyle,
  IconComponent,
} from "../shared/component-types.js";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "prefix">, ColorProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "compact" | "icon";
  full?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  prefix?: IconComponent;
  suffix?: IconComponent;
  style?: ComponentStyle;
}

/** Raised Tasks button with CSS-derived interaction colors and stable loading width. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      bgColor = "#101010",
      fgColor = "#ffffff",
      variant = "primary",
      size = "default",
      full = false,
      loading = false,
      loadingLabel = "Loading…",
      prefix: Prefix,
      suffix: Suffix,
      disabled = false,
      children,
      type = "button",
      className = "",
      style,
      onClick,
      ...props
    },
    ref,
  ) {
    const unavailable = disabled || loading;
    const ariaDisabled =
      props["aria-disabled"] === true || props["aria-disabled"] === "true";
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={`ziqx-button ${className}`.trim()}
        data-variant={variant}
        data-size={size}
        data-full={full || undefined}
        data-loading={loading || undefined}
        disabled={unavailable}
        aria-busy={loading || props["aria-busy"]}
        aria-label={loading ? loadingLabel : props["aria-label"]}
        style={
          {
            "--ziqx-bg": bgColor,
            "--ziqx-fg": fgColor,
            ...style,
          } as ComponentStyle
        }
        onClick={(event) => {
          if (unavailable || ariaDisabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
      >
        <span
          className="ziqx-button-content"
          aria-hidden={loading || undefined}
        >
          {Prefix && (
            <Prefix
              color={fgColor}
              size={18}
              className="ziqx-component-icon"
              aria-hidden={true}
            />
          )}
          {children}
          {Suffix && (
            <Suffix
              color={fgColor}
              size={18}
              className="ziqx-component-icon"
              aria-hidden={true}
            />
          )}
        </span>
        {loading && (
          <span className="ziqx-button-loader" aria-hidden="true">
            <DotsLoader
              size="sm"
              label={loadingLabel}
              style={{ color: "inherit" }}
            />
          </span>
        )}
      </button>
    );
  },
);
