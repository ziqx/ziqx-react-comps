import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h, forwardRef } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { readFile } from "node:fs/promises";
import { GlossyContainer } from "@ziqx/react-comps";
import { GlossyContainer as DirectGlossyContainer } from "@ziqx/react-comps/glossy-container";

test("glossy container entry points expose the same component", () => {
  assert.equal(GlossyContainer, DirectGlossyContainer);
});

test("plain containers preserve content without adding control semantics", () => {
  const html = render(
    h(GlossyContainer, { id: "summary" }, h("h2", null, "Project")),
  );
  assert.match(html, /^<div /);
  assert.match(html, /id="summary"/);
  assert.match(html, /<h2>Project<\/h2>/);
  assert.doesNotMatch(html, /data-interactive|tabindex|role=|type=/);
});

test("button containers default to non-submitting and preserve explicit submit/disabled props", () => {
  const html = render(
    h(GlossyContainer, { as: "button", disabled: true }, "Save"),
  );
  assert.match(html, /^<button type="button"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /data-interactive="true"/);
  const submit = render(
    h(GlossyContainer, { as: "button", type: "submit", form: "task" }, "Save"),
  );
  assert.match(submit, /type="submit"/);
  assert.match(submit, /form="task"/);
});

test("links and custom elements retain their navigation and semantic attributes", () => {
  const link = render(
    h(
      GlossyContainer,
      { as: "a", href: "/tasks", "aria-current": "page" },
      "Tasks",
    ),
  );
  assert.match(link, /^<a href="\/tasks"/);
  assert.match(link, /aria-current="page"/);
  assert.match(link, /data-interactive="true"/);
  const CustomLink = forwardRef((props, ref) => h("a", { ...props, ref }));
  const custom = render(
    h(
      GlossyContainer,
      { as: CustomLink, href: "/custom", interactive: true },
      "Custom",
    ),
  );
  assert.match(custom, /^<a href="\/custom"/);
  assert.match(custom, /ziqx-glossy-container/);
  const section = render(
    h(GlossyContainer, { as: "section", "aria-label": "Details" }),
  );
  assert.match(section, /^<section aria-label="Details"/);
  assert.doesNotMatch(section, /data-interactive/);
});

test("numeric geometry gets units and caller styles can customize the surface", () => {
  const html = render(
    h(GlossyContainer, {
      padding: 0,
      radius: 18,
      bgColor: "var(--brand)",
      fgColor: "white",
      className: "card",
      style: { display: "grid", "--ziqx-glossy-radius": "2rem" },
    }),
  );
  assert.match(html, /class="ziqx-glossy-container card"/);
  assert.match(html, /--ziqx-glossy-padding:0px/);
  assert.match(html, /--ziqx-glossy-radius:2rem/);
  assert.match(html, /--ziqx-glossy-bg:var\(--brand\)/);
  assert.match(html, /display:grid/);
});

test("standalone and combined CSS include the glossy surface and accessibility states", async () => {
  for (const url of [
    "../dist/styles.css",
    "../dist/glossy-container/styles.css",
  ]) {
    const css = await readFile(new URL(url, import.meta.url), "utf8");
    assert.match(css, /\.ziqx-glossy-container/);
    assert.match(css, /prefers-reduced-motion/);
    assert.match(css, /forced-colors/);
  }
});
