// Feature 01 — Layer stack.
// A vacuum sheet stacker: five poster sheets registered in a corner jig under a
// low gantry. The picker lifts the top sheet clear of the stack, holds it, and
// sets it back down. The lift is the layer reorder, made physical.

import {
    DOTS,
    LINE,
    S,
    at,
    cyl,
    feet,
    halo,
    k,
    labelPlate,
    part,
    sceneSvg,
    screenDelta,
    screws,
    seam,
    slab,
    stage,
    topLine,
    topText,
    topTicks,
} from "../../scene-kit.mjs";

const WIDTH = 680;
const HEIGHT = 420;

const BASE = { x: -80, y: -48, w: 160, d: 96, r: 4 };
const BASE_Z = 3;
const BASE_H = 6;
const DECK = BASE_Z + BASE_H;

const POST = { x: -66, y: -40, w: 11, d: 11, r: 1.4 };
const POST_RIGHT = { ...POST, x: 55 };
const RAIL = { x: -68, y: -40, w: 136, d: 9, r: 2 };
const CARRIAGE = { x: -14, y: -42, w: 28, d: 13, r: 2.2 };
const CANTILEVER = { x: -5, y: -40, w: 10, d: 48, r: 1.4 };
const BUSHING = { x: -9, y: -9, w: 18, d: 18, r: 2.4 };
const ARM = { x: 0, y: 0 };
const HEAD_R = 6.6;
const SHEET = { x: -40, y: -24, w: 80, d: 48, r: 1.4 };
const SHEET_T = 1.8;
const STACK_Z = DECK;
const TOP_Z = STACK_Z + 4 * SHEET_T;

const INK = { x: -33, y: -16, w: 21, d: 4.4, r: 0.5 };
const INK_LINE = { x: -33, y: -7, w: 29, d: 1.8, r: 0.3 };
const INK_RULE = { x: -33, y: 12, w: 15, d: 1.1, r: 0.2 };
const INK_FOOT = { x: 16, y: 16, w: 12, d: 1.6, r: 0.2 };

const points = [
    ...k.boxCorners(BASE, 0, DECK),
    ...k.boxCorners(POST, DECK, 41),
    ...k.boxCorners(POST_RIGHT, DECK, 41),
    ...k.boxCorners(RAIL, 35, 39),
    ...k.boxCorners(CARRIAGE, 39, 45),
    ...k.boxCorners(CANTILEVER, 32, 36),
    ...k.boxCorners(BUSHING, 30, 36),
    ...k.boxCorners(SHEET, STACK_Z, TOP_Z),
    [0, 0, 48],
    [8, -36, 49],
];

const P = stage(WIDTH, HEIGHT, points, { pad: 34 });
const lift = screenDelta(P, [0, 4, 9]);
const restCap = 36.4;

const drawBase = () => {
    const parts = [];
    parts.push(halo(BASE, 0, DECK, P));
    parts.push(feet(P, BASE, { z: 0, height: 3, inset: 12, w: 14, d: 14, tone: "mid" }));
    parts.push(S(slab(BASE, BASE_Z, BASE_H, P, 10, 0.8), { tone: "mid" }));

    // Engraved deck rule along the near edge, stopping clear of the label.
    const ticks = topTicks(P, { from: -60, to: 30, step: 5, every: 5, edge: 42, z: DECK + 0.02, lengths: [1.6, 3.2] });
    parts.push(ticks.all);
    parts.push(LINE(topLine(P, [-62, 42], [32, 42], DECK + 0.02), { tone: "faint" }));
    parts.push(labelPlate(P, { point: [54, 34], z: DECK + 0.02, width: 26, depth: 8, text: "OG / 02", size: 2.4, tone: "lo" }));
    parts.push(screws(P, BASE, { z: DECK + 0.02, inset: 8, r: 1.2, height: 0.5 }));
    parts.push(seam(P, BASE, DECK - 1.4, 10));
    return parts.join("");
};

