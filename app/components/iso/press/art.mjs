// OG-1 compositor — flatbed letterpress in black & white.
// Statics + movers recorded with the audit recorder; the live tour is a pure
// state machine so the verify page and the React client share one source.

import * as k from "../kit/iso-kit.mjs";
import * as A from "../kit/audit.mjs";
import { lathe as lathePaths, frameAlong } from "../kit/lathe.mjs";

export const WIDTH = 760;
export const HEIGHT = 430;
export const LABEL = "OG-1 compositor — flatbed letterpress with the finished card landing on its output tray";

// plinth top: every static sits at plinth + local z
export const OFFSET = 6.5;
const Z = (z) => z + OFFSET;

export const PLATE = { x: -150, y: -76, w: 300, d: 152, r: 8 };
export const FEED = { x: -128, y: -54, w: 14, d: 14, r: 1.5 }; // one foot; the rest mirror it
export const SCREW = { x: -140, y: -66 }; // inset 10 from plate corner
export const BED = { x: -134, y: -14, w: 108, d: 56, r: 2 };
export const MAG = { x: -134, y: -70, w: 108, d: 30, r: 2 };
export const MAG_WALL = { h: 5.6, t: 2.4 }; // walls 8..13.6, 2.4 thick
export const MAG_LIP = { x: -134, y: -40, w: 108, d: 2, r: 0.8, z1: 10.8 }; // full-height front wall
export const SHEET = { x: -128, y: -67.6, w: 54, d: 28, r: 1 };
export const SHEET_AT = { x: -102, y: 2, w: 54, d: 28, r: 1 };
export const SHEET_TRAY = { x: -102, y: 45.8, w: 54, d: 28, r: 1 };
export const SHEET_THICK = 0.8;
export const TRAY = {
  floor: { x: -104.4, y: 43.8, w: 58.8, d: 32.2, r: 2 },
  lipE: { x: -47.2, y: 43.8, w: 1.6, d: 32.2, r: 0.6 },
  lipS: { x: -104.4, y: 74.4, w: 58.8, d: 1.6, r: 0.6 },
};
export const COUNTER = { x: 28, y: 44, w: 26, d: 12, r: 2 };
export const COUNTER_WIN = { x: 31, y: 47.4, w: 13, d: 5.2, r: 1 };
export const RAIL = { x: -150, y: -67, w: 138, d: 5, r: 1.5 };
export const POSTS = [
  { x: -150, y: -67, w: 6, d: 6, r: 1 },
  { x: -16, y: -67, w: 6, d: 6, r: 1 },
];
export const CRADLE_H = 8;
export const CRADLES = [
  { x: -26, y: 6, w: 6, d: 6, r: 1 },
  { x: -26, y: 20, w: 6, d: 6, r: 1 },
];
export const DRUM = { x: -23, y0: 2, y1: 30, r: 5, rest: 13 };
export const DRUM_MERIDIAN = [[0, 0], [0, 5], [28, 5], [28, 0]];

// plate spots on the landed sheet (u = x fraction, v = y fraction)
export const SPOTS = [
  { name: "headline", u: [0.05, 0.3], v: [0.08, 0.38] },
  { name: "photo", u: [0.36, 0.62], v: [0.1, 0.62] },
  { name: "accent", u: [0.68, 0.72], v: [0.1, 0.6] },
  { name: "logo", u: [0.82, 0.94], v: [0.1, 0.24] },
];
export const PLATE_THICK = 0.9;
export const PLATE_Z0 = 4.8; // bottom of plate 0 on the sheet

export const HOPPER_PADS = [[2, 1.4], [1.4, 1.4], [1.4, 2], [2, 2]];
export const HOPPER = { y: -66, wallTop: 22, wallT: 1.2, gap: 3.2 };

export const spotPlan = (spot, at = SHEET_AT) => ({
  x: at.x + spot.u[0] * at.w,
  y: at.y + spot.v[0] * at.d,
  w: (spot.u[1] - spot.u[0]) * at.w,
  d: (spot.v[1] - spot.v[0]) * at.d,
});
export const spotTop = (index) => PLATE_Z0 + (index + 1) * PLATE_THICK;

export const hopperPlan = (index) => {
  const spot = spotPlan(SPOTS[index]);
  const [fL, fR] = HOPPER_PADS[index];
  return { x: spot.x - fL, y: HOPPER.y, w: spot.w + fL + fR, d: spot.d + HOPPER.gap, r: 1 };
};
export const storedPlan = (index) => {
  const spot = spotPlan(SPOTS[index]);
  return { x: spot.x, y: HOPPER.y + HOPPER.wallT + 0.2, w: spot.w, d: spot.d, r: 0 };
};

