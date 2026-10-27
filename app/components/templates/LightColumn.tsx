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
 * Light Column: a shaft of light standing behind the card.
 *
 * One violet column runs top to bottom through the centre. It is darkest down
 * its own middle and brightest along its two vertical edges, so the card reads
 * as a dark panel with a lit volume behind it rather than a stripe painted on
 * top. The lockup, the headline and the domain all sit on the centre line, and
 * the headline crosses the two bright edges without losing a letter, because
 * the light is a hollow tube and the type lands in the gap between its walls.
 *
 * The reference gets that hollow tube from two very tall rounded rectangles
 * carrying a 50px inner shadow, and it sets its headline in a white to silver
 * ramp. Neither survives here: the export path cannot rely on a blur, and a
 * gradient clipped to type would split the card into two colour families the
 * moment a user changes the text colour. So the shadow is re-solved as a
 * falloff table read straight off the rendered artwork and painted with layered
 * linear and radial gradients, and the violet stays where it belongs, in the
 * background. Every letter is solid `textColor`.
 */

/** Column violet, lifted from the reference's inner shadow. Paint only, never applied to type. */
const VIOLET = "#D050FF";

/** The column's own edges, measured off the artwork. */
const SHAFT_LEFT = 365;
const SHAFT_RIGHT = 834;
const SHAFT_WIDTH = SHAFT_RIGHT - SHAFT_LEFT;

/** How far one edge's glow reaches inward toward the dark middle. */
const GLOW_BAND = 120;
/** How far the same light spills back out past its own edge. */
const SPILL_RADIUS = 96;

/**
 * One edge's falloff as [fraction of the band, alpha], sampled from the render.
 * It drops faster than a linear ramp right off the edge and then keeps a long
 * tail, which is the shape a wide blur of a hard edge actually leaves.
 */
const EDGE_RAMP: [number, number][] = [
    [0, 0.74],
    [0.09, 0.645],
    [0.175, 0.548],
    [0.26, 0.457],
    [0.34, 0.36],
    [0.425, 0.264],
    [0.51, 0.188],
    [0.59, 0.125],
    [0.675, 0.082],
    [0.76, 0.043],
    [0.84, 0.024],
    [0.925, 0.006],
    [1, 0],
];

const BAND_FRACTION = GLOW_BAND / SHAFT_WIDTH;

const stopAt = (position: number, alpha: number) =>
    `${hexToRgba(VIOLET, alpha)} ${(position * 100).toFixed(2)}%`;

/**
 * Both falloffs laid on one 90deg axis across the column, so the middle is a
 * real gap between two ramps rather than a shape drawn over the light.
 */
const SHAFT_FILL = `linear-gradient(90deg, ${[
    ...EDGE_RAMP.map(([fraction, alpha]) => stopAt(fraction * BAND_FRACTION, alpha)),
    ...[...EDGE_RAMP].reverse().map(([fraction, alpha]) => stopAt(1 - fraction * BAND_FRACTION, alpha)),
].join(", ")})`;

/**
 * The ambient the hard clip would not give on its own: a wide, dim bloom
 * centred on each edge line, which softens where the column meets the black.
 * Its vertical radius is deliberately enormous so the shaft stays as bright at
 * the top of the card as it is at the middle.
 */
const spillAt = (x: number) =>
    `radial-gradient(${SPILL_RADIUS}px 220% at ${x}px 50%, ${hexToRgba(VIOLET, 0.12)} 0%, ${hexToRgba(VIOLET, 0.045)} 34%, ${hexToRgba(VIOLET, 0)} 72%)`;

const SPILL_FILL = [spillAt(SHAFT_LEFT), spillAt(SHAFT_RIGHT)].join(", ");

/** Lockup: a portrait mark, a hair of air, then a stacked uppercase wordmark. */
const LOCKUP_TOP = 99;
const MARK_WIDTH = 36;
const MARK_HEIGHT = 48;
const LOCKUP_GAP = 12;
const WORDMARK_SIZE = 30;
/** Tight enough that two lines of the wordmark measure the mark's height. */
const WORDMARK_LEADING = 0.87;
const WORDMARK_WIDTH = 118;

/**
 * The headline is centred in this band rather than pinned to a baseline. Its box
 * starts at y 214, which is the reference's first cap line at y 224.6 less the
 * air a line box leaves above a cap.
 */
const HEADLINE_TOP = 195;
const HEADLINE_BOTTOM = 173;
const HEADLINE_WIDTH = 880;

const DOMAIN_BOTTOM = 77;
const DOMAIN_SIZE = 38;

export default function LightColumn({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0A0A0C",
    gradientEnd = "#0A0A0C",
    gradientAngle = 150,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const domain = (tag || "").trim();

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
            <div style={{ position: "absolute", inset: 0, background: SPILL_FILL }} />
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: SHAFT_LEFT,
                    width: SHAFT_WIDTH,
                    background: SHAFT_FILL,
                }}
            />

            {/* Brand lockup, centred as one group at the top of the column. */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: LOCKUP_TOP,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoImage}
                        alt=""
                        style={{
                            width: MARK_WIDTH,
                            height: MARK_HEIGHT,
                            objectFit: "contain",
                            flexShrink: 0,
                        }}
                    />
                ) : (
                    <svg
                        width={MARK_WIDTH}
                        height={MARK_HEIGHT}
                        viewBox="0 0 36 48"
                        fill="none"
                        aria-hidden="true"
                        style={{ display: "block", flexShrink: 0 }}
                    >
                        <path
                            fillRule="evenodd"
                            d="M0 0V48H36V0ZM6.9 5L31 37.2V5H6.9ZM29.1 43L5 10.8V43H29.1Z"
                            fill={textColor}
                        />
                    </svg>
                )}

                {wordmark && (
                    <span
                        style={{
                            marginLeft: LOCKUP_GAP,
                            maxWidth: WORDMARK_WIDTH,
                            color: textColor,
                            fontStyle,
                            fontWeight: 700,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: WORDMARK_LEADING,
                            letterSpacing: "-0.03em",
                            textTransform: "uppercase",
                            textDecoration,
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/* The headline, set across the column so its edges pass behind it. */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: HEADLINE_TOP,
                    bottom: HEADLINE_BOTTOM,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        margin: 0,
                        maxWidth: HEADLINE_WIDTH,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 118)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.08)}em`,
                        lineHeight: 0.95,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </div>
            </div>

            {domain && (
                <p
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: DOMAIN_BOTTOM,
                        margin: 0,
                        color: tone.primary,
                        fontStyle,
                        fontWeight: 500,
                        textDecoration,
                        fontSize: DOMAIN_SIZE,
                        lineHeight: 1,
                        letterSpacing: "-0.01em",
                        textAlign: "center",
                    }}
                >
                    {domain}
                </p>
            )}
        </TemplateCard>
    );
}
