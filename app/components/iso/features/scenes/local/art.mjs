// NOTHING LEAVES THE TAB
// A welded steel archive strongbox on a low bench. The front drawer rides out
// on slides, a case-mounted latch tab flips, and the sealed work is held under
// a strip lamp: a lit archive poster. The blanked network port on the back has
// no cable; the only thing that comes out of the box is the drawer.

import {
    DOTS,
    LINE,
    S,
    at,
    halo,
    k,
    labelPlate,
    part,
    sceneSvg,
    screenDelta,
    seam,
    slab as slabRaw,
    stage,
    topLine,
} from "../../scene-kit.mjs";

const WIDTH = 680;
const HEIGHT = 420;

// ---- layout (world units: x depth toward viewer-right, y width, z up) ----
const BENCH = { x: -66, y: -40, w: 178, d: 80, r: 6 };
const GROUND = -24;
const CASE = { x: -44, y: -30, w: 74, d: 60, r: 2.4 };
const LID = { x: -45, y: -31, w: 73, d: 62, r: 3 };
const TOP = 56;
const OPEN = 70;

// drawer, built at rest; the group is moved by screenDelta(P, [OPEN, 0, 0])
const FLOOR = 14.0;
const TRAY = { x: -32, y: -21.5, w: 62, d: 43, r: 1.2 };
const POSTER = { x: 11.7, y: -16.8, w: 1.6, d: 33.6, r: 0.4 };
const POSTER_TOP = 46.4;

const points = [
    ...k.boxCorners(BENCH, GROUND, 0),
    ...k.boxCorners(CASE, 0, TOP),
    ...k.boxCorners(LID, TOP, 61.2),
    [-14, 0, 71],
    [30 + OPEN + 7.6, 23.8, 10.8],
    [30 + OPEN + 7.6, -23.8, 10.8],
    [30 + OPEN + 7.6, 23.8, 49.6],
    [30 + OPEN + 7.6, -23.8, 49.6],
    [30 + OPEN + 9.2, 23, 55.2],
    [POSTER.x + OPEN, -16.8, POSTER_TOP],
    [POSTER.x + OPEN, 16.8, POSTER_TOP],
    [-41, 33.4, 44.8],
    [-61, -31, 2.4],
];
const P = stage(WIDTH, HEIGHT, points, { pad: 18 });

const slide = screenDelta(P, [OPEN, 0, 0]);
const travel = [slide[0], slide[1]];

// ---- projection helpers -------------------------------------------------
const slab = (plan, z, height, projection, steps = 4, bevel = 0) =>
    slabRaw(plan, z, height, projection, Math.min(steps, 4), bevel);
const seg3 = (a, b) => k.segment(a, b, P);
const pt = (p) => at(P, p);

function topBolt(x, y, z, r = 1.5) {
    const [px, py] = pt([x, y, z + 0.02]);
    return (
        `<g><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" fill="var(--anatomy-shade-1)" stroke="var(--anatomy-lo)" stroke-width="0.5"/>` +
        `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(r * 0.42).toFixed(1)}" fill="var(--anatomy-shade-0)"/></g>`
    );
}

function faceBolts(face, spots, r = 1.9) {
    const heads = spots
        .map(([u, v]) =>
            `<circle cx="${u}" cy="${v}" r="${r}" fill="var(--anatomy-shade-1)" stroke="var(--anatomy-lo)" stroke-width="0.5"/>` +
            `<circle cx="${u}" cy="${v}" r="${(r * 0.4).toFixed(1)}" fill="var(--anatomy-shade-0)"/>`)
        .join("");
    return `<g transform="${face}">${heads}</g>`;
}

const faceOf = (x, y, z, face = "right") => k.sideMatrix([x, y], z, P, face);

