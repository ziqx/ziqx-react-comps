"use client";

import * as Primitive from "@radix-ui/react-select";
import {
  forwardRef,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Field, useField, type FieldProps } from "../shared/field.js";
import { ControlIcon } from "../shared/icons.js";
import {
  useValue,
  useFormReset,
  focusInvalidControl,
} from "../shared/use-value.js";
import type { ComponentStyle } from "../shared/component-types.js";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  labelClassName?: string;
}

type RootProps = ComponentPropsWithoutRef<typeof Primitive.Root>;
type TriggerProps = ComponentPropsWithoutRef<typeof Primitive.Trigger>;
type ContentProps = ComponentPropsWithoutRef<typeof Primitive.Content>;

export interface SelectProps extends Omit<RootProps, "children">, FieldProps {
  options: readonly SelectOption[];
  placeholder?: string;
  className?: string;
  style?: ComponentStyle;
  compact?: boolean;
  triggerProps?: Omit<
    TriggerProps,
    | "children"
    | "asChild"
    | "id"
    | "disabled"
    | "name"
    | "value"
    | "defaultValue"
    | "style"
    | "className"
  >;
  contentProps?: Omit<
    ContentProps,
    "children" | "asChild" | "forceMount" | "position"
  >;
  portalContainer?: ComponentPropsWithoutRef<
    typeof Primitive.Portal
  >["container"];
}

/** Single-select with typeahead, native form values, and a portalled option list. */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      options,
      value,
      defaultValue = "",
      onValueChange,
      placeholder = "Select an option",
      bgColor = "#ffffff",
      fgColor = "#11110f",
      id,
      label,
      description,
      error,
      ariaLabel,
      containerClassName,
      className = "",
      style,
      compact = false,
      triggerProps = {},
      contentProps = {},
      name,
      form,
      required,
      disabled,
      autoComplete,
      portalContainer,
      open,
      defaultOpen = false,
      onOpenChange,
      ...rootProps
    },
    ref,
  ) {
    const state = useValue(value, defaultValue, onValueChange);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const setOpen = (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    };
    const nativeRef = useRef<HTMLSelectElement>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    useFormReset(nativeRef, state.reset, form);
    const field = useField(
      id,
      description,
      error,
      triggerProps["aria-describedby"],
    );
    // Encode every option, so empty strings and user values can never collide.
    const encode = (item: string) => `ziqx:${item}`;
    const selectedOption = options.find(
      (option) => option.value === state.current,
    );
    const colors = {
      "--ziqx-bg": bgColor,
      "--ziqx-fg": fgColor,
    } as ComponentStyle;
    const {
      className: contentClassName = "",
      style: contentStyle,
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
          {...rootProps}
          disabled={disabled}
          open={!disabled && (open ?? internalOpen)}
          onOpenChange={setOpen}
          value={selectedOption ? encode(state.current) : ""}
          onValueChange={(next) => {
            if (!disabled) state.change(next.slice(5));
          }}
        >
          <Primitive.Trigger
            {...triggerProps}
            id={field.id}
            ref={(node) => {
              triggerRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            className={`ziqx-select-trigger ziqx-control-trigger ${className}`.trim()}
            style={{ ...colors, ...style }}
            data-compact={compact || undefined}
            aria-label={triggerProps["aria-label"] ?? ariaLabel}
            aria-describedby={field.describedBy}
            aria-invalid={field.hasError || triggerProps["aria-invalid"]}
            aria-required={required || undefined}
            title={triggerProps.title ?? selectedOption?.label}
          >
            <Primitive.Value placeholder={placeholder}>
              {selectedOption && (
                <span
                  className={`ziqx-select-label ${selectedOption.labelClassName ?? ""}`.trim()}
                >
                  {selectedOption.icon && (
                    <span
                      className="ziqx-select-option-icon"
                      aria-hidden="true"
                    >
                      {selectedOption.icon}
                    </span>
                  )}
                  <span>{selectedOption.label}</span>
                </span>
              )}
            </Primitive.Value>
            <Primitive.Icon className="ziqx-control-icon">
              <ControlIcon kind="chevron" />
            </Primitive.Icon>
          </Primitive.Trigger>
          <Primitive.Portal container={portalContainer}>
            <Primitive.Content
              align="start"
              sideOffset={6}
              collisionPadding={12}
              {...panelProps}
              position="popper"
              className={`ziqx-select-content ziqx-floating ${contentClassName}`.trim()}
              style={{ ...colors, ...contentStyle }}
            >
              <Primitive.ScrollUpButton
                className="ziqx-select-scroll"
                aria-label="Scroll up"
              >
                <ControlIcon
                  kind="chevron"
                  style={{ transform: "rotate(180deg)" }}
                />
              </Primitive.ScrollUpButton>
              <Primitive.Viewport className="ziqx-select-viewport">
                {options.map((option) => (
                  <Primitive.Item
                    key={option.value}
                    value={encode(option.value)}
                    disabled={option.disabled}
                    textValue={option.label}
                    className="ziqx-select-item"
                  >
                    {option.icon && (
                      <span
                        className="ziqx-select-option-icon"
                        aria-hidden="true"
                      >
                        {option.icon}
                      </span>
                    )}
                    <Primitive.ItemText className={option.labelClassName}>
                      {option.label}
                    </Primitive.ItemText>
                    <Primitive.ItemIndicator className="ziqx-select-check">
                      <ControlIcon kind="check" />
                    </Primitive.ItemIndicator>
                  </Primitive.Item>
                ))}
              </Primitive.Viewport>
              <Primitive.ScrollDownButton
                className="ziqx-select-scroll"
                aria-label="Scroll down"
              >
                <ControlIcon kind="chevron" />
              </Primitive.ScrollDownButton>
            </Primitive.Content>
          </Primitive.Portal>
        </Primitive.Root>
        <select
          ref={nativeRef}
          className="ziqx-native-control"
          aria-hidden="true"
          tabIndex={-1}
          name={name}
          form={form}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          value={state.current}
          onChange={(event) => state.change(event.target.value)}
          onInvalid={(event) => {
            event.preventDefault();
            focusInvalidControl(nativeRef.current, triggerRef.current);
          }}
        >
          {!options.some((option) => option.value === "") && (
            <option value="" />
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </Field>
    );
  },
);

export const CleanSelect = Select;
export type CleanSelectProps = SelectProps;
export type CleanSelectOption = SelectOption;
