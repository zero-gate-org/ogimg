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
 * Cyan Rim: two black shapes you only see because their edges catch light.
 *
 * A disc far larger than the card hangs off the top-left corner, and a beam
 * falls from the top edge toward the bottom centre. Both are filled with the
 * same near-black as the card, so neither reads as a shape: each reads as a
 * single lit edge, a crescent of cyan along the disc's lower right arc and a
 * straight cyan seam down the beam's leading edge. The product panel runs off
 * the right and bottom of the canvas and the beam dies behind it about a third
 * of the way down, which is what fixes the light in the card rather than on top
 * of it. The headline holds the left rail, centred on the card's midline, with a
 * compact lockup at the top of that rail and a support line under it.
 *
 * The reference paints its headline with a white-to-silver ramp and does all of
 * its colour with that cyan light. The light stays in the background here and
 * the type is set solid `textColor`, so a card keeps one colour family when the
 * user changes it and nothing depends on a gradient clip. Both lit edges are
 * built from one measured falloff, once curved and once straight, so they read
 * as the same source. No layer uses a filter: the export path inlines computed
 * styles into a foreignObject, so every glow is a stack of gradient stops.
 */

/** The light's hue. Background paint only, never applied to type. */
const RIM_CYAN = "#00E9FF";
const INK = "#070A0C";

/** The disc: centre off canvas, so only its lower right arc is ever in frame. */
const DISC = { cx: -85.2, cy: 55, r: 467.8 };

/**
 * The beam's leading edge crosses the top of the card at x 902 and leans 30deg
 * left as it falls, reaching x 539 at the bottom. The band is drawn on a rotated
 * box whose corner sits above the canvas, so the rotated edge rather than the
 * box's own top is what cuts the light off.
 */
const BEAM_EDGE_AT_TOP = 902.2;
const BEAM_TILT = 30;
const BEAM_LIFT = 200;
const BEAM_LEFT = BEAM_EDGE_AT_TOP + BEAM_LIFT * Math.tan((BEAM_TILT * Math.PI) / 180);
const BEAM_BOX = 1500;

/**
 * Falloff measured off the raster: the light peaks at half alpha on the edge
 * itself and is gone 100px inside it, on both shapes.
 */
const RIM_PEAK = 0.51;
const RIM_DEPTH: [number, number][] = [
    [0, 1],
    [4, 0.92],
    [10, 0.82],
    [18, 0.71],
    [30, 0.54],
    [45, 0.35],
    [60, 0.22],
    [80, 0.09],
    [100, 0],
];

const rimStops = (place: (depth: number) => number) =>
    RIM_DEPTH.map(([depth, level]) => `${hexToRgba(RIM_CYAN, RIM_PEAK * level)} ${place(depth).toFixed(1)}px`);

/** Read from the centre outward, so the stop list is turned around to ascend. */
const arcRim = `radial-gradient(${DISC.r}px ${DISC.r}px at ${DISC.r}px ${DISC.r}px, ${rimStops(
    (depth) => DISC.r - depth,
).reverse().join(", ")})`;

const edgeRim = `linear-gradient(to right, ${rimStops((depth) => depth).join(", ")})`;

/**
 * The panel bleeds off the right and the bottom, so the top left radius is the
 * only corner ever seen. The box runs just past both edges to keep it that way.
 */
const PANEL_RADIUS = 26;
const PANEL = {
    left: 695.5,
    top: 65.5,
    width: 1200 - 695.5 + PANEL_RADIUS + 8,
    height: 630 - 65.5 + PANEL_RADIUS + 8,
};

/**
 * The panel's top hairline catches the beam off canvas to the right, so the edge
 * light only gathers over the last third of the visible edge. It is the user's
 * text colour rather than a fixed white, so a light card gets shade on its edge.
 */
const PANEL_EDGE: [number, number][] = [
    [0, 0],
    [40, 0.05],
    [60, 0.14],
    [80, 0.36],
    [100, 0.62],
];

const edgeLight = (ink: string) =>
    PANEL_EDGE.map(([at, alpha]) => `${hexToRgba(ink, alpha)} ${at}%`).join(", ");

const RAIL_LEFT = 68;
const RAIL_WIDTH = 600;
/** Equal insets, which puts the headline block on the card's midline. */
const RAIL_INSET = 92;
const TITLE_BASELINE_PX = 93;
const TITLE_TRACKING_EM = -0.08;
/** The reference sets its two baselines 88px apart at 93px of type. */
const TITLE_LINE = 0.95;

