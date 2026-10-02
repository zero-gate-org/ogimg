"use client";

import {
    DEFAULT_BACKGROUND_PRESET_ID,
    TemplateProps,
    clampGridBlur,
    getBackgroundFill,
    getGridOverlayStyle,
    hexToRgba,
    resolveFontWeight,
    resolveImageRadius,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

export default function PodcastCover({
    title,
    textColor = "#fdf2f8",
    logoImage,
    image,
    tag,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#1A1142",
    gradientEnd = "#5F31B0",
    gradientAngle = 145,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "dots",
    gridColor = "#A78BFA",
    gridOpacity = 0.28,
    gridBlur = 1.1,
    titleSize,
    titleTracking,
    imageFit = "contain",
    imageRadius,
}: TemplateProps) {
    const hasImage = Boolean(image);
    const brandLabel = (logo || "").trim();
    const tagLabel = (tag || "").trim();
    const backgroundFill = getBackgroundFill(backgroundMode, gradientStart, gradientEnd, gradientAngle, backgroundPresetId);
    const overlayStyle = getGridOverlayStyle(gridOverlay, gridColor, gridOpacity);
    const clampedGridBlur = clampGridBlur(gridBlur);
    const headlineWeight = resolveFontWeight(fontWeight, 760);
    const guestColor = hexToRgba(textColor, 0.82);
    const showColor = hexToRgba(textColor, 0.68);

    return (
        <div
            id="og-template-node"
            className="relative isolate flex overflow-hidden border border-zinc-900"
            style={{
                width: "1200px",
                height: "630px",
                fontFamily,
                background: backgroundFill,
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(244,114,182,0.22)_0%,rgba(244,114,182,0)_40%),radial-gradient(circle_at_88%_74%,rgba(45,212,191,0.16)_0%,rgba(45,212,191,0)_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(126deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_40%,rgba(196,181,253,0.14)_100%)]" />
            {gridOverlay !== "none" && (
                <div
                    className="absolute inset-0"
                    style={{
                        ...overlayStyle,
                        filter: clampedGridBlur > 0 ? `blur(${clampedGridBlur}px)` : undefined,
                        transform: clampedGridBlur > 0 ? "scale(1.02)" : undefined,
                        mixBlendMode: "screen",
                    }}
                />
            )}

            <div className="relative z-10 h-full w-full px-14 py-12 flex gap-10">
                <div className="w-[50%] h-full overflow-hidden flex items-center justify-center">
                    {hasImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                                src={image}
                                alt="guest portrait"
                                className="w-full h-full object-center"
                                style={{ objectFit: imageFit, borderRadius: resolveImageRadius(imageRadius) }}
                            />
                        ) : null}
                </div>

                <div className="w-[50%] h-full flex flex-col justify-center">
                    <h1
                        className="text-[46px] leading-[1.08] tracking-[-0.03em]"
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: headlineWeight,
                            fontSize: `${resolveTitleFontSize(titleSize, 46)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                            textDecoration,
                        }}
                    >
                        {title}
                    </h1>

                    {tagLabel && (
                        <p className="mt-7 text-[26px] tracking-[-0.015em]" style={{ color: guestColor }}>
                            {tagLabel}
                        </p>
                    )}

                    <div className="mt-6 flex items-center gap-3">
                        {logoImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logoImage} alt="uploaded logo" className="w-[72px] h-[72px] object-contain" />
                        )}
                        {brandLabel && (
                            <p className="text-[23px] tracking-[-0.014em]" style={{ color: showColor }}>
                                {brandLabel}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
