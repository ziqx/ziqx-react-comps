"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export function useValue(
  value: string | undefined,
  defaultValue: string,
  onValueChange?: (value: string) => void,
) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value === undefined ? internalValue : value;
  const change = (next: string) => {
    if (value === undefined) setInternalValue(next);
    if (next !== current) onValueChange?.(next);
  };
  const reset = useCallback(() => {
    if (value === undefined) setInternalValue(defaultValue);
  }, [value, defaultValue]);
  return { current, change, reset };
}

/** Let native form reset restore uncontrolled controls, after cancellation is known. */
export function useFormReset(
  ref: RefObject<HTMLInputElement | HTMLSelectElement | null>,
  reset: () => void,
  formId?: string,
) {
  useEffect(() => {
    const form = ref.current?.form;
    if (!form) return;
    const onReset = (event: Event) =>
      queueMicrotask(() => {
        if (!event.defaultPrevented) reset();
      });
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [ref, reset, formId]);
}

/** Native validation emits one invalid event per field; focus only the first. */
export function focusInvalidControl(
  native: HTMLInputElement | HTMLSelectElement | null,
  trigger: HTMLButtonElement | null,
) {
  if (
    !native?.form ||
    native.form.querySelector(
      "input:invalid, select:invalid, textarea:invalid",
    ) === native
  )
    trigger?.focus();
}
