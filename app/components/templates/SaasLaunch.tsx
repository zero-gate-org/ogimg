"use client";

import TemplateCard, { ImageSlot, MetaLabel } from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
    splitPrefixedLine,
} from "./templateShared";

/**
 * Launch card with the image across the top band and copy beneath it, so the
 * composition reads as a stacked announcement rather than another side by side
 * split. "Added" style lines are split into a fixed width keyword column.
 */
export default function SaasLaunch({
    title,
    textColor = "#F4F7FB",
    logoImage,
    image,
    tag,
    logo,
    detailOne,
    detailTwo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0A1220",
    gradientEnd = "#14243F",
    gradientAngle = 150,
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
    const brandLabel = (logo || "").trim();
    const tagLabel = (tag || "").trim();
    const outcomes = [detailOne, detailTwo].map((line) => line?.trim() || "").filter(Boolean);
    const hasKeywords = outcomes.some((line) => splitPrefixedLine(line).label);

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
            <div className="flex h-full w-full flex-col">
                <div className="flex items-center justify-between gap-6 px-14 pt-12">
                    <div className="flex items-center gap-3">
                        {logoImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logoImage} alt="" className="h-10 w-10 object-contain" />
                        )}
                        {brandLabel && (
                            <p
                                className="text-[20px] leading-none tracking-[-0.01em]"
                                style={{
                                    color: textColor,
                                    fontStyle,
                                    fontWeight: resolveFontWeight(fontWeight, 600),
                                    textDecoration,
                                }}
                            >
                                {brandLabel}
                            </p>
                        )}
                    </div>

                    {tagLabel && <MetaLabel tone={tone}>{tagLabel}</MetaLabel>}
                </div>

                <div className="min-h-0 flex-1 px-14 pt-9">
                    <h1
                        className="max-w-[860px] leading-[1.04]"
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: `${resolveTitleFontSize(titleSize, 60)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, -0.036)}em`,
                        }}
                    >
                        {title}
                    </h1>
                </div>

                <div className="flex min-h-0 items-stretch gap-10 px-14 pb-12 pt-8">
                    {outcomes.length > 0 && (
                        <ul
                            className={`flex shrink-0 flex-col justify-center ${hasKeywords ? "w-[46%]" : "w-[54%]"}`}
                        >
                            {outcomes.map((line, index) => {
                                const { label, body } = splitPrefixedLine(line);

                                return (
                                    <li
                                        key={`${line}-${index}`}
                                        className="border-t py-3.5 first:border-t-0 first:pt-0 last:pb-0"
                                        style={{ borderColor: tone.hairline }}
                                    >
                                        <div className="flex items-baseline gap-5">
                                            {label && (
                                                <span
                                                    className="w-[86px] shrink-0 text-[15px] font-semibold uppercase tracking-[0.14em]"
                                                    style={{ color: tone.tertiary }}
                                                >
                                                    {label}
                                                </span>
                                            )}
                                            <span className="text-[21px] leading-[1.3]" style={{ color: tone.primary }}>
                                                {body}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <ImageSlot
                        className="min-w-0 flex-1"
                        image={image}
                        alt="product screenshot"
                        fit={imageFit}
                        radius={imageRadius}
                        tone={tone}
                        emptyLabel="Product screenshot"
                    />
                </div>
            </div>
        </TemplateCard>
    );
}
