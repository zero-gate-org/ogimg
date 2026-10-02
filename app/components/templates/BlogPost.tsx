"use client";

import {
    DEFAULT_BACKGROUND_PRESET_ID,
    TemplateProps,
    clampGridBlur,
    getBackgroundFill,
    getBrandMark,
    getGridOverlayStyle,
    hexToRgba,
    resolveFontWeight,
    resolveImageRadius,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

export default function BlogPost({
    title,
    textColor = "#111827",
    logoImage,
    image,
    tag,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#F7F0DB",
    gradientEnd = "#E5D7B8",
    gradientAngle = 130,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor = "#6B7280",
    gridOpacity = 0.15,
    gridBlur = 0,
    titleSize,
    titleTracking,
    imageFit = "contain",
    imageRadius,
}: TemplateProps) {
    const hasImage = Boolean(image);
    const brandLabel = (logo || "").trim();
    const tagLabel = (tag || "").trim();
    const brandMark = getBrandMark(brandLabel, tagLabel);
    const backgroundFill = getBackgroundFill(backgroundMode, gradientStart, gradientEnd, gradientAngle, backgroundPresetId);
    const overlayStyle = getGridOverlayStyle(gridOverlay, gridColor, gridOpacity);
    const clampedGridBlur = clampGridBlur(gridBlur);
    const headlineWeight = resolveFontWeight(fontWeight, 700);
    const mutedPrimary = hexToRgba(textColor, 0.82);
    const mutedSecondary = hexToRgba(textColor, 0.66);
    const slotBorder = hexToRgba(textColor, 0.24);
    const slotTint = hexToRgba(textColor, 0.08);
    const markColor = hexToRgba(textColor, 0.54);

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
            {gridOverlay !== "none" && (
                <div
                    className="absolute inset-0"
                    style={{
                        ...overlayStyle,
                        filter: clampedGridBlur > 0 ? `blur(${clampedGridBlur}px)` : undefined,
                        transform: clampedGridBlur > 0 ? "scale(1.01)" : undefined,
                    }}
                />
            )}

            <div className="relative z-10 h-full w-full px-12 py-10 flex gap-8">
                <div
                    className={`${hasImage ? "w-[44%] overflow-hidden flex items-center justify-center" : "w-[44%] rounded-2xl overflow-hidden flex items-center justify-center"}`}
                    style={hasImage ? undefined : {
                        border: `1px solid ${slotBorder}`,
                        backgroundColor: slotTint,
                    }}
                >
                    {hasImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={image}
                            alt="guest visual"
                            className="w-full h-full object-center"
                            style={{ objectFit: imageFit, borderRadius: resolveImageRadius(imageRadius) }}
                        />
                    ) : (
                        <p className="text-[44px] tracking-[0.07em]" style={{ color: markColor }}>
                            {brandMark}
                        </p>
                    )}
                </div>

                <div className="w-[56%] flex flex-col justify-center pr-3 relative">
                    {logoImage && (
                        <div className="absolute top-0 right-1 w-[72px] h-[72px] flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logoImage} alt="uploaded logo" className="w-full h-full object-contain" />
                        </div>
                    )}

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
                        <p className="mt-7 text-[26px] tracking-[-0.014em]" style={{ color: mutedPrimary }}>
                            {tagLabel}
                        </p>
                    )}

                    {brandLabel && (
                        <p className="mt-5 text-[22px] tracking-[-0.012em]" style={{ color: mutedSecondary }}>
                            {brandLabel}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
