"use client";

import { useId, type ReactNode } from "react";
import type { ColorProps, ComponentStyle } from "./component-types.js";

export interface FieldProps extends ColorProps {
  id?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  ariaLabel?: string;
  containerClassName?: string;
}

export function useField(
  id: string | undefined,
  description: ReactNode,
  error: ReactNode,
  externalDescription?: string,
) {
  const generatedId = useId();
  const fieldId = id ?? `ziqx-field-${generatedId}`;
  const hasError = error != null && error !== false && error !== "";
  const hasDescription =
    description != null && description !== false && description !== "";
  return {
    id: fieldId,
    hasError,
    descriptionId: hasDescription ? `${fieldId}-description` : undefined,
    errorId: hasError ? `${fieldId}-error` : undefined,
    describedBy:
      [
        externalDescription,
        hasDescription && `${fieldId}-description`,
        hasError && `${fieldId}-error`,
      ]
        .filter(Boolean)
        .join(" ") || undefined,
  };
}

export function Field({
  field,
  label,
  description,
  error,
  children,
  bgColor = "#ffffff",
  fgColor = "#11110f",
  containerClassName = "",
}: FieldProps & { field: ReturnType<typeof useField>; children: ReactNode }) {
  return (
    <div
      className={`ziqx-field ${containerClassName}`.trim()}
      style={{ "--ziqx-bg": bgColor, "--ziqx-fg": fgColor } as ComponentStyle}
    >
      {label != null && (
        <label className="ziqx-field-label" htmlFor={field.id}>
          {label}
        </label>
      )}
      {children}
      {field.descriptionId && (
        <span className="ziqx-field-description" id={field.descriptionId}>
          {description}
        </span>
      )}
      {field.errorId && (
        <span className="ziqx-field-error" id={field.errorId}>
          {error}
        </span>
      )}
    </div>
  );
}
