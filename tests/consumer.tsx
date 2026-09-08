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

import {
  Select,
  CleanSelect,
  DatePicker,
  Popover,
  PopoverClose,
  type DatePickerCalendarProps,
} from "@ziqx/react-comps";
import { Select as SubpathSelect } from "@ziqx/react-comps/select";
import { DatePicker as SubpathDatePicker } from "@ziqx/react-comps/date-picker";
import { Popover as SubpathPopover } from "@ziqx/react-comps/popover";
import "@ziqx/react-comps/select/styles.css";
import "@ziqx/react-comps/date-picker/styles.css";
import "@ziqx/react-comps/popover/styles.css";

export const expandedConsumer = (
  <>
    <Select
      label="Owner"
      name="owner"
      ref={buttonRef}
      options={[
        { value: "", label: "Unassigned" },
        { value: "alice", label: "Alice", icon: <Icon /> },
      ]}
      onValueChange={(value) => value.toUpperCase()}
    />
    <CleanSelect
      options={[]}
      ariaLabel="Priority"
      defaultValue=""
      triggerProps={{ "aria-describedby": "help" }}
      contentProps={{ side: "top" }}
    />
    <SubpathSelect options={[]} required form="task" />
    <DatePicker
      label="Due date"
      ref={buttonRef}
      name="due"
      defaultValue="2026-09-08"
      minDate="2026-01-01"
      maxDate="2026-12-31"
      calendarProps={{ weekStartsOn: 1, captionLayout: "dropdown" }}
      disabledDates={{ dayOfWeek: [0, 6] }}
    />
    <SubpathDatePicker value="" onValueChange={(value) => value.length} />
    <Popover
      ref={createRef<HTMLDivElement>()}
      trigger={<Button>Filters</Button>}
      ariaLabel="Filters"
      side="bottom"
      onEscapeKeyDown={(event) => event.preventDefault()}
    >
      <PopoverClose asChild>
        <Button>Done</Button>
      </PopoverClose>
    </Popover>
    <SubpathPopover trigger={<button>Menu</button>} defaultOpen>
      Content
    </SubpathPopover>
  </>
);
export const unsupportedCalendarMode: DatePickerCalendarProps = {
  // @ts-expect-error Selection mode is owned by the DatePicker.
  mode: "range",
};

import { Checkbox } from "@ziqx/react-comps";
import { Checkbox as DirectCheckbox } from "@ziqx/react-comps/checkbox";
import "@ziqx/react-comps/checkbox/styles.css";
export const checkboxes = (
  <>
    <Checkbox
      ref={inputRef}
      label="Assigned to me"
      defaultChecked
      name="assigned"
      size={20}
      bgColor="#0B6E4F"
      onChange={(event) => event.currentTarget.checked}
    />
    <DirectCheckbox
      aria-label="Select all"
      checked={false}
      indeterminate
      onChange={() => {}}
      style={{ "--ziqx-checkbox-pulse-duration": "400ms" }}
    />
  </>
);
// @ts-expect-error Checkbox type is always checkbox.
export const invalidCheckboxType = <Checkbox type="radio" />;
