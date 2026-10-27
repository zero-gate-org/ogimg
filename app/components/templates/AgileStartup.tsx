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
 * Agile Startup: a headline set on black and lit from two opposite corners.
 *
 * Measured off refs/01.svg. The light is the whole design: a cream bloom in the
 * top-left corner and its twin in the bottom-right, each one a violet halo
 * fading out over the black, with a wide hairline grid laid under both so the
 * lines dissolve into the light as they approach a corner.
 *
 * The reference builds each bloom from a radial gradient whose far stop carries no
 * colour of its own, so an SVG renderer drops the violet's colour and its alpha
 * together and the halo falls off as the square of the distance across it. CSS
 * gradients interpolate premultiplied, where the same two stops read as a straight
 * ramp that reaches about twice as far, so the curve is written out as stops of
 * its own. That puts the result within a point or two of the reference composite
 * at every sample taken along the ramp.
 *
 * The lower bloom is the one shape that cannot be lifted across directly: the
 * reference tilts its ellipse off the card's axes, and a CSS radial gradient
 * cannot. It is redrawn axis-aligned with its radii measured so the cream core
 * still reaches the reference's distance along the bottom edge (228px) and the
 * right one (302px). Only its diagonal bulge differs, and by about a tenth.
 */
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

/** The reference's two ramp hues, kept as background paint and never put on type. */
const CREAM = "#FFE9C5";
const VIOLET = "#500CB0";

/** Where the ramp turns, as a share of each bloom's own radius. */
const CORE = 20.878;
const RING = 31.25;
const FADE = 51.206;

/** Quarter-points of the violet-to-nothing run, at their reference alphas. */
const TAIL = [0.25, 0.5, 0.75]
    .map((step) => `${hexToRgba(VIOLET, (1 - step) ** 2)} ${(RING + step * (FADE - RING)).toFixed(3)}%`)
    .join(", ");

const bloom = (rx: number, ry: number, x: number, y: number) =>
    `radial-gradient(${rx}px ${ry}px at ${x}px ${y}px, ${CREAM} 0%, ${CREAM} ${CORE}%, ${VIOLET} ${RING}%, ${TAIL}, ${hexToRgba(
        VIOLET,
        0,
    )} ${FADE}%, ${hexToRgba(VIOLET, 0)} 100%)`;

/** The upper bloom is a circle on the corner, 1084px in radius in the reference. */
const UPPER_RADIUS = 1084;
/** The lower one, measured off the reference composite along the two edges it touches. */
const LOWER_RX = 1092;
const LOWER_RY = 1446;

const GRID_CELL = 160;
/**
 * The grid is registered to the composition rather than to the canvas corner:
 * verticals land on 120 / 280 / 440 / 600 / 760 / 920 / 1080, so one falls on the
 * card's centre line, and horizontals on 156 / 316 / 476, so one runs between the
 * two lines of a two-line headline.
 *
 * The reference strokes its lines half a pixel wide at 0.2, which an SVG renderer
 * spends across two device pixels. A CSS hairline is a whole pixel, so the same
 * ink reaches the card at about 0.09, which is what the registry ships as this
 * template's grid opacity.
 */
const GRID_ORIGIN_X = 120;
const GRID_ORIGIN_Y = 156;

const MARK_TOP = 108;
const MARK_SIZE = 32;
const HEADLINE_TOP = 246;
const HEADLINE_WIDTH = 820;
const HEADLINE_SIZE = 68;
const DOMAIN_BOTTOM = 77;

export default function AgileStartup({
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
    gradientStart = "#000000",
    gradientEnd = "#000000",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.09,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const domain = (tag || "").trim();
    const headlineSize = resolveTitleFontSize(titleSize, HEADLINE_SIZE);
    const headlineTracking = resolveTitleTracking(titleTracking, -0.03);
    const gridLine = hexToRgba(gridColor ?? textColor, gridOpacity);

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
            showLift={false}
        >
            {/*
              The grid goes under the light on purpose, the way it does in the
              reference, so its lines thin out into both blooms instead of
              crossing them.
            */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: [
                        `linear-gradient(${gridLine} 1px, transparent 1px)`,
                        `linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
                    ].join(","),
                    backgroundSize: `${GRID_CELL}px ${GRID_CELL}px, ${GRID_CELL}px ${GRID_CELL}px`,
                    backgroundPosition: `${GRID_ORIGIN_X}px ${GRID_ORIGIN_Y}px, ${GRID_ORIGIN_X}px ${GRID_ORIGIN_Y}px`,
                }}
            />

            {/* The two corner blooms, in one paint pass and without a filter. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: [
                        bloom(UPPER_RADIUS, UPPER_RADIUS, 0, 0),
                        bloom(LOWER_RX, LOWER_RY, CANVAS_WIDTH, CANVAS_HEIGHT),
                    ].join(","),
                }}
            />

            <div
                className="absolute inset-x-0 flex items-center justify-center gap-3"
                style={{ top: MARK_TOP }}
            >
                {logoImage && logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoImage}
                        alt=""
                        style={{ width: MARK_SIZE, height: MARK_SIZE, objectFit: "contain" }}
                    />
                )}
                {wordmark && (
                    <span
                        style={{
                            color: textColor,
                            fontFamily,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: "22px",
                            lineHeight: 1,
                            letterSpacing: "0.01em",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            <div
                className="absolute inset-x-0 flex justify-center"
                style={{ top: HEADLINE_TOP, padding: "0 96px" }}
            >
                <div
                    style={{
                        maxWidth: `${HEADLINE_WIDTH}px`,
                        color: textColor,
                        fontFamily,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${headlineSize}px`,
                        letterSpacing: `${headlineTracking}em`,
                        lineHeight: 1.04,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </div>
            </div>

            {domain && (
                <p
                    className="absolute inset-x-0 text-center"
                    style={{
                        bottom: DOMAIN_BOTTOM,
                        color: textColor,
                        fontFamily,
                        fontStyle,
                        fontWeight: 500,
                        textDecoration,
                        fontSize: "28px",
                        lineHeight: 1,
                        letterSpacing: "-0.01em",
                    }}
                >
                    {domain}
                </p>
            )}
        </TemplateCard>
    );
}