// ── projection ────────────────────────────────────────────────────────────
export const EXTENT = (() => {
  const points = [...k.boxCorners(PLATE, 0, OFFSET)];
  points.push(...k.boxCorners(BED, OFFSET, OFFSET + 4));
  points.push(...k.boxCorners(MAG, OFFSET + 8, OFFSET + 8 + MAG_WALL.h));
  points.push(...k.boxCorners(RAIL, OFFSET + 22, OFFSET + 25));
  points.push(...k.boxCorners(COUNTER, OFFSET, OFFSET + 8.2));
  points.push(...k.boxCorners(TRAY.floor, OFFSET, OFFSET + 2));
  points.push(...k.boxCorners(COUNTER_WIN, OFFSET + 8.2, OFFSET + 8.2));
  points.push([-23, 36.2, OFFSET + 14.5], [-23, 30, OFFSET + 18]);
  return points;
})();

export const P = k.fitProjection(EXTENT, WIDTH, HEIGHT, { pad: 30, azimuth: 45 });

// ── drawing helpers ───────────────────────────────────────────────────────
const S = k.solidSvg;
const SLAB = (plan, z, h, P, steps = 6, bevel = 0) => k.slabOf(plan, Z(z), h, P, steps, bevel);
const CYL = (cx, cy, r, z, h, P, steps = 24) => k.cylinder(cx, cy, r, Z(z), h, P, steps);
const TOP = (at, z, along = "x") => k.topMatrix(at, Z(z), P, along);
const TEXT = (at, z, text, { size = 2, tone = "lo", anchor = "start", along = "x" } = {}) =>
  k.faceTextSvg(TOP(at, z, along), text, { size, tone, anchor });
const LINE = (from, to, z, opts = {}) => k.lineSvg(k.lineOnTop(from, to, Z(z), P), opts);

const put = (R, name, at, svg, shapes = []) => R.put({ name, piece: name, at, svg, shapes });
const slabSolid = (plan, z, h, name, extra = {}) => A.slab(plan, Z(z), h, { name, ...extra });

function baseAndPlate(R) {
  const southFeet = [{ ...FEED }, { ...FEED, x: 114 }];
  const northFeet = [{ ...FEED, y: 40 }, { x: 114, y: 40, w: 14, d: 14, r: 1.5 }];
  R.put({
    piece: "plate.foot",
    name: "foot.north",
    at: [FEED.x + 7, 47, 0.6],
    svg: northFeet.map((plan) => S(k.slabOf(plan, 0, 2.5, P, 8), { tone: "mid", crease: "none" })).join(""),
    shapes: northFeet.map((plan, index) => R.solid(slabSolid(plan, -6.5, 2.5, `foot.north.${index}`, { ground: true }))),
  });
  R.put({
    piece: "plate.foot",
    name: "foot.south",
    at: [FEED.x + 7, FEED.y + 7, 0.6],
    bias: 0.06,
    svg: southFeet.map((plan) => S(k.slabOf(plan, 0, 2.5, P, 8), { tone: "mid", crease: "none" })).join(""),
    shapes: southFeet.map((plan, index) => R.solid(slabSolid(plan, -6.5, 2.5, `foot.south.${index}`, { ground: true }))),
  });
  R.put({
    piece: "plate",
    name: "plinth",
    at: [0, 0, 4.5],
    svg: S(k.slabOf(PLATE, OFFSET - 4, 4, P, 12, 0.8), { tone: "mid" }),
    shapes: [R.solid(A.slab(PLATE, OFFSET - 4, 4, { name: "plinth" }))],
  });
  const screws = [
    [SCREW.x, SCREW.y], [-SCREW.x, SCREW.y], [SCREW.x, -SCREW.y], [-SCREW.x, -SCREW.y],
  ];
  R.put({
    piece: "screws",
    name: "screws",
    at: [SCREW.x, SCREW.y, 0.4],
    svg: screws.map(([cx, cy]) => S(CYL(cx, cy, 1.6, 0, 0.9, P, 20), { tone: "hi" })).join("") +
      screws.map(([cx, cy]) => k.dotsSvg([k.iso([cx, cy, Z(0.92)], P)], { size: 0.7, tone: "mid" })).join(""),
    shapes: screws.map(([cx, cy]) => R.solid(A.cylinder(cx, cy, 1.6, Z(0), 0.9, { name: "screw" }))),
  });
}

