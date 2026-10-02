"use client";

import TemplateCard from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Benefits stacked as a ruled list rather than bulleted lines. The rule does the
 * separating, so each benefit reads as a row of its own without a marker.
 */
export default function BrandPitch({
    title,
    textColor = "#111111",
    logoImage,
    tag,
    logo,
    detailOne,
    detailTwo,
    detailThree,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#F5F5F4",
    gradientEnd = "#E7E7E5",
    gradientAngle = 155,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const brandName = (logo || "").trim();
    const subheading = (tag || "").trim();
    const benefits = [detailOne, detailTwo, detailThree].map((line) => line?.trim() || "").filter(Boolean);

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
            <div className="flex h-full w-full flex-col p-14">
                <div className="flex items-center gap-3">
                    {logoImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoImage} alt="" className="h-10 w-10 object-contain" />
                    )}
                    {brandName && (
                        <p
                            className="text-[20px] leading-none tracking-[-0.01em]"
                            style={{
                                color: textColor,
                                fontStyle,
                                fontWeight: resolveFontWeight(fontWeight, 600),
                                textDecoration,
                            }}
                        >
                            {brandName}
                        </p>
                    )}
                </div>

                <div className="grid flex-1 grid-cols-[1.15fr_1fr] content-center gap-16">
                    <div>
                        <h1
                            className="max-w-[620px] leading-[1.05]"
                            style={{
                                color: textColor,
                                fontStyle,
                                fontWeight: resolveFontWeight(fontWeight, 700),
                                textDecoration,
                                fontSize: `${resolveTitleFontSize(titleSize, 64)}px`,
                                letterSpacing: `${resolveTitleTracking(titleTracking, -0.036)}em`,
                            }}
                        >
                            {title}
                        </h1>

                        {subheading && (
                            <p className="mt-7 max-w-[560px] text-[22px] leading-[1.35]" style={{ color: tone.secondary }}>
                                {subheading}
                            </p>
                        )}
                    </div>

                    {benefits.length > 0 && (
                        <ul className="flex flex-col justify-center">
                            {benefits.map((line, index) => (
                                <li
                                    key={`${line}-${index}`}
                                    className="border-t py-4 first:border-t-0 first:pt-0 last:pb-0"
                                    style={{ borderColor: tone.hairline }}
                                >
                                    <p className="text-[21px] leading-[1.3]" style={{ color: textColor }}>
                                        {line}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </TemplateCard>
    );
}
