# @ziqx/react-comps

Shared, TSX-first React components for Ziqx products. Includes `Button`, `Input`, `Select` (also exported as `CleanSelect`), `DatePicker`, `Popover`, `DotsLoader`, `BeatLoader`, and `ZiqxLoader`. React and React DOM are peer dependencies. Selects and popovers use Radix; the calendar uses React DayPicker. No Tailwind, Next.js, icon library, or animation runtime is required.

## Use

Install the package in your React project:

```sh
npm install @ziqx/react-comps
```

Import the stylesheet once in your app entry or root layout:

```tsx
import "@ziqx/react-comps/styles.css";
import { Button, Input, BeatLoader } from "@ziqx/react-comps";
import { ArrowRight, Plus, Mail } from "lucide-react";

export function TaskForm({ saving }: { saving: boolean }) {
  return (
    <form>
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        prefix={Mail}
        required
      />
      <Button
        type="submit"
        bgColor="#07815d"
        fgColor="#ffffff"
        prefix={Plus}
        suffix={ArrowRight}
        loading={saving}
        loadingLabel="Creating task…"
      >
        Create task
      </Button>
      <BeatLoader label="Syncing…" />
    </form>
  );
}
```

Lucide is optional and belongs to the consuming app. Pass an icon **component** (`prefix={Plus}`), not an element (`prefix={<Plus />}`). Icons receive `color={fgColor}`, `size={18}`, a class name, and `aria-hidden`. Their rendered root should forward those props and use `currentColor`, so disabled colors follow the surrounding component. Prefix and suffix icons are decorative; give icon-only buttons an `aria-label`.

## Button