function bedAndLabels(R) {
  R.put({
    piece: "bed",
    name: "bed",
    at: [-80, 14, 2],
    svg: S(SLAB(BED, 0, 4, P, 10), { tone: "hi" }),
    shapes: [R.solid(slabSolid(BED, 0, 4, "bed"))],
  });
  // registration cross, ends land on the bed's own perimeter
  R.put({
    piece: "bed.mark",
    name: "bed.cross",
    at: [-80, 14, 4.02],
    svg: LINE([-134, 14], [-26, 14], 4.02, { tone: "lo" }) +
      LINE([-80, -14], [-80, 42], 4.02, { tone: "lo" }),
    // invisible record-only anchor: keeps the drawn marks supportable
    shapes: [R.solid(slabSolid({ x: -133.5, y: -13.5, w: 107, d: 52.6, r: 0 }, 4, 0.02, "bed.cross.mark"))],
  });
  // front ruler: edge line + ticks reaching for the pin dots
  const tickDots = [];
  const tickLines = [];
  for (let at = -128; at <= -28; at += 4) {
    const major = Math.round((at + 128) / 4) % 5 === 0;
    const end = major ? 41.5 : 40.6;
    tickLines.push(k.lineOnTop([at, 39.6], [at, end], Z(4.02), P));
    tickDots.push([at, end]);
  }
  const dots = tickDots.map(([x, y]) => k.iso([x, y, Z(4.02)], P));
  R.put({
    piece: "bed.ruler",
    name: "bed.ticks",
    at: [-78, 40.6, 4.02],
    svg: LINE([-134, 39.6], [-26, 39.6], 4.02, { tone: "lo" }) +
      tickLines.map((d) => k.lineSvg(d, { tone: "lo" })).join("") +
      k.dotsSvg(dots, { size: 0.55, tone: "mid" }),
    shapes: [R.solid(slabSolid({ x: -134, y: 39.2, w: 108, d: 3, r: 0 }, 4, 0.02, "bed.ticks.mark"))],
  });
  R.put({
    piece: "brand",
    name: "brand",
    at: [40, 6, 0.02],
    svg:
      TEXT([32, 6], 0.02, "OG-1 COMPOSITOR", { size: 4.5, tone: "mid" }) +
      TEXT([32, 0], 0.02, "PLATE BED 108 × 56 · CARD 1200 × 630", { size: 2.1, tone: "lo" }),
    shapes: [R.solid(slabSolid({ x: 31, y: -2, w: 50, d: 10, r: 0 }, 0, 0.02, "brand.mark"))],
  });
  R.put({
    piece: "mag.label",
    name: "mag.label",
    at: [-64, -56, 11.02],
    svg: TEXT([-68, -56], 11.02, "magazine", { size: 1.9, tone: "lo" }),
    shapes: [R.solid(slabSolid({ x: -69, y: -57.4, w: 16, d: 5, r: 0 }, 11, 0.02, "mag.label.mark"))],
  });
}

function magazine(R) {
  R.put({
    piece: "mag",
    name: "mag.shelf",
    at: [-80, -55, 9.5],
    bias: 0.1,
    svg: S(SLAB(MAG, 8, 3, P, 10), { tone: "mid" }),
    shapes: [R.solid(slabSolid(MAG, 8, 3, "mag.shelf"))],
  });
  const wallPlans = [
    { x: -134, y: -70, w: 108, d: MAG_WALL.t, r: 1 }, // north
    { x: -134, y: -67.6, w: MAG_WALL.t, d: 27.6, r: 1 }, // west, clear of the north wall
    { x: -28.4, y: -67.6, w: MAG_WALL.t, d: 27.6, r: 1 }, // east, clear of the north wall
  ];
  R.put({
    piece: "mag",
    name: "mag.walls",
    at: [-80, -68.8, 12],
    svg: wallPlans.map((plan) => S(SLAB(plan, 11, MAG_WALL.h, P, 8), { tone: "mid" })).join(""),
    shapes: wallPlans.map((plan, index) => R.solid(slabSolid(plan, 11, MAG_WALL.h, `mag.wall.${index}`))),
  });
  R.put({
    piece: "mag.lip",
    name: "mag.lip",
    at: [-80, -39, 5.4],
    svg: S(SLAB(MAG_LIP, 0, MAG_LIP.z1, P, 8), { tone: "mid" }),
    shapes: [R.solid(slabSolid(MAG_LIP, 0, MAG_LIP.z1, "mag.lip"))],
  });
  // two sheets stay parked in the stack; the top sheet is the mover
  const sheets0 = [{ ...SHEET }, { ...SHEET }];
  R.put({
    piece: "mag.stack",
    name: "mag.stack",
    at: [-101, -53.6, 11.4],
    svg: sheets0.map((plan, index) =>
      S(SLAB(plan, 11 + index * SHEET_THICK, SHEET_THICK, P, 6), { tone: "hi" })).join(""),
    shapes: sheets0.map((plan, index) => R.solid(slabSolid(plan, 11 + index * SHEET_THICK, SHEET_THICK, `mag.sheet.${index}`))),
  });
}