// ---- bench ---------------------------------------------------------------
function drawBench() {
    const out = [];
    out.push(halo(BENCH, GROUND, 26, P));

    // far structure, then the legs, then the near apron and deck
    out.push(S(slab({ x: -58, y: -36, w: 162, d: 4, r: 1 }, -15, 9, P, 3, 0.4), { tone: "mid" }));
    out.push(S(slab({ x: -50, y: -36, w: 144, d: 3, r: 0.8 }, -21, 3, P, 2), { tone: "lo" }));

    const legs = [
        [-58, -31], [-58, 18], [95, -31], [95, 18],
    ].sort((a, b) => k.depthOf([a[0] + 7, a[1] + 6.5, GROUND], P) - k.depthOf([b[0] + 7, b[1] + 6.5, GROUND], P));
    for (const [x, y] of legs) {
        out.push(S(slab({ x, y, w: 14, d: 13, r: 1 }, GROUND, 2.8, P, 2), { tone: "lo", crease: "none" }));
        out.push(S(slab({ x: x + 1.5, y: y + 1.5, w: 11, d: 10, r: 0.8 }, GROUND + 2.8, 15.2, P, 2), { tone: "mid" }));
    }

    out.push(S(slab({ x: -58, y: 32, w: 162, d: 4, r: 1 }, -15, 9, P, 3, 0.4), { tone: "mid" }));
    out.push(S(slab({ x: 104, y: -31, w: 8, d: 63, r: 1 }, -15, 9, P, 3), { tone: "mid" }));
    out.push(S(slab({ x: -66, y: 37, w: 178, d: 3, r: 1 }, -6, 2.4, P, 3), { tone: "hi" }));

    // deck, its seam, apron stamps and milled slot
    out.push(S(slab(BENCH, -6, 6, P, 5, 1.2), { tone: "mid" }));
    out.push(seam(P, BENCH, -2.4, 5));
    out.push(LINE(seg3([-58, 36.02, -12.4], [-21, 36.02, -12.4]), { tone: "lo" }));
    out.push(LINE(seg3([-58, 36.02, -13.6], [-34, 36.02, -13.6]), { tone: "faint" }));
    out.push(LINE(topLine(P, [-36, 37.25], [108, 37.25], 0.04), { tone: "lo" }));
    out.push(LINE(topLine(P, [-36, 37.95], [108, 37.95], 0.04), { tone: "faint" }));
    out.push(LINE(topLine(P, [-36, 37.25], [-36, 37.95], 0.04), { tone: "faint" }));

    // deck hold-downs
    out.push(topBolt(-58, 33.5, 0.05, 1.7));
    out.push(topBolt(100, 33.5, 0.05, 1.7));
    out.push(topBolt(-58, -33.5, 0.05, 1.7));
    out.push(topBolt(100, -33.5, 0.05, 1.7));

    // rules and graduated scale scribed into the clear near strip
    const ticks = k.topTicks(-33, -7, 2.6, 4, 32.35, 0.05, [1.0, 2.2], P, "x");
    out.push(LINE(ticks.minor, { tone: "mid" }));
    out.push(LINE(ticks.major, { tone: "hi" }));
    out.push(LINE(topLine(P, [-33.4, 35.4], [-6.6, 35.4], 0.05), { tone: "faint" }));
    return out.join("");
}

// ---- bench-side parts tray (the sealed spare caps) ----------------------
function drawSpares() {
    const out = [];
    out.push(S(slab({ x: -61, y: 31, w: 22, d: 7.2, r: 1.0 }, 0, 2.2, P, 3, 0.4), { tone: "mid" }));
    out.push(LINE(topLine(P, [-60.2, 37.35], [-39.8, 37.35], 2.22), { tone: "faint" }));
    for (const [x, y] of [[-56, 34.4], [-50.2, 35.2], [-45.4, 33.5]]) {
        out.push(S(k.cylinder(x, y, 2.0, 2.4, 2.0, P, 12, 0.2), { tone: "hi" }));
        out.push(LINE(k.ring(x, y, 1.82, 4.42, P, 12), { tone: "lo" }));
        out.push(LINE(topLine(P, [x - 1.2, y], [x + 1.2, y], 4.44), { tone: "lo" }));
    }
    return out.join("");
}

