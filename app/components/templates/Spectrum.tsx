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
 * Spectrum: a near-black card lit by two pieces of spectrum paint — a thin
 * rainbow strip along the very top edge and a warm glow bleeding from the
 * lower-left corner. A large headline sits centred in the upper half above a
 * short tag line, and a dark product screenshot is anchored to the bottom
 * edge, bleeding past it so the card reads as a stage, not a frame.
 *
 * The headline stays solid `textColor`; the colour story lives entirely in the
 * background layers, which keeps the type export-safe and the hierarchy on the
 * single-colour system. The mark is a replaceable logo slot; the prism glyph
 * below is only the empty-state fallback.
 */

// Stops taken from the reference art: yellow anchored to the right edge,
// orange and pink across the middle, blue at the left. Purple is pinned
// between pink and blue so the interpolation stays clean.
const SPECTRUM_GRADIENT =
    "linear-gradient(to left, #FFE702 0%, #FF5E01 23.5%, #FF8CE4 43.4%, #A900FF 68%, #0051FF 100%)";

export default function Spectrum({
    title,
    textColor = "#FAFAFA",
    logoImage,
    image,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#08080A",
    gradientEnd = "#101014",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity,
    gridBlur,
    titleSize,
    titleTracking,
    imageFit = "contain",
    imageRadius,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const tagline = (tag || "").trim();
    const frameRadius = typeof imageRadius === "number" && imageRadius > 0 ? imageRadius : 24;

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
            {/* Warm light bleeding from the lower-left corner, echoing the
                yellow-orange end of the top strip. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: [
                        `radial-gradient(54% 54% at 2% 100%, ${hexToRgba("#FFE702", 0.3)} 0%, ${hexToRgba("#FF5E01", 0.16)} 40%, rgba(0, 0, 0, 0) 72%)`,
                        `radial-gradient(24% 24% at 0% 98%, ${hexToRgba("#FFE702", 0.26)} 0%, rgba(0, 0, 0, 0) 70%)`,
                    ].join(","),
                }}
            />

            {/* The strip's own light spilling one soft step below the edge. */}
            <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{ top: -4, height: 16, background: SPECTRUM_GRADIENT, filter: "blur(16px)", opacity: 0.55 }}
            />

            {/* The thin full-width rainbow, pinned to the very top edge. */}
            <div className="absolute left-0 right-0 top-0" style={{ height: 10, background: SPECTRUM_GRADIENT }} />

            {/* Mark + headline + tag, centred in the band between the strip
                and the screenshot. Geometry mirrored by the preset branch:
                mark y 36, headline y 96, tag y 246. */}
            <div className="absolute left-0 right-0" style={{ top: 10, height: 290 }}>
                <div className="flex h-full flex-col items-center justify-center text-center">
                    {logoImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoImage} alt="" className="h-[44px] w-[44px] shrink-0 object-contain" />
                    ) : (
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                            {/* A prism refracting a beam into the strip's hues. */}
                            <line x1="2" y1="22" x2="19" y2="22" stroke={tone.tertiary} strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M22 6.5L37.5 33.5H6.5L22 6.5Z" stroke={textColor} strokeWidth="2.5" strokeLinejoin="round" fill="none" />
                            <line x1="27" y1="17" x2="41" y2="13" stroke="#FFE702" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="28" y1="23" x2="42" y2="23" stroke="#FF8CE4" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="27" y1="29" x2="41" y2="33" stroke="#0051FF" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    )}

                    <h1
                        className="mt-4 max-w-[860px]"
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: `${resolveTitleFontSize(titleSize, 64)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                            lineHeight: 1.04,
                        }}
                    >
                        {title}
                    </h1>

                    {tagline && (
                        <p className="mt-4 max-w-[720px] text-[21px] leading-[1.35]" style={{ color: tone.secondary }}>
                            {tagline}
                        </p>
                    )}
                </div>
            </div>

            {/* The screenshot frame: 20px side margins, top edge at y 300,
                bleeding off the bottom so it anchors the card. */}
            <div className="absolute" style={{ left: 20, right: 20, top: 300, bottom: -140 }}>
                {image ? (
                    <div
                        className="relative h-full w-full overflow-hidden"
                        style={{
                            borderRadius: `${frameRadius}px ${frameRadius}px 0 0`,
                            backgroundColor: tone.fill,
                            boxShadow: `inset 0 0 0 1px ${tone.hairline}`,
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image}
                            alt=""
                            className="h-full w-full"
                            style={{ objectFit: imageFit, objectPosition: "top center" }}
                        />
                    </div>
                ) : (
                    <ImageSlot
                        className="h-full w-full"
                        image=""
                        fit={imageFit}
                        radius={frameRadius}
                        tone={tone}
                        emptyLabel="Add a screenshot"
                    />
                )}

                {/* Light catching the top edge of the frame, strongest at the
                    centre, like the reference card's rim stroke. */}
                <div
                    className="absolute left-0 right-0 top-0"
                    style={{
                        height: 1,
                        background: `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, ${hexToRgba(textColor, 0.3)} 50%, rgba(0, 0, 0, 0) 100%)`,
                    }}
                />
            </div>
        </TemplateCard>
    );
}
