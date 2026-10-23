// Feature — Platform sizes.
// A mat-cutting trim station: a lit poster is pinned under a steel straightedge,
// the blade carriage runs the 16:9 cut, then the guide bridge lifts and indexes
// forward to the 1:1 crop while the etched size marks trade places.

import {
    DOTS,
    LINE,
    S,
    TEXT,
    at,
    cyl,
    drawPath,
    halo,
    k,
    labelPlate,
    part,
    sceneSvg,
    screenDelta,
    slab,
    stage,
    topLine,
    topText,
    topTicks,
} from "../../scene-kit.mjs";
import * as G from "../../../kit/lathe.mjs";

const WIDTH = 680;
const HEIGHT = 420;
const LOOP = 12;
const STILL = 6.6;

const BENCH = { x: -116, y: -92, w: 232, d: 184, r: 7 };
const BODY = { x: -110, y: -86, w: 220, d: 172, r: 5 };
const TOP_Z = 12;
const MAT = { x: -94, y: -72, w: 188, d: 144, r: 4 };
const SHEET = { x: -86, y: -30, w: 172, d: 94, r: 1.2 };
const PAPER_Z = 17.6;

const COL_L = { x: -109, y: 2, w: 13, d: 13, r: 1.6 };
const COL_R = { x: 96, y: 2, w: 13, d: 13, r: 1.6 };
const COL_TOP = 96;
const BEAM = { x: -112, y: 0, w: 224, d: 16, r: 2 };

const BAR = { x: -88, y: -34, w: 176, d: 12, r: 1.5 };
const CUT_Y = -16;
const BAR_LIFT = 8;
const INDEX_Y = 24;
const CUT_FROM = -70;
const CUT_TO = 6;

const DIAL = { x: 76, y: 82, r: 10 };

// Three proofs on one sheet, laid out like a test strip. Their back edges are
// the guide's index stops: 16:9 at y -16, 1:1 at y 8, so the bar steps 24
// units forward between sizes while the crop that is live trades places.
const CROPS = [
    {
        id: "og",
        plan: { x: -68, y: -16, w: 72, d: 40.5 },
        label: "16:9",
        sub: "OPEN GRAPH",
        at: [-62, 13.8],
        labelSize: 4.8,
        subSize: 2.0,
        tag: { x: -64.5, y: 10.3, w: 27.5, d: 10.6, r: 0.5 },
        tagAt: [[-62, 13.9], [-62, 18.1]],
    },
    {
        id: "sq",
        plan: { x: 8, y: 8, w: 40, d: 40 },
        label: "1:1",
        sub: "SQUARE",
        at: [12, 36.5],
        labelSize: 4.8,
        subSize: 2.0,
        tag: { x: 10.5, y: 34, w: 24.5, d: 10.4, r: 0.5 },
        tagAt: [[12.2, 37.6], [12.2, 41.7]],
    },
    {
        id: "st",
        plan: { x: 52, y: -12, w: 24, d: 42.7 },
        label: "9:16",
        sub: "STORY",
        at: [55.5, 22.5],
        labelSize: 4.3,
        subSize: 1.8,
    },
];

const points = [
    ...k.boxCorners(BENCH, -28, TOP_Z),
    ...k.boxCorners(COL_L, TOP_Z, COL_TOP + 3.5),
    ...k.boxCorners(COL_R, TOP_Z, COL_TOP + 3.5),
    ...k.boxCorners(BEAM, COL_TOP - 12, COL_TOP),
    // the clamp's full lift-and-index envelope, behind the sheet's live crops
    ...k.boxCorners({ x: -104, y: -40, w: 208, d: 46 }, 16, 58),
    ...k.boxCorners({ x: -104, y: -16, w: 208, d: 46 }, 16, 58),
    // handwheel on the right column
    [117, 8, 58],
    [104, 21, 71],
    [104, -5, 45],
    [DIAL.x, DIAL.y, 18.4],
];

const P = stage(WIDTH, HEIGHT, points, { pad: 18 });

const tr = ([x, y]) => `translate(${x.toFixed(2)} ${y.toFixed(2)})`;
const depthSort = (spots) => [...spots].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const rectPath = (plan, z) =>
    k.pathOf(
        [
            [plan.x, plan.y],
            [plan.x + plan.w, plan.y],
            [plan.x + plan.w, plan.y + plan.d],
            [plan.x, plan.y + plan.d],
        ].map(([x, y]) => at(P, [x, y, z])),
        true,
    );
