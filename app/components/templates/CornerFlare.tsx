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
 * Corner Flare: a headline rail lit by one elliptical flare off the top-right
 * corner.
 *
 * The light is a single ring, not a glow: it is transparent across the body of
 * the card, gathers to a violet crest where it crosses the top edge, and goes to
 * amber at the very corner. A dark panel runs off the right edge and the bottom,
 * and the crest disappears behind it about a fifth of the way down, which is what
 * makes the flare read as light passing under glass. The headline holds the left
 * rail, vertically centred, with the brand lockup at the top of that rail and a
 * support line under it.
 *
 * The reference paints its headline with a white-to-grey ramp and its corner with
 * violet and amber. The ramp is dropped and the type is set solid `textColor`,
 * while the violet and amber stay where they belong: in the background paint. That
 * way a card keeps one colour family when the user changes the text colour, and
 * nothing depends on a gradient clip, which would not survive the foreignObject
 * export. Every layer here is drawn in code.
 */

/** Flare hues. Background paint only, never applied to type. */
const ARC_VIOLET = "#AC59D6";
const ARC_AMBER = "#FFB43C";
const BLOOM_MAGENTA = "#A22DA8";
const BLOOM_VIOLET = "#8964F7";
const INK = "#0A0A0C";

/**
 * The ring, in card pixels. Its ellipse is tilted 41deg off the horizontal, and
 * the tilt is load bearing: flattened to an axis-aligned ellipse the crest would
 * cross the top edge near x 885 instead of x 631, so the arc would read as a
 * corner glow rather than an edge sweeping down behind the panel.
 */
const ARC = { x: 390, y: 602, rx: 1701, ry: 991, tilt: 41.2 };

/** Two soft blooms that only show through the ring's transparent interior. */
const MAGENTA_BLOOM = { x: 917, y: 654, rx: 858, ry: 482, tilt: 47.9 };
const VIOLET_BLOOM = { x: -9, y: 419, rx: 833, ry: 483, tilt: 40.4 };

/** Wide enough that a rotated field still covers every corner of the card. */
const FIELD_BOX = 2600;

/**
 * The vector's panel runs 1153 x 849, far off canvas. Only its top-left radius is
 * ever seen, so the box is cut back to just past the right and bottom edges: the
 * same silhouette, and the empty state stays centred on canvas instead of landing
 * at x 1380 where nobody can read it.
 */
const PANEL_RADIUS = 26;
const PANEL_BEZEL = 24;
const PANEL = {
    left: 803.5,
    top: 65.5,
    width: 1200 - 803.5 + PANEL_RADIUS + 8,
    height: 630 - 65.5 + PANEL_RADIUS + 8,
    innerRadius: 8,
};

/** Left rail: the headline's own box starts where the reference glyphs start, at
 *  243 minus the 6px of air a line box keeps above its cap height at 84px. */
const RAIL_LEFT = 68;
const RAIL_WIDTH = 620;
const RAIL_TOP = 237;
const RAIL_BOTTOM = 92;
const TITLE_BASELINE_PX = 84;
const TITLE_TRACKING_EM = -0.08;
const TITLE_LINE = 0.95;

const TAG_WIDTH = 520;
const TAG_SIZE = 22;
const TAG_LINE = 1.45;
const TAG_GAP = 26;

const LOCKUP_TOP = 62;
const MARK_WIDTH = 28;
const MARK_HEIGHT = 38;
const LOCKUP_GAP = 12;
const WORDMARK_SIZE = 21;
const WORDMARK_WIDTH = 240;

const ramp = (stops: [number, string][]) => stops.map(([at, color]) => `${color} ${at}%`).join(", ");

const flare = (hex: string, alpha: number) => {
    const edge = hexToRgba(hex, alpha);
    return ramp([
        [0, edge],
        [100, hexToRgba(hex, 0)],
    ]);
};

/**
 * One radial ramp on a rotated box. The rotation happens on the wrapper rather
 * than in the gradient, which CSS radial gradients cannot express, and the box is
 * centred on the field so the spin keeps the anchor where it was measured.
 */
const FlareField = ({
    x,
    y,
    rx,
    ry,
    tilt,
    background,
}: {
    x: number;
    y: number;
    rx: number;
    ry: number;
    tilt: number;
    background: string;
}) => (
    <div
        className="pointer-events-none absolute"
        style={{
            left: x - FIELD_BOX / 2,
            top: y - FIELD_BOX / 2,
            width: FIELD_BOX,
            height: FIELD_BOX,
            transform: `rotate(${tilt}deg)`,
            background: `radial-gradient(${rx}px ${ry}px at 50% 50%, ${background})`,
        }}
    />
);

export default function CornerFlare({
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
    gradientEnd = "#12081C",
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
    const innerRadius =
        typeof imageRadius === "number" && Number.isFinite(imageRadius) && imageRadius > 0
            ? imageRadius
            : PANEL.innerRadius;

    /**
     * The ring itself: clear to 48.8, the violet crest at 63, amber at the corner
     * at 100. Opaque on purpose, exactly as the vector paints it, so the corner
     * burns to a solid amber while the rail 600px away stays near black.
     */
    const arcSweep = ramp([
        [0, hexToRgba(ARC_VIOLET, 0)],
        [48.8, hexToRgba(ARC_VIOLET, 0)],
        [63, hexToRgba(ARC_VIOLET, 1)],
        [100, hexToRgba(ARC_AMBER, 1)],
    ]);

    /**
     * The panel's top hairline catches the flare off canvas to the right, so the
     * light ramps up only over the last third of the edge.
     */
    const edgeLight = ramp([
        [0, hexToRgba(textColor, 0)],
        [46, hexToRgba(textColor, 0)],
        [62, hexToRgba(textColor, 0.12)],
        [87, hexToRgba(textColor, 0.42)],
        [100, hexToRgba(textColor, 0.52)],
    ]);

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
            <FlareField {...MAGENTA_BLOOM} background={flare(BLOOM_MAGENTA, 0.6)} />
            <FlareField {...VIOLET_BLOOM} background={flare(BLOOM_VIOLET, 0.3)} />
            <FlareField {...ARC} background={arcSweep} />

            <div
                style={{
                    position: "absolute",
                    left: PANEL.left,
                    top: PANEL.top,
                    width: PANEL.width,
                    height: PANEL.height,
                    zIndex: 2,
                    borderRadius: PANEL_RADIUS,
                    background: hexToRgba(tone.veil, 0.82),
                    boxShadow: `inset 0 0 0 1px ${tone.hairline}`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: PANEL_RADIUS,
                        right: PANEL_RADIUS,
                        height: 1,
                        background: `linear-gradient(90deg, ${edgeLight})`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: PANEL_BEZEL,
                        top: PANEL_BEZEL,
                        right: PANEL_BEZEL,
                        bottom: PANEL_BEZEL,
                    }}
                >
                    <ImageSlot
                        className="h-full w-full"
                        image={image}
                        fit={imageFit}
                        radius={innerRadius}
                        tone={tone}
                        emptyLabel="App screenshot"
                    />
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: RAIL_LEFT,
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
                    top: RAIL_TOP,
                    bottom: RAIL_BOTTOM,
                    width: RAIL_WIDTH,
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                }}
            >
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
                    <p
                        style={{
                            margin: `${TAG_GAP}px 0 0`,
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
                )}
            </div>
        </TemplateCard>
    );
}
