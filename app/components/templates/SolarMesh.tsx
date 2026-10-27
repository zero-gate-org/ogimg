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
 * Solar Mesh: a four colour mesh split by one diagonal band of light.
 *
 * The field is two enormous rings whose centres both sit off the bottom of the
 * card, so only their far limbs cross the canvas. The crimson ring lands on the
 * left edge and the top-right, the violet ring sweeps from the upper-left corner
 * down to the bottom-right, and the middle, where both are still transparent,
 * stays near-black. That crossing is the light band: the violet limb reaches full
 * opacity exactly where it runs across the card, which is why it reads as a
 * hard-edged shaft rather than a glow. Two dark layers hold the core: the
 * vector's own type panel, a 638.5 x 362 black plate at x 280.75 blurred out to a
 * broad ellipse, and a shallower ellipse over the hole between the limbs.
 *
 * The reference paints its headline with a violet-to-ember ramp and its mesh is
 * built from saturated colour. Both live in the background here. The type is one
 * solid `textColor`, so a card stays in a single family whatever the user sets,
 * and nothing depends on a gradient definition surviving the foreignObject
 * rasteriser. The vector's hairline grid is dropped for the same reason: the
 * 182px blur it sits under erases it in the render, so it is paint with no job.
 *
 * Every layer is drawn in code: CSS gradients, one inline SVG fallback mark, and
 * a real <img> when a logo is uploaded.
 */

/** Mesh hues. Background paint only, never applied to type. */
const CRIMSON = "#FF007A";
const EMBER = "#FF8E19";
/** The hot middle of the crimson ring's runout, before it reaches full ember. */
const FLARE = "#FF5A28";
const VIOLET = "#C582FE";
/** The violet limb's own shadow side, which keeps its ramp from going grey. */
const SHALE = "#4A2166";
const MIDVIOLET = "#783CAA";
/** Both dark veils. Near-black rather than #000 so the base fill still reads. */
const INK = "#080308";

/**
 * Ring geometry in card pixels, lifted from the vector's two gradient transforms.
 * Both centres are below the canvas, so the visible arcs are limbs, not discs.
 */
const CRATER = { x: 938.125, y: 734.307, r: 1169.77 };
const CORONA = { x: 183.19, y: 1090.24, r: 1477.01 };

type Stop = [position: number, color: string];

const ring = (centre: { x: number; y: number; r: number }, stops: Stop[]) =>
    `radial-gradient(${centre.r}px ${centre.r}px at ${centre.x}px ${centre.y}px, ${stops
        .map(([position, color]) => `${color} ${(position * 100).toFixed(1)}%`)
        .join(", ")})`;

const fade = (hex: string, alpha: number) => hexToRgba(hex, alpha);

/**
 * The crimson limb. The vector blurs this layer by 182px, so its ramp is written
 * out as explicit stops: a wide gather, a peak short of full opacity, then a long
 * runout into ember. Hand-declared stops also mean the ramp cannot drift if a
 * rasteriser interpolates a transparent stop differently.
 */
const craterRing = ring(CRATER, [
    [0, fade(CRIMSON, 0)],
    [0.38, fade(CRIMSON, 0)],
    [0.56, fade(CRIMSON, 0.3)],
    [0.66, fade(CRIMSON, 0.6)],
    [0.713, fade(CRIMSON, 0.85)],
    [0.86, fade(FLARE, 0.95)],
    [0.934, EMBER],
]);

/**
 * The violet limb, drawn sharp over the plate exactly as the vector draws it last.
 * Its 0.713 stop is the light band, and it is the only fully opaque point in the
 * whole field, which is what makes the band read as a blade rather than a bloom.
 */
const coronaRing = ring(CORONA, [
    [0, fade(VIOLET, 0)],
    [0.44, fade(VIOLET, 0)],
    [0.58, fade(SHALE, 0.22)],
    [0.65, fade(MIDVIOLET, 0.55)],
    [0.713, VIOLET],
    [0.934, EMBER],
]);

