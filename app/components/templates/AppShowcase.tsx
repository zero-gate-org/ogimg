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

export default function AppShowcase({
    title,
    textColor = "#111827",
    image,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#F3F4F6",
    gradientEnd = "#D1D5DB",
    gradientAngle = 136,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor = "#6B7280",
    gridOpacity = 0.12,
    gridBlur = 0,
    titleSize,
    titleTracking,
    imageFit = "contain",
    imageRadius,
}: TemplateProps) {
    const brandName = (logo || "").trim();
    const brandTagline = (title || "").trim();
    const hasImage = Boolean(image);

    const backgroundFill = getBackgroundFill(backgroundMode, gradientStart, gradientEnd, gradientAngle, backgroundPresetId);
    const overlayStyle = getGridOverlayStyle(gridOverlay, gridColor, gridOpacity);
    const clampedGridBlur = clampGridBlur(gridBlur);
    const brandWeight = resolveFontWeight(fontWeight, 640);
    const taglineWeight = resolveFontWeight(fontWeight, 560);
    const placeholderColor = hexToRgba(textColor, 0.45);

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

            <div className="relative z-10 h-full w-full px-12 py-8 flex flex-col">
                <div className="px-10 pt-1 flex items-center justify-center text-center">
                    {brandName && (
                        <p
                            className="text-[30px] leading-[1.04] tracking-[-0.03em]"
                            style={{
                                color: textColor,
                                fontStyle,
                                fontWeight: brandWeight,
                                textDecoration,
                            }}
                        >
                            {brandName}
                        </p>
                    )}
                </div>

                <div className="mt-4 px-16 flex items-center justify-center text-center">
                    {brandTagline && (
                        <p
                            className="text-[24px] leading-[1.15] tracking-[-0.02em]"
                            style={{
                                color: textColor,
                                fontStyle,
                                fontWeight: taglineWeight,
                                fontSize: `${resolveTitleFontSize(titleSize, 24)}px`,
                                letterSpacing: `${resolveTitleTracking(titleTracking, -0.02)}em`,
                                textDecoration,
                            }}
                        >
                            {brandTagline}
                        </p>
                    )}
                </div>

                <div className="mt-8 flex-1 flex items-center justify-center">
                    <div className="relative w-[700px] aspect-video overflow-hidden flex items-center justify-center">
                        {hasImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={image}
                                alt="full app UI preview"
                                className="h-full w-full object-center"
                                style={{ objectFit: imageFit, borderRadius: resolveImageRadius(imageRadius) }}
                            />
                        ) : (
                            <div className="text-center px-10">
                                <p className="text-[32px] tracking-[-0.032em] leading-[1.05]" style={{ color: placeholderColor }}>
                                    FULL APP UI IMAGE
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
