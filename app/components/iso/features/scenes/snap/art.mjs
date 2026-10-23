// Feature — Snap guides.
// A cast-base precision XY cross-slide: two stacked dovetail slides with
// knurled feed knobs and graduated collars, a square platen carrying a framed
// layer, and engraved rules along the two near edges. The stage homes from an
// off-centre rest pose to the zero crosshair, both index fingers landing on
// their zero marks, holds, and drifts back. The framed layer is the one lit
// element; the signal lamp brightens with it.

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
    seam,
    slab,
    stage,
    topLine,
    topText,
} from "../../scene-kit.mjs";
import {
    circleOf,
    disc,
    frameAlong,
    pointOf,
    prismOf,
    ribsOf,
    solidOf,
} from "../../../kit/lathe.mjs";

const WIDTH = 680;
const HEIGHT = 420;

// ---- Plans and levels -------------------------------------------------------
const BASE = { x: -114, y: -75, w: 228, d: 150, r: 10 };
const BODY = k.insetPlan(BASE, 3);
const CAP = k.insetPlan(BASE, 1);
const DECK = { x: -106, y: -67, w: 212, d: 134, r: 5.5 };

const Z = {
    feet: 0,
    plinth: 4,
    plinthTop: 6.2,
    bodyTop: 14,
    capTop: 16.2,
    deck: 18.6,
    yRailTop: 24.7,
    ySaddle: 31.0,
    yPlate: 31.8,
    xRailTop: 36.0,
    xCarriage: 40.2,
    xCarriageTop: 41.0,
    platen: 44.2,
    pad: 45.2,
    frame: 48.4,
    art: 45.45,
};

const X_STRIP = { x: -98, y: 54, w: 196, d: 13, r: 0.4 };
const Y_STRIP = { x: 92, y: -62, w: 14, d: 124, r: 0.4 };
const Y_FACE = BODY.y + BODY.d + 0.05;
const X_FACE = BODY.x + BODY.w + 0.05;

const X_TRAVEL = 14;
const Y_TRAVEL = 10;

// ---- Fit --------------------------------------------------------------------
const cornersAt = (plan, z0, z1, dx = 0, dy = 0) =>
    k.boxCorners(plan, z0, z1).map(([x, y, z]) => [x + dx, y + dy, z]);

const points = [
    ...cornersAt(BASE, 0, Z.capTop),
    ...cornersAt(DECK, Z.deck, Z.deck + 0.4),
    ...cornersAt({ x: -44, y: -44, w: 88, d: 88 }, Z.platen, Z.platen + 0.4),
    ...cornersAt({ x: -28, y: -28, w: 56, d: 56 }, Z.frame - 3.2, Z.frame),
    ...cornersAt({ x: -56, y: -44, w: 112, d: 88 }, Z.xRailTop, Z.xCarriageTop, X_TRAVEL, Y_TRAVEL),
    ...cornersAt({ x: -78, y: -46, w: 156, d: 92 }, Z.yRailTop, Z.yPlate, 0, Y_TRAVEL),
    ...cornersAt({ x: -28, y: -28, w: 56, d: 56 }, Z.frame - 3.2, Z.frame, X_TRAVEL, Y_TRAVEL),
    // feed knobs and their collars, at rest and at the zero hold
    [-26, 59.0, 37.1],
    [-26, 59.0, 21.7],
    [-26, 69.0, 37.1],
    [-26, 69.0, 21.7],
    [69.2, 0, 49.5],
    [69.2, 0, 35.8],
    [83.2, -7, 49.5],
    [83.2, 7, 49.5],
    // index fingers, at both ends of travel
    [0, 66.0, 39.0],
    [0, 66.0, 19.2],
    [95.0, 10.0, 28.0],
    [95.0, 10.0, 19.2],
    [14.0, 56.0, 39.0],
    [95.0, 0, 28.0],
    // signal lamp, lock lever and the base's engraved faces
    [84, 47, 30.4],
    [-92, -53, 29.2],
    [-114, 73, 13.4],
    [113, -60, 13.4],
];
const P = stage(WIDTH, HEIGHT, points, { pad: 22, headroom: 2 });

const xShift = screenDelta(P, [X_TRAVEL, 0, 0]);
const yShift = screenDelta(P, [0, Y_TRAVEL, 0]);

