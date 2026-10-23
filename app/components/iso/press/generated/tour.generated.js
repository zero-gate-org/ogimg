// GENERATED FILE — do not edit by hand.
// Source of truth: app/components/iso/press/art.mjs (via build.mjs).
// Refresh with:  node app/components/iso/press/scripts/gen-react.mjs

export const AX = [[1.42,0.71],[-1.42,0.71],[0,-1.74]];

export const SLOT = {"left":0.1709,"top":0.4172,"width":0.1535,"height":0.1356};

export const TOUR = {
  "loop": 9.4,
  "T": 6.5,
  "sheet": {
    "x": -128,
    "y": -67.6,
    "w": 54,
    "d": 28,
    "z": 12.6
  },
  "sheetAt": {
    "x": -102,
    "y": 2,
    "w": 54,
    "d": 28,
    "z": 4
  },
  "tray": {
    "x": -102,
    "y": 45.8,
    "w": 54,
    "d": 28,
    "z": 0.5
  },
  "spots": [
    {
      "name": "headline",
      "u": [
        0.05,
        0.3
      ],
      "v": [
        0.08,
        0.38
      ]
    },
    {
      "name": "photo",
      "u": [
        0.36,
        0.62
      ],
      "v": [
        0.1,
        0.62
      ]
    },
    {
      "name": "accent",
      "u": [
        0.68,
        0.72
      ],
      "v": [
        0.1,
        0.6
      ]
    },
    {
      "name": "logo",
      "u": [
        0.82,
        0.94
      ],
      "v": [
        0.1,
        0.24
      ]
    }
  ],
  "plateH": 0.9,
  "plateBase": 4.8,
  "stored": {
    "y": -64.6,
    "z": 19.6
  },
  "box": {
    "y": -66,
    "drop": 3.2
  },
  "out": 1.8,
  "glideY": -45,
  "magFront": -36,
  "sheetRise": 15.4,
  "drum": {
    "x": -23,
    "rest": 13,
    "r": 5,
    "y0": 2,
    "y1": 30,
    "bed": 4,
    "sheetTop": 4.8,
    "cradleTop": 8,
    "cradleWest": -26,
    "cradleEast": -20
  },
  "t": {
    "feed": [
      0.1,
      0.32,
      0.72,
      1.1
    ],
    "plate0": 1.1,
    "plateGap": 0.28,
    "plateDur": 0.52,
    "plateOut": 0.18,
    "plateGlide": 0.18,
    "roll": [
      2.5,
      2.8,
      3.9,
      4.35,
      4.5
    ],
    "hold": 4.9,
    "exit": [
      4.9,
      5.6,
      5.85
    ],
    "plateRet": 5.85,
    "plateRetGap": 0.38,
    "plateRetDur": 0.55,
    "plateRetRise": 0.15,
    "plateRetFly": 0.28,
    "sheetRet": [
      7.8,
      8,
      8.65,
      9
    ]
  }
};

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
