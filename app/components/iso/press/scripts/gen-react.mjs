// Generates the client-safe literals the React port ships:
//
//   generated/figure.generated.js — the static figure SVG (with its CSS inline)
//   generated/tour.generated.js   — TOUR literal, tourFrames source, translate axes
//
// Source of truth is press/art.mjs and press/build.mjs. Refresh with:
//
//   node app/components/iso/press/scripts/gen-react.mjs
//
// The site never imports art.mjs from the client: it ships these literals only.

import { writeFileSync } from "node:fs";
import * as k from "../../kit/iso-kit.mjs";
import * as art from "../art.mjs";

const banner = "// GENERATED FILE — do not edit by hand.\n" +
  "// Source of truth: app/components/iso/press/art.mjs (via build.mjs).\n" +
  "// Refresh with:  node app/components/iso/press/scripts/gen-react.mjs\n";

const R = art.build();

// ── figure body: full static svg with the kit css inlined (standalone) ────
const figure = k.figureSvg({
  width: art.WIDTH,
  height: art.HEIGHT,
  label: art.LABEL,
  body: art.bodyOf(R),
  standalone: true,
  className: "press-svg",
});
writeFileSync(new URL("../generated/figure.generated.js", import.meta.url),
  `${banner}export const FIGURE_SVG = ${JSON.stringify(figure)};\n`);

// ── tour: loop data + pure frame function + precomputed translate axes ───
const axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((d) => {
  const m = k.translateAlong(art.P, d).match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
  return [Number(m[1]), Number(m[2])];
});
writeFileSync(new URL("../generated/tour.generated.js", import.meta.url), `${banner}
export const AX = ${JSON.stringify(axes)};

export const SLOT = ${JSON.stringify(art.spotFractions())};

export const TOUR = ${JSON.stringify(art.TOUR, null, 2)};

export ${art.tourFrames.toString()}
`);