// ---- welded case, back half and interior --------------------------------
function drawCaseBack() {
    const out = [];
    // feet
    for (const [x, y] of [[-38, -23], [24, -23], [-38, 23], [24, 23]]) {
        out.push(S(slab({ x, y, w: 14, d: 13, r: 1 }, 0, 3, P, 2), { tone: "lo", crease: "none" }));
    }
    // plinth flange
    out.push(S(slab({ x: -45.6, y: -31.6, w: 77.2, d: 63.2, r: 3.4 }, 3, 5.4, P, 4, 1.0), { tone: "mid" }));
    out.push(seam(P, { x: -45.6, y: -31.6, w: 77.2, d: 63.2, r: 3.4 }, 7.0, 4));

    // interior floor, shell and rear liner
    out.push(S(slab({ x: -42, y: -26, w: 68, d: 52, r: 1 }, 8.4, 1.4, P, 3), { tone: "lo" }));
    out.push(S(slab({ x: -44, y: -28, w: 3.6, d: 56, r: 1 }, 8.4, 43.6, P, 3), { tone: "mid" }));
    out.push(S(slab({ x: -40.4, y: -25, w: 0.8, d: 50, r: 0.4 }, 11, 39, P, 2), { tone: "lo", flat: true }));
    out.push(S(slab({ x: -42, y: -29.6, w: 70, d: 3.2, r: 1 }, 8.4, 42.6, P, 3), { tone: "mid" }));

    // fixed slide channels, rollers and the drawer stop
    for (const y of [-22.6, 22.4]) {
        out.push(S(slab({ x: -38, y, w: 66, d: 1.8, r: 0.6 }, 11.0, 2.6, P, 2), { tone: "mid" }));
        out.push(S(slab({ x: 19, y: y - 0.3, w: 7, d: 2.4, r: 0.8 }, 13.6, 1.8, P, 2), { tone: "hi" }));
        out.push(DOTS([pt([21, y + 0.6, 15.55]), pt([24, y + 0.6, 15.55])], { size: 0.5, tone: "lo" }));
    }
    out.push(S(slab({ x: -38, y: -10, w: 5, d: 20, r: 1 }, 11.4, 9.2, P, 2), { tone: "mid" }));

    // mouth frame: rails and stiles
    const frame = [
        { x: 26, y: -30, w: 4, d: 60, r: 0.5, z: 8.4, h: 3.6 },
        { x: 26, y: -30, w: 4, d: 60, r: 0.5, z: 50, h: 6 },
        { x: 26, y: -30, w: 4, d: 5.5, r: 0.5, z: 12, h: 38 },
        { x: 26, y: 24.5, w: 4, d: 5.5, r: 0.5, z: 12, h: 38 },
    ];
    for (const f of frame) out.push(S(slab(f, f.z, f.h, P, 3, 0.3), { tone: "mid" }));

    // fixed receiver that the near slide runs into
    out.push(S(slab({ x: 22, y: 23.8, w: 8, d: 1.8, r: 0.5 }, 13.8, 3.4, P, 2), { tone: "mid" }));

    // four frame fasteners around the mouth, visible when the drawer is out
    out.push(faceBolts(faceOf(30.02, 30, 56, "right"), [[3.2, 3.4], [56.8, 3.4], [3.2, 44.4], [56.8, 44.4]], 1.8));
    out.push(
        `<g transform="${faceOf(30.02, 30, 56, "right")}">` +
            `<rect x="7.0" y="2.6" width="4.0" height="4.2" rx="0.6" fill="var(--anatomy-shade-1)" stroke="var(--anatomy-lo)" stroke-width="0.5"/>` +
            `<circle cx="8.0" cy="3.6" r="0.35" fill="var(--anatomy-lo)"/>` +
            `<circle cx="10.0" cy="5.8" r="0.35" fill="var(--anatomy-lo)"/>` +
            `</g>`,
    );
    return out.join("");
}

