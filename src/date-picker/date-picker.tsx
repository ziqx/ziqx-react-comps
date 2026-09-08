"use client";

import * as Primitive from "@radix-ui/react-popover";
import {
  forwardRef,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
} from "react";
import {
  DayPicker,
  dateMatchModifiers,
  type PropsBase,
  type Matcher,
} from "react-day-picker";
import { Field, useField, type FieldProps } from "../shared/field.js";
import { ControlIcon } from "../shared/icons.js";
import {
  useValue,
  useFormReset,
  focusInvalidControl,
} from "../shared/use-value.js";
import type { ComponentStyle } from "../shared/component-types.js";
import { fromDateValue, toDateValue } from "./date-value.js";

type ContentProps = ComponentPropsWithoutRef<typeof Primitive.Content>;
export type DatePickerCalendarProps = Omit<
  PropsBase,
  | "mode"
  | "required"
  | "disabled"
  | "locale"
  | "timeZone"
  | "dateLib"
  | "autoFocus"
>;

export interface DatePickerProps extends FieldProps {
  /** Local date-only value in YYYY-MM-DD format, or an empty string. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  compact?: boolean;
  className?: string;
  style?: ComponentStyle;
  minDate?: string;
  maxDate?: string;
  disabledDates?: Matcher | Matcher[];
  locale?: PropsBase["locale"];
  formatDate?: (date: Date) => string;
  showClear?: boolean;
  showToday?: boolean;
  clearLabel?: string;
  todayLabel?: string;
  calendarLabel?: string;
  requiredLabel?: string;
  calendarProps?: DatePickerCalendarProps;
  triggerProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | "children"
    | "id"
    | "disabled"
    | "name"
    | "value"
    | "defaultValue"
    | "style"
    | "className"
  >;
  contentProps?: Omit<ContentProps, "children" | "asChild" | "forceMount">;
  portalContainer?: ComponentPropsWithoutRef<
    typeof Primitive.Portal
  >["container"];
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(
    {
      value,
      defaultValue = "",
      onValueChange,
      open,
      defaultOpen = false,
      onOpenChange,
      bgColor = "#ffffff",
      fgColor = "#11110f",
      id,
      label,
      description,
      error,
      ariaLabel,
      containerClassName,
      name,
      form,
      required = false,
      disabled = false,
      placeholder = "Select a date",
      compact = false,
      className = "",
      style,
      minDate,
      maxDate,
      disabledDates,
      locale,
      formatDate,
      showClear = true,
      showToday = true,
      clearLabel = "Clear",
      todayLabel = "Today",
      calendarLabel = "Choose date",
      requiredLabel = "Required",
      calendarProps = {},
      triggerProps = {},
      contentProps = {},
      portalContainer,
    },
    ref,
  ) {
    const state = useValue(value, defaultValue, onValueChange);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const setOpen = (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    };
    const nativeRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    useFormReset(nativeRef, state.reset, form);
    const field = useField(
      id,
      description,
      error,
      triggerProps["aria-describedby"],
    );
    const selected = fromDateValue(state.current);
    const minimum = fromDateValue(minDate ?? "");
    const maximum = fromDateValue(maxDate ?? "");
    const matchers: Matcher[] = [
      ...(Array.isArray(disabledDates)
        ? disabledDates
        : disabledDates
          ? [disabledDates]
          : []),
      ...(minimum ? [{ before: minimum }] : []),
      ...(maximum ? [{ after: maximum }] : []),
    ];
    const unavailable = (date: Date) =>
      disabled ||
      dateMatchModifiers(date, matchers) ||
      dateMatchModifiers(date, calendarProps.hidden ?? []);
    const select = (date: Date | undefined) => {
      if (!date || unavailable(date)) return;
      state.change(toDateValue(date));
      setOpen(false);
    };
    const today = calendarProps.today ?? new Date();
    const formatted = selected
      ? (formatDate?.(selected) ??
        new Intl.DateTimeFormat(locale?.code ?? "en-US", {
          month: "short",
          day: "numeric",
          ...(compact ? {} : { year: "numeric" as const }),
        }).format(selected))
      : placeholder;
    const initialMonth =
      selected ??
      (minimum && today < minimum
        ? minimum
        : maximum && today > maximum
          ? maximum
          : today);
    const colors = {
      "--ziqx-bg": bgColor,
      "--ziqx-fg": fgColor,
    } as ComponentStyle;
    const {
      className: panelClass = "",
      style: panelStyle,
      ...panelProps
    } = contentProps;
    return (
      <Field
        field={field}
        label={label}
        description={description}
        error={error}
        bgColor={bgColor}
        fgColor={fgColor}
        containerClassName={containerClassName}
      >
        <Primitive.Root
          open={!disabled && (open ?? internalOpen)}
          onOpenChange={setOpen}
        >
          <Primitive.Trigger asChild>
            <button
              {...triggerProps}
              type="button"
              disabled={disabled}
              id={field.id}
              ref={(node) => {
                triggerRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
              }}
              className={`ziqx-date-trigger ziqx-control-trigger ${className}`.trim()}
              style={{ ...colors, ...style }}
              data-empty={!selected || undefined}
              data-compact={compact || undefined}
              aria-label={triggerProps["aria-label"] ?? ariaLabel}
              aria-describedby={
                [field.describedBy, required && `${field.id}-required`]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              aria-invalid={field.hasError || triggerProps["aria-invalid"]}
              title={triggerProps.title ?? formatted}
            >
              <span>{formatted}</span>
              <ControlIcon kind="calendar" className="ziqx-control-icon" />
            </button>
          </Primitive.Trigger>
          <Primitive.Portal container={portalContainer}>
            <Primitive.Content
              align="start"
              sideOffset={6}
              collisionPadding={12}
              {...panelProps}
              aria-label={panelProps["aria-label"] ?? calendarLabel}
              className={`ziqx-date-content ziqx-floating ${panelClass}`.trim()}
              style={{ ...colors, ...panelStyle }}
            >
              <DayPicker
                defaultMonth={initialMonth}
                startMonth={minimum}
                endMonth={maximum}
                showOutsideDays
                fixedWeeks
                navLayout="after"
                {...calendarProps}
                mode="single"
                required={false}
                selected={selected}
                onSelect={select}
                disabled={matchers}
                locale={locale}
                autoFocus
              />
              {(showClear || showToday) && (
                <div className="ziqx-date-actions">
                  {showClear && (
                    <button
                      type="button"
                      disabled={required || !state.current}
                      onClick={() => {
                        state.change("");
                        setOpen(false);
                      }}
                    >
                      {clearLabel}
                    </button>
                  )}
                  {showToday && (
                    <button
                      type="button"
                      disabled={unavailable(today)}
                      onClick={() => select(today)}
                    >
                      {todayLabel}
                    </button>
                  )}
                </div>
              )}
            </Primitive.Content>
          </Primitive.Portal>
        </Primitive.Root>
        {required && (
          <span id={`${field.id}-required`} className="ziqx-native-control">
            {requiredLabel}
          </span>
        )}
        <input
          ref={nativeRef}
          className="ziqx-native-control"
          type="date"
          aria-hidden="true"
          tabIndex={-1}
          name={name}
          form={form}
          required={required}
          disabled={disabled}
          min={minDate}
          max={maxDate}
          value={selected ? state.current : ""}
          onChange={(event) => {
            const next = fromDateValue(event.target.value);
            if (next) select(next);
            else if (!required) state.change("");
          }}
          onInvalid={(event) => {
            event.preventDefault();
            focusInvalidControl(nativeRef.current, triggerRef.current);
          }}
        />
      </Field>
    );
  },
);
