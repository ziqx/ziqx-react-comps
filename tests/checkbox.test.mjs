import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { Checkbox } from "@ziqx/react-comps";
import { Checkbox as DirectCheckbox } from "@ziqx/react-comps/checkbox";

test("checkbox subpath is the shared root component", () => {
  assert.equal(Checkbox, DirectCheckbox);
});

test("uncontrolled checkboxes retain native form and label semantics", () => {
  const html = render(
    h(Checkbox, {
      id: "terms",
      label: "Accept terms",
      defaultChecked: true,
      name: "terms",
      value: "accepted",
      required: true,
      form: "signup",
    }),
  );
  assert.match(html, /type="checkbox"/);
  assert.match(html, /checked=""/);
  assert.match(html, /name="terms"/);
  assert.match(html, /value="accepted"/);
  assert.match(html, /required=""/);
  assert.match(html, /form="signup"/);
  assert.match(html, /<label for="terms">Accept terms<\/label>/);
  assert.match(html, /ziqx-checkbox-mark" aria-hidden="true"/);
});

test("table checkboxes forward accessible names, disabled state, and refs without nested labels", () => {
  const html = render(
    h(
      "label",
      null,
      h(Checkbox, {
        checked: false,
        disabled: true,
        "aria-label": "Select task",
        onChange() {},
      }),
    ),
  );
  assert.equal((html.match(/<label/g) ?? []).length, 1);
  assert.match(html, /aria-label="Select task"/);
  assert.match(html, /disabled=""/);
  assert.doesNotMatch(html, /checked=""/);
});

test("native inputs remain uncontrolled unless checked is supplied", () => {
  const html = render(h(Checkbox, { label: "Option" }));
  assert.doesNotMatch(html, /checked=|readonly=/i);
  const id = html.match(/<input[^>]+id="([^"]+)"/)[1];
  assert.ok(html.includes(`for="${id}"`));
});
