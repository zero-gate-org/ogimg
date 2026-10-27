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
 * A horizon seen from orbit: a violet field that goes to black above, a rose
 * bloom in the far corner, and one thin lit arc curving across the lower third.
 * The headline holds the centre, the brand mark the top, the domain the bottom.
 *
 * The arc is not an ellipse drawn by eye. It is the limb of a circle with a
 * 1082px radius centred 1550px down the card, so it reads as a planet edge
 * rather than a decorative curve. The same centre and radius drive the glow
 * wash, the vignette falloff and the stroked line, which is why the light and
 * the line agree exactly.
 *
 * Everything is drawn in code — CSS gradients, one inline SVG, and a real <img>
 * for the mark — so the whole card survives the foreignObject export.
 */

/** Centre and radius of the horizon circle, in card pixels (1200 x 630). */
const ARC_CENTRE_X = 609.5;
const ARC_CENTRE_Y = 1550;
const ARC_RADIUS = 1082;

/** The wash fades out here, which is also what pulls the top of the card down to black. */
const ARC_FIELD_RADIUS = 1596;

/** Inside this radius the field is clear, so the glow only lives below the limb. */
const ARC_INNER_RADIUS = 778;

/**
 * The visible stroke is overscanned below the canvas: at 870px under the centre
 * the circle is still 643px wide on either side, so the arc runs off both bottom
 * corners instead of ending in a cap.
 */
const ARC_SAMPLE_DEPTH = 870;
const ARC_HALF_CHORD = Math.sqrt(ARC_RADIUS ** 2 - ARC_SAMPLE_DEPTH ** 2);
const ARC_PATH = [
    `M ${(ARC_CENTRE_X - ARC_HALF_CHORD).toFixed(1)} ${(ARC_CENTRE_Y - ARC_SAMPLE_DEPTH).toFixed(1)}`,
    `A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${(ARC_CENTRE_X + ARC_HALF_CHORD).toFixed(1)} ${(ARC_CENTRE_Y - ARC_SAMPLE_DEPTH).toFixed(1)}`,
].join(" ");

const VIOLET = "#C582FE";
const LILAC = "#D6A0FF";
const FILAMENT = "#F0D9FF";
const INK = "#06030F";
const ROSE = "#FF007A";
const EMBER = "#FF8E19";

/**
 * Radial in true circle space — the radius is written in pixels rather than
 * percentages — so the falloff follows the horizon instead of the bounding box.
 * The bright stop sits exactly on the limb, which is what makes the wash and the
 * stroked arc read as one light source.
 */
const horizonWash = `radial-gradient(${ARC_FIELD_RADIUS}px ${ARC_FIELD_RADIUS}px at ${ARC_CENTRE_X}px ${ARC_CENTRE_Y}px,
    ${hexToRgba(VIOLET, 0)} 0px,
    ${hexToRgba(VIOLET, 0)} ${ARC_INNER_RADIUS}px,
    ${hexToRgba(VIOLET, 0.3)} 960px,
    ${hexToRgba(LILAC, 0.92)} ${ARC_RADIUS}px,
    ${hexToRgba(VIOLET, 0.55)} 1120px,
    ${hexToRgba("#AA64E6", 0.3)} 1250px,
    ${hexToRgba("#783CBE", 0.14)} 1420px,
    ${hexToRgba(INK, 0.4)} ${ARC_FIELD_RADIUS}px)`;

/**
 * Space above the limb is vacuum. Anchored just off the top edge so it swallows
 * the whole upper band and releases its grip only where the horizon light lives.
 */
const nightVignette = `radial-gradient(150% 120% at 50% -12%,
    ${hexToRgba(INK, 0.97)} 0%,
    ${hexToRgba(INK, 0.94)} 26%,
    ${hexToRgba(INK, 0.78)} 44%,
    ${hexToRgba(INK, 0.44)} 58%,
    ${hexToRgba(INK, 0.16)} 72%,
    ${hexToRgba(INK, 0)} 86%)`;