![Button colors, variants, icons, disabled states, and loading indicators](https://cdn.jsdelivr.net/npm/@ziqx/react-comps@0.1.0/assets/buttons.png)

- `bgColor`, `fgColor`: any valid CSS color, including `var(--brand)`. Defaults: `#101010` / `#ffffff`.
- `variant`: `primary` (raised Tasks finish), `secondary` (softened fill), `outline`, or `ghost`. Defaults to `primary`.
- `size`: `default`, `compact`, or `icon`.
- `prefix`, `suffix`: icon components.
- `loading`, `loadingLabel`: controlled loading state; shows DotsLoader, disables activation, announces the loading label, and preserves the original content's dimensions. Set `loading` for the duration of your request; there are no automatic timers. Loading retains the active colors.
- `disabled`: derives muted background, foreground, and border colors from your colors. `aria-disabled` also blocks click activation while allowing keyboard focus.
- `full`: fills the available width.
- Native button props, event handlers, `className`, `style`, and a forwarded button `ref` are supported. `type` defaults to `button`; use `submit` explicitly for forms.

Hover, pressed, border, focus, and disabled states are derived in CSS using `color-mix()`. No color parsing, palette object, or per-render JavaScript color calculation is needed. `fgColor` stays the text/icon color in every variant. For an outlined green button on a light surface, use `variant="outline" bgColor="#ffffff" fgColor="#07815d"`. Choose legible foreground/background pairs; the package does not automatically calculate contrast.

## Input

![Inputs with a focus ring, validation error, disabled state, and read-only state](https://cdn.jsdelivr.net/npm/@ziqx/react-comps@0.1.0/assets/input.png)

The Tasks input geometry: 43px height, 10px corners, 12px horizontal padding, and a 200ms border/inset-ring transition. The focus ring grows inward without shifting text or changing the layout.

- `bgColor`, `fgColor`: defaults `#ffffff` / `#11110f`; focus uses `fgColor` and neutral states derive from the pair.
- `label`, `description`, `error`: optional accessible field content. IDs connect the label and descriptions to the native input; errors set `aria-invalid` and a red border/ring.
- `prefix`, `suffix`: decorative icon components, with automatic padding.
- All native input props, including `value`, `defaultValue`, `onChange`, `name`, `required`, `readOnly`, `disabled`, and a forwarded input `ref`.
- `className` and `style` target the native input; `containerClassName` targets the field wrapper. Without `label`, supply `aria-label` or an external label.

The component does not mirror values into state and works with controlled inputs, uncontrolled inputs, native forms, and ref-based form libraries. Intended for text-like input types, including email, password, search, number, and URL; checkbox, radio, range, file controls, and date-picker UI are outside this release.

## Select / CleanSelect

A single-select dropdown with the Tasks styling, keyboard navigation and typeahead, option icons, disabled options, scrolling, and an automatically positioned panel. `CleanSelect` is an alias of `Select`.

```tsx
import { Select } from "@ziqx/react-comps";

<Select
  label="Assignee"
  name="assignee"
  defaultValue=""
  bgColor="#ffffff"
  fgColor="#11110f"
  options={[
    { value: "", label: "Unassigned" },
    { value: "alice", label: "Alice" },
    { value: "bob", label: "Bob", disabled: true },
  ]}
/>;
```

- `options`: an array of `{ value, label, disabled?, icon?, labelClassName? }`. Values must be unique strings. Empty strings are supported; `icon` accepts a React element.
- Use `value` + `onValueChange` for controlled selection, or `defaultValue` for internal state. The selected value should match an option; `""` also represents no selection when there is no empty option.
- `placeholder`, `disabled`, `compact`, `bgColor`, and `fgColor` customize the trigger and panel. The selected label is visible during server rendering.
- `label`, `description`, `error`, `id`, and `ariaLabel` connect accessible field content. Without `label`, provide `ariaLabel` or use `triggerProps["aria-labelledby"]`.
- `name`, `form`, `required`, and `autoComplete` support native forms. Submitted values are the original option strings, including empty strings. Native form reset restores `defaultValue` for uncontrolled selects. Required selects treat an empty value as invalid and focus the trigger.
- `open`, `defaultOpen`, and `onOpenChange` control the panel. `dir="rtl"` supports right-to-left layouts.
- `className`, `style`, `triggerProps`, and the forwarded `ref` target the trigger. `containerClassName` targets the field. `contentProps` configures the panel's classes, styles, positioning, and dismissal callbacks; `portalContainer` customizes its portal destination.

## DatePicker

A single-date calendar with the Tasks appearance, Today/Clear actions, keyboard navigation, locale support, and smooth opening/closing. Values use local `YYYY-MM-DD` strings; clearing emits `""`. Dates do not pass through UTC conversion.

```tsx
import { DatePicker } from "@ziqx/react-comps";

<DatePicker
  label="Due date"
  name="dueDate"
  defaultValue="2026-09-08"
  minDate="2026-09-01"
  maxDate="2026-12-31"
  disabledDates={{ dayOfWeek: [0, 6] }}
  description="Choose a weekday."
/>;
```

- `value` + `onValueChange`, or `defaultValue`, work like the select. The forwarded `ref` targets the trigger button. Invalid or rolled-over date strings display the placeholder.
- `minDate` and `maxDate` are inclusive `YYYY-MM-DD` limits. `disabledDates` accepts React DayPicker matchers (dates, date arrays, weekdays, intervals, or predicates). Calendar selections and the Today action respect these limits and hidden dates.
- `locale` accepts a React DayPicker locale, for example `import { fr } from "react-day-picker/locale"`. `formatDate` optionally customizes trigger text. `clearLabel`, `todayLabel`, `calendarLabel`, `requiredLabel`, and `placeholder` localize the surrounding UI.
- `calendarProps` exposes calendar presentation and navigation options, including `weekStartsOn`, `captionLayout`, `startMonth`, `endMonth`, `numberOfMonths`, `labels`, `formatters`, and `components`. Selection mode, selected value, disabled dates, and autofocus are managed by this component. This release supports single dates in the user's local timezone.
- `showClear` and `showToday` default to `true`. `required` disables Clear and enables native required validation. `name`, `form`, and native reset are supported; `minDate` and `maxDate` are also applied to the native date control. Applications should validate dates again when processing submissions.
- `label`, `description`, `error`, `id`, `ariaLabel`, `bgColor`, `fgColor`, `compact`, `disabled`, `open`, `defaultOpen`, and `onOpenChange` work as on `Select`.
- `className`, `style`, and `triggerProps` customize the trigger; `containerClassName` styles the field. `contentProps` customizes the panel and `portalContainer` sets its portal destination. Calendar CSS is bundled and scoped to this component.

## Popover

A general floating panel for filters, forms, and custom content. It supports controlled or uncontrolled opening, collision-aware positioning, Escape/outside dismissal, focus restoration, and nested controls.

```tsx
import { Button, Input, Popover, PopoverClose } from "@ziqx/react-comps";

<Popover
  trigger={<Button>Filters</Button>}
  ariaLabel="Task filters"
  align="start"
>
  <Input label="Search tasks" />
  <PopoverClose asChild>
    <Button>Done</Button>
  </PopoverClose>
</Popover>;
```

- `trigger` must be one React element that forwards DOM props and a ref (the package `Button` does this). Give the trigger an accessible name.
- Use `open` + `onOpenChange` for controlled behavior, or `defaultOpen` for internal state. `modal` defaults to `false`.
- `ariaLabel` names the dialog. `PopoverClose` closes the nearest popover; use `asChild` to compose a custom button.
- `side`, `align`, `sideOffset`, `collisionPadding`, and other Radix content props customize placement and dismissal. Defaults: `align="end"`, `sideOffset={8}`, `collisionPadding={16}`.
- `bgColor` and `fgColor` color the panel. `className`, `style`, and the forwarded `ref` target the panel. Set `style={{ "--ziqx-popover-width": "360px" }}` for a custom width; it remains constrained to the viewport. `portalContainer` changes the portal destination.

## Loaders

![DotsLoader, BeatLoader, and the branded ZiqxLoader](https://cdn.jsdelivr.net/npm/@ziqx/react-comps@0.1.0/assets/loaders.png)

```tsx
import { DotsLoader, BeatLoader, ZiqxLoader } from "@ziqx/react-comps/loaders";

<DotsLoader size="sm" label="Saving…" />;
<BeatLoader
  showLabel
  label="Syncing…"
  style={{ color: "#07815d", "--ziqx-loader-cycle": "1200ms" }}
/>;
<ZiqxLoader label="Loading workspace…" />;
```

All three support `size="sm" | "md" | "lg"`, `tone="default" | "inverse"`, `label`, `showLabel`, `className`, and `style`. Colors inherit by default. CSS variables `--ziqx-loader-color`, `--ziqx-loader-width`, and `--ziqx-loader-cycle` customize appearance and timing. `ZiqxLoader` shows its label by default; the dot loaders do not. Standalone loaders expose `role="status"`; button loaders are hidden from assistive technology because the button supplies the progress name.

## Styles and compatibility

![Buttons and an input styled for a dark surface](https://cdn.jsdelivr.net/npm/@ziqx/react-comps@0.1.0/assets/dark-surface.png)

Every component has scoped `ziqx-*` styles, reduced-motion handling, and forced-colors support. React 18.2+ and React 19 are supported. Use a modern browser with CSS `color-mix()` support. Fonts inherit from your product.

For smaller CSS imports, use component entry points:

```tsx
import { Button } from "@ziqx/react-comps/button";
import "@ziqx/react-comps/button/styles.css"; // includes button DotsLoader CSS
import { Input } from "@ziqx/react-comps/input";
import "@ziqx/react-comps/input/styles.css";
import "@ziqx/react-comps/loaders/styles.css"; // all standalone loaders
import { Select } from "@ziqx/react-comps/select";
import "@ziqx/react-comps/select/styles.css";
import { DatePicker } from "@ziqx/react-comps/date-picker";
import "@ziqx/react-comps/date-picker/styles.css";
import { Popover } from "@ziqx/react-comps/popover";
import "@ziqx/react-comps/popover/styles.css";
```

Prefer either the combined stylesheet or the required component styles. Source `.tsx` files and generated ESM/declaration files are shipped. Client directives are preserved for Next.js. CommonJS `require()` is not a supported entry point.

## Development

```sh
npm install
npm run check
npm pack --dry-run
```

`check` runs strict source types, build, component rendering tests, consumer types (including CSS imports), and formatting. `npm pack` rebuilds the ESM and declaration output. Component folders and subpath exports can be extended for additional shared controls. Upstream calendar CSS licensing is preserved in `THIRD_PARTY_NOTICES.md`.
