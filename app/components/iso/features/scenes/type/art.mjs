// Feature 05 — Type controls.
// A steel composing stick on a printer's bench. The measure knee draws out along
// its pica rail, five metal sorts are set one by one into the channel, and the
// quoin key turns to lock the line against the fixed head. A type case and a
// pinned copy board stand behind; the tray holds the loose sorts.

import {
    DOTS,
    LINE,
    S,
    at,
    cyl,
    halo,
    k,
    labelPlate,
    part,
    sceneSvg,
    screenDelta,
    serifText,
    slab,
    stage,
    topLine,
    topTicks,
} from "../../scene-kit.mjs";

const WIDTH = 680;
const HEIGHT = 420;

/* ------------------------------------------------------------------ bench */

const BENCH = { x: -150, y: -60, w: 300, d: 120, r: 6 };
const TOP_Z = 26;
const TOP_H = 9;
const DECK = TOP_Z + TOP_H; // 35

const LEGS = [
    { x: -137, y: -47, w: 17, d: 17, r: 1.6 },
    { x: 120, y: -47, w: 17, d: 17, r: 1.6 },
    { x: -137, y: 30, w: 17, d: 17, r: 1.6 },
    { x: 120, y: 30, w: 17, d: 17, r: 1.6 },
];

const APRON_FRONT = { x: -140, y: 52, w: 280, d: 8, r: 1 };
const APRON_SIDE = { x: 132, y: -52, w: 8, d: 104, r: 1 };
const DRAWER = { x: -16, y: 59.4, w: 66, d: 3.6, r: 1.2 };
const PLANING = { x: 62, y: 22, w: 32, d: 24, r: 2 };

/* ------------------------------------------------------------------- stick */

const CH = { x: -116, y: -31, w: 224, d: 38, r: 1.4 };
const BACK = { x: -116, y: -31, w: 224, d: 6, r: 1 };
const LIP = { x: -116, y: 1, w: 224, d: 6, r: 1 };
const BED = { x: -113, y: -24.5, w: 219, d: 25, r: 0.5 };
const RAIL = { x: -116, y: 11, w: 224, d: 10, r: 1 };
const SCALE = { x: -112, y: 12.2, w: 206, d: 6.2, r: 0.4 };
const HEAD = { x: -142, y: -36, w: 26, d: 62, r: 1.2 };
const HEAD_CAP = { x: -144, y: -38, w: 32, d: 68, r: 2 };
const HEAD_Z = DECK;
const HEAD_TOP = 52;
const HEAD_CAP_TOP = 55;
const HEAD_NUT = { x: -129, y: -6 };

// The knee starts in against the head, draws out to the measure, and finishes
// flush against the quoin that locks the set line.
const KNEE_SET = 22;
const KNEE_HOME = -24;
const KNEE_TRAVEL = KNEE_SET - KNEE_HOME;
const KNEE = { x: KNEE_SET, y: -33, w: 9, d: 25, r: 1.2 };
const KNEE_CAP = { x: KNEE_SET - 1.4, y: -35, w: 11.8, d: 30, r: 1.6 };
const KNEE_FOOT = { x: KNEE_SET + 0.8, y: -8, w: 8.4, d: 38, r: 1.2 };
const CLAMP_X = KNEE_SET + 4.6;
const CLAMP_Y = -28;

const QUOIN = { x: 3.0, y: -24, w: 18.6, d: 23 };
const QUOIN_TOP_Z = 46.4;
const QUOIN_TOP_H = 2.8;
const KEY_Z = QUOIN_TOP_Z + QUOIN_TOP_H; // 51.6
const KEY_CX = 12.3;
const KEY_CY = -12;

/* ------------------------------------------------------------- type case */

const RACK_IN = { x: 63.5, y: -56, w: 73, d: 20, r: 0.6 };
const SHELF_Z = [42, 66, 90];
const RACK_TOP = 114;
const RACK_CAP = { x: 56, y: -59, w: 88, d: 27, r: 1.6 };
const RACK_SIDES = [
    { x: 58.5, y: -58.2, w: 5, d: 23.6, r: 0.8 },
    { x: 136.5, y: -58.2, w: 5, d: 23.6, r: 0.8 },
];
const BOARD = { x: 68, y: -60, w: 66, d: 3.2, r: 1.2 };
const BOARD_TOP = 136;
const BOARD_FACE = -56.74;

