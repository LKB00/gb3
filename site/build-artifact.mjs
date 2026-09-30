// Bundles index.html + styles.css + app.js into one artifact-ready fragment
// (no doctype/html/head/body; the artifact host adds those). Usage: node build-artifact.mjs out.html
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "index.html"), "utf8");
const css = readFileSync(join(here, "styles.css"), "utf8");
const js = readFileSync(join(here, "app.js"), "utf8");

const body = html.split("<!-- PAGE-START -->")[1].split("<!-- PAGE-END -->")[0];
const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]+>/)[0];
const title = html.match(/<title>.*<\/title>/)[0];

const out = `${title}\n${fonts}\n<style>\n${css}\n</style>\n${body}\n<script>\n${js}\n</script>\n`;
writeFileSync(process.argv[2] || join(here, "artifact.html"), out);
console.log("wrote", process.argv[2] || "artifact.html", out.length, "bytes");