// ---- drawer --------------------------------------------------------------
function drawDrawer() {
    const out = [];
    const f = FLOOR;

    // telescoping slide on the near flank, visible while the drawer is out
    out.push(S(slab({ x: -46, y: 21.5, w: 76, d: 2.1, r: 0.8 }, 14.2, 2.6, P, 3, 0.2), { tone: "hi" }));
    out.push(LINE(topLine(P, [-42, 22.55], [25, 22.55], 16.84), { tone: "lo" }));

    const showcaseStart = out.length;
    // tray floor, with two scribed runner lines
    out.push(S(slab(TRAY, f, 2.4, P, 4, 0.5), { tone: "lo" }));
    for (const y of [-8.6, 6.6]) {
        out.push(LINE(topLine(P, [-28.6, y], [27.4, y], f + 2.42), { tone: "faint" }));
    }

    // tray back and side walls; the near wall stays low so the poster shows
    out.push(S(slab({ x: -32, y: -21.5, w: 3.4, d: 43, r: 1 }, f, 22, P, 3, 0.3), { tone: "mid" }));
    out.push(S(slab({ x: -32, y: -21.5, w: 62, d: 2.7, r: 0.8 }, f, 13, P, 3), { tone: "mid" }));
    out.push(S(slab({ x: -32, y: 18.8, w: 62, d: 2.7, r: 0.8 }, f, 8.6, P, 3), { tone: "mid" }));
    out.push(S(slab({ x: -32, y: 18.8, w: 62, d: 2.7, r: 0.7 }, 22.6, 0.7, P, 2), { tone: "hi", flat: true }));
    out.push(LINE(seg3([-29.4, 18.78, f + 8.64], [27.4, 18.78, f + 8.64]), { tone: "faint" }));

    // archive stand, poster frame and the poster itself
    out.push(S(slab({ x: 8.4, y: -19, w: 6, d: 38, r: 1 }, f + 2.4, 3, P, 3), { tone: "mid" }));
    out.push(S(slab({ x: 10.4, y: -18.4, w: 3.8, d: 36.8, r: 0.6 }, 19.8, 1.6, P, 2), { tone: "mid" }));
    out.push(S(slab({ x: 10.8, y: 16.6, w: 3.2, d: 1.9, r: 0.5 }, 21, 25.4, P, 2), { tone: "mid" }));
    out.push(S(slab({ x: 10.8, y: -18.5, w: 3.2, d: 1.9, r: 0.5 }, 21, 25.4, P, 2), { tone: "mid" }));
    out.push(S(slab({ x: 10.6, y: -18.4, w: 3.6, d: 36.8, r: 0.6 }, 45.6, 1.6, P, 2), { tone: "mid" }));

    // glow from the poster's own corners
    const posterTop = POSTER_TOP;
    const glowPts = [
        [POSTER.x + POSTER.w, -16.6, 21.4],
        [POSTER.x + POSTER.w, 16.6, 21.4],
        [POSTER.x + POSTER.w, -16.6, posterTop],
        [POSTER.x + POSTER.w, 16.6, posterTop],
    ].map((p) => pt(p));
    const gx = (Math.min(...glowPts.map((p) => p[0])) + Math.max(...glowPts.map((p) => p[0]))) / 2;
    const gy = (Math.min(...glowPts.map((p) => p[1])) + Math.max(...glowPts.map((p) => p[1]))) / 2;
    const grx = (Math.max(...glowPts.map((p) => p[0])) - Math.min(...glowPts.map((p) => p[0]))) / 2 + 12;
    const gry = (Math.max(...glowPts.map((p) => p[1])) - Math.min(...glowPts.map((p) => p[1]))) / 2 + 10;
    out.push(`<ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="${grx.toFixed(1)}" ry="${gry.toFixed(1)}" fill="var(--anatomy-lit)" opacity="0.14" filter="url(#posterGlow)"/>`);
    out.push(`<ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="${(grx * 0.6).toFixed(1)}" ry="${(gry * 0.6).toFixed(1)}" fill="var(--anatomy-lit)" opacity="0.18" filter="url(#posterGlowSoft)"/>`);

    out.push(S(slab(POSTER, 21, posterTop - 21, P, 3, 0.2), { tone: "lo", lit: true }));

    // printed matter on the lit face: headline, rules, image block, barcode
    const face = faceOf(POSTER.x + POSTER.w + 0.04, 16.8, posterTop, "right");
    const ink = "var(--anatomy-shade-0)";
    const paper = "var(--anatomy-lit-top)";
    out.push(
        `<g transform="${face}">` +
            `<rect x="2.2" y="2.2" width="29.2" height="21.3" rx="1.0" fill="none" stroke="var(--anatomy-lo)" stroke-width="0.4"/>` +
            `<rect x="4.2" y="4.4" width="16.2" height="7.4" rx="2.4" fill="${ink}"/>` +
            `<circle cx="7.6" cy="8.1" r="1.7" fill="${paper}"/>` +
            `<rect x="10.2" y="7.4" width="7.8" height="1.5" rx="0.5" fill="${paper}"/>` +
            `<rect x="4.2" y="13.8" width="13.5" height="1.2" fill="${ink}"/>` +
            `<rect x="4.2" y="16.1" width="16.8" height="1.2" fill="${ink}"/>` +
            `<rect x="4.2" y="18.4" width="10.4" height="1.2" fill="${ink}"/>` +
            `<rect x="22.4" y="13.6" width="6.4" height="7.0" fill="${ink}"/>` +
            `<rect x="23.1" y="14.4" width="5.0" height="0.9" fill="${paper}"/>` +
            `<rect x="23.1" y="16.1" width="3.4" height="0.9" fill="${paper}"/>` +
            `<rect x="4.2" y="21.0" width="3.8" height="0.7" fill="${ink}"/>` +
            `<rect x="8.8" y="21.0" width="2.0" height="0.7" fill="${ink}"/>` +
            `<rect x="11.7" y="21.0" width="4.6" height="0.7" fill="${ink}"/>` +
            `</g>`,
    );

    // the near stile of the archive frame catches the poster edge

    // strip lamp above the poster head
    out.push(S(slab({ x: 14.0, y: -2.2, w: 3.0, d: 4.4, r: 0.6 }, 44.2, 3.2, P, 2), { tone: "mid" }));
    out.push(S(slab({ x: 16.4, y: -7, w: 4.6, d: 14, r: 1.6 }, 46.6, 2.8, P, 3, 0.3), { tone: "hi" }));
    const lampFace = faceOf(21.02, 7, 49.4, "right");
    out.push(`<g transform="${lampFace}"><rect x="1.2" y="0.7" width="11.6" height="1.2" rx="0.5" fill="var(--anatomy-hi)"/><rect x="1.2" y="2.1" width="11.6" height="0.4" fill="var(--anatomy-shade-0)"/></g>`);

    // the tray and lit showcase stay dark while sealed in the case
    out.push(part("reveal", out.splice(showcaseStart).join(""), {
        alpha: [
            [0, 0],
            [2.0, 0],
            [2.85, 1, "inout"],
            [8.0, 1],
            [8.3, 0, "out"],
            [10, 0],
        ],
        extra: 'opacity="0"',
    }));

    // ---- drawer front: a heavy plate with a small deep pull niche ----
    const fx = 30;
    const fd = 7.5;
    out.push(S(slab({ x: fx + 0.2, y: -18, w: 3.8, d: 36, r: 0.7 }, 34.2, 8.4, P, 2), { tone: "mid" }));
    out.push(S(slab({ x: fx, y: -23.8, w: fd, d: 47.6, r: 1.4 }, 10.8, 23.4, P, 4, 0.6), { tone: "hi" }));
    out.push(S(slab({ x: fx, y: -23.8, w: fd, d: 47.6, r: 1.4 }, 42.6, 7.0, P, 3, 0.4), { tone: "hi" }));
    out.push(S(slab({ x: fx, y: 18, w: fd, d: 5.8, r: 0.8 }, 34.2, 8.4, P, 2, 0.3), { tone: "hi" }));
    out.push(S(slab({ x: fx, y: -23.8, w: fd, d: 5.8, r: 0.8 }, 34.2, 8.4, P, 2, 0.3), { tone: "hi" }));

    // recessed pull bar seated against the niche back, near the top
    out.push(S(slab({ x: fx + 4.0, y: -8.2, w: 2.6, d: 16.4, r: 0.9 }, 37.0, 4.2, P, 2, 0.3), { tone: "hi" }));

    // front face: fasteners, keyhole, stamping
    const frontFace = faceOf(fx + fd + 0.02, 23.8, 49.6, "right");
    out.push(
        `<g transform="${frontFace}">` +
            [[1.9, 3.2], [45.7, 3.2], [1.9, 36.8], [45.7, 36.8], [8.2, 17.2], [39.4, 17.2]]
                .map(([u, v]) =>
                    `<circle cx="${u}" cy="${v}" r="1.9" fill="var(--anatomy-shade-1)" stroke="var(--anatomy-lo)" stroke-width="0.5"/>` +
                    `<circle cx="${u}" cy="${v}" r="0.8" fill="var(--anatomy-shade-0)"/>`)
                .join("") +
            `<circle cx="23.8" cy="23.8" r="4.3" fill="var(--anatomy-shade-2)" stroke="var(--anatomy-lo)" stroke-width="0.7"/>` +
            `<circle cx="23.8" cy="23.3" r="1.5" fill="var(--anatomy-shade-0)" stroke="var(--anatomy-lo)" stroke-width="0.6"/>` +
            `<rect x="22.7" y="23.3" width="2.2" height="3.4" rx="0.3" fill="var(--anatomy-shade-0)" stroke="var(--anatomy-lo)" stroke-width="0.5"/>` +
            `<circle cx="23.8" cy="28.4" r="0.38" fill="var(--anatomy-mid)"/>` +
            `<rect x="6.4" y="29.4" width="12.4" height="0.9" fill="var(--anatomy-faint)"/>` +
            `<rect x="6.4" y="31.4" width="8.6" height="0.9" fill="var(--anatomy-faint)"/>` +
            `<rect x="6.4" y="33.4" width="11.4" height="0.9" fill="var(--anatomy-faint)"/>` +
            `<rect x="30.6" y="30.2" width="9.6" height="0.8" fill="var(--anatomy-faint)"/>` +
            `<rect x="30.6" y="32.2" width="6.2" height="0.8" fill="var(--anatomy-faint)"/>` +
            `<rect x="3.7" y="20.8" width="4.4" height="5.4" rx="0.8" fill="var(--anatomy-shade-2)" stroke="var(--anatomy-lo)" stroke-width="0.5"/>` +
            `<rect x="4.7" y="22.9" width="2.4" height="1.4" rx="0.3" fill="var(--anatomy-shade-0)"/>` +
            `<circle cx="4.4" cy="25.1" r="0.28" fill="var(--anatomy-lo)"/>` +
            `<circle cx="7.4" cy="25.1" r="0.28" fill="var(--anatomy-lo)"/>` +
            `</g>`,
    );

    // niche back: inset border and finger shadow below the bar
    const recessFace = faceOf(fx + 4.02, 18, 42.6, "right");
    out.push(
        `<g transform="${recessFace}">` +
            `<rect x="0.45" y="0.45" width="35.1" height="7.5" fill="none" stroke="var(--anatomy-lo)" stroke-width="0.5"/>` +
            `<rect x="9.7" y="0.8" width="16.6" height="0.7" fill="var(--anatomy-shade-0)"/>` +
            `<rect x="9.7" y="5.6" width="16.6" height="2.2" fill="var(--anatomy-shade-0)"/>` +
            `</g>`,
    );

    // drawer-mounted latch: a flat hasp tab over a fixed catch, near the lower edge
    const latchFace = faceOf(fx + fd + 0.02, 23.8, 49.6, "right");
    const latchTab =
        `<g transform="${latchFace}">` +
            `<rect x="5.0" y="21.1" width="2.4" height="4.9" rx="0.7" fill="var(--anatomy-shade-0)" opacity="0.6"/>` +
            `<rect x="4.7" y="20.9" width="2.4" height="4.9" rx="0.7" fill="var(--anatomy-hi)" stroke="var(--anatomy-lo)" stroke-width="0.45"/>` +
            `<circle cx="5.9" cy="22.2" r="0.9" fill="var(--anatomy-shade-1)" stroke="var(--anatomy-lo)" stroke-width="0.45"/>` +
            `<circle cx="5.9" cy="22.2" r="0.32" fill="var(--anatomy-shade-0)"/>` +
            `<path d="M5.3 24.7 H6.5" stroke="var(--anatomy-shade-1)" stroke-width="0.4"/>` +
            `</g>`;
    const pivot = pt([fx + fd + 0.02, 23.8 - 5.9, 49.6 - 20.9]);
    out.push(part("latch", latchTab, {
        pivot,
        pose: [
            [0, 0, 0, 0],
            [0.9, 0, 0, 0],
            [1.35, 0, 0, -36, "out"],
            [8.3, 0, 0, -36],
            [8.8, 0, 0, 0, "inout"],
            [10, 0, 0, 0],
        ],
    }));

    return part("drawer", out.join(""), {
        pose: [
            [0, 0, 0, 0],
            [1.5, 0, 0, 0],
            [3.2, travel[0], travel[1], 0, "out"],
            [6.4, travel[0], travel[1], 0],
            [8.3, 0, 0, 0, "inout"],
            [10, 0, 0, 0],
        ],
    });
}

