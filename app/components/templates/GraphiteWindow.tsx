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
 * Graphite Window: a black card lit by three circles that never show, a brand
 * lockup and a two line headline on the left rail, and the user's own screenshot
 * in a window that bleeds off the right and the bottom edge.
 *
 * Measured off refs/05.svg. The reference draws its light as three black discs
 * carrying an inner shadow (offset 4px down, blurred at 66, flooded with
 * rgb(88,88,88) at 0.346 alpha) at -85.21,55 r467.79; 1189.21,-50.29 r519.29;
 * and 600,1174.79 r662.15. Only the rim of each disc is ever visible, so each
 * one is restated here as a ring of `AMBIENT` hugging its own edge and dying
 * inward. Chrome answers `stdDeviation 66` with three box blurs, not a Gaussian,
 * so the band is 198px wide and its profile is a cubic rather than a tail: the
 * stops below were sampled off the raster at 10px steps, in grey levels, and
 * divided by the flood's own 88.3. No layer uses a filter, because the export
 * path inlines computed styles into a foreignObject. One thing is dropped: the
 * shadow's 4px offset makes each rim slightly brighter where the edge faces up
 * than where it faces down (about 3 grey levels across the 45 to 48 the sampled
 * profile carries), and a radial gradient cannot say that, so every ring here is
 * rotationally even.
 *
 * The first two discs sit under the window's plate; the third is the last thing
 * the reference paints, over its own artwork, so it is the last thing painted
 * here too. That is what puts a lit edge across the bottom of the card and
 * blacks out the strip under its arc, and it is why the floor keeps the canvas
 * colour rather than the ambient grey.
 *
 * The plate is a rounded rect at 803.5,65.5, 1153 x 849 with 23.5px corners,
 * black at 0.8 under a white 0.2 hairline, stroked a second time with a radial
 * gradient (a 322.071 x 237.227 ellipse centred at 1380,100.351, white to
 * transparent) which is the only reason its top edge lights up toward the
 * right. That ellipse is transferred rather than faked, so the hairline lands on
 * the reference's own 131/255 at x 1190, in row 65 and column 803, which is where
 * the reference's centred stroke rasterizes. Inside it, 23.5 of plate all the way
 * around, sits the window: the reference's own 827,89 rect, 1106 x 802 with 8px
 * corners. The reference fills it with an invented dashboard, sidebar and nav
 * rows; none of that is ported, because the slot is where the user's own
 * screenshot belongs.
 *
 * Type: the reference outlines "Designed for / agile startups", which measures a
 * cap height of exactly 64 at a 88px advance, with a flat x-height of 48 (0.75
 * of the cap) and an ascender level with the cap. Inter caps at 0.73em and its
 * x-height at 0.545em, which is the same 0.748 ratio, and its per-glyph ink
 * widths match the outlines within 1.3 percent, so the rail is set in Inter at
 * 88px and 600. Its ink starts 3.0 to 6.3 inside the pen, so the rail is at 64.
 * The headline keeps the reference's white to half white ramp, read from a
 * lighter version of itself at the right end.
 */

/** Ambient grey, the reference's own flood colour: 0.346208 of 255 is 88. */
const AMBIENT = "#585858";

interface Light {
    x: number;
    y: number;
    r: number;
}

/**
 * The rim's profile, measured off the raster as grey levels and written here as
 * alpha of `AMBIENT`. Pairs are (depth inward from the edge, alpha).
 */
const RIM: [number, number][] = [
    [160, 0],
    [150, 0.002],
    [140, 0.011],
    [130, 0.016],
    [120, 0.025],
    [110, 0.045],
    [100, 0.063],
    [90, 0.086],
    [80, 0.116],
    [70, 0.149],
    [60, 0.193],
    [50, 0.237],
    [40, 0.288],
    [30, 0.342],
    [20, 0.399],
    [10, 0.459],
    [0, 0.515],
];

/**
 * The reference's raster keeps some of its peak grey on the pixel whose centre
 * sits just outside the circle, because the filter tile is not snapped to the
 * path edge, and how much of it survives depends on which way the edge faces:
 * a full 45 down the top-left light's lower-left arc, nothing at all at its
 * bottom. The cut therefore runs one pixel past the true radius and fades
 * linearly across it, which splits that difference instead of shipping either
 * extreme.
 */
const SPILL = 1;

/** The two discs that light the card behind the window. */
const LIGHTS: Light[] = [
    { x: -85.2147, y: 54.9999, r: 467.793 },
    { x: 1189.21, y: -50.2935, r: 519.293 },
];

/** The third disc, centred 544.79px below the card, which paints over all of it. */
const FLOOR: Light = { x: 600, y: 1174.7928, r: 662.147 };

