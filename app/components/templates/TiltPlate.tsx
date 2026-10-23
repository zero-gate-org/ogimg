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
 * Tilted Plate: a dark window tipped 45 degrees, lit from its own rim.
 *
 * One rounded square carries the card. It is turned so its corners point at the
 * edges of the canvas, and it sits opaque over everything beneath it, which is
 * what makes it read as a window cut into the dark rather than as a shape
 * painted on it. Its edges catch light, brightest at the two corners that stay
 * in frame, and the only other colour on the card is the violet that pools in
 * the four corners outside the plate. No layer here uses a filter: the export
 * path inlines computed styles into a foreignObject, so every glow is a stack of
 * gradients measured from the reference instead.
 *
 * The reference draws its headline with a white to grey ramp and its domain line
 * with a similar one. That light lives in the background here, in the rim and
 * the pools, and every glyph stays flat `textColor`. A card that takes its
 * colour from the glow is the one that still holds together when the user
 * changes the text colour.
 */

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

/**
 * The two hues the reference pays for its light with. Background paint only,
 * never applied to text: `RIM` is the plate's own edge light, `POOL` the violet
 * thrown by the two far larger shapes the reference centres off canvas.
 */
const RIM = "#FF50D3";
const POOL = "#D050FF";

/** A square with 144px corners tipped a quarter turn, centred on the canvas. */
const PLATE_SIDE = 851;
const PLATE_CORNER = 144;
const PLATE_TILT = 45;
const PLATE_LEFT = (CANVAS_WIDTH - PLATE_SIDE) / 2;
const PLATE_TOP = (CANVAS_HEIGHT - PLATE_SIDE) / 2;

/**
 * Measured off the raster: the edge light starts at 0.5 alpha on the plate's
 * boundary and is gone 88px in.
 */
const RIM_ALPHA = 0.5;
const EDGE_RAMP: [number, number][] = [
    [0, 1],
    [11, 0.76],
    [23, 0.51],
    [34, 0.33],
    [46, 0.19],
    [57, 0.09],
    [69, 0.04],
    [79, 0.02],
    [88, 0],
];

/**
 * The corner arcs need their own band. A plate corner sits 60px inside the box
 * corner, so the light peaks out there rather than at the tip of the box; closer
 * than 60px is clipped away by the plate's own radius, which is why the ramp is
 * flat until it.
 */
const TIP_BAND = 210;
const TIP_ALPHA = 0.4;
const TIP_RAMP: [number, number][] = [
    [0, 1],
    [60, 1],
    [90, 0.5],
    [120, 0.25],
    [150, 0.1],
    [180, 0.03],
    [210, 0],
];

/**
 * The violet is the inner shadow of two shapes far larger than the plate, and the
 * reference draws them as rounded octagons. A circle is the honest stand-in for a
 * gradient: this one is fitted to the three places its band actually crosses the
 * card, the top edge, the two corner diagonals, so it lands about 36px inside each
 * corner on the edge and 100px in along the diagonal, and it dies hard 12px outside
 * because the reference clips its shadow to the shape. Everything the band sweeps
 * through in the middle is hidden behind the plate, which is what leaves only four
 * corner pools showing.
 */
const POOL_X = CANVAS_WIDTH / 2;
const POOL_ABOVE_Y = -160;
const POOL_BELOW_Y = CANVAS_HEIGHT + 160;
const POOL_BAND = 620;
const POOL_RADIUS = 586;
const POOL_ALPHA = 0.5;
const POOL_RAMP: [number, number][] = [
    [0, 0],
    [POOL_RADIUS - 105, 0.02],
    [POOL_RADIUS - 82, 0.08],
    [POOL_RADIUS - 59, 0.21],
    [POOL_RADIUS - 36, 0.45],
    [POOL_RADIUS - 13, 0.78],
    [POOL_RADIUS, 1],
    [POOL_RADIUS + 12, 0],
    [POOL_BAND, 0],
];

/** (distance along the band, level of the peak alpha) to gradient stops. */
const stops = (hex: string, peak: number, ramp: [number, number][]) =>
    ramp.map(([position, level]) => `${hexToRgba(hex, peak * level)} ${position}px`).join(", ");