const rectLine = (plan, z, tone = "faint") => LINE(rectPath(plan, z), { tone });

// Vertical front-face helpers for the beam markings.
const facePath = (y, pts, closed = false) => k.pathOf(pts.map(([x, z]) => at(P, [x, y, z])), closed);
const faceLine = (y, pts, tone = "faint", closed = false) => LINE(facePath(y, pts, closed), { tone });
const faceText = (x, y, z, text, { size = 2.5, tone = "mid", anchor = "start" } = {}) =>
    TEXT(k.sideMatrix([x, y], z, P, "left"), text, { size, tone, anchor });

// ---------------------------------------------------------------------------
// bench

const drawBench = () => {
    const out = [];
    out.push(halo(BENCH, -28, 42, P));

    for (const [x, y] of depthSort([
        [-100, -78],
        [100, -78],
        [-100, 78],
        [100, 78],
    ])) {
        out.push(S(cyl(x, y, 6.8, -26, 14.2, P, 12, 0.7), { tone: "mid", crease: "faint" }));
        out.push(LINE(k.ring(x, y, 6.8, -13.1, P, 12), { tone: "lo" }));
    }

    out.push(S(slab(BODY, -16, 17, P, 4, 0.9), { tone: "mid" }));
    out.push(S(slab(BENCH, 0, TOP_Z, P, 6, 1.3), { tone: "mid" }));
    out.push(LINE(k.planOutline(k.insetPlan(BENCH, 4.2), TOP_Z + 0.02, P, 6), { tone: "faint" }));

    // front-left rule, seated on a slim steel strip
    const ruler = { x: -110, y: 83.2, w: 52, d: 7.2, r: 1 };
    out.push(S(slab(ruler, TOP_Z, 0.55, P, 3), { tone: "lo", crease: "none" }));
    out.push(LINE(topLine(P, [ruler.x + 1, ruler.y + 0.1], [ruler.x + ruler.w - 1, ruler.y + 0.1], TOP_Z + 0.57), { tone: "lo" }));
    out.push(topTicks(P, { from: -107, to: -62, step: 5, every: 5, edge: ruler.y + 0.2, z: TOP_Z + 0.58, lengths: [1.3, 2.8], tone: "mid" }).all);

    for (const [x, y] of [
        [-107, -86],
        [107, -86],
        [-107, 88],
        [107, 88],
    ]) {
        out.push(DOTS([at(P, [x, y, TOP_Z + 0.03])], { size: 1.2, tone: "mid" }));
        out.push(DOTS([at(P, [x, y, TOP_Z + 0.04])], { size: 0.38, tone: "lo" }));
    }

    out.push(labelPlate(P, { point: [-30, 86.4], z: TOP_Z + 0.02, width: 38, depth: 7, text: "TRIM / 01", size: 2.5, tone: "mid" }));
    return out.join("");
};

// ---------------------------------------------------------------------------
// mat and poster

const drawMat = () => {
    const out = [];
    out.push(S(slab(MAT, TOP_Z, 3.6, P, 6, 0.6), { tone: "mid" }));
    out.push(LINE(k.planOutline(k.insetPlan(MAT, 4), TOP_Z + 3.62, P, 4), { tone: "faint" }));

    for (let x = -84; x <= 84; x += 28) {
        out.push(LINE(topLine(P, [x, MAT.y + 5], [x, MAT.y + MAT.d - 5], TOP_Z + 3.61), { tone: "lo" }));
    }
    for (let y = -60; y <= 60; y += 28) {
        out.push(LINE(topLine(P, [MAT.x + 5, y], [MAT.x + MAT.w - 5, y], TOP_Z + 3.61), { tone: "lo" }));
    }

    // corner registration L, on the back-left of the mat
    out.push(LINE(topLine(P, [MAT.x + 9, MAT.y + 11], [MAT.x + 9, MAT.y + 25], TOP_Z + 3.63), { tone: "mid" }));
    out.push(LINE(topLine(P, [MAT.x + 9, MAT.y + 11], [MAT.x + 23, MAT.y + 11], TOP_Z + 3.63), { tone: "mid" }));
    return out.join("");
};

