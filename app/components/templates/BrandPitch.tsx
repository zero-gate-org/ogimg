"use client";

import {
    DEFAULT_BACKGROUND_PRESET_ID,
    TemplateProps,
    clampGridBlur,
    getBackgroundFill,
    getGridOverlayStyle,
    hexToRgba,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

export default function BrandPitch({
    title,
    textColor = "#F8FAFC",
    logoImage,
    tag,
    logo,
    detailOne,
    detailTwo,
    detailThree,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0F172A",
    gradientEnd = "#1E293B",
    gradientAngle = 136,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor = "#94A3B8",
    gridOpacity = 0.14,
    gridBlur = 0.4,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const brandName = (logo || "").trim();
    const subheading = (tag || "").trim();
    const benefitLines = [detailOne, detailTwo, detailThree].map((line) => line?.trim() || "").filter(Boolean);

    const backgroundFill = getBackgroundFill(backgroundMode, gradientStart, gradientEnd, gradientAngle, backgroundPresetId);
    const overlayStyle = getGridOverlayStyle(gridOverlay, gridColor, gridOpacity);
    const clampedGridBlur = clampGridBlur(gridBlur);
    const headlineWeight = resolveFontWeight(fontWeight, 740);
    const brandWeight = resolveFontWeight(fontWeight, 640);
    const mutedText = hexToRgba(textColor, 0.78);

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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_36%),radial-gradient(circle_at_90%_84%,rgba(56,189,248,0.18)_0%,rgba(56,189,248,0)_40%)]" />
            {gridOverlay !== "none" && (
                <div
                    className="absolute inset-0"
                    style={{
                        ...overlayStyle,
                        filter: clampedGridBlur > 0 ? `blur(${clampedGridBlur}px)` : undefined,
                        transform: clampedGridBlur > 0 ? "scale(1.01)" : undefined,
                        mixBlendMode: "screen",
                    }}
                />
            )}

            <div className="relative z-10 h-full w-full px-16 py-14 flex gap-14">
                <div className="w-[32%] h-full flex flex-col">
                    {logoImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoImage} alt="brand logo" className="w-[144px] h-[144px] object-contain" />
                    )}

                    {brandName && (
                        <p
                            className="mt-7 text-[34px] leading-[1.07] tracking-[-0.025em]"
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

                    {benefitLines.length > 0 && (
                        <div className="mt-10 space-y-4">
                            {benefitLines.map((line, index) => (
                                <p key={`${line}-${index}`} className="text-[21px] leading-[1.16] tracking-[-0.015em]" style={{ color: textColor }}>
                                    • {line}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-px h-full" style={{ backgroundColor: hexToRgba(textColor, 0.22) }} />

                <div className="flex-1 h-full flex flex-col justify-center pl-8 pr-4">
                    <h1
                        className="text-[46px] leading-[1.08] tracking-[-0.03em] max-w-[700px]"
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

                    {subheading && (
                        <p className="mt-7 text-[24px] leading-[1.16] tracking-[-0.015em] max-w-[680px]" style={{ color: mutedText }}>
                            {subheading}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