const drawGantry = () => {
    const parts = [];
    const postPad = (plan) => {
        const pad = { x: plan.x - 3, y: plan.y - 3, w: plan.w + 6, d: plan.d + 6, r: 1.6 };
        return S(slab(pad, DECK, 2.4, P, 6), { tone: "mid" }) + S(slab(plan, DECK + 2.4, 27.6, P, 8), { tone: "mid" });
    };
    parts.push(postPad(POST) + postPad(POST_RIGHT));

    // Ruler up the left post's inner face.
    const postTicks = k.sideTicks(POST.x + 2.5, POST.x + POST.w - 2.5, 2.2, 2, POST.y + POST.d, 36, [1.2, 2.4], P, "x");
    parts.push(LINE(postTicks.minor, { tone: "faint" }) + LINE(postTicks.major, { tone: "lo" }));

    // Top caps with a small set screw.
    for (const post of [POST, POST_RIGHT]) {
        parts.push(S(slab({ x: post.x - 1, y: post.y - 1, w: post.w + 2, d: post.d + 2, r: 1.2 }, 39, 2.2, P, 6), { tone: "mid" }));
        parts.push(DOTS([at(P, [post.x + post.w / 2, post.y + post.d / 2, 41.3])], { size: 0.5, tone: "lo" }));
    }

    // Bridge rail with a wear strip and its end plugs.
    parts.push(S(slab(RAIL, 35, 4, P, 10, 0.5), { tone: "mid" }));
    parts.push(LINE(topLine(P, [RAIL.x + 6, RAIL.y + RAIL.d / 2], [RAIL.x + RAIL.w - 6, RAIL.y + RAIL.d / 2], 39.03), { tone: "faint" }));
    for (const x of [RAIL.x + 3, RAIL.x + RAIL.w - 3]) {
        parts.push(DOTS([at(P, [x, RAIL.y + RAIL.d / 2, 39.03])], { size: 0.5, tone: "lo" }));
    }

    // Carriage, its top handwheel, and the forward cantilever.
    parts.push(S(slab(CARRIAGE, 39, 6, P, 8, 0.6), { tone: "mid" }));
    const wheel = { x: 8, y: -36 };
    parts.push(S(cyl(wheel.x, wheel.y, 4.2, 45, 3.1, P, 26), { tone: "hi" }));
    parts.push(LINE(k.knurl(wheel.x, wheel.y, 4.2, 45, 48.1, 18, P, 0.4), { tone: "lo" }));
    parts.push(LINE(topLine(P, [wheel.x - 2.4, wheel.y], [wheel.x + 2.4, wheel.y], 48.12), { tone: "mid" }));
    parts.push(S(slab(CANTILEVER, 32, 4, P, 6, 0.4), { tone: "mid" }));
    parts.push(LINE(k.segment([-3.6, -36, 36.03], [3.6, -36, 36.03], P), { tone: "faint" }));
    parts.push(S(slab(BUSHING, 30, 6, P, 8, 0.5), { tone: "hi" }));

    // Fixed sleeve the picker rod runs inside.
    parts.push(S(cyl(ARM.x, ARM.y, 3.4, 24, 11, P, 26), { tone: "mid" }));
    parts.push(LINE(k.sideArc(ARM.x, ARM.y, 3.4, 34.9, P), { tone: "lo" }));

    // Corner registration jig: two angle brackets that locate the stack.
    const brackets = [
        { x: -45, y: -29, w: 3, d: 13, r: 0.6 },
        { x: -45, y: -29, w: 15, d: 3, r: 0.6 },
        { x: 42, y: 16, w: 3, d: 13, r: 0.6 },
        { x: 30, y: 26, w: 15, d: 3, r: 0.6 },
    ];
    parts.push(brackets.map((bracket) => S(slab(bracket, DECK, 4.6, P, 6), { tone: "hi" })).join(""));

    // Back stop the stack is pushed against.
    parts.push(S(slab({ x: -50, y: -32, w: 100, d: 3, r: 0.6 }, DECK, 3.8, P, 6), { tone: "lo" }));
    parts.push(LINE(topLine(P, [-44, -30.5], [44, -30.5], DECK + 3.82), { tone: "faint" }));

    return parts.join("");
};

const drawGauge = () => {
    const parts = [];
    const cx = 56;
    const cy = 22;
    const pad = { x: cx - 5.5, y: cy - 5.5, w: 11, d: 11, r: 2.4 };

    parts.push(S(slab(pad, DECK, 1.4, P, 6), { tone: "mid" }));
    parts.push(LINE(topLine(P, [cx - 3.6, cy + 4.4], [cx + 3.6, cy + 4.4], DECK + 1.42), { tone: "faint" }));
    parts.push(S(cyl(cx, cy, 1.5, DECK + 1.4, 4.2, P, 24), { tone: "mid" }));
    parts.push(S(cyl(cx, cy, 5.8, DECK + 5.6, 2.4, P, 30), { tone: "hi" }));
    parts.push(LINE(k.sideArc(cx, cy, 5.8, DECK + 7.15, P), { tone: "lo" }));

    const ticks = k.radialTicks(cx, cy, 4.4, 24, 6, DECK + 8.03, [0.9, 1.6], P);
    parts.push(LINE(ticks.minor, { tone: "lo" }) + LINE(ticks.major, { tone: "mid" }));

    const angle = -0.7;
    const nx = cx + Math.sin(angle) * 4.0;
    const ny = cy - Math.cos(angle) * 4.0;
    parts.push(LINE(k.segment([cx, cy, DECK + 8.06], [nx, ny, DECK + 8.06], P), { tone: "lit" }));
    parts.push(DOTS([at(P, [cx, cy, DECK + 8.08])], { size: 0.45, tone: "hi" }));

    return parts.join("");
};

