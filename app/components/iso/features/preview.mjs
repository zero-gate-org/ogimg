// Standalone preview for one feature scene.
//
//   node app/components/iso/features/preview.mjs layers
//   node app/components/iso/features/preview.mjs layers /tmp/layers.html
//
// Then screenshot it with the anatomy skill's capture script:
//   node <skill>/scripts/capture.mjs /tmp/layers.html --out /tmp/layers.png --width 1200 --height 760 --select .sheet

import { writeFileSync } from "node:fs";
import { previewPage } from "./scene-kit.mjs";

const scene = process.argv[2];
if (!scene) {
    console.error("usage: node preview.mjs <scene-folder> [out.html]");
    process.exit(1);
}

const { default: art } = await import(`./scenes/${scene}/art.mjs`);
const out = process.argv[3] ?? `/tmp/ogimg-scene-${scene}.html`;
writeFileSync(out, previewPage(art));
console.log(out);
console.log("svg bytes", art.svg.length);
