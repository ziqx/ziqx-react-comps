"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import type {
  ColorProps,
  ComponentStyle,
  IconComponent,
} from "../shared/component-types.js";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix">, ColorProps {
  label?: ReactNode;
  description?: ReactNode;
  /** Shows an error message and marks the native input invalid. */
  error?: ReactNode;
  prefix?: IconComponent;
  suffix?: IconComponent;
  containerClassName?: string;
  style?: ComponentStyle;
}

/** Native input: no mirrored value, effects, or extra state while typing. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    bgColor = "#ffffff",
    fgColor = "#11110f",
    label,
    description,
    error,
    prefix: Prefix,
    suffix: Suffix,
    id,
    className = "",
    containerClassName = "",
    style,
    disabled,
    type = "text",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? `ziqx-input-${generatedId}`;
  const hasError =
    error !== undefined && error !== null && error !== false && error !== "";
  const hasDescription =
    description !== undefined && description !== null && description !== false;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
  const describedBy =
    [
      props["aria-describedby"],
      hasDescription && descriptionId,
      hasError && errorId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  const invalid = hasError || props["aria-invalid"];
  return (
    <div
      className={`ziqx-input-field ${containerClassName}`.trim()}
      style={{ "--ziqx-bg": bgColor, "--ziqx-fg": fgColor } as ComponentStyle}
    >
      {label != null && (
        <label className="ziqx-input-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="ziqx-input-control" data-disabled={disabled || undefined}>
        {Prefix && (
          <span className="ziqx-input-prefix" aria-hidden="true">
            <Prefix
              color={fgColor}
              size={18}
              className="ziqx-component-icon"
              aria-hidden={true}
            />
          </span>
        )}
        <input
          {...props}
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={`ziqx-input ${className}`.trim()}
          data-prefix={!!Prefix || undefined}
          data-suffix={!!Suffix || undefined}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          style={style}
        />
        {Suffix && (
          <span className="ziqx-input-suffix" aria-hidden="true">
            <Suffix
              color={fgColor}
              size={18}
              className="ziqx-component-icon"
              aria-hidden={true}
            />
          </span>
        )}
      </div>
      {hasDescription && (
        <span className="ziqx-input-description" id={descriptionId}>
          {description}
        </span>
      )}
      {hasError && (
        <span className="ziqx-input-error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
});
