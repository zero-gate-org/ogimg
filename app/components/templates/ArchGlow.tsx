"use client";

import TemplateCard from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    hexToRgba,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Arch Glow: one dome of violet light behind a headline scaled to fill.
 *
 * The light is a single elliptical field whose source sits below the bottom edge
 * and to the left of centre, so the bright crest of it rises across the upper
 * third, lands on the left edge just under mid height, and walks off the bottom
 * right. Inside the crest the field dies out in a square curve, which is what
 * leaves a hard black bowl for the type to sit in. The only other marks on the
 * card are a 160px hairline grid, drawn under the light so it dissolves into it,
 * and a headline at 152px that runs to within a hand's width of both side edges.
 *
 * The reference paints its headline with a white-to-silver ramp and lets the
 * violet wash over the letters. Both live here in the background instead: the
 * type is one solid `textColor` laid over the arch rather than lit through it,
 * so the headline stays readable where the light is thickest and the whole card
 * still holds together when the user changes the text colour. Every layer is
 * drawn with CSS gradients, and none of them leans on blur, so the card survives
 * the foreignObject export intact.
 */

/** Arch paint, lifted from the reference's gradient stops. Background only, never applied to type. */
const VIOLET = "#500CB0";
/** The hot outer end of the same field, which is also what touches the top-left corner. */
const CREAM = "#FFE9C5";

/**
 * Solved from the reference's gradient matrix: an ellipse of these two radii on
 * this tilt, with its centre 62px below the bottom edge. The tilt is what pushes
 * the crest right of the source instead of straight above it.
 */
const ARCH_X = 305.8;
const ARCH_Y = 692.3;
const ARCH_RX = 1193.4;
const ARCH_RY = 656.1;
const ARCH_TILT = -31.75;

/** Square layer, centred on the arch, big enough that no corner of the canvas escapes it. */
const ARCH_LAYER = 2400;

/** Where the light reaches full saturation, and where it stops being dark, as a share of the radii. */
const DARK_EDGE = 48.8;
const CREST_EDGE = 71.3;

/** Hairline grid as the reference registers it: 160 x 157.5 cells, first crossing at 120, 157. */
const GRID_CELL_X = 159.875;
const GRID_CELL_Y = 157.5;
const GRID_ORIGIN_X = 120.125;
const GRID_ORIGIN_Y = 157.25;

/**
 * The reference's headline ink runs from y185 to y470, which is two lines at
 * 152px with 144px of advance, so the block starts here and is not centred in
 * the leftover space.
 */
const HEADLINE_TOP = 173;
const HEADLINE_WIDTH = 940;
/** The reference sets its two lines 144px apart at 152px, so the leading is under one. */
const HEADLINE_LINE = 0.95;

/** The tag sits under the arch, on the same low band the rest of this family uses. */
const TAG_BOTTOM = 60;
const TAG_WIDTH = 720;
const TAG_SIZE = 26;
const TAG_TRACKING = 0.18;

/**
 * The crest. Alpha is sampled as the square of the ramp position because the
 * reference's falloff composites that way, and it is the difference between a
 * lit edge and a lamp.
 */
const CREST_STOPS = Array.from({ length: 5 }, (_, index) => {
    const t = index / 4;
    const position = DARK_EDGE + (CREST_EDGE - DARK_EDGE) * t;
    return `${hexToRgba(VIOLET, t * t)} ${position.toFixed(2)}%`;
}).join(", ");

/**
 * The outer wash. Laid over an already opaque violet field, a linear cream alpha
 * is the same colour as the reference's violet-to-cream mix, stop for stop.
 */
const WASH_STOPS = [
    `${hexToRgba(CREAM, 0)} 0%`,
    `${hexToRgba(CREAM, 0)} ${CREST_EDGE}%`,
    `${hexToRgba(CREAM, 1)} 100%`,
].join(", ");

export default function ArchGlow({
    title,
    textColor = "#FAFAFA",
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0A0A0C",
    gradientEnd = "#1A0B33",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.06,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const tagline = (tag || "").trim();
    const gridLine = hexToRgba(gridColor ?? textColor, gridOpacity);
    const centre = ARCH_LAYER / 2;
    const shape = `${ARCH_RX}px ${ARCH_RY}px at ${centre}px ${centre}px`;

    return (
        <TemplateCard
            tone={tone}
            textColor={textColor}
            fontFamily={fontFamily}
            backgroundMode={backgroundMode}
            gradientStart={gradientStart}
            gradientEnd={gradientEnd}
            gradientAngle={gradientAngle}
            backgroundPresetId={backgroundPresetId}
            gridOverlay={gridOverlay}
            gridColor={gridColor}
            gridOpacity={gridOpacity}
            gridBlur={gridBlur}
        >
            {/* The grid is painted before the arch on purpose, so the lines fade
                out into the light toward the edges the way they do in the art. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: [
                        `linear-gradient(${gridLine} 1px, transparent 1px)`,
                        `linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
                    ].join(","),
                    backgroundSize: `${GRID_CELL_X}px ${GRID_CELL_Y}px, ${GRID_CELL_X}px ${GRID_CELL_Y}px`,
                    backgroundPosition: `${GRID_ORIGIN_X}px ${GRID_ORIGIN_Y}px, ${GRID_ORIGIN_X}px ${GRID_ORIGIN_Y}px`,
                }}
            />

            <div
                className="absolute pointer-events-none"
                style={{
                    left: ARCH_X - centre,
                    top: ARCH_Y - centre,
                    width: ARCH_LAYER,
                    height: ARCH_LAYER,
                    transform: `rotate(${ARCH_TILT}deg)`,
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(${shape}, ${hexToRgba(VIOLET, 0)} 0%, ${CREST_STOPS})` }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(${shape}, ${WASH_STOPS})` }}
                />
            </div>

            <h1
                className="absolute left-0 right-0"
                style={{
                    top: HEADLINE_TOP,
                    margin: "0 auto",
                    maxWidth: HEADLINE_WIDTH,
                    color: textColor,
                    fontStyle,
                    fontWeight: resolveFontWeight(fontWeight, 700),
                    textDecoration,
                    fontSize: `${resolveTitleFontSize(titleSize, 152)}px`,
                    letterSpacing: `${resolveTitleTracking(titleTracking, -0.08)}em`,
                    lineHeight: HEADLINE_LINE,
                    textAlign: "center",
                    textWrap: "balance",
                }}
            >
                {title}
            </h1>

            {tagline && (
                <p
                    className="absolute left-0 right-0"
                    style={{
                        bottom: TAG_BOTTOM,
                        margin: "0 auto",
                        maxWidth: TAG_WIDTH,
                        color: tone.secondary,
                        fontStyle,
                        textDecoration,
                        fontWeight: 600,
                        fontSize: TAG_SIZE,
                        lineHeight: 1,
                        letterSpacing: `${TAG_TRACKING}em`,
                        textTransform: "uppercase",
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {tagline}
                </p>
            )}
        </TemplateCard>
    );
}