/** A ring that only exists inside its own circle, cut one pixel past the edge. */
const ring = ({ x, y, r }: Light) =>
    `radial-gradient(${r}px ${r}px at ${x}px ${y}px, ${RIM.map(
        ([depth, alpha]) => `${hexToRgba(AMBIENT, alpha)} ${(r - depth).toFixed(2)}px`,
    ).join(", ")}, ${hexToRgba(AMBIENT, 0)} ${(r + SPILL).toFixed(2)}px)`;

/** The disc itself, opaque out to its radius, which is how the reference paints it. */
const disc = ({ x, y, r }: Light, color: string) =>
    `radial-gradient(${r}px ${r}px at ${x}px ${y}px, ${color} 0px, ${color} ${r.toFixed(2)}px, ${hexToRgba(
        color,
        0,
    )} ${r.toFixed(2)}px)`;

const FIELD = LIGHTS.map(ring).join(", ");

/** Left rail: lockup on the top edge, headline centred on the card's middle. */
const PAD_X = 64;
const LOCKUP_TOP = 64;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 28;
const WORDMARK_LEADING = 1;
const WORDMARK_WIDTH = 160;

/**
 * The rail is 540 wide because the reference's own second line ends at x 600.13,
 * which is 64 plus 536. Two lines at 88px advance 176, and the reference centres
 * that block on the card: its caps start at y 239 and its last baseline is 391,
 * which straddles 315, the exact middle.
 */
const HEADLINE_WIDTH = 540;
const HEADLINE_SIZE = 88;
/** The reference's two baselines are 303 and 391, so the advance is one em. */
const HEADLINE_LEADING = 88 / HEADLINE_SIZE;
/** Median of the nineteen inter-glyph gaps measured against Inter's own advances. */
const HEADLINE_TRACKING = -0.037;

/**
 * The reference's headline ramp: white at 277,275.5 to half white at
 * 781.617,192.495, which is 80.65deg and 511.42px long. Those are written as
 * shares of the two line box above, whose projected axis is 561.44px long, so
 * the white holds until 41.1 percent and the tail never quite finishes inside
 * the box. The bright end is the user's text colour so the rail still answers
 * the colour control.
 */
const RAMP_DEG = 80.65;
const RAMP_START = 41.13;
const RAMP_END = 132.2;

/** Plate and window, as the reference measures them. */
const PLATE_X = 803.5;
const PLATE_Y = 65.5;
const PLATE_W = 1153;
const PLATE_H = 849;
const PLATE_RADIUS = 23.5;
const WINDOW_PAD = 23.5;
const WINDOW_W = 1106;
const WINDOW_H = 802;

/**
 * The border light: the reference's stroke gradient, moved into the plate's own
 * coordinates, painted along its top edge. Its right edge is off canvas, so the
 * top is the only side the ellipse ever reaches.
 */
const GLINT_X = 1380 - PLATE_X;
const GLINT_Y = 100.351 - PLATE_Y;
const GLINT_RX = 322.071;
const GLINT_RY = 237.227;

export default function GraphiteWindow({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
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
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
    image,
    imageFit = "cover",
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();

    // The plate is the reference's own alpha stack, hung off the text colour so a
    // light card inverts with it instead of going dark on dark.
    const plateFill = tone.isDarkText ? "rgba(0, 0, 0, 0.8)" : "rgba(250, 250, 252, 0.86)";
    // The third disc is painted solid, in the reference's own #000, which is what
    // blacks out the strip under its arc; a light card gets the mirror of it.
    const discFill = tone.isDarkText ? "#000000" : "#fafafa";
    const plateEdge = hexToRgba(textColor, 0.2);
    const windowTint = hexToRgba(textColor, 0.05);
    const faint = hexToRgba(textColor, 0.5);
    const headlineSize = resolveTitleFontSize(titleSize, HEADLINE_SIZE);

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
            {/* The two ambient rings, painted on the bare canvas under everything. */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: FIELD }} />

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
                            fontWeight: resolveFontWeight(fontWeight, 600),
                            textDecoration,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: WORDMARK_LEADING,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/*
              Two lines of display type, centred on the card's middle line the way
              the reference's are. The ramp runs across the rail, brightest at the
              left, and lets go toward the window.
            */}
            <div
                className="absolute flex items-center"
                style={{ left: PAD_X, top: 0, bottom: 0, width: HEADLINE_WIDTH }}
            >
                <h1
                    style={{
                        margin: 0,
                        backgroundImage: `linear-gradient(${RAMP_DEG}deg, ${textColor} 0%, ${textColor} ${RAMP_START}%, ${hexToRgba(
                            textColor,
                            0.5,
                        )} ${RAMP_END}%)`,
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
                  path from the centre, so the band runs 803.0 to 804.0 and 65.0 to 66.0:
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

            {/*
              The third light, last because the reference paints it last: its disc is
              opaque and only its top rim is ever in frame, so it lays a lit edge along
              the bottom of the card and covers whatever sits under it, image included.
            */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: [ring(FLOOR), disc(FLOOR, discFill)].join(", ") }}
            />
        </TemplateCard>
    );
}
