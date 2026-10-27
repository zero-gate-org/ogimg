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
 * Brand lockup on a blueprint grid. A replaceable logo sits beside a large
 * uppercase wordmark, both centred on near-black, with a faint hairline grid
 * and a single purple glow bleeding from the top-right corner. The logo falls
 * back to a geometric square-and-diagonal mark when none is uploaded.
 *
 * Every layer is drawn in code (CSS gradients, one inline SVG fallback, and a
 * real <img> for the logo); there is no raster background, so the whole card
 * survives the foreignObject export.
 */
export default function NeonGrid({
    title,
    textColor = "#FAFAFA",
    logoImage,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#08080C",
    gradientEnd = "#050506",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.06,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const tagline = (tag || "").trim();
    const gridLine = hexToRgba(gridColor ?? textColor, gridOpacity);

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
            {/* Wide blueprint grid, drawn in code rather than inherited from the card overlay. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: [
                        `linear-gradient(${gridLine} 1px, transparent 1px)`,
                        `linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
                    ].join(","),
                    backgroundSize: "150px 150px, 150px 150px",
                }}
            />

            {/* The one decorative accent: a purple glow bleeding from the top-right corner. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: [
                        `radial-gradient(58% 58% at 100% 0%, ${hexToRgba("#AC59D6", 0.6)} 0%, ${hexToRgba("#7C3AED", 0.22)} 40%, rgba(0, 0, 0, 0) 72%)`,
                        `radial-gradient(38% 38% at 100% 0%, ${hexToRgba("#FFB43C", 0.16)} 0%, rgba(0, 0, 0, 0) 70%)`,
                    ].join(","),
                }}
            />

            <div className="relative z-10 flex h-full w-full items-center justify-center px-24">
                <div className="flex items-center gap-10">
                    {/*
                      The mark is a replaceable logo slot. When a logo is uploaded it
                      is drawn as a real image (so the export embeds it); the geometric
                      square-and-diagonal is only the empty-state fallback.
                    */}
                    {logoImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={logoImage}
                            alt=""
                            className="h-[150px] w-[150px] shrink-0 object-contain"
                        />
                    ) : (
                        <svg
                            width="112"
                            height="150"
                            viewBox="0 0 100 134"
                            fill="none"
                            style={{ flexShrink: 0 }}
                            aria-hidden="true"
                        >
                            <rect x="6" y="6" width="88" height="122" stroke={textColor} strokeWidth="11" />
                            <line x1="6" y1="6" x2="94" y2="128" stroke={textColor} strokeWidth="11" />
                        </svg>
                    )}

                    <div className="flex flex-col">
                        <div
                            className="max-w-[470px] uppercase leading-[0.94]"
                            style={{
                                color: textColor,
                                fontStyle,
                                fontWeight: resolveFontWeight(fontWeight, 700),
                                textDecoration,
                                fontSize: `${resolveTitleFontSize(titleSize, 84)}px`,
                                letterSpacing: `${resolveTitleTracking(titleTracking, -0.02)}em`,
                            }}
                        >
                            {title}
                        </div>

                        {tagline && (
                            <p
                                className="mt-6 text-[15px] font-semibold uppercase leading-none tracking-[0.32em]"
                                style={{ color: tone.tertiary }}
                            >
                                {tagline}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </TemplateCard>
    );
}