// ---- welded case, near half: wall, port, lid, latch ---------------------
function drawCaseFront() {
    const out = [];
    const WALL = { x: -44, y: 26, w: 72, d: 4, r: 1 };
    out.push(S(slab(WALL, 8.4, 47.6, P, 4, 0.7), { tone: "mid" }));

    // welds at the wall edges and around the shell
    for (const z of [12.5, 52.6]) {
        out.push(LINE(seg3([-44, 30.03, z], [28, 30.03, z]), { tone: "lo" }));
        out.push(LINE(seg3([-44, 30.03, z + 0.7], [28, 30.03, z + 0.7]), { tone: "faint" }));
    }
    for (const x of [-43.6, 27.6]) {
        out.push(LINE(seg3([x, 30.03, 8.6], [x, 30.03, 55.8]), { tone: "lo" }));
        out.push(LINE(seg3([x + 0.7, 30.03, 8.6], [x + 0.7, 30.03, 55.8]), { tone: "faint" }));
    }

    // vertical scribe where the service bay was cut into the shell
    out.push(LINE(seg3([17.65, 30.03, 12.4], [17.65, 30.03, 51.6]), { tone: "faint" }));

    // raised access panel, stamped and bolted
    out.push(S(slab({ x: -21, y: 30, w: 34, d: 1.6, r: 1.0 }, 13, 35.4, P, 3, 0.4), { tone: "mid" }));
    out.push(faceBolts(faceOf(-21, 31.62, 48.4, "left"), [[2.6, 2.6], [31.4, 2.6], [2.6, 32.8], [31.4, 32.8]]));
    const panelFace = faceOf(-21, 31.63, 48.4, "left");
    out.push(
        `<g transform="${panelFace}">` +
            `<rect x="19.6" y="25.4" width="12.0" height="1.0" fill="var(--anatomy-faint)"/>` +
            `<rect x="19.6" y="27.4" width="8.2" height="1.0" fill="var(--anatomy-faint)"/>` +
            `<rect x="19.6" y="29.4" width="11.0" height="1.0" fill="var(--anatomy-faint)"/>` +
            `<rect x="19.6" y="20.6" width="12.0" height="3.2" fill="none" stroke="var(--anatomy-faint)" stroke-width="0.5"/>` +
            `</g>`,
    );

    // blanked network port near the back of the visible wall
    out.push(S(slab({ x: -41, y: 30, w: 11.4, d: 3.2, r: 0.8 }, 31.8, 12.8, P, 3, 0.4), { tone: "mid" }));
    const portFace = faceOf(-41, 33.22, 44.6, "left");
    out.push(
        `<g transform="${portFace}">` +
            `<rect x="0.5" y="0.5" width="10.4" height="11.8" rx="0.9" fill="none" stroke="var(--anatomy-lo)" stroke-width="0.6"/>` +
            `<rect x="1.4" y="1.4" width="8.6" height="10.0" rx="0.7" fill="var(--anatomy-shade-0)" stroke="var(--anatomy-lo)" stroke-width="0.5"/>` +
            `<rect x="2.4" y="2.4" width="6.6" height="8.0" rx="0.6" fill="var(--anatomy-shade-3)" stroke="var(--anatomy-mid)" stroke-width="0.6"/>` +
            `<rect x="3.4" y="3.4" width="4.6" height="4.6" rx="0.3" fill="none" stroke="var(--anatomy-lo)" stroke-width="0.4"/>` +
            `<path d="M3.4 3.4 8 8M8 3.4 3.4 8" fill="none" stroke="var(--anatomy-lo)" stroke-width="0.5"/>` +
            `<circle cx="3.05" cy="3.05" r="0.5" fill="var(--anatomy-hi)" opacity="0.85"/>` +
            `<circle cx="8.35" cy="9.95" r="0.5" fill="var(--anatomy-hi)" opacity="0.85"/>` +
            `<rect x="2.4" y="10.7" width="6.6" height="0.7" fill="var(--anatomy-lo)"/>` +
            `<circle cx="-2.3" cy="5.7" r="1.4" fill="none" stroke="var(--anatomy-faint)" stroke-width="0.5"/>` +
            `</g>`,
    );

    // empty bonding stud beside the port
    out.push(S(slab({ x: -28.2, y: 30, w: 4, d: 1.8, r: 0.6 }, 36.2, 2.2, P, 2), { tone: "mid" }));
    out.push(S(k.cylinder(-26.2, 31.2, 1.15, 38.4, 2.4, P, 8, 0.2), { tone: "hi" }));
    out.push(DOTS([pt([-26.2, 31.2, 40.9])], { size: 0.4, tone: "lo" }));

    // lid, weld beads, top seam and fasteners
    out.push(S(slab(LID, TOP, 5.2, P, 5, 1.2), { tone: "mid" }));
    out.push(LINE(topLine(P, [-42.6, 29.35], [27.2, 29.35], 61.24), { tone: "faint" }));
    out.push(LINE(topLine(P, [26.35, -29], [26.35, 28], 61.24), { tone: "faint" }));
    out.push(LINE(topLine(P, [8, -31], [8, 11.5], 61.22), { tone: "faint" }));
    out.push(LINE(topLine(P, [8, 24.5], [8, 31], 61.22), { tone: "faint" }));
    out.push(topBolt(-39, 24, 61.22, 1.7));
    out.push(topBolt(20, 24, 61.22, 1.7));
    out.push(topBolt(-39, -24, 61.22, 1.7));
    out.push(topBolt(20, -24, 61.22, 1.7));
    out.push(topBolt(-3, -25.5, 61.22, 1.7));
    out.push(labelPlate(P, { point: [10, 19.6], z: 61.25, width: 22, depth: 7.2, text: "OG / 03", size: 2.2, tone: "lo" }));

    // carry handle: pads, posts, bar and grip
    for (const y of [-24, 18]) out.push(S(slab({ x: -15, y, w: 9, d: 6, r: 0.8 }, 61.2, 2.8, P, 2, 0.3), { tone: "mid" }));
    for (const y of [-22, 16]) out.push(S(slab({ x: -13.4, y, w: 6, d: 5, r: 0.5 }, 64, 4, P, 2), { tone: "mid" }));
    out.push(S(slab({ x: -14.6, y: -22, w: 8.4, d: 44, r: 3.4 }, 66.8, 3.4, P, 4, 0.5), { tone: "hi" }));
    out.push(S(slab({ x: -15.2, y: -7.6, w: 9.6, d: 15.2, r: 3 }, 66.4, 4.4, P, 4, 0.4), { tone: "mid" }));
    for (const x of [-13.6, -10.2]) out.push(LINE(topLine(P, [x, -7.6], [x, 7.6], 70.92), { tone: "faint" }));
    out.push(topBolt(-10.5, -20.5, 70.22, 1.3));
    out.push(topBolt(-10.5, 20.5, 70.22, 1.3));

    return out.join("");
}

const body = [
    drawBench(),
    drawSpares(),
    drawCaseBack(),
    drawDrawer(),
    drawCaseFront(),
].join("");

const label =
    "Sealed archive strongbox on a steel bench, its front drawer open under a strip lamp to show a lit poster, network port blanked and capped";

const art = {
    width: WIDTH,
    height: HEIGHT,
    label,
    loop: 10,
    offset: 0.4,
    still: 4.8,
    svg: sceneSvg({
        width: WIDTH,
        height: HEIGHT,
        label,
        loop: 10,
        offset: 0.4,
        still: 4.8,
        body:
            `<defs><filter id="posterGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>` +
            `<filter id="posterGlowSoft" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.2"/></filter></defs>` +
            body,
    }),
};

export default art;
