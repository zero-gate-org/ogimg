"use client";

import TemplateCard, { ImageSlot } from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

export default function OgImageStudio({
    title,
    textColor = "#F5F5F5",
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#050505",
    gradientEnd = "#16042B",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
    image,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const dashboardImage = image || "/templates/og-image-studio-dashboard.svg";

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
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: [
                        "radial-gradient(48% 52% at 50% 48%, rgba(106, 19, 217, 0.92) 0%, rgba(91, 16, 184, 0.64) 28%, rgba(35, 7, 71, 0.28) 52%, rgba(0, 0, 0, 0) 78%)",
                        "radial-gradient(24% 26% at 50% 48%, rgba(255, 226, 199, 0.58) 0%, rgba(255, 226, 199, 0) 72%)",
                        "linear-gradient(180deg, #000 0%, #020202 100%)",
                    ].join(","),
                }}
            />

            <div className="relative z-10 flex h-full w-full flex-col items-center">
                <div
                    className="mt-[104px] max-w-[560px] text-center leading-[0.96]"
                    style={{
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 68)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.045)}em`,
                    }}
                >
                    {title}
                </div>

                <ImageSlot
                    image={dashboardImage}
                    alt="Dashboard artwork"
                    fit="cover"
                    objectPosition="top center"
                    radius={23}
                    tone={tone}
                    className="relative mt-[42px] h-[346px] w-[1082px]"
                />
            </div>
        </TemplateCard>
    );
}