/* -------------------------------------------------------------------- tray */

const TRAY = { x: -116, y: 24, w: 172, d: 34, r: 2 };
const TRAY_FLOOR = 36.6;
const TRAY_FRONT = { x: -116, y: 53, w: 172, d: 5, r: 1 };
const TRAY_BACK = { x: -116, y: 24, w: 172, d: 5, r: 1 };
const TRAY_LEFT = { x: -116, y: 24, w: 5, d: 34, r: 1 };
const TRAY_RIGHT = { x: 51, y: 24, w: 5, d: 34, r: 1 };

/* ------------------------------------------------------------------- sorts */

// Final settings in the channel. Every sort has a body; the two letters carry a
// raised lit face with a serif glyph, the spacing sorts stay plain and low.
const SORTS = [
    { name: "sort-A", x: -114.2, w: 36, h: 12, cap: { w: 30, glyph: "A", size: 20, baseline: -7.2 }, trayX: -86 },
    { name: "sort-g", x: -78.2, w: 34, h: 12, cap: { w: 28, glyph: "g", size: 18.5, baseline: -11.0 }, trayX: -50 },
    { name: "sort-thin", x: -44.2, w: 8, h: 10, trayX: -24 },
    { name: "sort-space", x: -36.2, w: 12, h: 9.4, trayX: -9 },
    { name: "sort-quad", x: -24.2, w: 26.8, h: 8.2, trayX: 12 },
];

const SORT_BASE_Z = 40;
const SORT_Y = -12;
const SORT_CAP_Z = 52;
const SORT_CAP_H = 2.4;

/* -------------------------------------------------------------- projection */

const points = [
    ...k.boxCorners(BENCH, 0, DECK),
    ...k.boxCorners({ x: -146, y: -60, w: 34, d: 70 }, 35, 59),
    ...k.boxCorners({ x: 56, y: -60, w: 88, d: 27 }, 35, BOARD_TOP),
    ...k.boxCorners({ x: KNEE_HOME - 2, y: -36, w: KNEE_TRAVEL + 18, d: 70 }, 35, 63),
    ...k.boxCorners(QUOIN, 40, 56),
    ...k.boxCorners({ x: 62, y: 22, w: 32, d: 24 }, 35, 45),
    [KNEE_HOME - 12, -36, 63],
    [-148, -60, 0],
    [148, 60, 0],
];
const P = stage(WIDTH, HEIGHT, points, { pad: 24 });

// The knee is authored at the measure; the pose starts it home at the head.
const kneeHome = screenDelta(P, [KNEE_HOME - KNEE_SET, 0, 0]);
const quoinSlide = screenDelta(P, [-2.0, 0, 0]);
const clampPivot = at(P, [CLAMP_X, CLAMP_Y, 62.1]);
const keyPivot = at(P, [KEY_CX, KEY_CY, KEY_Z + 1.8]);
const ink = "var(--anatomy-shade-0)";

/* ------------------------------------------------------------------ helpers */

const solid = (plan, z, height, { steps = 5, bevel = 0.35, tone = "mid", ...rest } = {}) =>
    S(slab(plan, z, height, P, Math.max(3, steps - 1), bevel >= 0.6 ? bevel : 0), { tone, ...rest });
const pipe = (cx, cy, r, z, height, { steps = 14, bevel = 0.25, tone = "hi", ...rest } = {}) =>
    S(cyl(cx, cy, r, z, height, P, Math.max(8, Math.round(steps * 0.7)), bevel), { tone, ...rest });
const tl = (from, to, z, tone = "mid") => LINE(topLine(P, from, to, z), { tone });
const line3 = (pts, tone = "lo") => LINE(k.pathOf(pts.map((p) => k.iso(p, P))), { tone });
const rectFaceY = (y, x0, x1, z0, z1, tone = "lo") =>
    line3([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], [x0, y, z0]], tone);
const rectFaceX = (x, y0, y1, z0, z1, tone = "lo") =>
    line3([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1], [x, y0, z0]], tone);
