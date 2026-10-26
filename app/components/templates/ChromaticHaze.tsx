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
 * Chromatic Haze: four enormous colour discs washed across a black card, with a
 * lockup, a headline and the domain stacked down the centre.
 *
 * Measured off refs/06.svg. The reference paints a crimson ellipse over the top
 * right, a sky ellipse rising from the bottom centre, a magenta circle on the
 * upper left and a cobalt circle in the bottom corner, then throws a 182px
 * backdrop blur over all four. Nothing keeps a hard edge; the card reads as one
 * soft field. The blur cannot travel through the export path, which serialises
 * the card into a foreignObject, so the field is rebuilt as four radial lobes on
 * the vector's own centres and radii. Each lobe's alpha was fitted to the
 * reference raster: it holds near its peak through the middle of its disc in the
 * way the blur does, then releases along the same long tail. Three soft
 * correction layers handle what one radial profile cannot follow: the extra
 * depth the blur leaves in both top corners, and the cool slate it settles into
 * under the headline, where the sky and red discs meet. The layer order is the
 * reference's paint order reversed, because a CSS background paints its first
 * layer on top.
 *
 * The type is the reference's composition with the app's own copy: the mark and
 * a wordmark on the top centre line, a two line headline in the middle, and the
 * domain on the bottom centre line. The reference's "Designed for agile
 * startups" becomes "Designed for social feeds", and its stacked wordmark and
 * "www.never.design" become this app's single word domain. The reference sets
 * 112px display type with a 113px line advance, so the headline leading is one
 * em.
 *
 * The brand mark is replaced by the `logoImage` slot when the user uploads one.
 * The fallback is the project's own mark, a diagonal bar punched out of a filled
 * square. Geometry is mirrored by the `chromatic-haze` branch in
 * `templateLayout.ts`, so the card does not jump when it is detached.
 */

/** The reference's four disc fills. Background paint only, never put on type. */
const RED = "#E10D16";
const SKY = "#00B3FF";
const MAGENTA = "#CB0EFF";
const BLUE = "#0B5ABD";
/** The slate the blur leaves under the headline, where the sky and red meet. */
const COOL = "#2878EB";

/**
 * A disc and its fitted alpha profile: peak opacity at the centre, how far the
 * profile reaches as a share of the source shape's radius, and how sharply it
 * turns down. The profile is sampled from the blurred raster, not invented.
 */
interface Lobe {
    x: number;
    y: number;
    rx: number;
    ry: number;
    hue: string;
    peak: number;
    spread: number;
    turn: number;
}

/**
 * Listed top layer first, which is the reverse of the reference's paint order
 * (blue, magenta, sky, red). The centres and radii are the vector's own: the red
 * and sky ellipses are 405.595 x 341.121, the magenta circle is 235.662 and the
 * cobalt circle is 209.708.
 */
const LOBES: Lobe[] = [
    { x: 941.596, y: 161.364, rx: 405.595, ry: 341.121, hue: RED, peak: 0.95, spread: 1.157, turn: 2.503 },
    { x: 567.001, y: 656.121, rx: 405.595, ry: 341.121, hue: SKY, peak: 0.896, spread: 1.119, turn: 2.408 },
    { x: 146.511, y: 266.823, rx: 235.662, ry: 235.662, hue: MAGENTA, peak: 0.782, spread: 2.229, turn: 1.77 },
    { x: 120.557, y: 606.688, rx: 209.708, ry: 209.708, hue: BLUE, peak: 0.946, spread: 1.712, turn: 2.565 },
];

/**
 * The lobes run out to 3.5 times their source radius. A radial gradient is
 * written at eleven stops so the ramp stays smooth at card size; the last one is
 * forced clear so no gradient ends on a visible rim.
 */
const REACH = 3.5;
const STEPS = 10;

const lobe = ({ x, y, rx, ry, hue, peak, spread, turn }: Lobe) => {
    const stops = Array.from({ length: STEPS + 1 }, (_, index) => {
        const t = index / STEPS;
        if (index === STEPS) return `${hexToRgba(hue, 0)} 100%`;
        const alpha = Math.round(peak * Math.exp(-((t * REACH / spread) ** turn)) * 1000) / 1000;
        return `${hexToRgba(hue, alpha)} ${(t * 100).toFixed(0)}%`;
    });

    return `radial-gradient(${(rx * REACH).toFixed(1)}px ${(ry * REACH).toFixed(1)}px at ${x}px ${y}px, ${stops.join(
        ", ",
    )})`;
};

const FIELD = LOBES.map(lobe).join(", ");

/**
 * The blur carries each corner disc past the card's edge, so both top corners
 * keep more colour than a symmetric radial profile can. The cool pool settles
 * the lower middle, which the fitted lobes leave too warm. All three are tuned
 * to the composite sampled off the raster.
 */
interface Spill {
    x: number;
    y: number;
    rx: number;
    ry: number;
    hue: string;
    peak: number;
    plateau: number;
}

const COOLING: Spill = { x: 760, y: 480, rx: 420, ry: 300, hue: COOL, peak: 0.25, plateau: 30 };

const SPILLS: Spill[] = [
    { x: 1150, y: 20, rx: 360, ry: 260, hue: RED, peak: 0.7, plateau: 35 },
    { x: 20, y: 20, rx: 320, ry: 280, hue: MAGENTA, peak: 0.6, plateau: 40 },
];

const spill = ({ x, y, rx, ry, hue, peak, plateau }: Spill) =>
    `radial-gradient(${rx}px ${ry}px at ${x}px ${y}px, ${hexToRgba(hue, peak)} 0%, ${hexToRgba(
        hue,
        Math.round(peak * 0.55 * 1000) / 1000,
    )} ${plateau}%, ${hexToRgba(hue, 0)} 100%)`;

const COOLING_FIELD = spill(COOLING);
const SPILL_FIELD = SPILLS.map(spill).join(", ");

/** Lockup: the reference's 42 x 56 mark and its top edge at y 80. */
const LOCKUP_TOP = 80;
const MARK_WIDTH = 42;
const MARK_HEIGHT = 56;
const LOCKUP_GAP = 14;
const WORDMARK_SIZE = 32;
const WORDMARK_WIDTH = 170;

/**
 * The band between the lockup and the URL line. The reference's caps run from
 * y 218.5 to 413.2 across two lines, which straddles the card's middle line, so
 * the headline block is centred in this band and set at one em leading.
 */
const HEADLINE_TOP = 154;
const HEADLINE_BOTTOM = 151;
const HEADLINE_WIDTH = 780;
const HEADLINE_SIZE = 112;
const HEADLINE_LEADING = 1;

/** The reference's domain line sits on the bottom edge, 28px tall. */
const DOMAIN_BOTTOM = 78;
const DOMAIN_SIZE = 28;

export default function ChromaticHaze({
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
            showLift={false}
        >
            {/* The whole haze, in one paint pass and without a filter. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: [COOLING_FIELD, FIELD, SPILL_FIELD].join(", ") }}
            />

            {/* Brand lockup, centred as one group on the reference's top line. */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: LOCKUP_TOP, gap: LOCKUP_GAP }}
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
                            maxWidth: WORDMARK_WIDTH,
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: 1,
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/* The headline, centred in the calm middle of the haze. */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: HEADLINE_TOP, bottom: HEADLINE_BOTTOM }}
            >
                <h1
                    style={{
                        margin: 0,
                        maxWidth: HEADLINE_WIDTH,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 600),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, HEADLINE_SIZE)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.037)}em`,
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
                        margin: 0,
                        color: textColor,
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
