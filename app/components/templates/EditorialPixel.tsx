"use client";

import {
    DEFAULT_BACKGROUND_PRESET_ID,
    TemplateProps,
    getBackgroundFill,
    getGridOverlayStyle,
    clampGridBlur,
    resolveFontWeight,
    hexToRgba,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

export default function EditorialPixel({
    title,
    textColor = "#f8fafc",
    tag,
    logo,
    detailOne,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#1A1F36",
    gradientEnd = "#5B3B8F",
    gradientAngle = 140,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "dots",
    gridColor = "#FBCFE8",
    gridOpacity = 0.24,
    gridBlur = 0.2,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const waitlistLine = (tag || "").trim();
    const supportLine = (logo || "").trim();
    const ctaLine = (detailOne || "").trim();

    const backgroundFill = getBackgroundFill(backgroundMode, gradientStart, gradientEnd, gradientAngle, backgroundPresetId);
    const overlayStyle = getGridOverlayStyle(gridOverlay, gridColor, gridOpacity);
    const clampedGridBlur = clampGridBlur(gridBlur);
    const headlineWeight = resolveFontWeight(fontWeight, 720);
    const secondaryText = hexToRgba(textColor, 0.86);

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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_42%),radial-gradient(circle_at_86%_84%,rgba(245,158,11,0.14)_0%,rgba(245,158,11,0)_56%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_34%,rgba(17,24,39,0.28)_100%)]" />
            {gridOverlay !== "none" && (
                <div
                    className="absolute inset-0"
                    style={{
                        ...overlayStyle,
                        filter: clampedGridBlur > 0 ? `blur(${clampedGridBlur}px)` : undefined,
                        transform: clampedGridBlur > 0 ? "scale(1.012)" : undefined,
                        mixBlendMode: "screen",
                    }}
                />
            )}

            <div className="relative z-10 h-full w-full px-20 py-14 flex flex-col items-center justify-center text-center">
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

                {waitlistLine && (
                    <p className="mt-9 text-[30px] leading-[1.12] tracking-[-0.022em]" style={{ color: secondaryText }}>
                        {waitlistLine}
                    </p>
                )}

                {supportLine && (
                    <p className="mt-7 text-[25px] leading-[1.14] tracking-[-0.015em]" style={{ color: secondaryText }}>
                        {supportLine}
                    </p>
                )}

                {ctaLine && (
                    <p className="mt-8 text-[26px] leading-[1.12] tracking-[-0.015em]" style={{ color: textColor }}>
                        {ctaLine}
                    </p>
                )}
            </div>
        </div>
    );
}
