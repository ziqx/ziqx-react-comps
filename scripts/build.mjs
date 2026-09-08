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
const loaders = [
  dots,
  await read("loaders/beat.css"),
  await read("ziqx/styles.css"),
  await read("ziqx/motion.css"),
].join("\n");
for (const [directory, css] of Object.entries({
  button: `${button}\n${dots}`,
  input,
  loaders,
  "": [button, input, loaders].join("\n"),
})) {
  const target = new URL(directory ? `${directory}/` : "./", dist);
  await mkdir(target, { recursive: true });
  await writeFile(new URL("styles.css", target), css);
  await writeFile(new URL("styles.d.css.ts", target), "export {};\n");
}
