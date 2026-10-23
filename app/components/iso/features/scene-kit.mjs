// Shared drawing kit for the landing page's isometric feature machines.
//
// Every scene is built as a string of SVG at module scope in a Node script, then
// emitted into generated/scenes.generated.ts. Geometry never reaches the client.
// Motion lives in data-pose / data-alpha / data-draw attributes on <g> and
// <path> nodes; BentoLive.tsx evaluates one shared timeline format for all five
// scenes. Times are seconds, distances are SVG px in the scene's own viewBox.

import * as k from "../kit/iso-kit.mjs";
import { ISO_CSS } from "../kit/iso-kit.mjs";

export { k };
export const S = k.solidSvg;
export const LINE = k.lineSvg;
export const DOTS = k.dotsSvg;
export const TEXT = k.faceTextSvg;
export const GROUP = k.groupSvg;
export const PATH = k.pathOf;

const num = (value) => {
  const text = (Math.round(value * 100) / 100).toFixed(2).replace(/\.?0+$/, "");
  return text === "-0" ? "0" : text;
};

const escape = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Fit a 45/30 camera to the scene's true extents. */
export function stage(width, height, points, { pad = 30, headroom = 0, azimuth = 45, elevation = 30 } = {}) {
  return k.fitProjection(points, width, height, { pad, headroom, azimuth, elevation });
}

/** Screen movement of a world-space vector, in this scene's projection. */
export const screenDelta = (P, vector) => k.axisVector(P, vector);

/** Screen position of a world point. */
export const at = (P, point) => k.iso(point, P);

export const slab = (plan, z, height, P, steps = 8, bevel = 0) =>
  k.slabOf(plan, z, height, P, steps, bevel);

export const cyl = (cx, cy, r, z, height, P, steps = 24, bevel = 0) =>
  k.cylinder(cx, cy, r, z, height, P, steps, bevel);

export const top = (P, points, z, closed = false) => k.onTop(points, z, P, closed);
export const topLine = (P, from, to, z) => k.lineOnTop(from, to, z, P);
export const rise = (P, point, z0, z1) => k.rise(point, z0, z1, P);
export const outline = (P, plan, z, steps = 8) => k.planOutline(plan, z, P, steps);

export const topText = (P, point, z, text, options = {}) =>
  k.faceTextSvg(k.topMatrix(point, z, P, options.along ?? "x"), text, options);

/** Text set in the site serif, for the type scene. */
export function serifText(P, point, z, text, { size = 12, fill = "var(--anatomy-lit)", anchor = "middle", along = "x" } = {}) {
  const transform = k.topMatrix(point, z, P, along);
  return `<text transform="${transform}" font-family="var(--font-serif, Georgia), Georgia, serif" font-size="${size}" text-anchor="${anchor}" fill="${fill}" style="letter-spacing:-0.02em">${escape(text)}</text>`;
}

export function topTicks(P, { from, to, step, every = 5, edge, z, lengths = [2, 3.5], axis = "x", tone = "lo" }) {
  const ticks = k.topTicks(from, to, step, every, edge, z, lengths, P, axis);
  return {
    minor: k.lineSvg(ticks.minor, { tone }),
    major: k.lineSvg(ticks.major, { tone: tone === "lo" ? "mid" : tone }),
    all: k.lineSvg(ticks.minor, { tone }) + k.lineSvg(ticks.major, { tone: tone === "lo" ? "mid" : tone }),
  };
}

export function sideTicks(P, { from, to, step, every = 5, face, top: topZ, lengths = [2, 3.5], axis = "x", tone = "lo" }) {
  const ticks = k.sideTicks(from, to, step, every, face, topZ, lengths, P, axis);
  return {
    minor: k.lineSvg(ticks.minor, { tone }),
    major: k.lineSvg(ticks.major, { tone: tone === "lo" ? "mid" : tone }),
    all: k.lineSvg(ticks.minor, { tone }) + k.lineSvg(ticks.major, { tone: tone === "lo" ? "mid" : tone }),
  };
}

export const seam = (P, plan, z, steps = 8) => k.lineSvg(k.sideSeam(plan, z, P, steps), { tone: "faint" });
export const halo = (plan, z, height, P) => `<path class="iso-halo" d="${k.haloOf(plan, z, height, P)}"/>`;

