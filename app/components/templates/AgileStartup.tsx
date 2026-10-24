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

export default function AgileStartup({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#000000",
    gradientEnd = "#000000",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.2,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const domain = (tag || "").trim();
    const headlineSize = resolveTitleFontSize(titleSize, 68);
    const headlineTracking = resolveTitleTracking(titleTracking, -0.03);

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
            showLift={false}
        >
            {/* Keep the supplied grid and light field intact while replacing the
                reference creator's outlined text paths with our own editable copy. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/templates/agile-startup-background.svg"
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full"
                width={1200}
                height={630}
                draggable={false}
            />

            <div className="absolute inset-x-0 top-[108px] flex items-center justify-center gap-3">
                {logoImage && logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoImage} alt="" className="h-8 w-8 object-contain" />
                )}
                {wordmark && (
                    <span
                        style={{
                            color: textColor,
                            fontFamily,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: "22px",
                            lineHeight: 1,
                            letterSpacing: "0.01em",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            <div className="absolute inset-x-0 top-[246px] flex justify-center px-24">
                <h1
                    style={{
                        maxWidth: "820px",
                        color: textColor,
                        fontFamily,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${headlineSize}px`,
                        letterSpacing: `${headlineTracking}em`,
                        lineHeight: 1.04,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </h1>
            </div>

            {domain && (
                <p
                    className="absolute inset-x-0 bottom-[77px] text-center"
                    style={{
                        color: textColor,
                        fontFamily,
                        fontStyle,
                        fontWeight: 500,
                        textDecoration,
                        fontSize: "28px",
                        lineHeight: 1,
                        letterSpacing: "-0.01em",
                    }}
                >
                    {domain}
                </p>
            )}
        </TemplateCard>
    );
}
