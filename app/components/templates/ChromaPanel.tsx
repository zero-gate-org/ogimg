"use client";

import { useId } from "react";
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
 * Chroma Panel: a black card ruled by a faint grid and a dark moon in the top
 * left, with a rainbow headline on the left rail and the user's screenshot in a
 * glass window that bleeds off the right and bottom edges.
 *
 * Measured off refs/10.svg. The reference draws a 1200 x 630 black card, a 0.5px
 * white grid at 0.15 group opacity, a black circle centred at -4.21,-84.21 with a
 * white inner shadow, and then a 1153 x 849 glass plate at 812.5,65.5. The grid
 * and moon are inline SVG, so the filter survives the export path, which
 * serialises the card into a foreignObject. The full-bleed black rect is left
 * out on purpose: the card's own background fills the uncovered areas, so the
 * background controls still do something, and the default black matches the
 * reference.
 *
 * The moon's light is the reference's own filter: its source alpha is turned
 * into a hard mask, offset 4px down, blurred at 66, subtracted from the mask,
 * recoloured white at 0.25 and laid over the black fill. Only the inside of the
 * disc's edge keeps any light, which is what makes the dark moon's rim. The
 * filter id carries this instance's `useId`, so the gallery's many previews do
 * not share one definition.
 *
 * The plate is the reference's alpha stack: black at 0.8 under a white 0.2
 * hairline, stroked a second time with the radial gradient that lights its top
 * edge toward the right. Inside it, at the reference's 23.5px inset, sits the
 * 1106 x 802 window with 8px corners. The reference fills that window with an
 * invented task app; none of it is ported, because the slot is where the user's
 * own screenshot belongs.
 *
 * Type: the reference sets "Designed for / agile startups" as outlines whose cap
 * is 76 high at a 125px line advance and whose ink spans about 590 and 630 wide.
 * Inter at 104px carries the same cap and its widths hold the app's two-line
 * default, so the rail is set in Inter at 104 / 1.2. The reference paints the
 * headline with a rainbow gradient whose axis runs 531.41px from 703.301,52.411
 * to 196.026,210.751, which is 252.66deg. The clipped CSS ramp below puts those
 * stops where the vector's axis crosses the h1's own box; the stops outside the
 * box are kept (the start is slightly before the top right corner) so the first
 * and last inks land on the reference's solid blue and solid white. The white
 * end is the user's text colour, so the colour control still works.
 */

/** The grid, in card pixels. */
const GRID_VERTICAL_X = [120.125, 280, 439.875, 599.75, 759.625, 919.5, 1079.38];
const GRID_HORIZONTAL_Y = [157.25, 314.75, 472.25, 629.75];

/**
 * The moon's outer box, which is also the reference's filter region, plus the
 * geometry the filter needs.
 */
const MOON_CX = -4.2066;
const MOON_CY = -84.2066;
const MOON_R = 467.793;

/** Left rail: lockup on the top edge, the two line headline in the middle. */
const PAD_X = 64;
const LOCKUP_TOP = 80;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 24;
const WORDMARK_WIDTH = 220;

/**
 * The reference's first cap starts at y 214 and its second baseline is 125
 * lower. At 104px and 1.2 leading, the first cap sits 24px inside the h1 box,
 * so the box starts at 190. The rail is 660 wide: that holds the app's default
 * pair on two lines while leaving the window's left edge clear.
 */
const HEADLINE_LEFT = PAD_X;
const HEADLINE_TOP = 190;
const HEADLINE_WIDTH = 660;
const HEADLINE_SIZE = 104;
const HEADLINE_LEADING = 1.2;
/** Median of the reference's inter-glyph gaps measured against Inter's advances. */
const HEADLINE_TRACKING = -0.037;

/**
 * The reference's rainbow, compressed onto the shorter default copy so the full
 * ramp still reads across the visible words. The angle is the reference's own
 * 252.665 degrees; its blue start now lands at 20 percent of the h1 box, the
 * purple and orange turns at 42 and 62, and the bright ink end at 80. Mapping
 * the vector's absolute stops would put the blue well past the end of the copy.
 */
const RAMP_DEG = 252.665;
const RAMP_BLUE_STOP = 20;
const RAMP_PURPLE_STOP = 42;
const RAMP_ORANGE_STOP = 62;
const RAMP_INK_STOP = 80;
const RAMP_BLUE = "#008CFF";
const RAMP_PURPLE = "#A900FF";
const RAMP_ORANGE = "#FFB43C";

/** The reference's domain line sits at x 66 with its ink around y 529. */
const URL_LEFT = PAD_X;
const URL_TOP = 523;
const URL_SIZE = 28;
const URL_WIDTH = 340;

/** Plate and window, as the reference measures them. */
const PLATE_X = 812.5;
const PLATE_Y = 65.5;
const PLATE_W = 1153;
const PLATE_H = 849;
const PLATE_RADIUS = 23.5;
const WINDOW_PAD = 23.5;
const WINDOW_W = 1106;
const WINDOW_H = 802;

/**
 * The plate's edge light: the reference strokes the plate a second time with a
 * 322.071 x 237.227 radial gradient centred at 1380,100.351, which is only
 * visible along the top edge and gets brighter toward the right. Those are the
 * plate's own coordinates.
 */
const GLINT_X = 1380 - PLATE_X;
const GLINT_Y = 100.351 - PLATE_Y;
const GLINT_RX = 322.071;
const GLINT_RY = 237.227;

/** The reference's white inner shadow, ported with SVG primitives. */
const MoonFilter = ({ id }: { id: string }) => (
    <filter
        id={id}
        x="-472"
        y="-552"
        width="935.587"
        height="939.587"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
    >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="66" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="shape" result="innerShadow" />
    </filter>
);