/**
 * Four rubber feet under a base plate. Each foot gets a small screw dot.
 */
export function feet(P, plan, { z = 0, height = 2.4, inset = 8, w = 12, d = 12, tone = "mid" } = {}) {
  const spots = k.corners(plan, inset).map(([x, y]) => ({ x: x - w / 2, y: y - d / 2, w, d, r: 1.6 }));
  const bodies = spots.map((foot) => S(slab(foot, z, height, P, 6), { tone, crease: "none" })).join("");
  const pins = spots
    .map((foot) => DOTS([at(P, [foot.x + w / 2, foot.y + d / 2, z + height + 0.02])], { size: 0.45, tone: "lo" }))
    .join("");
  return bodies + pins;
}

/** Recessed screws around a plate. */
export function screws(P, plan, { z, inset = 9, r = 1.35, height = 0.6, tone = "hi", steps = 18 } = {}) {
  const spots = k.corners(plan, inset);
  const heads = spots.map(([x, y]) => S(cyl(x, y, r, z, height, P, steps), { tone, crease: "none" })).join("");
  const pins = spots.map(([x, y]) => DOTS([at(P, [x, y, z + height + 0.02])], { size: 0.4, tone: "mid" })).join("");
  return heads + pins;
}

/**
 * A small engraved label plate with two rule lines. Use once per object at most.
 */
export function labelPlate(P, { point, z, width = 26, depth = 8, text, size = 2.6, tone = "lo" } = {}) {
  const plan = { x: point[0] - width / 2, y: point[1] - depth / 2, w: width, d: depth, r: 0.6 };
  const body = S(slab(plan, z, 0.25, P, 6), { tone: "lo", crease: "none", flat: true });
  const rules = text
    ? topText(P, [plan.x + 1.5, plan.y + depth * 0.62], z + 0.27, text, { size, tone, anchor: "start" })
    : LINE(topLine(P, [plan.x + 1.5, point[1]], [plan.x + width - 1.5, point[1]], z + 0.27), { tone });
  const under = topLine(
    P,
    [plan.x + 1.5, point[1] + depth * 0.22],
    [plan.x + width * 0.55, point[1] + depth * 0.22],
    z + 0.27,
  );
  return body + rules + LINE(under, { tone: "faint" });
}

/**
 * A motion part. Frames are [time, dx, dy, rotation?, ease?].
 * Ease names: inout (default), out, in, lin, snap.
 */
export function part(name, inner, { pose, alpha, pivot, className, extra = "" } = {}) {
  const attrs = [`data-part="${escape(name)}"`];
  if (className) attrs.push(`class="${escape(className)}"`);
  if (pivot) attrs.push(`data-pivot="${num(pivot[0])} ${num(pivot[1])}"`);
  if (pose?.length) {
    attrs.push(
      `data-pose="${pose
        .map(([time, dx = 0, dy = 0, rot = 0, ease = "inout"]) =>
          `${num(time)},${num(dx)},${num(dy)},${num(rot)},${ease}`,
        )
        .join(";")}"`,
    );
  }
  if (alpha?.length) {
    attrs.push(
      `data-alpha="${alpha.map(([time, value, ease = "inout"]) => `${num(time)},${num(value)},${ease}`).join(";")}"`,
    );
  }
  if (extra) attrs.push(extra);
  return `<g ${attrs.join(" ")}>${inner}</g>`;
}

/** A path that draws itself over a time window. Invisible before its start. */
export function drawPath(d, { from, to, tone = "hi", className = "", width = 0.9 } = {}) {
  return `<path class="iso-line ${className}" data-draw="${num(from)},${num(to)}" data-tone="${tone}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke-width="${width}" d="${d}"/>`;
}

/**
 * The scene document. loop/offset/still are read by BentoLive.
 * offset staggers scenes so they do not all move on the same beat.
 */
export function sceneSvg({ width, height, label, body, loop = 10, offset = 0, still = 0, className = "" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg bento-svg ${className}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(label)}" data-bento-scene data-loop="${num(loop)}" data-offset="${num(offset)}" data-still="${num(still)}">${body}</svg>`;
}