function railAndCradles(R) {
  R.put({
    piece: "rail",
    name: "posts",
    at: [-83, -64, 11],
    svg: POSTS.map((plan) => S(SLAB(plan, 0, 22, P, 10), { tone: "mid" })).join(""),
    shapes: POSTS.map((plan, index) => R.solid(slabSolid(plan, 0, 22, `post.${index}`))),
  });
  R.put({
    piece: "rail",
    name: "rail",
    at: [-81, -64.5, 23.5],
    svg: S(SLAB(RAIL, 22, 3, P, 10), { tone: "mid" }),
    shapes: [R.solid(slabSolid(RAIL, 22, 3, "rail"))],
  });
  CRADLES.forEach((plan, index) => {
    R.put({
      piece: "cradle",
      name: `cradle.${index}`,
      at: [-23, plan.y + 3, 4],
      svg: S(SLAB(plan, 0, CRADLE_H, P, 8), { tone: "mid" }),
      shapes: [R.solid(slabSolid(plan, 0, CRADLE_H, `cradle.${index}`))],
    });
  });
}

function counterAndTray(R) {
  R.put({
    piece: "counter",
    name: "counter",
    at: [41, 50, 3.5],
    svg: S(SLAB(COUNTER, 0, 7, P, 10), { tone: "mid" }),
    shapes: [R.solid(slabSolid(COUNTER, 0, 7, "counter"))],
  });
  R.put({
    piece: "counter",
    name: "counter.window",
    at: [37.5, 50, 7.6],
    svg: S(SLAB(COUNTER_WIN, 7, 1.2, P, 8), { tone: "lo" }),
    shapes: [R.solid(slabSolid(COUNTER_WIN, 7, 1.2, "counter.window"))],
  });
  R.put({
    piece: "counter",
    name: "counter.readout",
    at: [37.5, 50, 8.22],
    svg:
      TEXT([31.4, 46.2], 7.02, "slice no.", { size: 1.8, tone: "lo" }) +
      k.faceTextSvg(TOP([37.5, 50.2], 8.22, "x"), "000", { size: 3.2, tone: "hi", anchor: "middle" })
        .replace("<text ", `<text data-count="on" `),
    shapes: [
      R.solid(slabSolid({ x: 30.5, y: 45.3, w: 16, d: 2, r: 0 }, 7, 0.02, "counter.readout.note")),
      R.solid(slabSolid({ x: 31, y: 47.4, w: 13, d: 5.2, r: 0 }, 8.2, 0.02, "counter.readout.face")),
    ],
  });
  R.put({
    piece: "tray",
    name: "tray.floor",
    at: [-75, 60, 0.25],
    svg: S(SLAB(TRAY.floor, 0, 0.5, P, 10), { tone: "lo" }),
    shapes: [R.solid(slabSolid(TRAY.floor, 0, 0.5, "tray.floor"))],
  });
  R.put({
    piece: "tray",
    name: "tray.lipE",
    at: [-46.4, 60, 1.25],
    svg: S(SLAB(TRAY.lipE, 0.5, 1.5, P, 8), { tone: "mid" }),
    shapes: [R.solid(slabSolid(TRAY.lipE, 0.5, 1.5, "tray.lipE"))],
  });
  R.put({
    piece: "tray",
    name: "tray.lipS",
    at: [-75, 75.2, 1.25],
    svg: S(SLAB(TRAY.lipS, 0.5, 1.5, P, 8), { tone: "mid" }),
    shapes: [R.solid(slabSolid(TRAY.lipS, 0.5, 1.5, "tray.lipS"))],
  });
  R.put({
    piece: "tray",
    name: "tray.label",
    at: [-75, 75.2, 2.02],
    svg: TEXT([-75, 75.2], 2.02, "1200 × 630", { size: 2.2, tone: "mid", anchor: "middle" }),
    shapes: [R.solid(slabSolid({ x: -84, y: 74.5, w: 18, d: 1.4, r: 0 }, 2, 0.02, "tray.label.mark"))],
  });
}