// ---- Small helpers ----------------------------------------------------------
const depth = ([x, y, z]) => k.depthOf([x, y, z], P);
const sorted = (list) => [...list].sort((a, b) => depth(a) - depth(b));
const dot = (points, tone = "mid", size = 0.5) => DOTS(points.map((p) => at(P, p)), { tone, size });
const ringLine = (x, y, r, z, tone = "lo", steps = 28) => LINE(k.ring(x, y, r, z, P, steps), { tone });
const quadY = (x0, x1, z0, z1, y = Y_FACE) =>
    k.pathOf(
        [
            [x0, y, z0],
            [x1, y, z0],
            [x1, y, z1],
            [x0, y, z1],
        ].map((p) => k.iso(p, P)),
        true,
    );
const quadX = (y0, y1, z0, z1, x = X_FACE) =>
    k.pathOf(
        [
            [x, y0, z0],
            [x, y1, z0],
            [x, y1, z1],
            [x, y0, z1],
        ].map((p) => k.iso(p, P)),
        true,
    );

// A dovetail way: a trapezoid section wider at the crown than at its root.
function dovetail(origin, axis, length, height, { waist = 2.2, root = 5, crown = 8 } = {}) {
    const F = frameAlong(origin, axis);
    const section = [
        [-root, 0],
        [root, 0],
        [crown, waist],
        [crown, height],
        [-crown, height],
        [-crown, waist],
    ];
    return S(prismOf(F, section, 0, length, P), { tone: "mid", crease: "faint" });
}

// A hanging index finger with a chisel tip, over the rule.
function bladeSvg(origin, axis, top, width = 1.8, thickness = 1.8) {
    const F = frameAlong(origin, axis);
    const polygon = [
        [-width, top],
        [width, top],
        [width, 20.35],
        [0, 19.3],
        [-width, 20.35],
    ];
    return S(prismOf(F, polygon, -thickness / 2, thickness / 2, P), { tone: "hi", crease: "faint" });
}

// ---- Base -------------------------------------------------------------------
const FEET = [
    [-97, -58],
    [97, -58],
    [-97, 58],
    [97, 58],
];

const drawFeet = () =>
    sorted(FEET.map(([x, y]) => [x, y])).map(([x, y]) => {
        const pad = S(cyl(x, y, 8.7, Z.feet, 4.2, P, 14), { tone: "mid", crease: "none" });
        const ring = ringLine(x, y, 6.0, 1.5, "lo", 16);
        return pad + ring;
    }).join("");

const drawRules = () => {
    const parts = [];
    const xTicks = k.topTicks(-96, 96, 6, 5, X_STRIP.y + 0.18, Z.deck + 0.38, [3.2, 5.9], P, "x");
    const yTicks = k.topTicks(-60, 60, 6, 5, Y_STRIP.x + 0.18, Z.deck + 0.38, [3.2, 5.9], P, "y");

    parts.push(S(slab(X_STRIP, Z.deck, 0.34, P, 2, 0.1), { tone: "lo", crease: "faint" }));
    parts.push(S(slab(Y_STRIP, Z.deck, 0.34, P, 2, 0.1), { tone: "lo", crease: "faint" }));
    parts.push(LINE(xTicks.minor, { tone: "mid" }));
    parts.push(LINE(xTicks.major, { tone: "hi" }));
    parts.push(LINE(yTicks.minor, { tone: "mid" }));
    parts.push(LINE(yTicks.major, { tone: "hi" }));

    // Zero gates: a bright line across each rule with short flanking jaws.
    parts.push(
        LINE(topLine(P, [0, X_STRIP.y + 0.2], [0, X_STRIP.y + X_STRIP.d - 0.2], Z.deck + 0.39), {
            tone: "hi",
        }),
    );
    parts.push(
        LINE(topLine(P, [Y_STRIP.x + 0.2, 0], [Y_STRIP.x + Y_STRIP.w - 0.2, 0], Z.deck + 0.39), {
            tone: "hi",
        }),
    );
    parts.push(topText(P, [8.6, 63.4], Z.deck + 0.39, "0", { size: 4.0, tone: "hi", anchor: "middle" }));
    parts.push(topText(P, [102.8, 7.8], Z.deck + 0.39, "0", { size: 4.0, tone: "hi", along: "y", anchor: "middle" }));
    parts.push(topText(P, [-92.5, 63.8], Z.deck + 0.39, "X", { size: 3.2, tone: "mid", anchor: "middle" }));
    parts.push(topText(P, [102.8, -57], Z.deck + 0.39, "Y", { size: 3.2, tone: "mid", along: "y", anchor: "middle" }));
    return parts.join("");
};

