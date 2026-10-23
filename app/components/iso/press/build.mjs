// OG-1 compositor — audit gate + self-contained verify page emission.
//
//   node app/components/iso/press/build.mjs --audit   → prints the report and "audit passed"
//   node app/components/iso/press/build.mjs           → audit + writes /tmp/opencode/press/index.html

import { writeFileSync } from "node:fs";
import * as A from "../kit/audit.mjs";
import * as k from "../kit/iso-kit.mjs";
import * as art from "./art.mjs";

const R = art.build();

// always audit; `--audit` additionally acts as the pure gate (no emission)
const wantsEmit = !process.argv.includes("--audit");
const argv = wantsEmit ? [...process.argv, "--audit"] : process.argv;
A.auditOrExit(R, R.P, { argv });
if (process.exitCode) process.exit(process.exitCode);

if (!wantsEmit) {
  console.log("audit gate only");
  process.exit(0);
}

const slot = art.spotFractions();
const domeStyle = `style="${Object.entries(slot)
  .map(([key, value]) => `--slot-${key}:${(value * 100).toFixed(3)}%`)
  .join(";")}"`;
const svg = k.figureSvg({
  width: art.WIDTH,
  height: art.HEIGHT,
  label: art.LABEL,
  body: art.bodyOf(R),
  standalone: true,
});
const page = k.plateHtml({
  fig: "Fig — OG-1",
  title: "OG-1 compositor",
  hint: "press cycle · 9.4 s",
  readout: "ready",
  keys: [
    { mark: "lit", label: "Accent plate: the one lit layer" },
    { mark: "hi", label: "Galley stones: the sheet's landing" },
  ],
  caption:
    "A flatbed letterpress that composes the OG card from four plates: the sheet feeds from the magazine, headline, photo, accent and logo plates drop into place, the brayer calenders the stack, and the finished card lands on the output tray before every layer reloads.",
  body: `<div class="iso-stage press-stage" ${domeStyle}>
  ${svg}
  <div class="press-slot" aria-hidden="true"><span>1200 × 630</span></div>
</div>
<style>
  .press-stage{position:relative}
  .press-slot{
    position:absolute;display:grid;place-items:center;border-radius:2px;
    left:var(--slot-left);top:var(--slot-top);width:var(--slot-width);height:var(--slot-height);
    background:#fff;color:#0a0a0a;
    font:600 clamp(11px,1.9vw,19px)/1 var(--anatomy-mono);letter-spacing:.08em;
    box-shadow:0 18px 40px -18px #000c, 0 0 0 1px #00000022;
    pointer-events:none;
  }
</style>`,
});

writeFileSync("/tmp/opencode/press/index.html", k.pageHtml({ title: "OG-1 compositor", theme: "dark", body: page, script: art.livePageScript(), width: 950 }));

const counts = {};
R.items.forEach((item) => (counts[item.piece] = (counts[item.piece] ?? 0) + 1));
console.log("parts", JSON.stringify(counts));
console.log("slot", JSON.stringify(slot));
console.log("wrote /tmp/opencode/press/index.html");
