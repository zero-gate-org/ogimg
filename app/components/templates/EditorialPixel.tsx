"use client";

import TemplateCard, { MetaLabel } from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Announcement poster. The headline sits large and flush left on the lower
 * third, with a small mark above it and a link line on the same baseline. The
 * default face is a pixel cut, held at weight 400, which gives the template its
 * printed notice register instead of a centred text block.
 */
export default function EditorialPixel({
    title,
    textColor = "#FAFAFA",
    logoImage,
    tag,
    logo,
    detailOne,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0B0B0D",
    gradientEnd = "#141418",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "dots",
    gridColor,
    gridOpacity = 0.22,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const supportLine = (tag || "").trim();
    const brandName = (logo || "").trim();
    const ctaLine = (detailOne || "").trim();

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
            <div className="flex h-full w-full flex-col justify-between p-14">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        {logoImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logoImage} alt="" className="h-8 w-8 shrink-0 object-contain" />
                        ) : (
                            <div
                                className="h-3.5 w-3.5 shrink-0"
                                style={{ backgroundColor: textColor }}
                            />
                        )}
                        {brandName && (
                            <p
                                className="text-[19px] leading-none tracking-[-0.01em]"
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

                    {supportLine && <MetaLabel tone={tone}>{supportLine}</MetaLabel>}
                </div>

                <div className="flex items-end justify-between gap-12">
                    {/*
                      The default face for this template is Geist Pixel Square,
                      which ships at weight 400 only. Holding the headline at 400
                      keeps it honest and gives the template its poster register,
                      so nothing is ever faux bolded.
                    */}
                    <h1
                        className="max-w-[760px] leading-[1.08]"
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: 400,
                            textDecoration,
                            fontSize: `${resolveTitleFontSize(titleSize, 82)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, -0.012)}em`,
                        }}
                    >
                        {title}
                    </h1>

                    {ctaLine && (
                        <div className="shrink-0 pb-2 text-right">
                            <div
                                className="mb-4 ml-auto h-px w-16"
                                style={{ backgroundColor: tone.hairline }}
                            />
                            <p className="text-[22px] leading-none" style={{ color: tone.secondary }}>
                                {ctaLine}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </TemplateCard>
    );
}