const drawBase = () => {
    const parts = [];
    parts.push(halo(BASE, 0, 15, P));
    parts.push(drawFeet());

    parts.push(S(slab(BASE, Z.plinth, Z.plinthTop - Z.plinth, P, 6, 0.45), { tone: "mid", crease: "faint" }));
    parts.push(S(slab(BODY, Z.plinthTop, Z.bodyTop - Z.plinthTop, P, 6, 0.45), { tone: "mid", crease: "faint" }));
    parts.push(seam(P, BODY, 11.7, 6));

    // Engraved panel on the left-front face.
    parts.push(LINE(quadY(-104, -38, 7.0, 13.4), { tone: "faint" }));
    parts.push(
        LINE(
            quadY(-96, -46, 7.7, 12.7),
            { tone: "faint" },
        ),
    );
    parts.push(k.faceTextSvg(k.sideMatrix([-99, Y_FACE], 9.9, P, "left"), "SNAP / XY", { size: 4.0, tone: "mid" }));
    parts.push(dot([[-100, Y_FACE, 8.2], [-42, Y_FACE, 12.2]], "mid", 0.55));
    // Three closed vents at the right of the face.
    for (let index = 0; index < 3; index += 1) {
        const z = 8.0 + index * 1.7;
        parts.push(LINE(quadY(22, 84, z, z + 1.05), { tone: "faint" }));
    }

    parts.push(LINE(quadX(-64, 64, 7.0, 13.4), { tone: "faint" }));
    parts.push(LINE(quadX(-56, 56, 7.7, 12.7), { tone: "faint" }));
    parts.push(dot([[X_FACE, -58, 8.2], [X_FACE, 58, 8.2], [X_FACE, -58, 12.2], [X_FACE, 58, 12.2]], "mid", 0.55));

    parts.push(S(slab(CAP, Z.bodyTop, Z.capTop - Z.bodyTop, P, 6, 0.4), { tone: "mid", crease: "faint" }));
    parts.push(S(slab(DECK, Z.capTop, Z.deck - Z.capTop, P, 6, 0.4), { tone: "mid", crease: "faint" }));
    parts.push(seam(P, DECK, Z.deck - 0.6, 6));

    // Inset border around the deck, and countersunk hold-down screws on the crown.
    parts.push(LINE(k.planOutline(k.insetPlan(DECK, 4.2), Z.deck + 0.02, P, 6), { tone: "faint" }));
    for (const [x, y] of [[-104, -64], [104, -64], [-104, 64], [104, 64]]) {
        parts.push(ringLine(x, y, 1.55, Z.capTop + 0.03, "lo", 14));
        parts.push(dot([[x, y, Z.capTop + 0.05]], "mid", 0.42));
    }

    // Two machined T-slots in the open left and rear deck.
    const slotPlan = (plan) => LINE(k.planOutline(plan, Z.deck + 0.02, P, 3), { tone: "lo" });
    const slotInset = (plan) => LINE(k.planOutline(k.insetPlan(plan, 1.25), Z.deck + 0.03, P, 3), { tone: "faint" });
    const slots = [
        { x: -97, y: -49, w: 7, d: 65, r: 3.5 },
        { x: -86, y: -60, w: 173, d: 7, r: 3.5 },
    ];
    for (const plan of slots) {
        parts.push(slotPlan(plan));
        parts.push(slotInset(plan));
    }
    parts.push(dot([[-93.5, -45.5, Z.deck + 0.04], [-93.5, 12.9, Z.deck + 0.04], [83.9, -56.5, Z.deck + 0.04]], "lo", 0.42));

    parts.push(drawRules());
    parts.push(labelPlate(P, {
        point: [-103, 25.5],
        z: Z.deck + 0.02,
        width: 20,
        depth: 5.6,
        text: "0.01",
        size: 2.0,
        tone: "mid",
    }));

    // Compact lock selector at the left of the deck.
    parts.push(S(slab({ x: -100, y: 36, w: 12, d: 12, r: 3 }, Z.deck, 1.6, P, 3, 0.2), { tone: "mid" }));
    parts.push(S(cyl(-94, 42, 3.3, Z.deck + 1.6, 3.1, P, 12), { tone: "hi", crease: "lo" }));
    parts.push(LINE(k.knurl(-94, 42, 3.3, Z.deck + 1.9, Z.deck + 4.4, 10, P, 0.35), { tone: "lo" }));
    parts.push(dot([[-94, 42, Z.deck + 4.75]], "mid", 0.38));

    // Fixed Y ways: two dovetail rails running front to back.
    for (const x of [-56, 56]) {
        parts.push(dovetail([x, -58, Z.deck], [0, 1, 0], 110, Z.yRailTop - Z.deck));
        parts.push(LINE(topLine(P, [x, -55], [x, 49], Z.yRailTop + 0.03), { tone: "faint" }));
        parts.push(LINE(topLine(P, [x + (x > 0 ? 7.8 : -7.8), -56], [x + (x > 0 ? 7.8 : -7.8), 50], Z.yRailTop + 0.03), { tone: "lo" }));
        parts.push(dot([[x, -55.6, Z.yRailTop + 0.04], [x, 49.6, Z.yRailTop + 0.04]], "lo", 0.4));
        // Fixed end stop on the rear end of each way.
        parts.push(S(slab({ x: x - 10, y: -60, w: 20, d: 5.4, r: 1.4 }, Z.yRailTop, 1.5, P, 2, 0.2), { tone: "mid" }));
        parts.push(dot([[x, -57.6, Z.yRailTop + 1.53]], "lo", 0.4));
    }
    return parts.join("");
};