function hoppers(R) {
  SPOTS.forEach((spot, index) => {
    const box = hopperPlan(index);
    const wallT = HOPPER.wallT;
    const floor = { ...box };
    const north = { x: box.x, y: box.y, w: box.w, d: wallT, r: 0 };
    const west = { x: box.x, y: box.y + wallT, w: wallT, d: box.d - wallT, r: 0 };
    const east = { x: box.x + box.w - wallT, y: box.y + wallT, w: wallT, d: box.d - wallT, r: 0 };
    // back of the box reads behind its stored plate; the west wall also votes
    // against the plate in one corner, so it needs its own ordering slot
    R.put({
      piece: "hopper",
      name: `hopper.${index}.back`,
      at: [box.x + box.w / 2, box.y + box.d / 2, 19],
      svg:
        S(SLAB(floor, 17, 2.6, P, 8), { tone: "lo" }) +
        S(SLAB(north, 19.6, 2.4, P, 8), { tone: "lo" }),
      shapes: [
        R.solid(slabSolid(floor, 17, 2.6, `hopper.${index}.floor`)),
        R.solid(slabSolid(north, 19.6, 2.4, `hopper.${index}.north`)),
      ],
    });
    R.put({
      piece: "hopper",
      name: `hopper.${index}.west`,
      at: [west.x + wallT / 2, box.y + box.d / 2, 20.8],
      svg: S(SLAB(west, 19.6, 2.4, P, 8), { tone: "lo" }),
      shapes: [R.solid(slabSolid(west, 19.6, 2.4, `hopper.${index}.west`))],
    });
    R.put({
      piece: "hopper",
      name: `hopper.${index}.east`,
      at: [east.x + wallT / 2, box.y + box.d / 2, 20.8],
      svg: S(SLAB(east, 19.6, 2.4, P, 8), { tone: "lo" }),
      shapes: [R.solid(slabSolid(east, 19.6, 2.4, `hopper.${index}.east`))],
    });
  });
}

// ── movers (rest poses) ───────────────────────────────────────────────────
function movers(R) {
  // top sheet of the magazine
  R.put({
    piece: "sheet",
    name: "sheet",
    at: [SHEET.x + 27, SHEET.y + 14, 13],
    svg: `<g class="iso-mover" data-part="sheet">${S(SLAB(SHEET, 12.6, SHEET_THICK, P, 6), { tone: "hi" })}</g>`,
    shapes: [R.solid(slabSolid(SHEET, 12.6, SHEET_THICK, "sheet"))],
  });

  SPOTS.forEach((spot, index) => {
    const plan = storedPlan(index);
    const top = 20.5;
    const styles = [
      { tone: "hi" },
      { tone: "mid" },
      { tone: "hi", lit: true },
      { tone: "hi" },
    ];
    const num = Text_on(plan, top, `0${index + 1}`, styles[index]);
    R.put({
      piece: "plate",
      name: `plate.${index}`,
      at: [plan.x + plan.w / 2, plan.y + plan.d / 2, 20],
      svg: `<g class="iso-mover" data-part="plate-${index}">` +
        S(SLAB(plan, 19.6, PLATE_THICK, P, 6), styles[index]) + num + `</g>`,
      shapes: [R.solid(slabSolid(plan, 19.6, PLATE_THICK, `plate.${index}`))],
    });
  });

  // brayer: drum + axis rod + grip
  const F = frameAlong([DRUM.x, DRUM.y0, Z(DRUM.rest)], [0, 1, 0]);
  const F2 = frameAlong([DRUM.x, DRUM.y1, Z(DRUM.rest)], [0, 1, 0]);
  const rodLen = 1.8;
  const knob = { x: DRUM.x, y: DRUM.y1 + rodLen + 2.2, r: 2.2, z0: DRUM.rest - 1.5, h: 3 };
  R.put({
    piece: "brayer",
    name: "brayer",
    at: [DRUM.x, (DRUM.y0 + DRUM.y1) / 2, DRUM.rest],
    svg: `<g class="iso-mover" data-part="brayer">` +
      S(lathePaths(DRUM_MERIDIAN, F, P, { steps: 40 }), { tone: "mid" }) +
      S(lathePaths([[0, 0], [0, 1.2], [rodLen, 1.2], [rodLen, 0]], F2, P, { steps: 20 }), { tone: "mid" }) +
      S(CYL(knob.x, knob.y, knob.r, knob.z0, knob.h, P, 24), { tone: "mid" }) +
      k.knurl(knob.x, knob.y, knob.r, Z(knob.z0), Z(knob.z0) + knob.h, 10, P) +
      `</g>`,
    shapes: [
      R.solid(A.lathe(F, DRUM_MERIDIAN, { name: "brayer.drum" })),
      R.solid(A.lathe(F2, [[0, 0], [0, 1.2], [rodLen, 1.2], [rodLen, 0]], { name: "brayer.rod" })),
      R.solid(A.cylinder(knob.x, knob.y, knob.r, Z(knob.z0), knob.h, { name: "brayer.grip" })),
    ],
  });
}