const dotAt = (point, size = 0.45, tone = "hi") => DOTS([at(P, point)], { size, tone });
const glyph = (point, z, text, size) =>
    serifText(P, point, z, text, { size, fill: ink, anchor: "middle" }).replace("<text ", '<text font-weight="620" ');

const blankSort = (x, y, w, d, z, h, tone = "hi") =>
    solid({ x, y, w, d, r: 0.4 }, z, h, { steps: 4, bevel: 0.2, tone }) +
    tl([x + 1.3, y + d / 2], [x + w - 1.3, y + d / 2], z + h + 0.03, "lo");

const sortArt = (sort) => {
    const pieces = [];
    const cx = sort.x + sort.w / 2;
    const body = { x: sort.x, y: -24, w: sort.w, d: 24, r: 0.5 };
    pieces.push(solid(body, SORT_BASE_Z, sort.h, { steps: 5, bevel: 0.3, tone: "mid" }));

    // The nick: a closed notch on the front shoulder, not a line that stops.
    const nickW = Math.min(8, sort.w * 0.34);
    const nick = { x: cx - nickW * 0.5, y: -4.2, w: nickW, d: 1.3, r: 0.25 };
    pieces.push(solid(nick, SORT_BASE_Z + sort.h + 0.01, 0.06, { steps: 3, bevel: 0, tone: "lo", crease: "none", flat: true }));

    if (sort.cap) {
        const capPlan = { x: cx - sort.cap.w / 2, y: -22.2, w: sort.cap.w, d: 17.4, r: 0.5 };
        pieces.push(solid(capPlan, SORT_CAP_Z, SORT_CAP_H, { steps: 5, bevel: 0.4, tone: "hi", lit: true }));
        pieces.push(glyph([cx, sort.cap.baseline], SORT_CAP_Z + SORT_CAP_H + 0.05, sort.cap.glyph, sort.cap.size));
    } else {
        pieces.push(tl([sort.x + 1.6, -4.8], [sort.x + sort.w - 1.6, -4.8], SORT_BASE_Z + sort.h + 0.04, "lo"));
    }
    return pieces.join("");
};

/* --------------------------------------------------------------------- draw */

const drawBench = () => {
    const out = [];
    out.push(halo(BENCH, 0, DECK, P));

    const leg = (item, footed = true) => {
        const foot = { x: item.x - 3, y: item.y - 3, w: item.w + 6, d: item.d + 6, r: 2 };
        return (
            (footed ? solid(foot, 0, 2.6, { steps: 5, bevel: 0.5, tone: "mid" }) : "") +
            solid(item, 2.6, TOP_Z - 2.6, { steps: 4, bevel: 0.5, tone: "hi" }) +
            tl([item.x + 2, item.y + item.d / 2], [item.x + item.w - 2, item.y + item.d / 2], 3.1, "lo") +
            dotAt([item.x + item.w / 2, item.y + item.d / 2, TOP_Z + 0.06], 0.42, "lo")
        );
    };
    out.push(leg(LEGS[0], false) + leg(LEGS[1], false));

    out.push(leg(LEGS[2]) + leg(LEGS[3]));

    // Aprons and the shallow drawer in the front rail.
    out.push(solid(APRON_SIDE, 15.4, 10.6, { steps: 4, bevel: 0.5, tone: "hi" }));
    out.push(solid(APRON_FRONT, 15.4, 10.6, { steps: 4, bevel: 0.5, tone: "hi" }));
    out.push(solid(DRAWER, 17, 7.6, { steps: 4, bevel: 0.5, tone: "hi" }));
    out.push(rectFaceY(63.05, -12, 62, 18.8, 23.4, "lo"));
    out.push(line3([[13, 63.06, 21.2], [33, 63.06, 21.2]], "hi"));
    out.push(dotAt([-12.2, 62.4, 22.4], 0.4, "lo") + dotAt([62.2, 62.4, 22.4], 0.4, "lo"));

    // Bench top, an inlaid edge rule and the four hold-down screws.
    out.push(solid(BENCH, TOP_Z, TOP_H, { steps: 8, bevel: 1.1, tone: "hi" }));
    out.push(
        LINE(k.planOutline({ x: -142, y: -52, w: 284, d: 108, r: 4 }, DECK + 0.02, P, 6), { tone: "mid" }),
    );
    out.push(tl([-142, 54], [142, 54], DECK + 0.035, "mid"));
    out.push(tl([-142, 48.5], [-121, 48.5], DECK + 0.035, "lo"));
    out.push(dotAt([-138, 52, DECK + 0.04], 0.5, "lo") + dotAt([136, 52, DECK + 0.04], 0.5, "lo"));

    return out.join("");
};

