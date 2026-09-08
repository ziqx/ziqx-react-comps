import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import {
  Select,
  CleanSelect,
  DatePicker,
  Popover,
  PopoverClose,
  Button,
} from "@ziqx/react-comps";
import { Select as SubpathSelect } from "@ziqx/react-comps/select";
import { DatePicker as SubpathDate } from "@ziqx/react-comps/date-picker";
import { Popover as SubpathPopover } from "@ziqx/react-comps/popover";
import { fromDateValue, toDateValue } from "../dist/date-picker/date-value.js";

const options = [
  { value: "", label: "Unassigned" },
  { value: "__ziqx_empty_value__", label: "Literal sentinel" },
  { value: "alice", label: "Alice" },
];

test("all new entry points and select alias resolve", () => {
  assert.equal(Select, CleanSelect);
  assert.equal(Select, SubpathSelect);
  assert.equal(DatePicker, SubpathDate);
  assert.equal(Popover, SubpathPopover);
});

test("select renders its selected label during SSR and preserves raw native form values", () => {
  const html = render(
    h(Select, {
      options,
      defaultValue: "__ziqx_empty_value__",
      name: "owner",
      label: "Owner",
      id: "owner",
      required: true,
      description: "Assign an owner",
      error: "Choose another owner",
      bgColor: "#171717",
      fgColor: "white",
    }),
  );
  assert.match(html, /for="owner"/);
  assert.match(html, /role="combobox"/);
  assert.match(html, /aria-describedby="owner-description owner-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /--ziqx-bg:#171717;--ziqx-fg:white/);
  const native = html.match(/<select[^>]*name="owner"[\s\S]*?<\/select>/)?.[0];
  assert.ok(native);
  assert.match(native, /required=""/);
  assert.match(native, /value="__ziqx_empty_value__" selected=""/);
  assert.doesNotMatch(native, /ziqx:alice/);
});

test("select supports empty options and placeholders without an artificial user value", () => {
  const empty = render(
    h(Select, { options, defaultValue: "", ariaLabel: "Owner" }),
  );
  assert.match(empty, /Unassigned/);
  const placeholder = render(
    h(Select, { options: options.slice(1), placeholder: "Choose owner" }),
  );
  assert.match(placeholder, /Choose owner/);
});

test("date picker connects native constraints and accessible field information", () => {
  const html = render(
    h(DatePicker, {
      id: "due",
      label: "Due date",
      defaultValue: "2026-09-08",
      name: "due",
      minDate: "2026-09-01",
      maxDate: "2026-09-30",
      required: true,
      description: "This month",
      formatDate: () => "September eighth",
    }),
  );
  assert.match(html, /for="due"/);
  assert.match(html, /September eighth/);
  assert.match(html, /aria-describedby="due-description due-required"/);
  assert.match(html, /type="date"/);
  assert.match(html, /name="due"/);
  assert.match(html, /min="2026-09-01" max="2026-09-30"/);
  assert.match(html, /value="2026-09-08"/);
});

test("date-only parsing rejects invalid and rolled-over dates", () => {
  for (const value of [
    "",
    "2026-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-00-10",
    "2026-9-8",
    "0000-01-01",
    "2026-09-08T00:00:00Z",
  ])
    assert.equal(fromDateValue(value), undefined);
  for (const value of ["2024-02-29", "2026-09-08", "0099-01-01"])
    assert.equal(toDateValue(fromDateValue(value)), value);
  const html = render(
    h(DatePicker, { value: "2026-02-30", placeholder: "Pick a valid date" }),
  );
  assert.match(html, /Pick a valid date/);
  assert.match(html, /value=""/);
});

test("date-only values survive timezone and daylight-saving boundaries", () => {
  const moduleURL = new URL(
    "../dist/date-picker/date-value.js",
    import.meta.url,
  ).href;
  for (const timezone of [
    "America/Los_Angeles",
    "Asia/Kolkata",
    "Pacific/Auckland",
  ]) {
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import assert from 'node:assert/strict'; import {fromDateValue,toDateValue} from ${JSON.stringify(moduleURL)}; for (const day of ['2026-03-08','2026-11-01','0099-01-01']) assert.equal(toDateValue(fromDateValue(day)),day);`,
      ],
      { env: { ...process.env, TZ: timezone } },
    );
  }
});

test("Popover composes a package Button without changing its accessible trigger", () => {
  const html = render(
    h(
      Popover,
      {
        trigger: h(Button, { "aria-label": "Open filters" }, "Filters"),
        ariaLabel: "Filters",
      },
      h(PopoverClose, null, "Done"),
    ),
  );
  assert.match(html, /aria-label="Open filters"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /aria-expanded="false"/);
});

test("calendar CSS is scoped and every standalone stylesheet includes its shared styles", async () => {
  const date = await readFile(
    new URL("../dist/date-picker/styles.css", import.meta.url),
    "utf8",
  );
  assert.match(date, /\.ziqx-date-content \.rdp-root/);
  assert.doesNotMatch(date, /^\.rdp-/m);
  assert.match(date, /@keyframes ziqx-rdp-/);
  assert.match(date, /\.ziqx-control-trigger/);
  for (const name of ["select", "date-picker", "popover"]) {
    const css = await readFile(
      new URL(`../dist/${name}/styles.css`, import.meta.url),
      "utf8",
    );
    assert.match(css, /ziqx-floating-in/);
    assert.match(css, /prefers-reduced-motion/);
    assert.match(css, /forced-colors/);
  }
});