export default function ChromaPanel({
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
    gridOpacity = 0.075,
    gridBlur = 0,
    titleSize,
    titleTracking,
    image,
    imageFit = "cover",
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const domain = (tag || "").trim();
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const moonFilterId = `${uid}-chroma-moon`;
    const headlineSize = resolveTitleFontSize(titleSize, HEADLINE_SIZE);

    // The plate is the reference's own alpha stack, hung off the text colour so a
    // light card inverts with it instead of going dark on dark.
    const plateFill = tone.isDarkText ? "rgba(0, 0, 0, 0.8)" : "rgba(250, 250, 252, 0.86)";
    const plateEdge = hexToRgba(textColor, 0.2);
    const windowTint = hexToRgba(textColor, 0.05);
    const faint = hexToRgba(textColor, 0.5);

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
              Grid and moon, on the bare canvas under the plate. Both are inline
              SVG so their strokes and the filter travel through the export.
            */}
            <svg
                width="1200"
                height="630"
                viewBox="0 0 1200 630"
                fill="none"
                aria-hidden="true"
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "1200px",
                    height: "630px",
                    pointerEvents: "none",
                }}
            >
                <defs>
                    <MoonFilter id={moonFilterId} />
                </defs>

                <g opacity="0.15" stroke="#FFFFFF" strokeWidth="0.5">
                    {GRID_HORIZONTAL_Y.map((y) => (
                        <line key={`h-${y}`} x1="-39.5" y1={y} x2="1239.5" y2={y} />
                    ))}
                    {GRID_VERTICAL_X.map((x) => (
                        <line key={`v-${x}`} x1={x} y1="630" x2={x} y2="0" />
                    ))}
                </g>

                <circle
                    cx={MOON_CX}
                    cy={MOON_CY}
                    r={MOON_R}
                    fill="#000000"
                    filter={`url(#${moonFilterId})`}
                />
            </svg>

            {/* Brand lockup, on the rail's top corner, centred on the mark. */}
            <div
                className="absolute flex items-center"
                style={{ left: PAD_X, top: LOCKUP_TOP, gap: LOCKUP_GAP }}
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
                      Empty state: the project's own mark, a diagonal bar punched
                      out of a filled square, so the two can never drift apart.
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
                            maxWidth: WORDMARK_WIDTH,
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: 1,
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/*
              Two lines of display type on the left rail. The rainbow is clipped
              to the glyphs and measured on the h1's own box, so every word keeps
              the reference's blue-to-white run.
            */}
            <div
                className="absolute"
                style={{ left: HEADLINE_LEFT, top: HEADLINE_TOP, width: HEADLINE_WIDTH }}
            >
                <h1
                    style={{
                        margin: 0,
                        backgroundImage: `linear-gradient(${RAMP_DEG}deg, ${RAMP_BLUE} ${RAMP_BLUE_STOP}%, ${RAMP_PURPLE} ${RAMP_PURPLE_STOP}%, ${RAMP_ORANGE} ${RAMP_ORANGE_STOP}%, ${textColor} ${RAMP_INK_STOP}%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 600),
                        textDecoration,
                        fontSize: `${headlineSize}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, HEADLINE_TRACKING)}em`,
                        lineHeight: HEADLINE_LEADING,
                        textAlign: "left",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </h1>
            </div>

            {domain && (
                <p
                    className="absolute"
                    style={{
                        left: URL_LEFT,
                        top: URL_TOP,
                        width: URL_WIDTH,
                        margin: 0,
                        color: textColor,
                        fontStyle,
                        fontWeight: 500,
                        textDecoration,
                        fontSize: URL_SIZE,
                        lineHeight: 1,
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap",
                    }}
                >
                    {domain}
                </p>
            )}

            {/* The plate, bleeding off the right and the bottom edge as the reference sets it. */}
            <div
                className="absolute"
                style={{
                    left: PLATE_X,
                    top: PLATE_Y,
                    width: PLATE_W,
                    height: PLATE_H,
                    borderRadius: PLATE_RADIUS,
                    background: plateFill,
                }}
            >
                {/*
                  The white hairline, at 0.2 of the text colour. The reference strokes its
                  path from the centre, so the band runs 812.0 to 813.0 and 65.0 to 66.0:
                  the box is pushed out half a pixel and carries a whole pixel of border,
                  which puts it on the same pixel row and column the reference rasterizes.
                */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: -0.5,
                        border: `1px solid ${plateEdge}`,
                        borderRadius: PLATE_RADIUS + 0.5,
                    }}
                />

                {/* The stroke gradient, restated as a hairline along the plate's top edge. */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: -0.5,
                        height: 1,
                        background: `radial-gradient(${GLINT_RX}px ${GLINT_RY}px at ${GLINT_X}px ${GLINT_Y}px, ${hexToRgba(
                            textColor,
                            1,
                        )} 0%, ${hexToRgba(textColor, 0)} 100%)`,
                    }}
                />

                {/* The window, clipped to its 8px corners: the user's screenshot fills it. */}
                <div
                    style={{
                        position: "absolute",
                        left: WINDOW_PAD,
                        top: WINDOW_PAD,
                        width: WINDOW_W,
                        height: WINDOW_H,
                        borderRadius: 8,
                        overflow: "hidden",
                        background: windowTint,
                    }}
                >
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={image}
                            alt=""
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: imageFit,
                                objectPosition: "left top",
                                display: "block",
                            }}
                        />
                    ) : null}

                    {!image && (
                        <div className="flex h-full w-full items-center justify-center">
                            <span
                                style={{
                                    color: faint,
                                    fontSize: 12,
                                    lineHeight: 1,
                                    fontWeight: 600,
                                    letterSpacing: "0.16em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Your screenshot
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </TemplateCard>
    );
}
