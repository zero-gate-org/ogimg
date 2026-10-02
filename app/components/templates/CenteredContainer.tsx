"use client";

import TemplateCard from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getBrandMark,
    getCardTone,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Typographic and centred, so it earns its place by scale alone. The mark and
 * headline carry the weight, the subtext sits under a short centred rule, and
 * nothing competes for attention.
 */
export default function CenteredContainer({
    title,
    textColor = "#FAFAFA",
    logoImage,
    tag,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#111318",
    gradientEnd = "#1A1D24",
    gradientAngle = 165,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const subtext = (tag || "").trim();
    const mark = getBrandMark(logo, tag, "OG");

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
            <div className="flex h-full w-full flex-col items-center justify-center px-24 text-center">
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoImage} alt="" className="h-[86px] w-[86px] object-contain" />
                ) : (
                    <div
                        className="flex h-[86px] w-[86px] items-center justify-center text-[30px] font-bold tracking-[-0.02em]"
                        style={{
                            color: textColor,
                            backgroundColor: tone.fill,
                            boxShadow: `inset 0 0 0 1px ${tone.hairline}`,
                        }}
                    >
                        {mark}
                    </div>
                )}

                <h1
                    className="mt-11 max-w-[900px] leading-[1.04]"
                    style={{
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 720),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 76)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.04)}em`,
                    }}
                >
                    {title}
                </h1>

                {subtext && (
                    <div className="mt-12 flex flex-col items-center gap-6">
                        <div className="h-px w-14" style={{ backgroundColor: tone.hairline }} />
                        <p className="max-w-[560px] text-[23px] leading-[1.4]" style={{ color: tone.secondary }}>
                            {subtext}
                        </p>
                    </div>
                )}
            </div>
        </TemplateCard>
    );
}