const drawSheet = () => {
    const out = [];
    out.push(S(slab(SHEET, 15.6, 2.0, P, 3, 0.4), { tone: "hi", lit: true }));

    // printed poster furniture, kept to the blank margins of the proof sheet
    const ink = [
        { x: 68.5, y: 42.5, w: 13.5, d: 1.4 },
        { x: 68.5, y: 45.4, w: 9, d: 1.1 },
        { x: -82, y: 52.5, w: 14, d: 1.2 },
    ];
    for (const bar of ink) {
        out.push(S(slab({ ...bar, r: 0.25 }, PAPER_Z + 0.01, 0.04, P, 3), { tone: "faint", crease: "none", flat: true }));
    }

    // etched crop set, held back so the active proof can come forward
    const base = [];
    for (const crop of CROPS) {
        base.push(rectLine(crop.plan, PAPER_Z + 0.03, "faint"));
        base.push(topText(P, crop.at, PAPER_Z + 0.04, crop.label, { size: crop.labelSize, tone: "faint" }));
        base.push(topText(P, [crop.at[0], crop.at[1] + (crop.labelSize > 4.5 ? 4.5 : 4.0)], PAPER_Z + 0.04, crop.sub, { size: crop.subSize, tone: "faint" }));
    }
    // one quiet registration cross in the front-right margin
    base.push(topText(P, [77, 55], PAPER_Z + 0.035, "+", { size: 3.2, tone: "faint", anchor: "middle" }));
    out.push(`<g opacity="0.34">${base.join("")}</g>`);

    // active proof: heavier outline, corner crop marks and an inked size tag
    const active = (crop) => {
        const { x, y, w, d } = crop.plan;
        const markD = [];
        const reach = 4.2;
        for (const [cx, cy, sx, sy] of [
            [x, y, -1, -1],
            [x + w, y, 1, -1],
            [x + w, y + d, 1, 1],
            [x, y + d, -1, 1],
        ]) {
            markD.push(topLine(P, [cx + sx * reach, cy], [cx, cy], PAPER_Z + 0.055));
            markD.push(topLine(P, [cx, cy + sy * reach], [cx, cy], PAPER_Z + 0.055));
        }
        let tag = "";
        if (crop.tag) {
            tag =
                S(slab(crop.tag, PAPER_Z + 0.055, 0.03, P, 2), { tone: "faint", crease: "none", flat: true }) +
                topText(P, crop.tagAt[0], PAPER_Z + 0.09, crop.label, { size: 4.3, tone: "hi" }) +
                topText(P, crop.tagAt[1], PAPER_Z + 0.09, crop.sub, { size: 1.8, tone: "hi" });
        }
        return (
            `<g style="--anatomy-weight:2.8px">` +
            LINE(rectPath(crop.plan, PAPER_Z + 0.06), { tone: "faint" }) +
            LINE(markD.join(""), { tone: "faint" }) +
            `</g>${tag}`
        );
    };

    const alpha = {
        og: [
            [0, 0],
            [2.6, 0],
            [3.3, 1, "out"],
            [8.4, 1],
            [9.2, 0],
            [12, 0],
        ],
        sq: [
            [0, 0],
            [9.7, 0],
            [10.4, 1, "out"],
            [10.9, 1],
            [11.6, 0],
            [12, 0],
        ],
    };
    for (const crop of CROPS) {
        if (!alpha[crop.id]) continue;
        out.push(part(`crop-${crop.id}`, active(crop), { alpha: alpha[crop.id], extra: 'opacity="0"' }));
    }

    // the blade's cut draws itself along the live proof's back edge
    const cut = topLine(P, [CUT_FROM, CUT_Y], [CUT_TO, CUT_Y], PAPER_Z + 0.1);
    out.push(
        part("cut", drawPath(cut, { from: 2.7, to: 5.4, tone: "faint", width: 2.6 }), {
            alpha: [
                [0, 0],
                [2.9, 0],
                [3.3, 1, "out"],
                [8.2, 1],
                [8.9, 0],
                [12, 0],
            ],
            extra: 'opacity="0"',
        }),
    );
    return out.join("");
};

