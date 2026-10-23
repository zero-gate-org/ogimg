"use client";

import * as React from "react";
import { useInView, useLoop, useStillness } from "../../kit/react/live";
import { AX, TOUR, tourFrames } from "../generated/tour.generated";

// Subtree roots the tour drives; ids match the emitted figure's data-part
// groups. The counter digits and readout copy live inside the hero card.
const MOVER_IDS = ["sheet", "plate-0", "plate-1", "plate-2", "plate-3", "brayer"];

type Nodes = {
  movers: Array<Element | null>;
  count: Element | null;
  readout: Element | null;
};

const settle = (value: number) => value.toFixed(2);

/**
 * Runs the compositor's press cycle against the static figure. The tour is a
 * pure state machine (../generated/tour.generated.js, shared with the verify
 * page), so the client ships one literal and no geometry code.
 *
 * Plays while the figure is in view, and the cycle clock keeps clipping-free
 * position when scrolling back. Under prefers-reduced-motion it parks the
 * cycle at its mid-press beat (the sheet set, plates down) once.
 */
export default function PressLive() {
  const marker = React.useRef<HTMLDivElement>(null);
  const inView = useInView(marker);
  const still = useStillness();
  const nodes = React.useRef<Nodes | null>(null);
  const clock = React.useRef(0);

  const show = React.useCallback((t: number) => {
    const root = marker.current?.closest("[data-press-root]");
    if (!root) return;
    const f = tourFrames(t, TOUR);
    // Cache the svg movers the first time — the figure body never changes.
    if (!nodes.current) {
      nodes.current = {
        movers: MOVER_IDS.map((id) => root.querySelector(`[data-part="${id}"]`)),
        count: root.querySelector("[data-count]"),
        readout: document.querySelector("[data-readout]"),
      };
    }
    const { movers, readout } = nodes.current;
    movers.forEach((node, index) => {
      const d = index === 0 ? f.sheet : index === movers.length - 1 ? [f.brayer.dx, 0, f.brayer.dz] : f.plates[index - 1];
      if (!node) return;
      const x = d[0] * AX[0][0] + d[1] * AX[1][0] + d[2] * AX[2][0];
      const y = d[0] * AX[0][1] + d[1] * AX[1][1] + d[2] * AX[2][1];
      node.setAttribute("transform", `translate(${settle(x)} ${settle(y)})`);
    });
    const counted = String(f.count).padStart(3, "0");
    const digits = nodes.current.count;
    if (digits && digits.textContent !== counted) digits.textContent = counted;
    if (readout && readout.textContent !== f.phase) readout.textContent = f.phase;
  }, []);

  useLoop(
    (dt) => {
      clock.current += dt;
      show(clock.current);
      return true; // the tour is an endless loop
    },
    inView && !still,
  );

  React.useEffect(() => {
    if (still) show(5.0);
  }, [still, show]);

  // The marker gives useInView a target that spans the whole figure.
  return <div ref={marker} aria-hidden className="pointer-events-none absolute inset-0 -z-10" />;
}
