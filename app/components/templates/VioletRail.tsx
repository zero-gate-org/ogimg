"use client";

import TemplateCard, { ImageSlot } from "./TemplateCard";
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
 * Violet Rail: a brand rail down the left, a product panel bleeding off the card.
 *
 * The card is cut into two fields at x 634.5. The left rail carries all the type:
 * a lockup of mark plus stacked wordmark at the top, and a large headline whose
 * last baseline sits low at y 540. The right field is a rounded panel that leaves
 * the canvas on both the right and the bottom, so only its top-left radius is ever
 * seen. Two lights sit under everything: a violet pool on the floor of the rail and
 * a teal edge running up the seam where the panel begins.
 *
 * The reference sets its headline in a white-to-silver ramp and paints its floor in
 * violet and teal. The ramp is dropped and the type is set solid `textColor`, while
 * the hues stay where they belong, in the background paint. That keeps the card in
 * one colour family when the user changes the text colour, and nothing depends on a
 * gradient clip, which would not survive the foreignObject export anyway. The panel
 * body is a translucent scrim rather than a solid plate, so the violet pool keeps
 * reading through it the way it does in the artwork.
 */

/** Pool hues. Background paint only, never applied to type. */
const VIOLET = "#8964F7";
const TEAL = "#2DA88B";

/** One padding drives the lockup, the headline rail, and the gutter to the panel seam. */
const PAD = 64;
const RAIL_WIDTH = 634.5;
const HEADLINE_WIDTH = RAIL_WIDTH - PAD * 2;

/** Anchored from the bottom so the last baseline lands at y 540 whatever wraps above it. */
const HEADLINE_BOTTOM = 76;
const HEADLINE_BASELINE_PX = 84;
const HEADLINE_BASELINE_EM = -0.08;
const HEADLINE_LINE = 0.98;

/** Lockup: a portrait mark, a gap, then a stacked uppercase wordmark. */
const LOCKUP_TOP = 72;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 18;
const WORDMARK_SIZE = 26;
/** Tight enough that two lines of the wordmark measure the mark's height. */
const WORDMARK_LEADING = 0.88;
const WORDMARK_WIDTH = 150;

/**
 * The vector's panel is 1153 x 849, most of it off canvas. The box is cut back to
 * just past the right and bottom edges, which is the same silhouette on screen and
 * keeps the empty state centred where it can be read rather than at x 1380.
 */
const PANEL = { x: RAIL_WIDTH, y: 65.5, width: 640, height: 600, radius: 26, bezel: 24, innerRadius: 8 };

/**
 * Light positions, in card pixels, fitted to the raster rather than to the vector's
 * gradient matrices: the export flattens both ellipses onto the card axes and steepens
 * their falloff, and this is what the reference actually reads as on screen.
 */
const VIOLET_POOL = { x: 356, y: 577, rx: 746, ry: 442, peak: 0.49, power: 1.7 };
const TEAL_EDGE = { x: 836, y: 441, rx: 597, ry: 541, peak: 0.48, power: 1.75 };

/** The panel's lit corner, in coordinates local to the panel box. */
const EDGE_HIGHLIGHT = { x: 576.5, y: 35, rx: 322, ry: 237 };

/** A (1 - r)^power falloff, written out as the linear stops CSS can actually draw. */
const falloff = (hex: string, peak: number, power: number) =>
    Array.from({ length: 11 }, (_, step) => {
        const r = step / 10;
        const alpha = Number((peak * Math.pow(1 - r, power)).toFixed(3));
        return `${hexToRgba(hex, alpha)} ${step * 10}%`;
    }).join(", ");

const pool = ({ x, y, rx, ry, peak, power, hex }: typeof VIOLET_POOL & { hex: string }) =>
    `radial-gradient(${rx}px ${ry}px at ${x}px ${y}px, ${falloff(hex, peak, power)})`;

export default function VioletRail({
    title,
    textColor = "#FAFAFA",
    logoImage,
    image,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0A0A0C",
    gradientEnd = "#101018",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
    imageFit = "cover",
    imageRadius,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();

    const floorLight = [pool({ ...VIOLET_POOL, hex: VIOLET }), pool({ ...TEAL_EDGE, hex: TEAL })].join(",");

    // The seam is a hairline everywhere, then picks the user's text colour up toward
    // the far corner, which is off canvas. That ramp is the only thing defining the
    // panel's edge, so the frame needs no shadow to separate from the rail.
    const panelEdge = [
        `radial-gradient(${EDGE_HIGHLIGHT.rx}px ${EDGE_HIGHLIGHT.ry}px at ${EDGE_HIGHLIGHT.x}px ${EDGE_HIGHLIGHT.y}px, ${hexToRgba(textColor, 0.95)} 0%, ${hexToRgba(textColor, 0)} 100%)`,
        tone.hairline,
    ].join(",");

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
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 1, background: floorLight }}
            />

            <div
                style={{
                    position: "absolute",
                    left: PANEL.x,
                    top: PANEL.y,
                    width: PANEL.width,
                    height: PANEL.height,
                    zIndex: 2,
                    borderRadius: PANEL.radius,
                    background: panelEdge,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 1,
                        borderRadius: PANEL.radius - 1,
                        background: hexToRgba(tone.veil, 0.8),
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: PANEL.bezel,
                        top: PANEL.bezel,
                        right: PANEL.bezel,
                        bottom: PANEL.bezel,
                        borderRadius: PANEL.innerRadius,
                        overflow: "hidden",
                    }}
                >
                    <ImageSlot
                        className="h-full w-full"
                        image={image}
                        fit={imageFit}
                        radius={imageRadius}
                        tone={tone}
                        emptyLabel="Product screenshot"
                    />
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: PAD,
                    top: LOCKUP_TOP,
                    zIndex: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: LOCKUP_GAP,
                }}
            >
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoImage}
                        alt=""
                        style={{ width: MARK_WIDTH, height: MARK_HEIGHT, objectFit: "contain", flexShrink: 0 }}
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
                            maxWidth: WORDMARK_WIDTH,
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: WORDMARK_LEADING,
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase",
                            textWrap: "balance",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            <div
                style={{
                    position: "absolute",
                    left: PAD,
                    bottom: HEADLINE_BOTTOM,
                    width: HEADLINE_WIDTH,
                    zIndex: 3,
                    margin: 0,
                    color: textColor,
                    fontStyle,
                    fontWeight: resolveFontWeight(fontWeight, 700),
                    textDecoration,
                    fontSize: `${resolveTitleFontSize(titleSize, HEADLINE_BASELINE_PX)}px`,
                    letterSpacing: `${resolveTitleTracking(titleTracking, HEADLINE_BASELINE_EM)}em`,
                    lineHeight: HEADLINE_LINE,
                    textWrap: "balance",
                }}
            >
                {title}
            </div>
        </TemplateCard>
    );
}
