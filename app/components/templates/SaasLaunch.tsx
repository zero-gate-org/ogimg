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

export default function SaasLaunch({
    title,
    textColor = "#f8fafc",
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
    gradientStart = "#081120",
    gradientEnd = "#172554",
    gradientAngle = 125,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "graph",
    gridColor = "#60A5FA",
    gridOpacity = 0.2,
    gridBlur = 0.8,
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
    const headlineWeight = resolveFontWeight(fontWeight, 720);
    const mutedText = hexToRgba(textColor, 0.8);
    const outcomes = [detailOne, detailTwo].map((item) => item?.trim() || "").filter(Boolean);

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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(45,212,191,0.24)_0%,rgba(45,212,191,0)_38%),radial-gradient(circle_at_88%_80%,rgba(96,165,250,0.28)_0%,rgba(96,165,250,0)_52%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(128deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_42%,rgba(6,182,212,0.14)_100%)]" />
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
                <div className="w-[54%] h-full overflow-hidden flex items-center justify-center">
                    {hasImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={image}
                            alt="dashboard screenshot"
                            className="w-full h-full object-center"
                            style={{ objectFit: imageFit, borderRadius: resolveImageRadius(imageRadius) }}
                        />
                    ) : null}
                </div>

                <div className="w-[46%] h-full flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                        {logoImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logoImage} alt="uploaded logo" className="w-[72px] h-[72px] object-contain" />
                        )}
                        {brandLabel && (
                            <p className="text-[32px] leading-[1.08] tracking-[-0.025em]" style={{ color: textColor }}>
                                {brandLabel}
                            </p>
                        )}
                    </div>

                    <h1
                        className="mt-6 text-[38px] leading-[1.1] tracking-[-0.03em]"
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: headlineWeight,
                            fontSize: `${resolveTitleFontSize(titleSize, 38)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                            textDecoration,
                        }}
                    >
                        {title}
                    </h1>

                    {outcomes.length > 0 && (
                        <div className="mt-8 space-y-3">
                            {outcomes.map((line, index) => (
                                <p key={`${line}-${index}`} className="text-[22px] leading-[1.2] tracking-[-0.01em]" style={{ color: mutedText }}>
                                    • {line}
                                </p>
                            ))}
                        </div>
                    )}

                    {tagLabel && (
                        <p className="mt-7 text-[23px] leading-[1.18] tracking-[-0.014em]" style={{ color: mutedText }}>
                            {tagLabel}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
