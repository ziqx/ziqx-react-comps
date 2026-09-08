import { createRef, type SVGProps } from "react";
import {
  Button,
  Input,
  BeatLoader,
  DotsLoader,
  ZiqxLoader,
  type IconComponent,
} from "@ziqx/react-comps";
import { Button as DirectButton } from "@ziqx/react-comps/button";
import "@ziqx/react-comps/styles.css";
import "@ziqx/react-comps/button/styles.css";
import "@ziqx/react-comps/input/styles.css";
import "@ziqx/react-comps/loaders/styles.css";

const Icon = (props: SVGProps<SVGSVGElement>) => <svg {...props} />;
const icon: IconComponent = Icon;
const buttonRef = createRef<HTMLButtonElement>();
const inputRef = createRef<HTMLInputElement>();
export const consumer = (
  <>
    <Button
      ref={buttonRef}
      prefix={icon}
      suffix={Icon}
      bgColor="var(--brand)"
      fgColor="white"
      loading
      loadingLabel="Saving…"
      onClick={(event) => event.currentTarget.focus()}
    >
      Save
    </Button>
    <DirectButton
      variant="outline"
      size="compact"
      full
      style={{ "--ziqx-button-duration": "200ms" }}
    >
      Cancel
    </DirectButton>
    <Input
      ref={inputRef}
      label="Email"
      type="email"
      prefix={Icon}
      error="Required"
      defaultValue=""
      name="email"
      onChange={(event) => event.currentTarget.value}
    />
    <BeatLoader />
    <DotsLoader />
    <ZiqxLoader />
  </>
);
// @ts-expect-error icon slots accept components, not instantiated elements.
export const invalidIcon = <Button prefix={<Icon />} />;
// @ts-expect-error restrict variant names.
export const invalidVariant = <Button variant="danger" />;
