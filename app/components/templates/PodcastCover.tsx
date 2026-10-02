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
 * Episode art built like cover art: square image, show name above it in wide
 * tracked caps, episode title below. Centred on both axes, because that is the
 * convention this format expects.
 */
export default function PodcastCover({
    title,
    textColor = "#F7F2FA",
    logoImage,
    image,
    tag,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#16111C",
    gradientEnd = "#241B2E",
    gradientAngle = 155,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "dots",
    gridColor,
    gridOpacity = 0.2,
    gridBlur = 0,
    titleSize,
    titleTracking,
    imageFit = "cover",
    imageRadius,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const showName = (logo || "").trim();
    const guest = (tag || "").trim();
    const hostMark = (logoImage || "").trim();

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
            <div className="flex h-full w-full flex-col items-center justify-center px-16">
                {showName && (
                    <p
                        className="text-[16px] font-semibold uppercase tracking-[0.32em]"
                        style={{
                            color: tone.secondary,
                            fontStyle,
                            textDecoration,
                        }}
                    >
                        {showName}
                    </p>
                )}

                <div className="mt-8 flex items-stretch gap-12">
                    <ImageSlot
                        className="h-[300px] w-[300px] shrink-0"
                        image={image}
                        alt="episode art"
                        fit={imageFit}
                        radius={imageRadius}
                        tone={tone}
                        emptyLabel="Artwork"
                    />

                    {/*
                      The title block is top aligned to the artwork and allowed to
                      run long, so a longer episode title grows downward instead of
                      stretching the artwork out of square.
                    */}
                    <div className="flex w-[300px] flex-col justify-between py-1">
                        <h1
                            className="leading-[1.04]"
                            style={{
                                color: textColor,
                                fontStyle,
                                fontWeight: resolveFontWeight(fontWeight, 740),
                                textDecoration,
                                fontSize: `${resolveTitleFontSize(titleSize, 48)}px`,
                                letterSpacing: `${resolveTitleTracking(titleTracking, -0.038)}em`,
                            }}
                        >
                            {title}
                        </h1>

                        {guest && (
                            <div>
                                <div className="h-px w-12" style={{ backgroundColor: tone.hairline }} />
                                <p className="mt-5 text-[20px] leading-[1.3]" style={{ color: tone.secondary }}>
                                    {guest}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {hostMark && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoImage} alt="" className="mt-8 h-9 w-9 object-contain" />
                )}
            </div>
        </TemplateCard>
    );
}
