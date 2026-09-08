"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import type { ColorProps, ComponentStyle } from "../shared/component-types.js";

export interface CheckboxProps
  extends
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "type" | "size" | "style" | "children"
    >,
    ColorProps {
  label?: ReactNode;
  /** Mixed selection; update this alongside checked for select-all controls. */
  indeterminate?: boolean;
  /** Visual size in pixels. The native input covers the entire control. */
  size?: number;
  uncheckedColor?: string;
  /** className and style target the wrapper; the ref targets the native input. */
  style?: ComponentStyle;
  inputClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      indeterminate = false,
      size = 20,
      bgColor = "#1b1b1b",
      fgColor = "#ffffff",
      uncheckedColor = "#deddd9",
      className = "",
      inputClassName = "",
      style,
      id,
      checked,
      disabled,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? `ziqx-checkbox-${generatedId}`;
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!, []);
    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate, checked]);

    return (
      <span
        className={`ziqx-checkbox ${className}`.trim()}
        style={
          {
            "--ziqx-checkbox-size": `${size}px`,
            "--ziqx-checkbox-bg": bgColor,
            "--ziqx-checkbox-fg": fgColor,
            "--ziqx-checkbox-unchecked": uncheckedColor,
            ...style,
          } as ComponentStyle
        }
      >
        <span className="ziqx-checkbox-control">
          <input
            {...props}
            ref={inputRef}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className={`ziqx-checkbox-input ${inputClassName}`.trim()}
          />
          <span className="ziqx-checkbox-mark" aria-hidden="true" />
        </span>
        {label != null && <label htmlFor={inputId}>{label}</label>}
      </span>
    );
  },
);