// ---- Knobs ------------------------------------------------------------------
const KNOB_PROFILE = [
    [0, 4.4],
    [0.7, 4.4],
    [0.9, 6.9],
    [1.3, 7.6],
    [7.1, 7.6],
    [7.4, 8.6],
    [10.2, 8.6],
    [10.2, 4.9],
    [10.7, 4.9],
    [11.6, 4.4],
];

function knobSvg(origin, axis, scale) {
    const F = frameAlong(origin, axis);
    const parts = [];
    parts.push(S(disc(-0.65, 0, 5.2 * scale, F, P, { steps: 16 }), { tone: "mid", crease: "none" }));
    const profile = KNOB_PROFILE.map(([s, r]) => [s * scale, r * scale]);
    parts.push(S(solidOf(profile, F, P, { steps: 22 }), { tone: "hi", crease: "lo" }));

    // Graduated collar face: long ticks every third, and a zero tick.
    const face = 10.2 * scale;
    const outer = 8.6 * scale;
    const minor = [];
    const major = [];
    const zero = [];
    for (let index = 0; index < 18; index += 1) {
        const angle = (index / 18) * Math.PI * 2 - Math.PI / 2;
        const long = index % 3 === 0;
        const from = outer - (long ? 1.6 : 0.95) * scale;
        const d = k.pathOf([
            at(P, pointOf(F, face + 0.03, from, angle)),
            at(P, pointOf(F, face + 0.03, outer - 0.12 * scale, angle)),
        ]);
        if (index === 0) zero.push(d);
        else if (long) major.push(d);
        else minor.push(d);
    }
    parts.push(LINE(minor.join(""), { tone: "lo" }));
    parts.push(LINE(major.join(""), { tone: "mid" }));
    parts.push(LINE(zero.join(""), { tone: "hi" }));
    parts.push(LINE(circleOf(F, face + 0.02, 5.5 * scale, P, 20), { tone: "faint" }));

    // Knurl on the grip only, ending on the collar creases.
    const ribs = ribsOf(F, 1.34 * scale, 7.06 * scale, 7.62 * scale, 22, P, {
        fade: [0.08, 0.5],
    });
    parts.push(k.fadedSvg(ribs, { tone: "lo" }));

    // Slotted screw on the end of the feed shaft.
    parts.push(LINE(circleOf(F, 11.62 * scale, 2.7 * scale, P, 18), { tone: "mid" }));
    parts.push(
        LINE(
            k.pathOf([
                at(P, pointOf(F, 11.64 * scale, 1.85 * scale, 0.35)),
                at(P, pointOf(F, 11.64 * scale, 1.85 * scale, 0.35 + Math.PI)),
            ]),
            { tone: "lo" },
        ),
    );
    return parts.join("");
}

