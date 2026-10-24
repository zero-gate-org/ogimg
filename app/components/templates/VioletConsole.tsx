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
 * Violet Console: a violet colour field with a brand lockup and a low headline on
 * the left, and the user's own card filling the editor window that bleeds off the
 * right edge.
 *
 * Measured off refs/03.svg. The window starts at x 725.5 and is 1153 x 849 with
 * 23.5px corners, so it runs off both the right and the bottom edge and only its
 * left half is ever seen; inside it the reference keeps a 23.5px margin around an
 * 8px-cornered content rect. That rect is the dashboard's screen, so the user's
 * image fills it edge to edge and nothing is painted over the image.
 *
 * The reference paints its field as a blurred grey blob map with a violet
 * `color-dodge` ramp over it. That is rebuilt here as stacked radial lobes, the
 * way SoftMesh does it, because the export path cannot rely on `filter: blur()`.
 * The lobes are placed to land on the values sampled off the reference composite:
 * lavender along the top from x 300 rightwards, a blue-violet bulge on the left
 * edge at y 340, a second bloom under the headline at the bottom edge, and deep
 * indigo in the bottom-left corner.
 *
 * The window's glass is the reference's own white-on-black alpha stack, keyed to
 * the user's text colour, so it reads as dark glass by default and inverts cleanly
 * when the card is given dark type. Geometry is mirrored by the `violet-console`
 * branch in `templateLayout.ts`, so the card does not jump when it is detached.
 */

/** Field hues, sampled off the reference composite. Paint only, never applied to type. */
const LAVENDER = "#D3A8FF";
const BLUE_VIOLET = "#9A7CFF";
const VIOLET = "#5B49FF";
const COOL = "#3B2ED8";
const INDIGO = "#2C239E";
const DEEP = "#120F33";

/**
 * A gradient ramp falls off more gently than the Gaussian blur the reference was
 * built with, so each lobe reaches a little further to put the same hue in the
 * same place.
 */
const REACH = 198;

/** One shared falloff: hold the hue flat, then run it out over the last third. */
const FALLOFF: [number, number][] = [
    [0, 1],
    [0.42, 1],
    [0.72, 0.6],
    [0.86, 0.28],
    [0.96, 0.06],
    [1, 0],
];

interface Lobe {
    x: number;
    y: number;
    rx: number;
    ry: number;
    hue: string;
    alpha: number;
}

/** Centres and radii read off the sampled grid, in the card's own coordinates. */
const LOBES: Lobe[] = [
    // The body of the field everything else sits on.
    { x: 420, y: 240, rx: 700, ry: 520, hue: VIOLET, alpha: 0.9 },
    // The bright plateau that runs along the top edge from x 300 outwards.
    { x: 520, y: -160, rx: 470, ry: 320, hue: LAVENDER, alpha: 0.95 },
    // The bulge on the left edge, at its brightest around y 330.
    { x: -170, y: 330, rx: 330, ry: 320, hue: BLUE_VIOLET, alpha: 0.9 },
    // The bloom under the headline, along the bottom edge.
    { x: 380, y: 800, rx: 380, ry: 260, hue: BLUE_VIOLET, alpha: 0.9 },
    // The right half cools and holds there.
    { x: 860, y: 560, rx: 420, ry: 380, hue: COOL, alpha: 0.85 },
    // The two corners that never light up. Listed last because they paint on top.
    { x: -140, y: 780, rx: 340, ry: 300, hue: DEEP, alpha: 0.95 },
    { x: -120, y: -120, rx: 280, ry: 250, hue: INDIGO, alpha: 0.95 },
];

const lobe = ({ x, y, rx, ry, hue, alpha }: Lobe) =>
    `radial-gradient(${rx + REACH}px ${ry + REACH}px at ${x}px ${y}px, ${FALLOFF.map(([position, scale]) => {
        const stop = Number((alpha * scale).toFixed(3));
        return `${hexToRgba(hue, stop)} ${(position * 100).toFixed(0)}%`;
    }).join(", ")})`;

/** Background layers paint first-listed-on-top, so the order is reversed. */
const FIELD = LOBES.map(lobe)
    .reverse()
    .join(",");

/** Left rail: lockup on the top edge, headline on the bottom one. */
const PAD_X = 64;
const LOCKUP_TOP = 64;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 28;
/** The reference's two wordmark lines advance by 23.9px against a 28px face. */
const WORDMARK_LEADING = 0.86;
const WORDMARK_WIDTH = 104;
/** Ink stops 58.6px above the card's bottom edge. */
const HEADLINE_BOTTOM = 58;
const HEADLINE_WIDTH = 520;
const HEADLINE_LINE = 0.95;
const HEADLINE_SIZE = 86;

/** Panel, measured off the vector: 1153 x 849 with 23.5px corners. */
const PANEL_X = 725.5;
const PANEL_Y = 40.5;
const PANEL_W = 1153;
const PANEL_H = 849;
const PANEL_RADIUS = 23.5;
const PANEL_PAD = 23.5;

export default function VioletConsole({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#241C7A",
    gradientEnd = "#120F33",
    gradientAngle = 165,
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

    // The reference's window is black at 0.8 under a white 0.2 edge, with a white
    // 0.1 content rect. All of it hangs off the text colour so a light card
    // inverts with it.
    const dark = tone.isDarkText;
    const panelFill = dark ? "rgba(0, 0, 0, 0.8)" : "rgba(250, 250, 252, 0.86)";
    const panelEdge = hexToRgba(textColor, 0.2);
    const innerFill = hexToRgba(textColor, 0.1);
    const panelGlint = dark
        ? `radial-gradient(322px 72px at 576px 0px, ${hexToRgba("#FFFFFF", 0.5)} 0%, ${hexToRgba("#FFFFFF", 0)} 100%)`
        : "none";
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
            {/* The whole colour field, in one paint pass and without a filter. */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: FIELD }} />

            {/* Brand lockup, on the card's top-left corner. */}
            <div
                className="absolute flex items-start"
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
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/* Headline, anchored to the bottom edge of the rail. */}
            <div className="absolute" style={{ left: PAD_X, bottom: HEADLINE_BOTTOM, width: HEADLINE_WIDTH }}>
                <h1
                    style={{
                        margin: 0,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, HEADLINE_SIZE)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.08)}em`,
                        lineHeight: HEADLINE_LINE,
                        textWrap: "balance",
                    }}
                >
                    {title}
                </h1>
            </div>

            {/* The app panel, bleeding off the right and bottom edges. */}
            <div
                className="absolute"
                style={{
                    left: PANEL_X,
                    top: PANEL_Y,
                    width: PANEL_W,
                    height: PANEL_H,
                    borderRadius: PANEL_RADIUS,
                    background: panelFill,
                    boxShadow: `inset 0 0 0 1px ${panelEdge}`,
                }}
            >
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 1,
                        background: panelGlint,
                    }}
                />

                {/* Inner rect, clipped to 8px corners: the dashboard's screen. */}
                <div
                    style={{
                        position: "absolute",
                        left: PANEL_PAD,
                        top: PANEL_PAD,
                        width: PANEL_W - PANEL_PAD * 2,
                        height: PANEL_H - PANEL_PAD * 2,
                        borderRadius: 8,
                        overflow: "hidden",
                        background: innerFill,
                    }}
                >
                    {/* The image is the dashboard's own screen, so it fills the
                        whole window edge to edge with nothing painted over it. */}
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
                                Your dashboard
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </TemplateCard>
    );
}
