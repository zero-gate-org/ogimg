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
 * A bold diagonal color field: near-black in the top-left sweeping through
 * violet to a hot orange corner glow in the top-right, with one thin lit arc
 * curving across the mesh. A replaceable mark and wordmark sit top-left; a
 * very large headline anchors the bottom-left.
 *
 * The arc is not drawn by eye. It is a circle with a 1004px radius centred
 * off the bottom-left of the card, sampled past the top and bottom edges so
 * it bleeds off canvas instead of ending in a cap. The same centre and radius
 * drive the halo band around it, which is why the light and the line agree.
 *
 * Every layer is drawn in code — CSS gradients, one inline SVG of stacked
 * strokes (a filter would not survive the export, overlapping strokes do),
 * and a real <img> for the mark — so the whole card survives the foreignObject
 * rasterization.
 */

/** Centre and radius of the glowing arc, in card pixels (1200 x 630). */
const ARC_CENTRE_X = 127;
const ARC_CENTRE_Y = 874;
const ARC_RADIUS = 1004;

/** Sampled past both edges so the stroke runs off canvas at each end. */
const ARC_TOP_SAMPLE = -60;
const ARC_BOTTOM_SAMPLE = 690;

const arcXAt = (y: number) =>
    ARC_CENTRE_X + Math.sqrt(ARC_RADIUS ** 2 - (ARC_CENTRE_Y - y) ** 2);

const ARC_PATH = [
    `M ${arcXAt(ARC_TOP_SAMPLE).toFixed(1)} ${ARC_TOP_SAMPLE}`,
    `A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${arcXAt(ARC_BOTTOM_SAMPLE).toFixed(1)} ${ARC_BOTTOM_SAMPLE}`,
].join(" ");

const ORANGE = "#F97316";
const EMBER = "#FDBA26";
const ROSE = "#BE123C";
const VIOLET = "#8B5CF6";
const LILAC = "#C4B5FD";
const FILAMENT = "#F3E8FF";
const INK = "#0A0A0C";

/**
 * The mesh itself, in CSS radial layers (first listed paints on top): an
 * ember core inside a wide orange field at the top-right corner, a rose
 * bloom gathering at the bottom edge, and a violet bloom mid-right. The base
 * linear gradient underneath already carries the black-to-purple sweep; this
 * is what turns it from a gradient into a color field.
 */
const meshField = [
    `radial-gradient(26% 38% at 100% 0%, ${hexToRgba(EMBER, 0.5)} 0%, ${hexToRgba(EMBER, 0)} 68%)`,
    `radial-gradient(52% 78% at 100% 0%, ${hexToRgba(ORANGE, 0.92)} 0%, ${hexToRgba(ORANGE, 0.5)} 38%, ${hexToRgba(ORANGE, 0)} 72%)`,
    `radial-gradient(44% 60% at 63% 104%, ${hexToRgba(ROSE, 0.55)} 0%, ${hexToRgba(ROSE, 0)} 70%)`,
    `radial-gradient(50% 70% at 88% 42%, ${hexToRgba(VIOLET, 0.34)} 0%, ${hexToRgba(VIOLET, 0)} 72%)`,
].join(",");

/**
 * The dark half of the field. Anchored off the top-left corner so the black
 * keeps a firm grip on the mark and headline zone and releases exactly where
 * the mesh starts to glow.
 */
const nightVeil = `radial-gradient(118% 128% at -10% -16%,
    ${hexToRgba(INK, 0.96)} 0%,
    ${hexToRgba(INK, 0.82)} 28%,
    ${hexToRgba(INK, 0.46)} 50%,
    ${hexToRgba(INK, 0.14)} 68%,
    ${hexToRgba(INK, 0)} 82%)`;

/**
 * The arc's wide bloom, radial in true circle space so the falloff follows
 * the limb. Centered on the same circle as the stroke, biased slightly
 * outward, which is where the reference carries its lavender band.
 */
const arcHalo = `radial-gradient(${ARC_RADIUS + 260}px ${ARC_RADIUS + 260}px at ${ARC_CENTRE_X}px ${ARC_CENTRE_Y}px,
    ${hexToRgba(LILAC, 0)} ${ARC_RADIUS - 170}px,
    ${hexToRgba(LILAC, 0.14)} ${ARC_RADIUS - 40}px,
    ${hexToRgba(LILAC, 0.2)} ${ARC_RADIUS + 8}px,
    ${hexToRgba(LILAC, 0)} ${ARC_RADIUS + 150}px)`;

export default function ColorMesh({
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
    gradientEnd = "#7C3AED",
    gradientAngle = 120,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity,
    gridBlur,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const tagline = (tag || "").trim();

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
            {/* The colored corner glow, rose bloom, and violet bloom of the mesh. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: meshField }}
            />

            {/* Pull the top-left back to near-black so the lockup and headline sit on it. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: nightVeil }}
            />

            {/* The arc's wide lavender bloom, drawn before the filament it belongs to. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: arcHalo }}
            />

            {/*
              The filament: four strokes on the same circle, from a wide bloom
              down to a hairline core. Stacked strokes instead of a blur filter
              because filters do not survive the foreignObject export.
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
                <path d={ARC_PATH} stroke={hexToRgba(LILAC, 0.1)} strokeWidth="46" />
                <path d={ARC_PATH} stroke={hexToRgba(LILAC, 0.16)} strokeWidth="18" />
                <path d={ARC_PATH} stroke={hexToRgba(FILAMENT, 0.38)} strokeWidth="5" />
                <path d={ARC_PATH} stroke={hexToRgba(FILAMENT, 0.92)} strokeWidth="1.6" />
            </svg>

            <div className="relative z-10 flex h-full w-full flex-col justify-between px-16 pt-14 pb-14">
                {/* Brand lockup: replaceable mark beside an uppercase wordmark. */}
                <div className="flex shrink-0 items-center gap-5">
                    {logoImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={logoImage}
                            alt=""
                            className="h-16 w-16 shrink-0 object-contain"
                        />
                    ) : (
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 56 56"
                            fill="none"
                            aria-hidden="true"
                            style={{ flexShrink: 0 }}
                        >
                            <rect x="4" y="4" width="48" height="48" rx="10" stroke={textColor} strokeWidth="4.5" />
                            <path
                                d="M10 46 A 36 36 0 0 1 46 10"
                                stroke={textColor}
                                strokeWidth="4.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}

                    {wordmark && (
                        <span
                            className="max-w-[260px] uppercase leading-[1.1]"
                            style={{
                                color: textColor,
                                fontStyle,
                                fontWeight: 700,
                                fontSize: "22px",
                                letterSpacing: "0.01em",
                                textDecoration,
                            }}
                        >
                            {wordmark}
                        </span>
                    )}
                </div>

                {/* The headline carries the card; the tag is a quiet line beneath it. */}
                <div>
                    <h1
                        className="max-w-[960px]"
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: `${resolveTitleFontSize(titleSize, 84)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                            lineHeight: 1.02,
                        }}
                    >
                        {title}
                    </h1>

                    {tagline && (
                        <p
                            className="mt-[22px] max-w-[680px]"
                            style={{
                                color: tone.secondary,
                                fontSize: "22px",
                                fontWeight: 500,
                                lineHeight: 1.2,
                            }}
                        >
                            {tagline}
                        </p>
                    )}
                </div>
            </div>
        </TemplateCard>
    );
}