// ---------------------------------------------------------------------------
// bench-top tooling

const drawTools = () => {
    const out = [];
    const strips = [
        { x: 18, y: 75.4, w: 28, d: 7.2, z: TOP_Z, tone: "hi" },
        { x: 20, y: 76.2, w: 25, d: 6.0, z: TOP_Z + 0.35, tone: "faint" },
        { x: 21.5, y: 76.8, w: 26, d: 6.4, z: TOP_Z + 0.7, tone: "hi" },
    ];
    for (const strip of strips) {
        out.push(S(slab({ ...strip, r: 0.4 }, strip.z, 0.32, P, 3), { tone: strip.tone, crease: "none" }));
    }
    out.push(S(slab({ x: 24, y: 77, w: 10, d: 5.2, r: 0.9 }, TOP_Z + 1.02, 1.7, P, 4), { tone: "mid" }));
    out.push(LINE(k.ring(29, 79.6, 2.1, TOP_Z + 2.75, P, 12), { tone: "faint" }));
    out.push(DOTS([at(P, [29, 79.6, TOP_Z + 2.76])], { size: 0.4, tone: "mid" }));

    const bladeCase = { x: 47, y: 83.4, w: 13, d: 6.4, r: 1.2 };
    out.push(S(slab(bladeCase, TOP_Z, 1.1, P, 4), { tone: "mid" }));
    out.push(S(slab({ x: 47.7, y: 84.0, w: 11.6, d: 5.2, r: 0.9 }, TOP_Z + 1.1, 0.8, P, 4), { tone: "hi" }));
    out.push(LINE(k.planOutline(k.insetPlan(bladeCase, 1.5), TOP_Z + 1.92, P, 3), { tone: "faint" }));
    return out.join("");
};

const drawDial = () => {
    const out = [];
    out.push(S(cyl(DIAL.x, DIAL.y, DIAL.r + 1.6, TOP_Z, 1.3, P, 16), { tone: "mid", crease: "faint" }));
    out.push(S(cyl(DIAL.x, DIAL.y, DIAL.r + 0.2, TOP_Z + 1.3, 2.7, P, 20, 0.4), { tone: "hi" }));
    out.push(LINE(k.knurl(DIAL.x, DIAL.y, DIAL.r + 0.2, TOP_Z + 1.6, TOP_Z + 3.8, 18, P, 0.32), { tone: "lo" }));
    out.push(LINE(k.ring(DIAL.x, DIAL.y, DIAL.r - 1.2, TOP_Z + 4.02, P, 20), { tone: "faint" }));
    const ticks = k.radialTicks(DIAL.x, DIAL.y, DIAL.r - 1.1, 12, 4, TOP_Z + 4.03, [0.9, 1.9], P);
    out.push(LINE(ticks.minor, { tone: "faint" }));
    out.push(LINE(ticks.major, { tone: "lo" }));
    out.push(S(cyl(DIAL.x, DIAL.y, 2.0, TOP_Z + 4.0, 1.0, P, 12), { tone: "mid" }));
    out.push(DOTS([at(P, [DIAL.x, DIAL.y, TOP_Z + 5.02])], { size: 0.4, tone: "hi" }));

    // the needle indexes with the guide
    const needle = LINE(topLine(P, [DIAL.x, DIAL.y - 0.5], [DIAL.x + 0.4, DIAL.y - 6.8], TOP_Z + 4.06), { tone: "hi" });
    const center = at(P, [DIAL.x, DIAL.y, TOP_Z + 4.06]);
    out.push(part("dial-needle", needle + DOTS([at(P, [DIAL.x + 0.4, DIAL.y - 6.6, TOP_Z + 4.07])], { size: 0.38, tone: "hi" }), {
        pose: [
            [0, 0, 0, 0],
            [2.8, 0, 0, 0],
            [3.5, 0, 0, -40, "out"],
            [9.4, 0, 0, -40],
            [10.3, 0, 0, 35, "inout"],
            [11.5, 0, 0, 35],
            [12, 0, 0, 0],
        ],
        pivot: center,
    }));
    return out.join("");
};

// ---------------------------------------------------------------------------
// guide frame

