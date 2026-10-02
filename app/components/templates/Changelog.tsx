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

export default function Changelog({
    title,
    textColor = "#E5E7EB",
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
    gradientStart = "#0A1015",
    gradientEnd = "#1F3C53",
    gradientAngle = 130,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "graph",
    gridColor = "#34D399",
    gridOpacity = 0.2,
    gridBlur = 0.4,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const brandLabel = (logo || "").trim();
    const footerCta = (tag || "").trim();
    const backgroundFill = getBackgroundFill(backgroundMode, gradientStart, gradientEnd, gradientAngle, backgroundPresetId);
    const overlayStyle = getGridOverlayStyle(gridOverlay, gridColor, gridOpacity);
    const clampedGridBlur = clampGridBlur(gridBlur);
    const headingWeight = resolveFontWeight(fontWeight, 680);
    const lineColor = hexToRgba(textColor, 0.84);
    const dividerColor = hexToRgba(textColor, 0.24);
    const updateLines = [detailOne, detailTwo, detailThree].map((entry) => entry?.trim() || "").filter(Boolean);

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
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,185,129,0.1)_0%,rgba(16,185,129,0)_45%)]" />
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

            <div className="relative z-10 h-full w-full px-56 py-8 flex flex-col">
                <div className="h-[96px] px-10 flex items-center justify-between">
                    {logoImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoImage} alt="uploaded logo" className="w-[72px] h-[72px] object-contain" />
                    )}

                    {brandLabel && <p className="text-[28px] tracking-[-0.015em]" style={{ color: textColor }}>{brandLabel}</p>}
                </div>

                <div className="h-[126px] px-10 flex items-center justify-center text-center">
                    <h1
                        className="text-[42px] tracking-[-0.024em] leading-[1.08]"
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: headingWeight,
                            fontSize: `${resolveTitleFontSize(titleSize, 42)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, -0.024)}em`,
                            textDecoration,
                        }}
                    >
                        {title}
                    </h1>
                </div>

                <div className="flex-1 px-14 py-9 flex flex-col justify-center gap-5">
                    {updateLines.map((entry, index) => (
                        <p key={`${entry}-${index}`} className="text-[24px] leading-[1.2] tracking-[-0.012em]" style={{ color: lineColor }}>
                            • {entry}
                        </p>
                    ))}
                </div>

                <div className="h-px w-full" style={{ backgroundColor: dividerColor }} />

                <div className="h-[104px] px-10 flex items-center justify-center text-center">
                    {footerCta && <p className="text-[24px] tracking-[-0.012em]" style={{ color: textColor }}>{footerCta}</p>}
                </div>
            </div>
        </div>
    );
}