/**
 * The one warm accent: light leaking around the far corner of the planet, a rose
 * field with an ember core. Two layers because a single gradient cannot carry
 * both the tight hot centre and the wide cool spill.
 */
const roseBloom = `radial-gradient(30% 40% at 101% -2%, ${hexToRgba(EMBER, 0.26)} 0%, ${hexToRgba(EMBER, 0)} 70%),
    radial-gradient(46% 62% at 101% -4%,
    ${hexToRgba(ROSE, 0.85)} 0%,
    ${hexToRgba("#EE0E7C", 0.46)} 34%,
    ${hexToRgba("#C41884", 0.14)} 62%,
    ${hexToRgba("#C41884", 0)} 86%)`;

export default function AuroraArc({
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
    gradientStart = "#1B1030",
    gradientEnd = "#6D28D9",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur,
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
            {/* Field light: the violet that gathers at the limb and dies above it. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: nightVignette }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: horizonWash }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: roseBloom }}
            />

            {/*
              The filament itself. Four strokes on the same circle, from a wide
              bloom down to a hairline core, because a filter would not survive
              the export and a box-shadow would.
            */}
            <svg
                width="1200"
                height="630"
                viewBox="0 0 1200 630"
                fill="none"
                aria-hidden="true"
                style={{
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    width: "1200px",
                    height: "630px",
                    pointerEvents: "none",
                }}
            >
                <path d={ARC_PATH} stroke={hexToRgba(VIOLET, 0.1)} strokeWidth="34" />
                <path d={ARC_PATH} stroke={hexToRgba(LILAC, 0.16)} strokeWidth="14" />
                <path d={ARC_PATH} stroke={hexToRgba(FILAMENT, 0.34)} strokeWidth="5" />
                <path d={ARC_PATH} stroke={hexToRgba(FILAMENT, 0.85)} strokeWidth="1.6" />
            </svg>

            <div className="relative z-10 flex h-full w-full flex-col items-center">
                {/* Brand lockup, centred as a group the way the reference sets it. */}
                <div className="mt-[96px] flex shrink-0 items-center gap-[14px]">
                    {logoImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={logoImage}
                            alt=""
                            style={{ width: "46px", height: "46px", objectFit: "contain", flexShrink: 0 }}
                        />
                    ) : (
                        <svg
                            width="46"
                            height="46"
                            viewBox="0 0 44 44"
                            fill="none"
                            aria-hidden="true"
                            style={{ width: "46px", height: "46px", flexShrink: 0 }}
                        >
                            <rect
                                x="4"
                                y="4"
                                width="36"
                                height="36"
                                rx="4"
                                stroke={textColor}
                                strokeWidth="3.2"
                            />
                            <path
                                d="M10 34 A 12 12 0 0 1 34 34"
                                stroke={textColor}
                                strokeWidth="3.2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}

                    {wordmark && (
                        <span
                            style={{
                                color: tone.secondary,
                                fontStyle,
                                fontWeight: 700,
                                fontSize: "19px",
                                lineHeight: 1.1,
                                letterSpacing: "0.01em",
                                textTransform: "uppercase",
                                maxWidth: "200px",
                            }}
                        >
                            {wordmark}
                        </span>
                    )}
                </div>

                <div className="flex min-h-0 flex-1 items-center justify-center px-[132px]">
                    <div
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: `${resolveTitleFontSize(titleSize, 88)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                            lineHeight: 1.04,
                            textAlign: "center",
                            maxWidth: "680px",
                        }}
                    >
                        {title}
                    </div>
                </div>

                {domain && (
                    <p
                        style={{
                            marginBottom: "78px",
                            color: tone.secondary,
                            fontSize: "30px",
                            fontWeight: 500,
                            lineHeight: 1,
                            letterSpacing: "0.01em",
                            textAlign: "center",
                            maxWidth: "760px",
                        }}
                    >
                        {domain}
                    </p>
                )}
            </div>
        </TemplateCard>
    );
}