const drawRack = () => {
    const out = [];
    // Plinth, a solid back board and the shelf stacks of a type case cabinet.
    out.push(solid({ x: 56, y: -59.4, w: 88, d: 26.4, r: 2 }, DECK, 2.2, { steps: 5, bevel: 0.5, tone: "hi" }));
    out.push(solid({ x: RACK_IN.x + 1.4, y: -58.4, w: RACK_IN.w - 2.8, d: 1.0, r: 0.4 }, DECK + 2.2, RACK_TOP - DECK - 2.2, { steps: 3, bevel: 0, tone: "lo" }));
    for (const z of SHELF_Z) {
        out.push(solid({ x: RACK_IN.x, y: RACK_IN.y, w: RACK_IN.w, d: RACK_IN.d, r: 0.6 }, z, 2.2, { steps: 4, bevel: 0.3, tone: "hi" }));
        // The compartment grid, ruled on the case tray floor.
        for (const dx of [18.5, 36.5, 54.5]) {
            out.push(tl([RACK_IN.x + dx, RACK_IN.y + 2], [RACK_IN.x + dx, -37.5], z + 2.24, "lo"));
        }
        out.push(tl([RACK_IN.x + 2, -47], [RACK_IN.x + RACK_IN.w - 2, -47], z + 2.24, "mid"));
    }
    // Middle tray: two blank sorts standing in their compartments.
    out.push(blankSort(69, -51, 13, 10, 68.4, 7.4));
    out.push(blankSort(87, -51, 15, 10, 68.4, 8));
    // Top tray: one spare sort.
    out.push(blankSort(122, -51, 12, 10, 92.3, 7.2, "mid"));
    // The sides are last so their near faces sit in front of the case trays.
    out.push(solid(RACK_SIDES[0], DECK + 2.2, RACK_TOP - DECK - 2.2, { steps: 4, bevel: 0.4, tone: "hi" }));
    out.push(solid(RACK_SIDES[1], DECK + 2.2, RACK_TOP - DECK - 2.2, { steps: 4, bevel: 0.4, tone: "hi" }));
    for (const z of SHELF_Z) {
        out.push(line3([[141.56, -54, z + 1.2], [141.56, -37, z + 1.2]], "mid"));
    }
    out.push(rectFaceX(141.56, -52, -40, 50, 64, "lo"));
    out.push(rectFaceX(141.56, -52, -40, 74, 87, "lo"));
    out.push(line3([[141.56, -46, 37], [141.56, -46, 112]], "faint"));
    out.push(dotAt([141.58, -51, 65.2], 0.35, "lo") + dotAt([141.58, -51, 88.2], 0.35, "lo"));
    // Top cap and the copy board pinned above it.
    out.push(solid(BOARD, RACK_TOP - 9, BOARD_TOP - RACK_TOP + 9, { steps: 4, bevel: 0.4, tone: "hi", flat: true }));
    out.push(solid(RACK_CAP, RACK_TOP, 2.4, { steps: 5, bevel: 0.5, tone: "hi" }));
    out.push(tl([60, -52], [140, -52], RACK_TOP + 2.43, "mid"));
    out.push(dotAt([61.5, -37, RACK_TOP + 2.45], 0.4, "lo") + dotAt([139.5, -37, RACK_TOP + 2.45], 0.4, "lo"));

    // A ruled copy sheet clipped to the near face.
    out.push(rectFaceY(BOARD_FACE, 73.5, 128.5, 117.5, 133.5, "hi"));
    out.push(rectFaceY(BOARD_FACE, 76, 126, 120, 131.5, "lo"));
    for (const z of [123, 126.5, 130]) {
        out.push(line3([[78, BOARD_FACE, z], [z === 130 ? 114 : 122, BOARD_FACE, z]], "lo"));
    }
    out.push(line3([[78, BOARD_FACE, 121.8], [96, BOARD_FACE, 121.8]], "faint"));
    out.push(solid({ x: 66, y: -56.8, w: 70, d: 0.9, r: 0.3 }, BOARD_TOP - 1.4, 1.4, { steps: 3, bevel: 0.1, tone: "hi" }));

    return out.join("");
};