// tiny engraved plate numbers
function Text_on(plan, top, text, style) {
  const at = [plan.x + plan.w / 2, plan.y + plan.d / 2];
  const tone = style.lit ? "mid" : "lo";
  return k.faceTextSvg(TOP(at, top + 0.02, "x"), text, { size: 2.2, tone, anchor: "middle" });
}

// ── build ─────────────────────────────────────────────────────────────────
export function build() {
  const R = A.recorder(P);
  baseAndPlate(R);
  bedAndLabels(R);
  magazine(R);
  railAndCradles(R);
  counterAndTray(R);
  hoppers(R);
  movers(R);
  A.settle(R, P);
  return R;
}

export function bodyOf(R) {
  return [...R.items].sort((a, b) => a.key - b.key).map((item) => item.svg).join("\n");
}

export function figure() {
  const R = build();
  return {
    R,
    width: WIDTH,
    height: HEIGHT,
    label: LABEL,
    body: bodyOf(R),
  };
}

// ── live tour ─────────────────────────────────────────────────────────────
// Literal data shared by the verify page script and the React client.
// All z deltas are in world units (1:1 with locals), so no offset here.
export const TOUR = {
  loop: 9.4,
  T: OFFSET,
  sheet: { x: -128, y: -67.6, w: 54, d: 28, z: 12.6 },
  sheetAt: { x: -102, y: 2, w: 54, d: 28, z: 4 },
  tray: { x: -102, y: 45.8, w: 54, d: 28, z: 0.5 },
  spots: SPOTS,
  plateH: PLATE_THICK,
  plateBase: PLATE_Z0,
  stored: { y: -64.6, z: 19.6 },
  box: { y: -66, drop: 3.2 },
  out: 1.8, // extra slide past the floor's south edge
  glideY: -45,
  magFront: -36,
  sheetRise: 15.4,
  drum: { x: -23, rest: 13, r: 5, y0: 2, y1: 30, bed: 4, sheetTop: 4.8, cradleTop: 8, cradleWest: -26, cradleEast: -20 },
  t: {
    feed: [0.1, 0.32, 0.72, 1.1],
    plate0: 1.1, plateGap: 0.28, plateDur: 0.52, plateOut: 0.18, plateGlide: 0.18,
    roll: [2.5, 2.8, 3.9, 4.35, 4.5],
    hold: 4.9,
    exit: [4.9, 5.6, 5.85],
    plateRet: 5.85, plateRetGap: 0.38, plateRetDur: 0.55, plateRetRise: 0.15, plateRetFly: 0.28,
    sheetRet: [7.8, 8.0, 8.65, 9.0],
  },
};