const drawStack = () => {
    const parts = [];
    for (let index = 0; index < 4; index += 1) {
        const plan = {
            ...SHEET,
            x: SHEET.x + (index % 2 === 0 ? 1.1 : -0.7),
            y: SHEET.y + (index % 3 === 0 ? -0.6 : 0.7),
        };
        const z = STACK_Z + index * SHEET_T;
        parts.push(S(slab(plan, z, SHEET_T, P, 6), { tone: "hi" }));
        parts.push(
            LINE(
                k.segment(
                    [plan.x + 1.6, plan.y + plan.d + 0.01, z + SHEET_T - 0.35],
                    [plan.x + plan.w - 1.6, plan.y + plan.d + 0.01, z + SHEET_T - 0.35],
                    P,
                ),
                { tone: "faint" },
            ),
        );
    }
    // Cast shadow stays on the stack when the top sheet lifts.
    parts.push(halo(SHEET, TOP_Z - 0.4, 0.3, P));
    return parts.join("");
};

const drawTopSheet = () => {
    const parts = [];
    const z = TOP_Z + SHEET_T + 0.03;
    parts.push(S(slab(SHEET, TOP_Z, SHEET_T, P, 6), { tone: "hi", lit: true }));
    parts.push(S(slab(INK, TOP_Z + SHEET_T + 0.02, 0.04, P, 4), { tone: "faint", crease: "none", flat: true }));
    parts.push(S(slab(INK_LINE, TOP_Z + SHEET_T + 0.02, 0.04, P, 4), { tone: "faint", crease: "none", flat: true }));
    parts.push(S(slab(INK_RULE, TOP_Z + SHEET_T + 0.02, 0.04, P, 4), { tone: "faint", crease: "none", flat: true }));
    parts.push(S(slab(INK_FOOT, TOP_Z + SHEET_T + 0.02, 0.04, P, 4), { tone: "faint", crease: "none", flat: true }));
    parts.push(topText(P, [SHEET.x + 4, SHEET.y + 8], TOP_Z + SHEET_T + 0.06, "ogimg.in", { size: 2.6, tone: "faint" }));
    parts.push(
        topText(P, [SHEET.x + SHEET.w - 5, SHEET.y + 8], TOP_Z + SHEET_T + 0.06, "05", {
            size: 3,
            tone: "faint",
            anchor: "end",
        }),
    );

    // Crop marks and a registration cross, so the lit sheet reads as printed.
    const mark = (from, to) => LINE(topLine(P, from, to, z), { tone: "faint" });
    const x0 = SHEET.x + 3.4;
    const y0 = SHEET.y + 3.4;
    const x1 = SHEET.x + SHEET.w - 3.4;
    const y1 = SHEET.y + SHEET.d - 3.4;
    parts.push(
        mark([x0, y0], [x0 + 2.6, y0]) +
            mark([x0, y0], [x0, y0 + 2.6]) +
            mark([x1, y0], [x1 - 2.6, y0]) +
            mark([x1, y0], [x1, y0 + 2.6]) +
            mark([x0, y1], [x0 + 2.6, y1]) +
            mark([x0, y1], [x0, y1 - 2.6]) +
            mark([x1, y1], [x1 - 2.6, y1]) +
            mark([x1, y1], [x1, y1 - 2.6]),
    );
    const rx = SHEET.x + SHEET.w - 12;
    const ry = SHEET.y + 18;
    parts.push(mark([rx - 2, ry], [rx + 2, ry]) + mark([rx, ry - 2], [rx, ry + 2]));

    return parts.join("");
};

const drawPicker = () => {
    const parts = [];
    // Sheet first, then the vacuum hardware that sits on top of it.
    parts.push(drawTopSheet());
    parts.push(S(cyl(ARM.x, ARM.y, 5.5, 18.02, 1.3, P, 28), { tone: "hi" }));
    parts.push(S(cyl(ARM.x, ARM.y, HEAD_R, 19.32, 2.5, P, 28), { tone: "mid" }));
    parts.push(S(cyl(ARM.x, ARM.y, 2.3, 21.8, 15.2, P, 24), { tone: "mid" }));
    parts.push(S(cyl(ARM.x, ARM.y, 3.1, restCap, 1.8, P, 24), { tone: "hi" }));
    parts.push(LINE(k.sideArc(ARM.x, ARM.y, HEAD_R, 21.82, P), { tone: "lo" }));
    parts.push(DOTS([at(P, [ARM.x, ARM.y, 21.84])], { size: 0.45, tone: "lo" }));
    return part("lift", parts.join(""), {
        pose: [
            [0, 0, 0, 0],
            [1.0, 0, 0, 0],
            [2.4, lift[0] * 0.94, lift[1] * 0.94, 0, "out"],
            [2.95, lift[0], lift[1], 0, "out"],
            [4.9, lift[0], lift[1], 0],
            [6.3, 0, 0, 0, "inout"],
            [10.8, 0, 0, 0],
        ],
    });
};

const body = [drawBase(), drawGantry(), drawGauge(), drawStack(), drawPicker()].join("");

const art = {
    width: WIDTH,
    height: HEIGHT,
    label: "Vacuum sheet stacker lifting the top poster from a registered stack of five layers",
    loop: 10.8,
    offset: 0.6,
    still: 3.9,
    svg: sceneSvg({
        width: WIDTH,
        height: HEIGHT,
        label: "Vacuum sheet stacker lifting the top poster from a registered stack of five layers",
        loop: 10.8,
        offset: 0.6,
        still: 3.9,
        body,
    }),
};

export default art;
