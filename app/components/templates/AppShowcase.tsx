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

/**
 * Left aligned identity column with the product shot given a full bleed right
 * panel. Differs from Minimalist Tech by keeping all copy in one left aligned
 * stack and by letting the image run edge to edge with no radius of its own.
 */
export default function AppShowcase({
    title,
    textColor = "#09090B",
    image,
    logo,
    logoImage,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#F4F4F5",
    gradientEnd = "#E4E4E7",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.12,
    gridBlur = 0,
    titleSize,
    titleTracking,
    imageFit = "cover",
    imageRadius,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const brandName = (logo || "").trim();
    const tagline = (title || "").trim();
    const tagLabel = (tag || "").trim();

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
            <div className="flex h-full w-full">
                <div className="flex w-[44%] shrink-0 flex-col justify-between p-14">
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

                    <div>
                        {tagline && (
                            <h1
                                className="max-w-[440px] leading-[1.08]"
                                style={{
                                    color: textColor,
                                    fontStyle,
                                    fontWeight: resolveFontWeight(fontWeight, 680),
                                    textDecoration,
                                    fontSize: `${resolveTitleFontSize(titleSize, 54)}px`,
                                    letterSpacing: `${resolveTitleTracking(titleTracking, -0.032)}em`,
                                }}
                            >
                                {tagline}
                            </h1>
                        )}

                        {tagLabel && (
                            <p className="mt-6 max-w-[400px] text-[21px] leading-[1.35]" style={{ color: tone.secondary }}>
                                {tagLabel}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex w-[56%] items-stretch" style={{ backgroundColor: tone.fill }}>
                    <ImageSlot
                        className="flex-1"
                        image={image}
                        alt="product interface"
                        fit={imageFit}
                        radius={imageRadius}
                        tone={tone}
                        emptyLabel="Product interface"
                    />
                </div>
            </div>
        </TemplateCard>
    );
}