const drawFrame = () => {
    const out = [];
    for (const post of [COL_L, COL_R]) {
        out.push(S(slab({ x: post.x - 2.5, y: post.y - 3, w: post.w + 5, d: post.d + 6, r: 2 }, TOP_Z, 2.4, P, 3), { tone: "mid" }));
        out.push(DOTS([at(P, [post.x + post.w / 2, post.y + post.d + 2, TOP_Z + 2.42])], { size: 0.38, tone: "lo" }));
        out.push(S(slab(post, TOP_Z + 2.4, COL_TOP - TOP_Z - 5.9, P, 4, 0.6), { tone: "mid" }));
        out.push(S(slab({ x: post.x + 4.5, y: post.y + post.d, w: 4, d: 0.8, r: 0.3 }, TOP_Z + 5, COL_TOP - TOP_Z - 9, P, 3), { tone: "hi", crease: "none" }));
        out.push(S(slab({ x: post.x - 1.5, y: post.y - 1.5, w: post.w + 3, d: post.d + 3, r: 1.6 }, COL_TOP - 3.5, 3.5, P, 3, 0.4), { tone: "mid" }));
        out.push(DOTS([at(P, [post.x + post.w / 2, post.y + post.d / 2, COL_TOP + 0.03])], { size: 0.45, tone: "lo" }));
    }

    // portal beam
    out.push(S(slab(BEAM, COL_TOP - 12, 12, P, 5, 0.7), { tone: "mid" }));
    out.push(LINE(k.planOutline(k.insetPlan(BEAM, 3.4), COL_TOP + 0.02, P, 4), { tone: "faint" }));
    out.push(faceText(-8, BEAM.y + BEAM.d + 0.02, COL_TOP - 4.6, "SIZES", { size: 5.2, tone: "hi", anchor: "middle" }));
    out.push(faceLine(BEAM.y + BEAM.d + 0.03, [
        [-30, COL_TOP - 3.2],
        [14, COL_TOP - 3.2],
    ], "faint"));

    // beam crown knob
    out.push(S(cyl(0, BEAM.y + BEAM.d / 2, 4.4, COL_TOP, 2.2, P, 14), { tone: "hi" }));
    out.push(LINE(k.knurl(0, BEAM.y + BEAM.d / 2, 4.4, COL_TOP + 0.3, COL_TOP + 2.1, 12, P, 0.3), { tone: "lo" }));
    out.push(LINE(topLine(P, [-2.4, BEAM.y + BEAM.d / 2], [2.4, BEAM.y + BEAM.d / 2], COL_TOP + 2.22), { tone: "mid" }));

    // handwheel fixed to the right column; turns when the bar indexes
    const wheelX = 114;
    const wheel = G.frameAlong([wheelX, 8, 58], [1, 0, 0]);
    out.push(S(G.disc(0, 4.6, 13, wheel, P, { steps: 18 }), { tone: "mid", crease: "lo" }));
    out.push(S(G.disc(4.6, 7.4, 3.6, wheel, P, { steps: 12 }), { tone: "hi" }));
    out.push(S(G.disc(7.4, 9.2, 1.9, wheel, P, { steps: 10 }), { tone: "mid" }));

    const face = wheelX + 4.62;
    const rim = k.pathOf(
        Array.from({ length: 20 }, (_, step) => {
            const angle = (step / 20) * Math.PI * 2;
            return at(P, [face, 8 + Math.cos(angle) * 10.4, 58 + Math.sin(angle) * 10.4]);
        }),
        true,
    );
    out.push(LINE(rim, { tone: "hi" }));
    const spinning = [];
    for (const angle of [-0.9, 1.5]) {
        spinning.push(LINE(k.segment([face + 0.05, 8, 58], [face + 0.05, 8 + Math.cos(angle) * 9.3, 58 + Math.sin(angle) * 9.3], P), { tone: "lo" }));
    }
    spinning.push(S(cyl(face + 0.3, 8 + 6.6, 1.7, 58 - 3.6, 2.6, P, 10), { tone: "hi" }));
    const wheelCenter = at(P, [face, 8, 58]);
    out.push(part("wheel", spinning.join(""), {
        pose: [
            [0, 0, 0, 0],
            [9.3, 0, 0, 0],
            [10.3, 0, 0, 112, "inout"],
            [12, 0, 0, 112],
        ],
        pivot: wheelCenter,
    }));
    return out.join("");
};

