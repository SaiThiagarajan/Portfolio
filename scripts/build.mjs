// Bundles src/main.ts with esbuild and inlines JS + CSS into a single self-contained dist/index.html.
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";

const watch = process.argv.includes("--dev");
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
const res = await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  minify: !watch,
  format: "iife",
  target: ["es2020"],
  outdir: "dist/.tmp",
  write: false,
  sourcemap: false,
  logLevel: "info",
});
let js = "", css = "";
for (const f of res.outputFiles) {
  if (f.path.endsWith(".js")) js = f.text;
  if (f.path.endsWith(".css")) css = f.text;
}
const html = readFileSync("index.html", "utf8")
  .replace("<!--BUILD:CSS-->", () => `<style>${css}</style>`)
  .replace("<!--BUILD:JS-->", () => `<script>${js.replace(/<\/script/gi, "<\\/script")}</script>`);
writeFileSync("dist/index.html", html);
console.log(`dist/index.html — ${(html.length / 1024).toFixed(0)} KB`);