const drawStick = () => {
    const out = [];
    // Support pads and the channel proper.
    out.push(solid({ x: -118, y: -33, w: 9, d: 43, r: 1.4 }, DECK, 1.2, { steps: 4, bevel: 0.25, tone: "mid" }));
    out.push(solid({ x: 102, y: -33, w: 9, d: 43, r: 1.4 }, DECK, 1.2, { steps: 4, bevel: 0.25, tone: "mid" }));
    out.push(solid(CH, DECK, 5, { steps: 6, bevel: 0.6, tone: "hi" }));
    out.push(solid(BED, SORT_BASE_Z + 0.01, 0.12, { steps: 4, bevel: 0, tone: "lo", crease: "none", flat: true }));
    out.push(tl([-110, -23.2], [102, -23.2], SORT_BASE_Z + 0.17, "lo"));
    out.push(tl([-110, -1.2], [102, -1.2], SORT_BASE_Z + 0.17, "lo"));
    out.push(solid(BACK, DECK + 5, 9, { steps: 5, bevel: 0.5, tone: "hi" }));
    out.push(tl([-112, -28], [105, -28], DECK + 14.03, "mid"));
    out.push(solid({ x: 104, y: -33, w: 5.4, d: 44, r: 1.4 }, DECK, 8.6, { steps: 4, bevel: 0.4, tone: "hi" }));
    out.push(dotAt([106.7, -27, DECK + 8.64], 0.4, "lo") + dotAt([106.7, 4, DECK + 8.64], 0.4, "lo"));

    out.push(solid(LIP, DECK + 5, 2.5, { steps: 4, bevel: 0.3, tone: "hi" }));
    out.push(tl([-112, 4], [104, 4], DECK + 7.54, "mid"));

    // Rail, inlaid pica scale and its bed screws.
    out.push(solid(RAIL, DECK, 4, { steps: 5, bevel: 0.5, tone: "hi" }));
    out.push(solid(SCALE, DECK + 4, 0.24, { steps: 3, bevel: 0, tone: "mid", crease: "none", flat: true }));
    const ticks = topTicks(P, {
        from: -108,
        to: 104,
        step: 4,
        every: 5,
        edge: 12.35,
        z: DECK + 4.27,
        lengths: [2.2, 4.6],
        tone: "lo",
    });
    out.push(ticks.all);
    for (const x of [-104, -84, -64, -44, -24, -4, 16, 36, 56, 76, 96]) {
        out.push(tl([x, 12.35], [x, 18.4], DECK + 4.29, "hi"));
    }
    out.push(tl([-109, 18.05], [101, 18.05], DECK + 4.27, "mid"));
    out.push(
        DOTS(
            [
                [-92, 19.4],
                [-42, 19.4],
                [18, 19.4],
                [78, 19.4],
            ].map(([x, y]) => at(P, [x, y, DECK + 4.28])),
            { size: 0.45, tone: "lo" },
        ),
    );

    // Fixed head: a heavy stop with a machined plate, ruled face and clamp nut.
    out.push(solid(HEAD, HEAD_Z, HEAD_TOP - HEAD_Z, { steps: 5, bevel: 0.7, tone: "hi" }));
    out.push(solid(HEAD_CAP, HEAD_TOP, HEAD_CAP_TOP - HEAD_TOP, { steps: 5, bevel: 0.7, tone: "hi" }));
    out.push(rectFaceY(25.98, -139, -119, 39, 50.5, "lo"));
    out.push(tl([-129, -34], [-129, 26], HEAD_CAP_TOP + 0.04, "faint"));
    out.push(dotAt([-117.9, -24, 45.4], 0.4, "lo") + dotAt([-117.9, 9, 45.4], 0.4, "lo"));
    out.push(dotAt([-133, -28, HEAD_CAP_TOP + 0.04], 0.42, "lo") + dotAt([-133, 20, HEAD_CAP_TOP + 0.04], 0.42, "lo"));
    out.push(pipe(HEAD_NUT.x, HEAD_NUT.y, 4.6, HEAD_CAP_TOP, 2.6, { steps: 14, bevel: 0.2, tone: "hi" }));
    out.push(LINE(k.knurl(HEAD_NUT.x, HEAD_NUT.y, 4.6, HEAD_CAP_TOP, HEAD_CAP_TOP + 2.6, 18, P, 0.35), { tone: "lo" }));

    return out.join("");
};