const PREVIEW_CSS = `
*{box-sizing:border-box}
html{-webkit-font-smoothing:antialiased}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0a;color:#f5f5f5;font:14px/1.5 ui-sans-serif,system-ui,sans-serif}
.sheet{width:min(1000px,100vw - 32px);padding:32px;border:1px solid #222;background:#0a0a0a}
.sheet .iso-svg{display:block;width:100%;height:auto}
.feature-iso .iso,.feature-iso.iso{--anatomy-paper:#101010;--anatomy-face:#161616;--anatomy-top:#1b1b1b;--anatomy-shade-0:#0b0b0b;--anatomy-shade-1:#0d0d0d;--anatomy-shade-2:#101010;--anatomy-shade-3:#131313;--anatomy-lit-top:#f5f5f5;--anatomy-lit-shade:#d4d4d4;--anatomy-hi:#d4d4d4;--anatomy-mid:#8a8a8a;--anatomy-lo:#4a4a4a;--anatomy-faint:#2c2c2c;--anatomy-lit:#ffffff;--anatomy-halo:#000000;--anatomy-halo-opacity:.8;--anatomy-dot:#e5e5e5;--anatomy-weight:.7px}
`;

// Preview-only sampler: parks the scene at data-still (or ?t=seconds) so a
// screenshot shows the interesting hold pose instead of the rest pose.
const PREVIEW_SCRIPT = `
(() => {
  const svg = document.querySelector("svg[data-bento-scene]");
  if (!svg) return;
  const q = new URLSearchParams(location.search);
  const t = q.has("t") ? Number(q.get("t")) : Number(svg.dataset.still || 0);
  const E = {
    lin: (v) => v,
    in: (v) => v * v * v,
    out: (v) => 1 - (1 - v) ** 4,
    snap: (v) => 1 - (1 - v) ** 5,
    inout: (v) => (v < 0.5 ? 4 * v * v * v : 1 - (-2 * v + 2) ** 3 / 2),
  };
  const frames = (text) =>
    text.split(";").map((f) => f.trim()).filter(Boolean).map((f) => f.split(",").map(Number));
  const sample = (list, k) => {
    if (t <= Number(list[0][0])) return { a: list[0], b: list[0], k: 0 };
    for (let i = 1; i < list.length; i += 1) {
      if (t <= Number(list[i][0])) {
        const a = list[i - 1];
        const b = list[i];
        return { a, b, k: (t - Number(a[0])) / (Number(b[0]) - Number(a[0]) || 1) };
      }
    }
    const last = list[list.length - 1];
    return { a: last, b: last, k: 0 };
  };
  for (const el of svg.querySelectorAll("[data-pose]")) {
    const list = frames(el.dataset.pose);
    const { a, b, k } = sample(list, 0);
    const e = E[["inout","out","in","lin","snap"].includes(b[4]) ? b[4] : "inout"](k);
    const x = Number(a[1] || 0) + (Number(b[1] || 0) - Number(a[1] || 0)) * e;
    const y = Number(a[2] || 0) + (Number(b[2] || 0) - Number(a[2] || 0)) * e;
    const r = Number(a[3] || 0) + (Number(b[3] || 0) - Number(a[3] || 0)) * e;
    const pivot = el.dataset.pivot;
    el.setAttribute("transform", pivot
      ? "translate(" + x + " " + y + ") rotate(" + r + " " + pivot.replace(" ", " ") + ")"
      : "translate(" + x + " " + y + ")");
  }
  for (const el of svg.querySelectorAll("[data-alpha]")) {
    const list = frames(el.dataset.alpha);
    const { a, b, k } = sample(list, 0);
    const e = E[["inout","out","in","lin","snap"].includes(b[2]) ? b[2] : "inout"](k);
    el.setAttribute("opacity", String(Number(a[1]) + (Number(b[1]) - Number(a[1])) * e));
  }
  for (const el of svg.querySelectorAll("[data-draw]")) {
    const [from, to] = el.dataset.draw.split(",").map(Number);
    const raw = Math.max(0, Math.min(1, (t - from) / (to - from || 1)));
    el.setAttribute("stroke-dashoffset", String(1 - E.inout(raw)));
  }
})();
`;

/** A standalone preview page for a scene author to screenshot. */
export function previewPage(art) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(art.label)}</title><style>${ISO_CSS}${PREVIEW_CSS}</style></head><body class="iso feature-iso"><main class="sheet">${art.svg}</main><script>${PREVIEW_SCRIPT}</script></body></html>`;
}