// ---------------------------------------------------------------------------
// clamp bar, rail and blade carriage

const clampBody = (() => {
    const out = [];
    // clamp shoe and rubber lip, resting on the sheet just behind the cut
    out.push(S(slab({ x: -84, y: -29, w: 168, d: 9, r: 1 }, 17.6, 2.8, P, 4, 0.3), { tone: "lo" }));
    out.push(S(slab({ x: -82, y: -23.6, w: 164, d: 3.4, r: 0.6 }, 17.62, 0.8, P, 3), { tone: "faint", crease: "none" }));
    out.push(S(slab(BAR, 20.4, 7.6, P, 6, 0.6), { tone: "mid" }));

    const barTicks = topTicks(P, { from: -83, to: 83, step: 8, every: 5, edge: BAR.y + BAR.d - 0.3, z: 28.13, lengths: [1.1, 2.4] });
    out.push(LINE(topLine(P, [BAR.x + 3, BAR.y + BAR.d - 0.3], [BAR.x + BAR.w - 3, BAR.y + BAR.d - 0.3], 28.12), { tone: "faint" }));
    out.push(barTicks.all);

    for (const side of [-1, 1]) {
        const x = side < 0 ? -96 : 87;
        out.push(S(slab({ x, y: -35, w: 9, d: 14, r: 1.4 }, 16, 14.4, P, 4, 0.4), { tone: "mid" }));
        out.push(S(slab({ x: x + 1.3, y: -33.8, w: 6.4, d: 11.6, r: 1 }, 18.6, 9.4, P, 3), { tone: "lo" }));
        out.push(S(cyl(x + 4.5, -28, 3.4, 30.4, 3.2, P, 12, 0.3), { tone: "hi" }));
        out.push(LINE(k.knurl(x + 4.5, -28, 3.4, 30.7, 33.3, 10, P, 0.3), { tone: "lo" }));
        out.push(LINE(topLine(P, [x + 1.9, -28], [x + 7.1, -28], 33.62), { tone: "mid" }));

        // L-shaped hold-down, attached to the bar and pressing ahead of the cut
        const fx = side < 0 ? -82 : 82;
        out.push(S(slab({ x: fx - 3, y: -23, w: 6, d: 10, r: 0.8 }, 21.8, 4.4, P, 3), { tone: "mid" }));
        out.push(S(slab({ x: fx - 2.5, y: -17, w: 5, d: 5, r: 0.7 }, 19.4, 5.4, P, 3), { tone: "mid" }));
        out.push(S(slab({ x: fx - 5.4, y: -19.5, w: 10.8, d: 8.8, r: 1.1 }, 17.6, 1.8, P, 4, 0.3), { tone: "hi" }));
    }

    // cutting rail along the top of the bar
    const railF = G.frameAlong([-84, -28, 30.0], [1, 0, 0]);
    out.push(S(G.disc(0, 168, 1.9, railF, P, { steps: 10 }), { tone: "hi", crease: "lo" }));
    for (const x of [-83, 83]) {
        const collar = G.frameAlong([x, -28, 30.0], [1, 0, 0]);
        out.push(S(G.disc(0, 2.2, 2.8, collar, P, { steps: 10 }), { tone: "mid" }));
    }

    // carriage, built around x = 0 then indexed along the rail
    const carriage = [];
    for (const x of [-9, 9]) {
        const F = G.frameAlong([x - 2, -28, 30.0], [1, 0, 0]);
        carriage.push(S(G.disc(0, 4, 3.3, F, P, { steps: 12 }), { tone: "mid", crease: "lo" }));
    }
    carriage.push(S(slab({ x: -16, y: -38, w: 34, d: 20, r: 2.2 }, 31.2, 10.4, P, 5, 0.8), { tone: "mid" }));
    carriage.push(S(slab({ x: -12, y: -35, w: 25, d: 14, r: 1.5 }, 41.6, 2.2, P, 4, 0.3), { tone: "hi" }));
    carriage.push(DOTS([at(P, [-9, -32, 43.82]), at(P, [11, -32, 43.82])], { size: 0.36, tone: "mid" }));
    carriage.push(S(cyl(1, -28, 4.4, 43.8, 4.4, P, 16, 0.3), { tone: "hi" }));
    carriage.push(LINE(k.knurl(1, -28, 4.4, 44.1, 48.0, 14, P, 0.3), { tone: "lo" }));
    carriage.push(LINE(topLine(P, [-1.4, -28], [3.4, -28], 48.23), { tone: "mid" }));
    carriage.push(S(slab({ x: -4, y: -24, w: 12, d: 10, r: 1.1 }, 29.4, 9.2, P, 4, 0.3), { tone: "mid" }));

    // blade head drops to the paper inside the carriage
    const blade = [];
    blade.push(S(slab({ x: -4, y: -21, w: 8, d: 5.8, r: 0.8 }, 21.6, 9.6, P, 4, 0.3), { tone: "hi" }));
    blade.push(S(slab({ x: -2.6, y: -18.6, w: 5.2, d: 3.4, r: 0.5 }, 18.3, 3.6, P, 3), { tone: "mid" }));
    blade.push(S(slab({ x: -1.2, y: -17.4, w: 2.4, d: 2.8, r: 0.2 }, 17.62, 0.9, P, 3), { tone: "hi" }));
    blade.push(S(cyl(0, -16.8, 1.9, 26.4, 2.2, P, 10, 0.2), { tone: "hi" }));
    blade.push(LINE(k.knurl(0, -16.8, 1.9, 26.7, 28.3, 8, P, 0.26), { tone: "lo" }));

    const bladeUp = screenDelta(P, [0, 0, 3.1]);
    carriage.push(part("blade", blade.join(""), {
        pose: [
            [0, bladeUp[0], bladeUp[1]],
            [2.3, bladeUp[0], bladeUp[1]],
            [2.6, 0, 0, 0, "out"],
            [6.9, 0, 0],
            [7.2, bladeUp[0], bladeUp[1], 0, "out"],
            [12, bladeUp[0], bladeUp[1]],
        ],
        extra: `transform="${tr(bladeUp)}"`,
    }));

    const start = screenDelta(P, [CUT_FROM, 0, 0]);
    const run = screenDelta(P, [CUT_TO - CUT_FROM, 0, 0]);
    out.push(part("carriage", carriage.join(""), {
        pose: [
            [0, start[0], start[1]],
            [2.4, start[0], start[1]],
            [5.4, start[0] + run[0], start[1] + run[1], 0, "inout"],
            [8.2, start[0] + run[0], start[1] + run[1]],
            [10.9, start[0] + run[0], start[1] + run[1]],
            [11.7, start[0], start[1], 0, "inout"],
            [12, start[0], start[1]],
        ],
        extra: `transform="${tr(start)}"`,
    }));

    const lift = screenDelta(P, [0, 0, BAR_LIFT]);
    const index = screenDelta(P, [0, INDEX_Y, 0]);
    const raised = [lift[0], lift[1]];
    const indexed = [lift[0] + index[0], lift[1] + index[1]];
    return part("clamp", out.join(""), {
        pose: [
            [0, raised[0], raised[1]],
            [1.2, raised[0], raised[1]],
            [2.2, 0, 0, 0, "inout"],
            [8.0, 0, 0],
            [8.7, raised[0], raised[1], 0, "out"],
            [9.3, raised[0], raised[1]],
            [10.1, indexed[0], indexed[1], 0, "inout"],
            [10.8, indexed[0], indexed[1]],
            [11.5, raised[0], raised[1], 0, "inout"],
            [12, raised[0], raised[1]],
        ],
        extra: `transform="${tr(raised)}"`,
    });
})();

const body = [drawBench(), drawMat(), drawSheet(), drawTools(), drawDial(), clampBody, drawFrame()].join("");

const label = "A mat-cutting trim station clamping a lit poster under a steel straightedge, cutting the 16:9 crop, then indexing the guide bridge forward to the 1:1 square";

const art = {
    width: WIDTH,
    height: HEIGHT,
    label,
    loop: LOOP,
    offset: 1.2,
    still: STILL,
    svg: sceneSvg({
        width: WIDTH,
        height: HEIGHT,
        label,
        loop: LOOP,
        offset: 1.2,
        still: STILL,
        body,
    }),
};

export default art;
