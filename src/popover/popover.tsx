"use client";

import * as Primitive from "@radix-ui/react-popover";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from "react";
import type { ColorProps, ComponentStyle } from "../shared/component-types.js";

type ContentProps = ComponentPropsWithoutRef<typeof Primitive.Content>;
type RootProps = ComponentPropsWithoutRef<typeof Primitive.Root>;

export interface PopoverProps
  extends Omit<ContentProps, "asChild" | "style" | "forceMount">, ColorProps {
  trigger: ReactElement;
  open?: RootProps["open"];
  defaultOpen?: RootProps["defaultOpen"];
  onOpenChange?: RootProps["onOpenChange"];
  modal?: boolean;
  ariaLabel?: string;
  portalContainer?: ComponentPropsWithoutRef<
    typeof Primitive.Portal
  >["container"];
  style?: ComponentStyle;
}

/** Positioned, keyboard-accessible content. Ref and className target the panel. */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      trigger,
      children,
      open,
      defaultOpen,
      onOpenChange,
      modal = false,
      bgColor = "#ffffff",
      fgColor = "#11110f",
      ariaLabel,
      portalContainer,
      className = "",
      style,
      sideOffset = 8,
      collisionPadding = 16,
      align = "end",
      ...props
    },
    ref,
  ) {
    return (
      <Primitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={modal}
      >
        <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
        <Primitive.Portal container={portalContainer}>
          <Primitive.Content
            {...props}
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            aria-label={props["aria-label"] ?? ariaLabel}
            className={`ziqx-popover ziqx-floating ${className}`.trim()}
            style={
              {
                "--ziqx-bg": bgColor,
                "--ziqx-fg": fgColor,
                ...style,
              } as ComponentStyle
            }
          >
            {children}
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
    );
  },
);

/** Use asChild to make a Button (or any native button) close its parent Popover. */
export const PopoverClose = Primitive.Close;
export type PopoverCloseProps = ComponentPropsWithoutRef<
  typeof Primitive.Close
>;
