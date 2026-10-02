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
 * Article cover. Byline and category sit in a top bar, the serif headline runs
 * down the left, and the cover image is given a wide frame that bleeds off the
 * right and bottom edges. Serif by default, with no device competing with it.
 */
export default function BlogPost({
    title,
    textColor = "#111111",
    logoImage,
    image,
    tag,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#FAFAF9",
    gradientEnd = "#E7E5E4",
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
    const byline = (logo || "").trim();
    const category = (tag || "").trim();

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
                            <img src={logoImage} alt="" className="h-9 w-9 object-contain" />
                        )}
                        {byline && (
                            <p
                                className="text-[19px] leading-none tracking-[-0.01em]"
                                style={{
                                    color: textColor,
                                    fontStyle,
                                    fontWeight: resolveFontWeight(fontWeight, 600),
                                    textDecoration,
                                }}
                            >
                                {byline}
                            </p>
                        )}
                    </div>

                    {category && <MetaLabel tone={tone}>{category}</MetaLabel>}
                </div>

                <div className="flex min-h-0 flex-1">
                    <div className="flex w-[50%] shrink-0 flex-col justify-center px-14 pb-14 pt-10">
                        <div className="mb-7 h-px w-16" style={{ backgroundColor: tone.hairline }} />
                        <h1
                            className="max-w-[520px] leading-[1.12]"
                            style={{
                                color: textColor,
                                fontStyle,
                                fontWeight: resolveFontWeight(fontWeight, 600),
                                textDecoration,
                                fontSize: `${resolveTitleFontSize(titleSize, 54)}px`,
                                letterSpacing: `${resolveTitleTracking(titleTracking, -0.018)}em`,
                            }}
                        >
                            {title}
                        </h1>
                    </div>

                    <ImageSlot
                        className="min-w-0 flex-1 self-end"
                        image={image}
                        alt="article cover"
                        fit={imageFit}
                        radius={imageRadius}
                        tone={tone}
                        emptyLabel="Article cover"
                        style={{ aspectRatio: "16 / 9" }}
                    />
                </div>
            </div>
        </TemplateCard>
    );
}
