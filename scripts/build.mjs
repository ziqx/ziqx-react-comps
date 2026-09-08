import postcss from "postcss";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
const require = createRequire(import.meta.url);
const dist = new URL("dist/", root);
await rm(dist, { recursive: true, force: true });
execFileSync(process.execPath, [require.resolve("typescript/bin/tsc")], {
  cwd: fileURLToPath(root),
  stdio: "inherit",
});
const read = async (path) => readFile(new URL(`src/${path}`, root), "utf8");
const dots = `${await read("generic/styles.css")}\n${await read("generic/motion.css")}`;
const button = await read("button/styles.css");
const input = await read("input/styles.css");
const checkbox = await read("checkbox/styles.css");
const glossyContainer = await read("glossy-container/styles.css");
const loaders = [
  dots,
  await read("loaders/beat.css"),
  await read("ziqx/styles.css"),
  await read("ziqx/motion.css"),
].join("\n");
// Scope the upstream calendar CSS so other calendars in consuming apps are unaffected.
const calendarCSS = postcss.parse(
  await readFile(require.resolve("react-day-picker/style.css"), "utf8"),
);
calendarCSS.walkRules((rule) => {
  if (rule.parent.type === "atrule" && rule.parent.name.endsWith("keyframes"))
    return;
  rule.selectors = rule.selectors.map(
    (selector) => `.ziqx-date-content ${selector}`,
  );
});
calendarCSS.walkAtRules(/keyframes$/, (rule) => {
  rule.params = `ziqx-${rule.params}`;
});
calendarCSS.walkDecls(/^animation/, (declaration) => {
  declaration.value = declaration.value.replace(/\brdp-/g, "ziqx-rdp-");
});
const floating = await read("shared/floating.css");
const field = await read("shared/field.css");
const select = await read("select/styles.css");
const datePicker = `${calendarCSS.toString()}\n${await read("date-picker/styles.css")}`;
const popover = await read("popover/styles.css");
for (const [directory, css] of Object.entries({
  button: `${button}\n${dots}`,
  input,
  checkbox,
  "glossy-container": glossyContainer,
  loaders,
  select: [field, floating, select].join("\n"),
  "date-picker": [field, floating, datePicker].join("\n"),
  popover: [floating, popover].join("\n"),
  "": [
    button,
    input,
    checkbox,
    glossyContainer,
    loaders,
    field,
    floating,
    select,
    datePicker,
    popover,
  ].join("\n"),
})) {
  const target = new URL(directory ? `${directory}/` : "./", dist);
  await mkdir(target, { recursive: true });
  await writeFile(new URL("styles.css", target), css);
  await writeFile(new URL("styles.d.css.ts", target), "export {};\n");
}