// Pure, self-contained frame computer: every helper lives inside so its
// source can be shipped verbatim into the verify page.
export function tourFrames(t, D) {
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const uf = (s, a, b) => clamp01((s - a) / (b - a || 1e-9));
  const io = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const lerp = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
  const add = (a, o) => [a[0] + o[0], a[1] + o[1], a[2] + o[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const plan = (sp, at) => ({
    x: at.x + sp.u[0] * at.w,
    y: at.y + sp.v[0] * at.d,
    w: (sp.u[1] - sp.u[0]) * at.w,
    d: (sp.v[1] - sp.v[0]) * at.d,
  });

  const n = Math.floor(t / D.loop);
  const r = t - D.loop * n;
  const T = D.t;
  const count = n + (r >= T.exit[2] ? 1 : 0);

  // ── sheet poses [x, y0, zBottom] ────────────────────────────────────────
  const SHEET = {
    rest: [D.sheet.x, D.sheet.y, D.sheet.z],
    out: [D.sheet.x, D.sheet.y + 6, D.sheet.z],
    glide: [-102, D.magFront, D.sheet.z],
    bed: [D.sheetAt.x, D.sheetAt.y, D.sheetAt.z],
    exitGlide: [D.sheetAt.x, 42, D.sheetAt.z],
    tray: [D.tray.x, D.tray.y, D.tray.z],
    rise: [D.tray.x, D.tray.y, D.sheetRise],
    flyBack: [D.sheet.x, D.magFront, D.sheetRise],
  };
  let sheetPose = SHEET.rest;
  {
    const [f0, f1, f2, f3] = T.feed;
    const [e0, e1, e2] = T.exit;
    const [s0, s1, s2, s3] = T.sheetRet;
    if (r >= s3 || r < f0) sheetPose = SHEET.rest;
    else if (r < f1) sheetPose = lerp(SHEET.rest, SHEET.out, io(uf(r, f0, f1)));
    else if (r < f2) sheetPose = lerp(SHEET.out, SHEET.glide, io(uf(r, f1, f2)));
    else if (r < f3) sheetPose = lerp(SHEET.glide, SHEET.bed, io(uf(r, f2, f3)));
    else if (r < e0) sheetPose = SHEET.bed;
    else if (r < e1) sheetPose = lerp(SHEET.bed, SHEET.exitGlide, io(uf(r, e0, e1)));
    else if (r < e2) sheetPose = lerp(SHEET.exitGlide, SHEET.tray, uf(r, e1, e2) ** 3);
    else if (r < s0) sheetPose = SHEET.tray;
    else if (r < s1) sheetPose = lerp(SHEET.tray, SHEET.rise, io(uf(r, s0, s1)));
    else if (r < s2) sheetPose = lerp(SHEET.rise, SHEET.flyBack, io(uf(r, s1, s2)));
    else sheetPose = lerp(SHEET.flyBack, SHEET.rest, io(uf(r, s2, s3)));
  }
  const sheet = sub(sheetPose, SHEET.rest);

  // ── plates ──────────────────────────────────────────────────────────────
  const plates = [];
  {
    const dur = T.plateDur, sOut = T.plateOut, sGlide = T.plateGlide;
    const e0 = T.exit[0];
    const pR = T.plateRet, pGap = T.plateRetGap, pDur = T.plateRetDur, pRise = T.plateRetRise, pFly = T.plateRetFly;
    const lastRet = pR + D.spots.length * pGap;
    D.spots.forEach((sp, b) => {
      const at = plan(sp, D.sheetAt);
      const px = at.x;
      const outY = D.stored.y + at.d + 2.4;
      const POSE = {
        rest: [px, D.stored.y, D.stored.z],
        out: [px, outY, D.stored.z],
        glide: [px, D.glideY, D.stored.z],
        placed: [px, at.y, D.plateBase + b * D.plateH],
      };
      const rideOff = [px - D.sheetAt.x, at.y - D.sheetAt.y, 0.8 + b * D.plateH];
      const trayPose = add(SHEET.tray, rideOff);
      const risePose = [px, at.y + (D.tray.y - D.sheetAt.y), D.stored.z];
      const flyPose = [px, outY, D.stored.z];
      let pose = POSE.rest;
      const start = T.plate0 + b * T.plateGap;
      if (r < start) pose = POSE.rest;
      else if (r < start + dur) {
        const p = r - start;
        if (p < sOut) pose = lerp(POSE.rest, POSE.out, io(uf(p, 0, sOut)));
        else if (p < sOut + sGlide) pose = lerp(POSE.out, POSE.glide, io(uf(p, sOut, sOut + sGlide)));
        else pose = lerp(POSE.glide, POSE.placed, io(uf(p, sOut + sGlide, dur)));
      } else if (r < e0) pose = POSE.placed;
      else if (r < lastRet) {
        const hs = pR + b * pGap;
        if (r < hs) pose = add(sheetPose, rideOff);
        else if (r < hs + pDur) {
          const p = r - hs;
          if (p < pRise) pose = lerp(trayPose, risePose, io(uf(p, 0, pRise)));
          else if (p < pRise + pFly) pose = lerp(risePose, flyPose, io(uf(p, pRise, pRise + pFly)));
          else pose = lerp(flyPose, POSE.rest, io(uf(p, pRise + pFly, pDur)));
        } else pose = POSE.rest;
      }
      plates.push(sub(pose, POSE.rest));
    });
  }

  // ── brayer: rolls the bed, climbs the stack, parks on its cradles ───────
  const brayer = { dx: 0, dz: 0 };
  {
    const spans = D.spots.map((sp, b) => {
      const p = plan(sp, D.sheetAt);
      return [p.x, p.x + p.w, D.plateBase + (b + 1) * D.plateH];
    });
    const climb = (ax) => {
      let h = 0;
      for (const [x1, x2, zt] of spans) {
        const ramp = Math.min(
          clamp01(((x2 + 6) - ax) / 2),
          clamp01((ax - (x1 - 7)) / 2)
        );
        h = Math.max(h, (zt - D.drum.sheetTop) * ramp);
      }
      return h;
    };
    const surface = (ax) => {
      let s = D.drum.bed;
      if (ax <= -48.6) s = D.drum.sheetTop;
      else if (ax <= -47.4) s = D.drum.bed + (D.drum.sheetTop - D.drum.bed) * ((-47.4 - ax) / 1.2);
      if (ax >= D.drum.cradleWest && ax <= D.drum.cradleEast) s = D.drum.cradleTop;
      return Math.max(s, D.drum.sheetTop + climb(ax));
    };
    const park = D.drum.x;
    const rollEnd = -102;
    let ax = park;
    let az = D.drum.rest;
    if (r >= T.roll[0]) {
      if (r < T.roll[1]) {
        const u = io(uf(r, T.roll[0], T.roll[1]));
        ax = park + u * -7;
        const low = surface(-30) + D.drum.r;
        az = D.drum.rest + u * (low - D.drum.rest);
      } else if (r < T.roll[2]) {
        ax = -30 - io(uf(r, T.roll[1], T.roll[2])) * 72;
        az = surface(ax) + D.drum.r;
      } else if (r < T.roll[3]) {
        ax = rollEnd + io(uf(r, T.roll[2], T.roll[3])) * 72;
        az = surface(ax) + D.drum.r;
      } else if (r < T.roll[4]) {
        const u = io(uf(r, T.roll[3], T.roll[4]));
        ax = -30 + u * 7;
        const low = surface(-30) + D.drum.r;
        az = low + u * (D.drum.rest - low);
      }
    }
    brayer.dx = ax - park;
    brayer.dz = az - D.drum.rest;
  }

  // ── readout ─────────────────────────────────────────────────────────────
  let phase = "ready";
  const [e0] = T.exit;
  if (r >= T.sheetRet[3]) phase = "ready";
  else if (r >= T.sheetRet[0]) phase = "sheet back in magazine";
  else if (r >= T.plateRet) phase = "reloading plates";
  else if (r >= e0) phase = "card to output tray";
  else if (r >= T.hold) phase = "card set";
  else if (r >= T.roll[0]) phase = "calendering layers";
  else if (r >= T.feed[3]) phase = "layers set";
  else if (r >= T.feed[0]) {
    for (let b = D.spots.length - 1; b >= 0; b--) {
      const s0 = T.plate0 + b * T.plateGap;
      if (r >= s0) { phase = `placing ${D.spots[b].name}`; break; }
    }
    if (phase === "ready") phase = "feeding sheet";
  }

  return { sheet, plates, brayer, count, phase };
}

// ── overlay slot fractions (projected card slot on the output tray) ───────
export function spotFractions() {
  const plan = SHEET_TRAY;
  const z = OFFSET + TOUR.tray.z + 0.8 + (SPOTS.length - 1) * PLATE_THICK + PLATE_THICK;
  const corners = [
    [plan.x, plan.y],
    [plan.x + plan.w, plan.y],
    [plan.x + plan.w, plan.y + plan.d],
    [plan.x, plan.y + plan.d],
  ].map(([x, y]) => k.iso([x, y, z], P));
  const xs = corners.map(([x]) => x);
  const ys = corners.map(([, y]) => y);
  const round = (v) => Math.round(v * 10000) / 10000;
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  return {
    left: round(left / WIDTH),
    top: round(top / HEIGHT),
    width: round((right - left) / WIDTH),
    height: round((bottom - top) / HEIGHT),
  };
}

// ── self-contained verify page script ────────────────────────────────────
export function livePageScript() {
  const axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((d) => {
    const m = k.translateAlong(P, d).match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
    return [Number(m[1]), Number(m[2])];
  });
  return `
    (function () {
      var AX = ${JSON.stringify(axes)};
      var TOUR = ${JSON.stringify(TOUR)};
      var tourFrames = ${tourFrames.toString()};
      var movers = {};
      ["sheet", "plate-0", "plate-1", "plate-2", "plate-3", "brayer"].forEach(function (id) {
        movers[id] = document.querySelector('[data-part="' + id + '"]');
      });
      var readout = document.querySelector('[data-readout]');
      var counter = document.querySelector('[data-count]');
      var apply = function (node, d) {
        if (!node) return;
        var x = d[0] * AX[0][0] + d[1] * AX[1][0] + d[2] * AX[2][0];
        var y = d[0] * AX[0][1] + d[1] * AX[1][1] + d[2] * AX[2][1];
        node.setAttribute("transform", "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ")");
      };
      var show = function (f) {
        apply(movers.sheet, f.sheet);
        f.plates.forEach(function (d, b) { apply(movers["plate-" + b], d); });
        apply(movers.brayer, [f.brayer.dx, 0, f.brayer.dz]);
        var text = String(f.count).padStart(3, "0");
        if (counter && counter.textContent !== text) counter.textContent = text;
        if (readout && readout.textContent !== f.phase) readout.textContent = f.phase;
      };
      var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      var t0 = null;
      var step = function (now) {
        if (t0 === null) t0 = now;
        show(tourFrames((now - t0) / 1000, TOUR));
        requestAnimationFrame(step);
      };
      if (reduced) show(tourFrames(5.0, TOUR));
      else requestAnimationFrame(step);
    })();
  `;
}
