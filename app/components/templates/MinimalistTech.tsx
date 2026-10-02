"use client";

import {
    DEFAULT_BACKGROUND_PRESET_ID,
    TemplateImageFit,
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

export default function MinimalistTech({
    title,
    textColor = "#020617",
    logoImage,
    image,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#8B95A8",
    gradientEnd = "#3D475A",
    gradientAngle = 120,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "grid",
    gridColor = "#6B7280",
    gridOpacity = 0.4,
    gridBlur = 1.2,
    titleSize,
    titleTracking,
    imageFit = "contain" as TemplateImageFit,
    imageRadius,
}: TemplateProps) {
    const hasImage = Boolean(image);
    const tagLabel = (tag || "").trim();
    const clampedGridBlur = clampGridBlur(gridBlur);
    const backgroundFill = getBackgroundFill(backgroundMode, gradientStart, gradientEnd, gradientAngle, backgroundPresetId);
    const overlayStyle = getGridOverlayStyle(gridOverlay, gridColor, gridOpacity);
    const mutedTextColor = hexToRgba(textColor, 0.72);

    return (
        <div
            id="og-template-node"
            className="relative isolate flex text-white overflow-hidden border border-zinc-900"
            style={{
                width: "1200px",
                height: "630px",
                fontFamily,
                background: backgroundFill,
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_58%)]" />
            {gridOverlay !== "none" && (
                <div
                    className="absolute inset-0"
                    style={{
                        ...overlayStyle,
                        filter: clampedGridBlur > 0 ? `blur(${clampedGridBlur}px)` : undefined,
                        transform: clampedGridBlur > 0 ? "scale(1.01)" : undefined,
                        transformOrigin: "center center",
                        opacity: 1,
                        mixBlendMode: "screen",
                        pointerEvents: "none",
                        willChange: "filter",
                    }}
                />
            )}
            <div
                className="absolute inset-0 mix-blend-soft-light"
                style={{
                    opacity: 0.15,
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.85'/%3E%3C/svg%3E\")",
                    backgroundSize: "180px 180px",
                }}
            />

            <div className="relative z-10 p-16 flex flex-col justify-between w-full h-full">
                <div className="space-y-9">
                    {logoImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoImage} alt="uploaded logo" className="w-[84px] h-[84px] object-contain" />
                    )}

                    {tagLabel && (
                        <div className="inline-flex w-max max-w-full items-center whitespace-nowrap px-4 py-1.5 border border-black/30 rounded-full text-[14px] font-medium tracking-[-0.01em] bg-black/8 backdrop-blur-sm" style={{ color: mutedTextColor }}>
                            {tagLabel}
                        </div>
                    )}

                    <div className={`${hasImage ? "max-w-[500px]" : "max-w-[720px]"} pt-2`}>
                        <h1
                            className="text-[46px] leading-[1.08] tracking-[-0.035em]"
                            style={{
                                color: textColor,
                                fontStyle,
                                fontWeight: resolveFontWeight(fontWeight, 700),
                                textDecoration,
                                fontSize: `${resolveTitleFontSize(titleSize, 46)}px`,
                                letterSpacing: `${resolveTitleTracking(titleTracking, -0.035)}em`,
                            }}
                        >
                            {title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-end justify-end w-full">
                    {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={image}
                            alt="app screenshot"
                            className="absolute right-0 top-[98px] w-[700px] h-[460px] object-center"
                            style={{ objectFit: imageFit, borderRadius: resolveImageRadius(imageRadius) }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
