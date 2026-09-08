import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import {
  Button,
  Input,
  DotsLoader,
  BeatLoader,
  ZiqxLoader,
} from "@ziqx/react-comps";
import { Button as DirectButton } from "@ziqx/react-comps/button";
import { Input as DirectInput } from "@ziqx/react-comps/input";
import { DotsLoader as DirectDots } from "@ziqx/react-comps/loaders";

const Icon = (props) => h("svg", props);

test("component subpaths match root exports", () => {
  assert.equal(Button, DirectButton);
  assert.equal(Input, DirectInput);
  assert.equal(DotsLoader, DirectDots);
});

test("loading blocks submission, announces progress, and retains sizing content", () => {
  const html = render(
    h(
      Button,
      {
        type: "submit",
        loading: true,
        loadingLabel: "Saving task…",
        bgColor: "#07815d",
        fgColor: "white",
        prefix: Icon,
      },
      "Save task",
    ),
  );
  assert.match(html, /type="submit"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /aria-label="Saving task…"/);
  assert.match(html, /ziqx-button-content" aria-hidden="true"/);
  assert.match(html, /Save task/);
  assert.match(html, /--ziqx-bg:#07815d;--ziqx-fg:white/);
  assert.match(html, /ziqx-button-loader" aria-hidden="true"/);
  assert.match(html, /ziqx-dots-loader-mark/);
});

test("idle buttons keep native attributes and pass fgColor to both icons", () => {
  const html = render(
    h(
      Button,
      {
        prefix: Icon,
        suffix: Icon,
        fgColor: "#fafafa",
        "aria-label": "Continue",
        name: "intent",
        value: "save",
      },
      "Continue",
    ),
  );
  assert.match(html, /type="button"/);
  assert.match(html, /name="intent"/);
  assert.match(html, /value="save"/);
  assert.equal((html.match(/color="#fafafa"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /disabled|ziqx-button-loader|aria-busy/);
});

test("label, description, external hint and error are connected to the native input", () => {
  const html = render(
    h(Input, {
      id: "email",
      label: "Email",
      type: "email",
      required: true,
      name: "email",
      defaultValue: "hello",
      description: "Work address",
      error: "Enter a valid email",
      "aria-describedby": "external-hint",
      prefix: Icon,
    }),
  );
  assert.match(html, /for="email"/);
  assert.match(html, /id="email"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(
    html,
    /aria-describedby="external-hint email-description email-error"/,
  );
  assert.match(html, /id="email-description">Work address/);
  assert.match(html, /id="email-error">Enter a valid email/);
  assert.match(html, /type="email"/);
  assert.match(html, /required=""/);
  assert.match(html, /value="hello"/);
});

test("generated input ids stay unique and values are not mirrored into component state", () => {
  const html = render(
    h(
      "form",
      null,
      h(Input, { label: "First", defaultValue: "A" }),
      h(Input, { label: "Second", value: "B", readOnly: true, disabled: true }),
    ),
  );
  const ids = [...html.matchAll(/<input[^>]+id="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(new Set(ids).size, 2);
  assert.match(html, /value="A"/);
  assert.match(html, /value="B"/);
  assert.match(html, /readOnly=""/);
  assert.match(html, /disabled=""/);
});

test("all loaders expose status, inherited color, sizes and optional visible labels", () => {
  for (const Loader of [DotsLoader, BeatLoader, ZiqxLoader]) {
    const html = render(
      h(Loader, {
        label: "Working",
        size: "sm",
        showLabel: true,
        style: { color: "rebeccapurple", "--ziqx-loader-cycle": "1200ms" },
      }),
    );
    assert.match(html, /role="status"/);
    assert.match(html, /aria-label="Working"/);
    assert.match(html, /data-size="sm"/);
    assert.match(html, /color:rebeccapurple/);
    assert.match(html, /--ziqx-loader-cycle:1200ms/);
    assert.match(html, />Working<\/span>/);
  }
});