// ---- Y axis (outer group) ---------------------------------------------------
const drawYStage = () => {
    const parts = [];
    // Saddle: one broad dovetail rider, seamed where the top face was milled.
    parts.push(S(slab({ x: -78, y: -46, w: 156, d: 92, r: 4.5 }, Z.yRailTop, Z.yPlate - Z.yRailTop, P, 4, 0.35), {
        tone: "mid",
        crease: "faint",
    }));
    parts.push(seam(P, { x: -78, y: -46, w: 156, d: 92, r: 4.5 }, Z.ySaddle, 4));

    // Dovetail gibs on the near face.
    for (const x of [-58, 58]) {
        parts.push(S(slab({ x: x - 9, y: 45.8, w: 18, d: 2.6, r: 0.8 }, Z.yRailTop + 0.5, 2.1, P, 2, 0.2), {
            tone: "mid",
        }));
        parts.push(dot([[x, 48.7, Z.yRailTop + 1.6]], "lo", 0.4));
    }

    // X ways on the saddle top.
    for (const y of [-26, 26]) {
        parts.push(dovetail([-66, y, Z.yPlate], [1, 0, 0], 132, Z.xRailTop - Z.yPlate));
        parts.push(LINE(topLine(P, [-63, y], [63, y], Z.xRailTop + 0.03), { tone: "faint" }));
        parts.push(LINE(topLine(P, [-64, y + 7.8], [64, y + 7.8], Z.xRailTop + 0.03), { tone: "lo" }));
        parts.push(dot([[-63, y, Z.xRailTop + 0.04], [63, y, Z.xRailTop + 0.04]], "lo", 0.4));
    }

    // X travel stops at the ends of the saddle.
    for (const x of [-71, 71]) {
        parts.push(S(slab({ x: x - 2.6, y: -33, w: 5.2, d: 66, r: 1.0 }, Z.yPlate, 5.1, P, 2, 0.25), {
            tone: "mid",
        }));
        parts.push(dot([[x, -27, Z.yPlate + 5.14], [x, 27, Z.yPlate + 5.14]], "mid", 0.4));
    }

    // Y feed bearing, block and knob.
    parts.push(S(slab({ x: -40, y: 46, w: 26, d: 3.4, r: 2.4 }, Z.yRailTop + 0.8, 7.0, P, 3, 0.3), {
        tone: "mid",
    }));
    parts.push(dot([[-37.5, 49.55, Z.yRailTop + 2.4], [-16.5, 49.55, Z.yRailTop + 2.4]], "lo", 0.38));
    parts.push(knobSvg([-27, 49.4, 29.4], [0, 1, 0], 0.9));

    // Y index bracket and finger over the left rule.
    parts.push(S(slab({ x: 78, y: -5.4, w: 2.6, d: 10.8, r: 0.8 }, Z.yRailTop + 0.4, 3.9, P, 2, 0.25), {
        tone: "mid",
    }));
    parts.push(dot([[80.9, -2.2, Z.yRailTop + 1.2], [80.9, 2.2, Z.yRailTop + 1.2]], "lo", 0.36));
    parts.push(S(slab({ x: 78, y: -2.4, w: 15.6, d: 4.8, r: 1.1 }, Z.yRailTop + 0.8, 1.7, P, 2, 0.2), {
        tone: "mid",
    }));
    parts.push(LINE(topLine(P, [79, 0], [93.6, 0], Z.yRailTop + 2.53), { tone: "faint" }));
    parts.push(bladeSvg([95, 0, 0], [0, 1, 0], 27.8));
    parts.push(LINE(k.segment([95, 0.92, 27.4], [95, 0.92, 19.9], P), { tone: "mid" }));
    return parts.join("");
};

