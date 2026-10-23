"use client";

import * as React from "react";
import { FIGURE_SVG } from "../generated/figure.generated";
import { SLOT } from "../generated/tour.generated";
import PressLive from "./PressLive";

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

// The card slot mirrors the output-tray landing plan, projected by the same
// audited geometry that draws the figure, so it stays glued to the tray at
// every size the svg scales to.
export const SLOT_STYLE: React.CSSProperties = {
  left: pct(SLOT.left),
  top: pct(SLOT.top),
  width: pct(SLOT.width),
  height: pct(SLOT.height),
};

/**
 * The isometric OG-1 compositor, for the hero figure card. The static svg body
 * is a generated literal (see ../scripts/gen-react.mjs) — the geometry kit that
 * draws it never ships to the client; only this string does. Moving parts are
 * <g data-part> nodes animated by <PressLive>, and `children` prints on the
 * output tray slot where the finished card lands.
 */
export default function PressFigure({ children }: { children?: React.ReactNode }) {
  return (
    <div data-press-root className="relative">
      <div
        className="[&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: FIGURE_SVG }}
      />
      <div
        className="pointer-events-none absolute grid place-items-center overflow-hidden rounded-[2px] bg-white text-[#0a0a0a] shadow-[0_18px_40px_-18px_#000000cc,0_0_0_1px_#00000022]"
        style={SLOT_STYLE}
        aria-hidden={children ? undefined : true}
      >
        {children ?? (
          <span className="font-mono text-[clamp(11px,1.9vw,19px)] font-semibold leading-none tracking-[0.08em]">
            1200 × 630
          </span>
        )}
      </div>
      <PressLive />
    </div>
  );
}