const veil = (rx: number, ry: number, cx: number, cy: number, ramp: [number, number][]) =>
    `radial-gradient(${rx}px ${ry}px at ${cx}px ${cy}px, ${ramp
        .map(([position, alpha]) => `${fade(INK, alpha)} ${(position * 100).toFixed(0)}%`)
        .join(", ")})`;

/**
 * The vector's type panel: a 638.5 x 362 black plate at x 280.75, blurred by
 * 182px. An ellipse is fitted to that blur, which is what the plate looks like
 * once it has been softened, and it sits under the violet limb so the band that
 * crosses it stays sharp.
 */
const plateVeil = veil(620, 470, 600, 181, [
    [0, 0.35],
    [0.3, 0.3],
    [0.5, 0.22],
    [0.7, 0.11],
    [0.88, 0.04],
    [1, 0],
]);

/**
 * The hole the two limbs leave in the middle of the card. The vector gets its
 * near-black core from a base that is already black, so the core is drawn here
 * instead, which keeps the user's fill as the colour of the corners and the
 * light rather than the middle.
 */
const coreVeil = veil(660, 300, 680, 480, [
    [0, 0.7],
    [0.45, 0.68],
    [0.65, 0.6],
    [0.82, 0.39],
    [0.93, 0.15],
    [1, 0],
]);

/** Lockup: a portrait mark, a hair of air, then a stacked uppercase wordmark. */
const LOCKUP_TOP = 80;
const MARK_WIDTH = 42;
const MARK_HEIGHT = 56;
const LOCKUP_GAP = 14;
const WORDMARK_SIZE = 36;
/** Tight enough that two lines of the wordmark measure the mark's height. */
const WORDMARK_LEADING = 0.85;
const WORDMARK_WIDTH = 150;

/** The reference's ink runs y214.6 to y436.2, so the band is exactly its two lines tall. */
const HEADLINE_TOP = 204;
const HEADLINE_BOTTOM = 202;
/** Wide enough that the reference's own break, 678px of ink, still fits. */
const HEADLINE_WIDTH = 820;
/** 112px of advance at 118px, the reference's own two-line leading. */
const HEADLINE_LINE = 0.95;
const TITLE_BASELINE_PX = 118;
const TITLE_TRACKING_EM = -0.08;

const DOMAIN_BOTTOM = 76;
const DOMAIN_SIZE = 30;

export default function SolarMesh({
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
    gradientStart = "#3B0F5E",
    gradientEnd = "#B23A00",
    gradientAngle = 120,
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
            {/* The crimson limb, gathered out of the bottom-right and landing on
                the left edge and the top of the card. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: craterRing }}
            />

            {/* The plate, over the crimson so the arc behind the type loses its
                peak the way the blurred original does. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: plateVeil }}
            />

            {/* The near-black core the two limbs leave between them. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: coreVeil }}
            />

            {/* The violet limb, last, so the band stays sharp across the plate. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: coronaRing }}
            />

            {/* Brand lockup, centred as one group at the top of the card. */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: LOCKUP_TOP, height: MARK_HEIGHT }}
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
                      Empty state: the reference's own mark, a square with a
                      diagonal bar punched out of it.
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
                            fontWeight: resolveFontWeight(fontWeight, 700),
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

            {/* The headline, held on the plate and cut by the band of light. */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: HEADLINE_TOP, bottom: HEADLINE_BOTTOM }}
            >
                <div
                    style={{
                        maxWidth: HEADLINE_WIDTH,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, TITLE_BASELINE_PX)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, TITLE_TRACKING_EM)}em`,
                        lineHeight: HEADLINE_LINE,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </div>
            </div>

            {domain && (
                <p
                    className="absolute left-0 right-0"
                    style={{
                        bottom: DOMAIN_BOTTOM,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 600),
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