// ---- X axis (inner group) ---------------------------------------------------
const drawXStage = () => {
    const parts = [];
    parts.push(S(slab({ x: -56, y: -44, w: 112, d: 88, r: 3.5 }, Z.xRailTop, Z.xCarriage - Z.xRailTop, P, 4, 0.3), {
        tone: "mid",
        crease: "faint",
    }));
    parts.push(S(slab({ x: -52, y: -40, w: 104, d: 80, r: 2.5 }, Z.xCarriage, Z.xCarriageTop - Z.xCarriage, P, 4, 0.2), {
        tone: "hi",
    }));
    parts.push(seam(P, { x: -56, y: -44, w: 112, d: 88, r: 3.5 }, Z.xCarriage - 0.8, 4));

    // X gibs on the near face.
    for (const x of [-44, 44]) {
        parts.push(S(slab({ x: x - 7, y: 43.8, w: 14, d: 2.6, r: 0.7 }, Z.xRailTop + 0.6, 2.0, P, 2, 0.2), {
            tone: "mid",
        }));
        parts.push(dot([[x, 46.7, Z.xRailTop + 1.6]], "lo", 0.38));
    }

    // X feed bearing and knob on the right-hand face.
    parts.push(S(slab({ x: 56, y: -9, w: 3.8, d: 18, r: 2.4 }, 36, 12.4, P, 3, 0.3), { tone: "mid" }));
    parts.push(dot([[59.9, -6, 46.4], [59.9, 6, 46.4]], "lo", 0.36));
    parts.push(knobSvg([59.8, 0, 42.6], [1, 0, 0], 0.8));

    // X index bracket and finger over the front rule.
    parts.push(S(slab({ x: -5.4, y: 44, w: 10.8, d: 2.5, r: 1.3 }, 36.5, 2.7, P, 2, 0.2), {
        tone: "mid",
    }));
    parts.push(dot([[-3.0, 46.7, 38.6], [3.0, 46.7, 38.6]], "lo", 0.36));
    parts.push(S(slab({ x: -2.8, y: 44, w: 5.6, d: 10.6, r: 1.1 }, 37.1, 1.7, P, 2, 0.2), { tone: "mid" }));
    parts.push(LINE(topLine(P, [0, 45], [0, 54.6], 37.83), { tone: "faint" }));
    parts.push(bladeSvg([0, 56, 0], [0, 1, 0], 38.6));
    parts.push(LINE(k.segment([0, 56.92, 38.2], [0, 56.92, 19.9], P), { tone: "mid" }));

    // Square platen, pad, and a bright machined border.
    parts.push(S(slab({ x: -44, y: -44, w: 88, d: 88, r: 0 }, Z.xCarriageTop, Z.platen - Z.xCarriageTop, P, 0, 0.3), {
        tone: "hi",
        crease: "lo",
    }));
    parts.push(seam(P, { x: -44, y: -44, w: 88, d: 88, r: 0 }, Z.platen - 0.8, 0));
    parts.push(S(slab({ x: -34, y: -34, w: 68, d: 68, r: 0 }, Z.platen, Z.pad - Z.platen, P, 0, 0.25), {
        tone: "mid",
    }));
    parts.push(LINE(k.planOutline({ x: -38.5, y: -38.5, w: 77, d: 77, r: 0 }, Z.platen + 0.02, P, 0), { tone: "faint" }));
    for (const [x, y] of [[-39, -39], [39, -39], [-39, 39], [39, 39]]) {
        parts.push(ringLine(x, y, 1.45, Z.platen + 0.03, "lo", 14));
        parts.push(dot([[x, y, Z.platen + 0.05]], "hi", 0.42));
    }

    // Picture frame, mitred at the corners.
    const FR = 28;
    const IN = 20;
    const north = [[-FR, -FR], [FR, -FR], [IN, -IN], [-IN, -IN]];
    const south = [[-FR, FR], [FR, FR], [IN, IN], [-IN, IN]];
    const west = [[-FR, -FR], [-IN, -IN], [-IN, IN], [-FR, FR]];
    const east = [[FR, -FR], [FR, FR], [IN, IN], [IN, -IN]];
    const bar = (plan) =>
        S(k.extrude(plan, Z.pad, Z.frame - Z.pad, P, { bevel: 0.26 }), { tone: "hi", crease: "lo" });
    parts.push([north, west].map(bar).join(""));

    // The one lit element: the framed artboard layer, a registration sheet.
    parts.push(S(slab({ x: -19.7, y: -19.7, w: 39.4, d: 39.4, r: 0 }, Z.art, 0.24, P, 0, 0), {
        tone: "hi",
        lit: true,
        crease: "none",
    }));
    parts.push(
        LINE(k.planOutline({ x: -15.4, y: -15.4, w: 30.8, d: 30.8, r: 0 }, Z.art + 0.27, P, 0), { tone: "faint" }),
    );
    parts.push(ringLine(0, 0, 5.2, Z.art + 0.29, "mid", 28));
    parts.push(ringLine(0, 0, 2.2, Z.art + 0.29, "lo", 18));
    parts.push(dot([[0, 0, Z.art + 0.31]], "mid", 0.42));
    for (const [x, y] of [[-13.8, -13.8], [13.8, -13.8], [-13.8, 13.8], [13.8, 13.8]]) {
        parts.push(
            LINE(topLine(P, [x - 1.2, y], [x + 1.2, y], Z.art + 0.29), { tone: "mid" }),
            LINE(topLine(P, [x, y - 1.2], [x, y + 1.2], Z.art + 0.29), { tone: "mid" }),
        );
    }
    parts.push(
        LINE(
            k.pathOf(
                [
                    [-6.4, 14.2],
                    [-6.4, 13.1],
                    [6.4, 13.1],
                    [6.4, 14.2],
                ].map((p) => k.iso([p[0], p[1], Z.art + 0.29], P)),
            ),
            { tone: "faint" },
        ),
    );

    parts.push([south, east].map(bar).join(""));
    for (const [x, y] of [[-24, -24], [24, -24], [-24, 24], [24, 24]]) {
        parts.push(ringLine(x, y, 1.05, Z.frame + 0.03, "lo", 12));
        parts.push(dot([[x, y, Z.frame + 0.05]], "mid", 0.34));
    }
    return parts.join("");
};