const TAG_GAP = 28;
const TAG_RULE_WIDTH = 56;
const TAG_WIDTH = 452;
const TAG_SIZE = 20;
const TAG_LINE = 1.45;

const LOCKUP_TOP = 64;
/** The mark keeps the fallback's own 36:48 proportion. */
const MARK_WIDTH = 24;
const MARK_HEIGHT = 32;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 20;
const WORDMARK_WIDTH = 200;

export default function CyanRim({
    title,
    textColor = "#FAFAFA",
    logoImage,
    image,
    tag,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = INK,
    gradientEnd = "#0A0A0C",
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
    const support = (tag || "").trim();
    const panelRadius =
        typeof imageRadius === "number" && Number.isFinite(imageRadius) && imageRadius > 0
            ? imageRadius
            : PANEL_RADIUS;

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
            {/* The disc. Its body is a shade off the base fill, and the rim is the
                only part of its edge that lands inside the card. */}
            <div
                className="pointer-events-none absolute"
                style={{
                    left: DISC.cx - DISC.r,
                    top: DISC.cy - DISC.r,
                    width: DISC.r * 2,
                    height: DISC.r * 2,
                    borderRadius: "50%",
                    backgroundColor: hexToRgba(tone.veil, 0.5),
                    backgroundImage: arcRim,
                    zIndex: 1,
                }}
            />

            {/* The beam, drawn under the panel so the panel cuts it off. */}
            <div
                className="pointer-events-none absolute"
                style={{
                    left: BEAM_LEFT,
                    top: -BEAM_LIFT,
                    width: BEAM_BOX,
                    height: BEAM_BOX,
                    transform: `rotate(${BEAM_TILT}deg)`,
                    transformOrigin: "0 0",
                    backgroundImage: edgeRim,
                    zIndex: 2,
                }}
            />

            <div
                className="pointer-events-none absolute"
                style={{ left: PANEL.left, top: PANEL.top, width: PANEL.width, height: PANEL.height, zIndex: 3 }}
            >
                <ImageSlot
                    className="h-full w-full"
                    image={image}
                    fit={imageFit}
                    radius={panelRadius}
                    tone={tone}
                    emptyLabel="Product screenshot"
                />
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: panelRadius,
                        right: panelRadius,
                        height: 1,
                        background: `linear-gradient(90deg, ${edgeLight(textColor)})`,
                    }}
                />
            </div>

            {/* Compact lockup at the head of the rail. */}
            <div
                style={{
                    position: "absolute",
                    left: RAIL_LEFT,
                    top: LOCKUP_TOP,
                    zIndex: 4,
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
                    <p
                        style={{
                            margin: 0,
                            maxWidth: WORDMARK_WIDTH,
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 600),
                            textDecoration,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: 1.1,
                            letterSpacing: "-0.015em",
                        }}
                    >
                        {wordmark}
                    </p>
                )}
            </div>

            <div
                style={{
                    position: "absolute",
                    left: RAIL_LEFT,
                    top: RAIL_INSET,
                    bottom: RAIL_INSET,
                    width: RAIL_WIDTH,
                    zIndex: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {/* The support line hangs off the headline's own box, so an empty one
                    leaves no gap and a filled one never moves the centring. */}
                <div style={{ position: "relative" }}>
                    <div
                        style={{
                            margin: 0,
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: `${resolveTitleFontSize(titleSize, TITLE_BASELINE_PX)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, TITLE_TRACKING_EM)}em`,
                            lineHeight: TITLE_LINE,
                            textWrap: "balance",
                        }}
                    >
                        {title}
                    </div>

                    {support && (
                        <div style={{ position: "absolute", top: "100%", left: 0, width: RAIL_WIDTH }}>
                            <div
                                style={{
                                    width: TAG_RULE_WIDTH,
                                    height: 1,
                                    marginTop: TAG_GAP,
                                    backgroundColor: tone.hairline,
                                }}
                            />
                            <p
                                style={{
                                    margin: "20px 0 0",
                                    maxWidth: TAG_WIDTH,
                                    color: tone.secondary,
                                    fontStyle,
                                    fontWeight: resolveFontWeight(fontWeight, 500),
                                    textDecoration,
                                    fontSize: TAG_SIZE,
                                    lineHeight: TAG_LINE,
                                    letterSpacing: "-0.005em",
                                }}
                            >
                                {support}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </TemplateCard>
    );
}