const drawTray = () => {
    const out = [];
    out.push(solid(TRAY, DECK, 1.6, { steps: 6, bevel: 0.4, tone: "hi" }));
    out.push(LINE(k.planOutline({ x: -110, y: 28.8, w: 160, d: 25.4, r: 0.5 }, TRAY_FLOOR + 0.16, P, 3), { tone: "mid" }));
    out.push(solid(TRAY_BACK, TRAY_FLOOR, 4.4, { steps: 4, bevel: 0.3, tone: "hi" }));
    out.push(solid(TRAY_LEFT, TRAY_FLOOR, 4.2, { steps: 4, bevel: 0.3, tone: "mid" }));
    out.push(solid(TRAY_RIGHT, TRAY_FLOOR, 4.2, { steps: 4, bevel: 0.3, tone: "hi" }));
    out.push(tl([-112, 26.2], [50, 26.2], TRAY_FLOOR + 4.43, "mid"));
    out.push(dotAt([-40, 26.5, 41.05], 0.35, "lo") + dotAt([20, 26.5, 41.05], 0.35, "lo"));
    // A composing rule waits on the back rail of the tray.
    out.push(solid({ x: -108, y: 24.5, w: 126, d: 3.6, r: 0.4 }, TRAY_FLOOR + 4.4, 0.9, { steps: 3, bevel: 0.12, tone: "hi" }));
    const ruleTicks = topTicks(P, {
        from: -104,
        to: 14,
        step: 4,
        every: 5,
        edge: 24.7,
        z: TRAY_FLOOR + 5.33,
        lengths: [0.9, 2],
        tone: "lo",
    });
    out.push(ruleTicks.all);
    out.push(dotAt([-103, 26.5, TRAY_FLOOR + 4.74], 0.3, "lo"));
    // A divider makes the right-hand end a composing slot.
    out.push(solid({ x: 28, y: 29, w: 1.4, d: 25, r: 0.2 }, TRAY_FLOOR, 1.8, { steps: 3, bevel: 0.1, tone: "mid" }));
    out.push(blankSort(30, 32, 9, 18, TRAY_FLOOR, 8, "hi"));
    out.push(solid(PLANING, DECK, 9, { steps: 5, bevel: 0.9, tone: "hi" }));
    out.push(tl([64, 40], [94, 40], DECK + 9.05, "lo"));
    out.push(dotAt([66, 31, DECK + 9.06], 0.4, "lo") + dotAt([90, 31, DECK + 9.06], 0.4, "lo"));
    out.push(labelPlate(P, { point: [82, 51], z: DECK + 0.04, width: 34, depth: 7, text: "OG TYPE", size: 2.6, tone: "mid" }));

    // A pica gauge on the right-hand bench top.
    out.push(solid({ x: 96, y: -5, w: 40, d: 8, r: 0.6 }, DECK, 1.1, { steps: 3, bevel: 0.2, tone: "hi" }));
    const benchTicks = topTicks(P, {
        from: 98,
        to: 134,
        step: 3,
        every: 5,
        edge: -5,
        z: DECK + 1.13,
        lengths: [1.4, 3],
        tone: "lo",
    });
    out.push(benchTicks.all);
    out.push(tl([98, 1.6], [134, 1.6], DECK + 1.14, "faint"));

    return out.join("");
};

const drawTrayFront = () => {
    const out = [];
    out.push(solid(TRAY_FRONT, TRAY_FLOOR, 4.4, { steps: 4, bevel: 0.35, tone: "hi" }));
    out.push(tl([-110, 55.5], [28, 55.5], TRAY_FLOOR + 4.43, "hi"));
    out.push(dotAt([-100, 55.5, TRAY_FLOOR + 4.45], 0.38, "lo") + dotAt([30, 55.5, TRAY_FLOOR + 4.45], 0.38, "lo"));
    return out.join("");
};

