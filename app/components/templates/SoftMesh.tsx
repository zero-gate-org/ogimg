"use client";

import TemplateCard from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    hexToRgb,
    hexToRgba,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Soft Mesh: a blurred colour field with type floating on top of it.
 *
 * The reference paints five large discs and throws a 182px backdrop blur over
 * the whole stack, so no edge survives. Crimson holds the top-left and the left
 * edge, cobalt fills the bottom-centre and the bottom-right, a dusty mauve rose
 * sits at the top-right, and violet pools at the bottom-left. The middle is
 * where all of them agree.
 *
 * A filter is off the table, because the export path cannot rely on
 * `filter: blur()`. The field is therefore rebuilt as stacked radial gradients
 * on the vector's own centres and radii, with each disc's linear ramp split into
 * lobes placed where that ramp actually falls inside the shape. Every lobe holds
 * its colour over a wide plateau and releases along a long tail, which is what
 * keeps the result as soft as the blur it replaces.
 *
 * All of that is background paint, and the type never touches it. The reference
 * sets every letter in one near-white fill, so this card does the same through
 * `textColor`: change the text colour and the headline, the wordmark, and the
 * domain line move together while the field stays put.
 */

/** Field hues, read off the vector's gradient stops. Paint only, never applied to type. */
const CRIMSON = "#E10D16";
const INDIGO = "#0F077B";
/** The bottom ellipse's stop, and the only pure blue in the field. */
const COBALT = "#0011FF";
/** The top ellipse's own ramp end. White over crimson is what makes the top-right read as rose. */
const PALE = "#FFFFFF";

/**
 * The vector's 182px backdrop blur, widened. A gradient ramp falls off more
 * gently than a Gaussian, so each lobe reaches a little further to put the same
 * hue in the same place.
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

const mix = (from: string, to: string, t: number) => {
    const a = hexToRgb(from);
    const b = hexToRgb(to);
    return `#${a
        .map((channel, i) => Math.round(channel + (b[i] - channel) * t).toString(16).padStart(2, "0"))
        .join("")}`;
};

/** The crimson-to-indigo ramp the three circles are filled with, sampled at t. */
const rampAt = (t: number) => mix(CRIMSON, INDIGO, t);

interface Lobe {
    x: number;
    y: number;
    rx: number;
    ry: number;
    hue: string;
    alpha: number;
}

/**
 * The field, painted bottom layer first and in the vector's own shape order:
 * the two left circles, the right circle, the bottom ellipse, the top ellipse.
 * Each entry is one lobe of a shape's ramp, sitting where that ramp falls
 * inside the shape's radius.
 */
const LOBES: Lobe[] = [
    // circle at 120.6, 606.7, r 209.7
    { x: 120.6, y: 500, rx: 108, ry: 108, hue: rampAt(0.3), alpha: 0.69 },
    { x: 120.6, y: 700, rx: 236, ry: 236, hue: rampAt(0.72), alpha: 0.6 },
    // circle at 146.5, 266.8, r 235.7
    { x: 146.5, y: 150, rx: 256, ry: 256, hue: rampAt(0.25), alpha: 0.9 },
    { x: 146.5, y: 390, rx: 118, ry: 118, hue: rampAt(0.68), alpha: 0.33 },
    // circle at 965, 312, r 410
    { x: 965, y: 90, rx: 350, ry: 350, hue: rampAt(0.22), alpha: 0.54 },
    { x: 965, y: 330, rx: 218, ry: 218, hue: rampAt(0.52), alpha: 0.81 },
    { x: 965, y: 560, rx: 249, ry: 249, hue: rampAt(0.8), alpha: 0.28 },
    // ellipse at 567, 656.1, rx 405.6, ry 341.1
    { x: 567, y: 656.1, rx: 447, ry: 375, hue: COBALT, alpha: 0.57 },
    // ellipse at 655.6, 161.4, rx 405.6, ry 341.1, ramping sideways rather than down
    { x: 430, y: 161.4, rx: 315, ry: 315, hue: INDIGO, alpha: 0.67 },
    { x: 800, y: 161.4, rx: 177, ry: 177, hue: mix(INDIGO, PALE, 0.5), alpha: 0.19 },
    { x: 1000, y: 120, rx: 266, ry: 266, hue: PALE, alpha: 0.28 },
];

const lobe = ({ x, y, rx, ry, hue, alpha }: Lobe) =>
    `radial-gradient(${rx + REACH}px ${ry + REACH}px at ${x}px ${y}px, ${FALLOFF.map(([position, scale]) => {
        const stop = Number((alpha * scale).toFixed(3));
        return `${hexToRgba(hue, stop)} ${(position * 100).toFixed(0)}%`;
    }).join(", ")})`;

/** Background layers paint first-listed-on-top, so the vector's order is reversed. */
const FIELD = LOBES.map(lobe)
    .reverse()
    .join(",");

/** Lockup: a portrait mark, a hair of air, then a two-line uppercase wordmark. */
const LOCKUP_TOP = 80;
const MARK_WIDTH = 42;
const MARK_HEIGHT = 56;
const LOCKUP_GAP = 14;
const WORDMARK_SIZE = 34;
/** Tight leading, so two lines of the wordmark measure the mark's height. */
const WORDMARK_LEADING = 0.89;
const WORDMARK_WIDTH = 126;

/** The band the headline is centred in, between the lockup and the domain line.
 *  Its box starts at y 204, the reference's cap line at y 214.6 less the air a
 *  line box leaves above a cap. */
const HEADLINE_TOP = 154;
const HEADLINE_BOTTOM = 151;
const HEADLINE_WIDTH = 940;

const DOMAIN_BOTTOM = 80;
const DOMAIN_SIZE = 28;

export default function SoftMesh({
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
    gradientStart = "#4C1D95",
    gradientEnd = "#1E3A8A",
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
            {/* The whole colour field, in one paint pass and without a filter. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: FIELD }}
            />

            {/* Brand lockup, centred as one group at the top of the card. */}
            <div
                className="absolute left-0 right-0 flex items-start justify-center"
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
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            fontSize: WORDMARK_SIZE,
                            lineHeight: WORDMARK_LEADING,
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase",
                            textDecoration,
                            textWrap: "balance",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/* The headline, centred in the calm middle of the field. */}
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
                </h1>
            </div>

            {domain && (
                <p
                    className="absolute left-0 right-0"
                    style={{
                        bottom: DOMAIN_BOTTOM,
                        margin: 0,
                        color: hexToRgba(textColor, 0.95),
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