// ---- Signal lamp (fixed, brightens at lock) ---------------------------------
const LAMP = { x: 84, y: 47 };
const drawSignal = () => {
    const parts = [];
    parts.push(S(cyl(LAMP.x, LAMP.y, 6.6, Z.deck, 2.4, P, 14), { tone: "mid", crease: "faint" }));
    parts.push(S(cyl(LAMP.x, LAMP.y, 4.7, Z.deck + 2.4, 8.0, P, 14), { tone: "hi", crease: "lo" }));
    parts.push(LINE(k.knurl(LAMP.x, LAMP.y, 4.7, Z.deck + 3.0, Z.deck + 9.9, 12, P, 0.5), { tone: "lo" }));
    parts.push(S(cyl(LAMP.x, LAMP.y, 5.8, Z.deck + 10.4, 0.9, P, 16), { tone: "mid", crease: "faint" }));
    parts.push(ringLine(LAMP.x, LAMP.y, 5.2, Z.deck + 11.33, "mid", 20));
    const lens =
        `<path class="iso-lens" d="${k.ring(LAMP.x, LAMP.y, 4.1, Z.deck + 11.4, P, 20)}" style="fill:var(--anatomy-mid);stroke:var(--anatomy-mid);stroke-width:.4"/>` +
        ringLine(LAMP.x, LAMP.y, 2.7, Z.deck + 11.41, "lo", 16);
    parts.push(
        part("lock-lamp", lens, {
            alpha: [
                [0, 0.25],
                [3.4, 0.25],
                [4.0, 1, "out"],
                [9.0, 1],
                [9.55, 0.25, "inout"],
                [10.8, 0.25],
            ],
        }),
    );
    return parts.join("");
};

// ---- Compose ----------------------------------------------------------------
const base = drawBase();
const yStage = drawYStage();
const xStage = drawXStage();
const signal = drawSignal();

const xOver = [-xShift[0] * 0.05, -xShift[1] * 0.05];
const yOver = [-yShift[0] * 0.05, -yShift[1] * 0.05];
const yGroup = part("y-axis", yStage + part("x-axis", xStage, {
    pose: [
        [0, xShift[0], xShift[1], 0, "inout"],
        [0.55, xShift[0], xShift[1], 0, "inout"],
        [2.55, xOver[0], xOver[1], 0, "out"],
        [3.15, 0, 0, 0, "inout"],
        [8.8, 0, 0, 0, "inout"],
        [10.8, xShift[0], xShift[1], 0, "inout"],
    ],
}), {
    pose: [
        [0, yShift[0], yShift[1], 0, "inout"],
        [1.1, yShift[0], yShift[1], 0, "inout"],
        [3.3, yOver[0], yOver[1], 0, "out"],
        [3.9, 0, 0, 0, "inout"],
        [9.15, 0, 0, 0, "inout"],
        [10.8, yShift[0], yShift[1], 0, "inout"],
    ],
});

const body = base + yGroup + signal;

const art = {
    width: WIDTH,
    height: HEIGHT,
    label: "Precision XY cross-slide stage gliding to its zero crosshair, with engraved rules, index fingers and a lock lamp",
    loop: 10.8,
    offset: 0.4,
    still: 6.0,
    svg: sceneSvg({
        width: WIDTH,
        height: HEIGHT,
        label: "Precision XY cross-slide stage gliding to its zero crosshair, with engraved rules, index fingers and a lock lamp",
        loop: 10.8,
        offset: 0.4,
        still: 6.0,
        body,
    }),
};

export default art;