const drawQuoin = () => {
    const body = [];
    // A fixed bottom wedge; the driven top plate rides on it once the line is set.
    const baseRing = [
        [QUOIN.x, QUOIN.y],
        [QUOIN.x + QUOIN.w, QUOIN.y + 6.5],
        [QUOIN.x + QUOIN.w, QUOIN.y + 16],
        [QUOIN.x, QUOIN.y + QUOIN.d],
    ];
    body.push(S(k.extrude(baseRing, SORT_BASE_Z, 6.4, P, { convex: true, bevel: 0.4 }), { tone: "mid" }));
    body.push(tl([QUOIN.x + 2, QUOIN.y + QUOIN.d], [QUOIN.x + QUOIN.w - 2, QUOIN.y + 16.5], 46.44, "faint"));

    const topRing = [
        [5.6, -22.6],
        [21.0, -17.4],
        [21.0, -8.6],
        [5.6, -3.4],
    ];
    const quoinTop = [];
    quoinTop.push(S(k.extrude(topRing, QUOIN_TOP_Z, QUOIN_TOP_H, P, { convex: true, bevel: 0.35 }), { tone: "hi" }));
    quoinTop.push(tl([6.8, -6], [19.8, -10.4], QUOIN_TOP_Z + QUOIN_TOP_H + 0.02, "mid"));
    quoinTop.push(dotAt([8, -19, QUOIN_TOP_Z + QUOIN_TOP_H + 0.03], 0.35, "lo"));
    quoinTop.push(pipe(KEY_CX, KEY_CY, 1.4, KEY_Z, 2.3, { steps: 12, bevel: 0.1, tone: "mid" }));
    const key = [
        pipe(KEY_CX, KEY_CY, 2.6, KEY_Z + 1.6, 0.5, { steps: 16, bevel: 0.1, tone: "hi", crease: "lo" }),
        solid({ x: KEY_CX - 1.8, y: KEY_CY - 9.4, w: 3.6, d: 18.8, r: 0.8 }, KEY_Z + 2.1, 1.5, { steps: 4, bevel: 0.25, tone: "hi" }),
        pipe(KEY_CX, KEY_CY - 8.2, 2.3, KEY_Z + 2.1, 1.5, { steps: 12, bevel: 0.2, tone: "hi" }),
        pipe(KEY_CX, KEY_CY + 8.2, 2.3, KEY_Z + 2.1, 1.5, { steps: 12, bevel: 0.2, tone: "hi" }),
    ].join("");
    quoinTop.push(
        part("quoin-key", key, {
            pivot: keyPivot,
            pose: [
                [0, 0, 0, 0],
                [5.15, 0, 0, 0],
                [6.05, 0, 0, 55, "out"],
                [8.9, 0, 0, 55],
                [9.35, 0, 0, 0, "inout"],
                [11, 0, 0, 0],
            ],
        }),
    );
    body.push(
        part("quoin-plate", quoinTop.join(""), {
            pose: [
                [0, 0, 0, 0],
                [5.15, 0, 0, 0],
                [5.95, quoinSlide[0], quoinSlide[1], 0, "out"],
                [8.9, quoinSlide[0], quoinSlide[1], 0],
                [9.35, 0, 0, 0, "inout"],
                [11, 0, 0, 0],
            ],
        }),
    );

    // The loose quoin is only on the stick while a line is being locked.
    return part("quoin", body.join(""), {
        alpha: [
            [0, 0],
            [4.75, 0],
            [5.05, 1, "out"],
            [9.3, 1],
            [9.55, 0, "inout"],
        ],
    });
};