const edgeBand = (to: string) => `linear-gradient(${to}, ${stops(RIM, RIM_ALPHA, EDGE_RAMP)})`;

const tipBand = (at: string) => `radial-gradient(${TIP_BAND}px ${TIP_BAND}px at ${at}, ${stops(RIM, TIP_ALPHA, TIP_RAMP)})`;

const poolBand = (y: number) =>
    `radial-gradient(${POOL_BAND}px ${POOL_BAND}px at ${POOL_X}px ${y}px, ${stops(POOL, POOL_ALPHA, POOL_RAMP)})`;

/** Lockup: the reference's mark, a hair of air, then an uppercase wordmark on two lines. */
const LOCKUP_TOP = 99;
const MARK_WIDTH = 36;
const MARK_HEIGHT = 48;
const LOCKUP_GAP = 12;
const WORDMARK_SIZE = 29;
/** Tight enough that two lines of the wordmark measure the mark's height. */
const WORDMARK_LEADING = 0.87;
const WORDMARK_WIDTH = 140;

/** The band the headline is centred in, placed so two lines at 101px start on the
 *  reference's own cap line at y228.8. */
const HEADLINE_TOP = 101;
const HEADLINE_BOTTOM = 99;
const HEADLINE_WIDTH = 620;
const BASELINE_PX = 101;
const BASELINE_EM = -0.08;
/** The reference sets its two baselines 96px apart at 101px of type. */
const HEADLINE_LEADING = 0.95;

const DOMAIN_BOTTOM = 76;
const DOMAIN_SIZE = 40;

export default function TiltPlate({
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
    gradientEnd = "#14081A",
    gradientAngle = 160,
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
            {/*
              Laid under the plate on purpose: the plate's fill is what cuts this
              light back down to the four corners, exactly as the vector does.
            */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: [poolBand(POOL_ABOVE_Y), poolBand(POOL_BELOW_Y)].join(", ") }}
            />

            {/* The plate. Its rim is painted in the plate's own rotated frame, so the light follows the tipped edges. */}
            <div
                className="absolute pointer-events-none"
                style={{
                    left: PLATE_LEFT,
                    top: PLATE_TOP,
                    width: PLATE_SIDE,
                    height: PLATE_SIDE,
                    borderRadius: PLATE_CORNER,
                    transform: `rotate(${PLATE_TILT}deg)`,
                    backgroundColor: tone.veil,
                    backgroundImage: [
                        edgeBand("to bottom"),
                        edgeBand("to top"),
                        edgeBand("to right"),
                        edgeBand("to left"),
                        tipBand("0% 0%"),
                        tipBand("100% 0%"),
                        tipBand("0% 100%"),
                        tipBand("100% 100%"),
                    ].join(", "),
                }}
            />

            {/* Brand lockup, centred as one group at the top of the plate. */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: LOCKUP_TOP }}
            >
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoImage}
                        alt=""
                        style={{ width: MARK_WIDTH, height: MARK_HEIGHT, objectFit: "contain", flexShrink: 0 }}
                    />
                ) : (
                    /*
                      Empty state: the reference's own mark, a diagonal bar punched
                      out of a filled square so the two can never drift apart.
                    */
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
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase",
                            textDecoration,
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/* Two lines of display type, centred inside the plate rather than on top of it. */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: HEADLINE_TOP, bottom: HEADLINE_BOTTOM }}
            >
                <h1
                    style={{
                        maxWidth: HEADLINE_WIDTH,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, BASELINE_PX)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, BASELINE_EM)}em`,
                        lineHeight: HEADLINE_LEADING,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </h1>
            </div>

            {domain && (
                <p
                    className="absolute left-0 right-0"
                    style={{
                        bottom: DOMAIN_BOTTOM,
                        color: hexToRgba(textColor, 0.86),
                        fontSize: DOMAIN_SIZE,
                        fontWeight: 500,
                        lineHeight: 1,
                        letterSpacing: "-0.005em",
                        textAlign: "center",
                        fontStyle,
                        textDecoration,
                    }}
                >
                    {domain}
                </p>
            )}
        </TemplateCard>
    );
}
