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

export default function CenteredContainer({
    title,
    textColor = "#F8FAFC",
    logoImage,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#1E293B",
    gradientEnd = "#0F172A",
    gradientAngle = 140,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor = "#94A3B8",
    gridOpacity = 0.16,
    gridBlur = 0.4,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const subtext = (tag || "").trim();

    const backgroundFill = getBackgroundFill(backgroundMode, gradientStart, gradientEnd, gradientAngle, backgroundPresetId);
    const overlayStyle = getGridOverlayStyle(gridOverlay, gridColor, gridOpacity);
    const clampedGridBlur = clampGridBlur(gridBlur);
    const headlineWeight = resolveFontWeight(fontWeight, 760);
    const subtextColor = hexToRgba(textColor, 0.82);
    const dividerColor = hexToRgba(textColor, 0.44);

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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(56,189,248,0.22)_0%,rgba(56,189,248,0)_40%),radial-gradient(circle_at_86%_86%,rgba(148,163,184,0.24)_0%,rgba(148,163,184,0)_42%)]" />
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

            <div className="relative z-10 h-full w-full px-24 py-16 flex items-center justify-center">
                <div className="w-full max-w-[860px] px-8 py-8 flex flex-col items-center text-center">
                    {logoImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoImage} alt="brand logo" className="w-[128px] h-[128px] object-contain" />
                    )}

                    <h1
                        className={`${logoImage ? "mt-9" : "mt-2"} text-[44px] leading-[1.1] tracking-[-0.028em] max-w-[700px]`}
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: headlineWeight,
                            fontSize: `${resolveTitleFontSize(titleSize, 44)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, -0.028)}em`,
                            textDecoration,
                        }}
                    >
                        {title}
                    </h1>

                    {subtext && (
                        <div className="mt-10 inline-flex items-center gap-5">
                            <span className="h-14 w-px" style={{ backgroundColor: dividerColor }} />
                            <p className="text-[20px] leading-[1.2] tracking-[-0.012em] max-w-[520px] text-left" style={{ color: subtextColor }}>
                                {subtext}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