const drawKnee = () => {
    const inner = [];
    // Bridge, top plate and the shoe that reads the pica scale.
    inner.push(solid(KNEE, DECK + 4, 14.5, { steps: 5, bevel: 0.6, tone: "hi" }));
    inner.push(solid(KNEE_FOOT, 39.2, 4.2, { steps: 4, bevel: 0.4, tone: "hi" }));
    inner.push(dotAt([KNEE_SET + 7.2, -4, 43.44], 0.35, "lo") + dotAt([KNEE_SET + 7.2, 24, 43.44], 0.35, "lo"));
    inner.push(solid(KNEE_CAP, 53.5, 2.9, { steps: 5, bevel: 0.7, tone: "hi" }));
    inner.push(dotAt([KNEE_SET + 7.2, -28, 56.44], 0.4, "lo") + dotAt([KNEE_SET + 7.2, -12, 56.44], 0.4, "lo"));

    // Clamp screw rising through the knee cap, turned down once the knee is set.
    inner.push(pipe(CLAMP_X, CLAMP_Y, 2.4, 56.4, 3.2, { steps: 12, bevel: 0.15, tone: "mid" }));
    const clampHead = [
        pipe(CLAMP_X, CLAMP_Y, 5.0, 59.6, 3.0, { steps: 16, bevel: 0.4, tone: "hi", crease: "lo" }),
        LINE(k.knurl(CLAMP_X, CLAMP_Y, 5.0, 59.6, 62.6, 16, P, 0.4), { tone: "lo" }),
        LINE(
            k.pathOf([
                k.iso([CLAMP_X, CLAMP_Y - 3.4, 62.66], P),
                k.iso([CLAMP_X, CLAMP_Y + 3.4, 62.66], P),
            ]),
            { tone: "lo" },
        ),
    ].join("");
    inner.push(
        part("clamp-head", clampHead, {
            pivot: clampPivot,
            pose: [
                [0, 0, 0, 0],
                [1.9, 0, 0, 0],
                [2.2, 0, 0, 105, "out"],
                [9.3, 0, 0, 105],
                [9.55, 0, 0, 0, "inout"],
            ],
        }),
    );

    return part("measure-knee", inner.join(""), {
        pose: [
            [0, kneeHome[0], kneeHome[1], 0],
            [0.45, kneeHome[0], kneeHome[1], 0],
            [1.65, 0, 0, 0, "out"],
            [9.9, 0, 0, 0],
            [10.7, kneeHome[0], kneeHome[1], 0, "inout"],
            [11, kneeHome[0], kneeHome[1], 0],
        ],
    });
};

const sortOffset = (sort) => {
    const [ax, ay] = at(P, [sort.trayX, 41, TRAY_FLOOR + 0.02]);
    const [bx, by] = at(P, [sort.x + sort.w / 2, SORT_Y, SORT_BASE_Z]);
    return [ax - bx, ay - by];
};

const drawSorts = () => {
    const out = [];
    const starts = [2.55, 2.95, 3.35, 3.75, 4.15];
    const resets = [8.9, 9.05, 9.2, 9.35, 9.5];
    SORTS.forEach((sort, index) => {
        const [ox, oy] = sortOffset(sort);
        const t0 = starts[index];
        const tr = resets[index];
        const pose = [
            [0, ox, oy, 0],
            [t0, ox, oy, 0],
            [t0 + 0.32, ox * 0.56, oy * 0.56 - 16, 0, "inout"],
            [t0 + 0.62, 0, -4.6, 0, "out"],
            [t0 + 0.82, 0, 0, 0, "inout"],
            [tr, 0, 0, 0],
            [tr + 0.2, ox * 0.3, oy * 0.3 - 13, 0, "inout"],
            [tr + 0.58, ox, oy, 0, "inout"],
            [10.98, ox, oy, 0],
        ];
        out.push(part(sort.name, sortArt(sort), { pose }));
    });
    return out.join("");
};

const body = [
    "<!--bench-->",
    drawBench(),
    "<!--rack-->",
    drawRack(),
    "<!--stick-->",
    drawStick(),
    "<!--tray-->",
    drawTray(),
    "<!--sorts-->",
    drawSorts(),
    "<!--quoin-->",
    drawQuoin(),
    "<!--knee-->",
    drawKnee(),
    "<!--front-->",
    drawTrayFront(),
].join("");

const label = "Letterpress composing stick on a printer's bench: cap A and lowercase g set against the sliding measure knee";

const art = {
    width: WIDTH,
    height: HEIGHT,
    label,
    loop: 11,
    offset: 0.8,
    still: 6.4,
    svg: sceneSvg({
        width: WIDTH,
        height: HEIGHT,
        label,
        loop: 11,
        offset: 0.8,
        still: 6.4,
        body,
    }),
};

export default art;
