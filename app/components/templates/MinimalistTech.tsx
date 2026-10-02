"use client";

import TemplateCard, { ImageSlot, MetaLabel } from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Asymmetric split: copy pinned to a narrow left rail on a strict grid, the
 * screenshot given the remaining width and allowed to bleed off the right edge.
 * The headline is bottom anchored so the card reads top to bottom as
 * identity, then claim.
 */
export default function MinimalistTech({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
    image,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0B0B0D",
    gradientEnd = "#1C1C20",
    gradientAngle = 155,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
    imageFit = "cover",
    imageRadius,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const brandName = (logo || "").trim();
    const tagLabel = (tag || "").trim();
    const headlineSize = resolveTitleFontSize(titleSize, 68);
    const headlineTracking = resolveTitleTracking(titleTracking, -0.038);
    const headlineWeight = resolveFontWeight(fontWeight, 700);

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
                <div className="flex w-[54%] shrink-0 flex-col justify-between p-14">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex min-w-0 items-center gap-3.5">
                            {logoImage && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={logoImage} alt="" className="h-11 w-11 shrink-0 object-contain" />
                            )}
                            {brandName && (
                                <p
                                    className="truncate text-[21px] leading-none tracking-[-0.02em]"
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

                        {tagLabel && <MetaLabel tone={tone}>{tagLabel}</MetaLabel>}
                    </div>

                    <div className="max-w-[560px]">
                        <h1
                            className="leading-[1.03]"
                            style={{
                                color: textColor,
                                fontStyle,
                                fontWeight: headlineWeight,
                                textDecoration,
                                fontSize: `${headlineSize}px`,
                                letterSpacing: `${headlineTracking}em`,
                            }}
                        >
                            {title}
                        </h1>
                    </div>
                </div>

                {/*
                  The screenshot gets a landscape frame that sits on the bottom
                  edge and runs past the right edge, so it shares a baseline with
                  the headline instead of floating in a full height panel.
                */}
                <div className="relative flex w-[46%] items-end overflow-hidden">
                    <ImageSlot
                        className="w-[124%] shrink-0"
                        image={image}
                        alt="product screenshot"
                        fit={imageFit}
                        radius={imageRadius}
                        tone={tone}
                        emptyLabel="Product screenshot"
                        style={{ aspectRatio: "16 / 10" }}
                    />
                </div>
            </div>
        </TemplateCard>
    );
}
