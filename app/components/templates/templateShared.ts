import type { CSSProperties } from "react";

export type BackgroundMode = "Gradient" | "Solid Color" | "Background";
export type GridOverlay = "none" | "grid" | "graph" | "dots";
export type BackgroundPresetId =
    | "studio-sky"
    | "clear-mint"
    | "mesh-bloom"
    | "midnight-orb"
    | "sunset-stage"
    | "graphite-flow"
    | "candy-cloud"
    | "northern-glow"
    | "aurora-fold"
    | "lava-lamp"
    | "copper-haze"
    | "ultraviolet-fog"
    | "sea-glass"
    | "acid-pop"
    | "paper-sunrise"
    | "obsidian-iris"
    | "red-velvet"
    | "jade-mirror"
    | "moon-ice"
    | "topographic"
    | "diagonal-weave"
    | "checker-depth"
    | "sunburst-stage"
    | "folded-paper"
    | "prism-facets"
    | "ripple-rings"
    | "cinema-stripes";

export interface BackgroundPreset {
    id: BackgroundPresetId;
    name: string;
    background: string;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
    {
        id: "studio-sky",
        name: "Studio Sky",
        background: [
            "radial-gradient(circle at 16% 22%, rgba(125, 211, 252, 0.9) 0%, rgba(125, 211, 252, 0) 32%)",
            "radial-gradient(circle at 84% 18%, rgba(167, 139, 250, 0.82) 0%, rgba(167, 139, 250, 0) 38%)",
            "radial-gradient(circle at 72% 82%, rgba(45, 212, 191, 0.42) 0%, rgba(45, 212, 191, 0) 30%)",
            "linear-gradient(135deg, #060816 0%, #11213e 44%, #1d2b55 100%)",
        ].join(","),
    },
    {
        id: "clear-mint",
        name: "Clear Mint",
        background: [
            "radial-gradient(circle at 12% 16%, rgba(255, 255, 255, 0.84) 0%, rgba(255, 255, 255, 0) 24%)",
            "radial-gradient(circle at 78% 18%, rgba(190, 242, 100, 0.85) 0%, rgba(190, 242, 100, 0) 32%)",
            "radial-gradient(circle at 72% 78%, rgba(16, 185, 129, 0.68) 0%, rgba(16, 185, 129, 0) 34%)",
            "linear-gradient(140deg, #f7fee7 0%, #d9f99d 34%, #34d399 100%)",
        ].join(","),
    },
    {
        id: "mesh-bloom",
        name: "Mesh Bloom",
        background: [
            "radial-gradient(circle at 18% 78%, rgba(251, 146, 60, 0.84) 0%, rgba(251, 146, 60, 0) 28%)",
            "radial-gradient(circle at 82% 26%, rgba(244, 114, 182, 0.82) 0%, rgba(244, 114, 182, 0) 33%)",
            "radial-gradient(circle at 46% 32%, rgba(192, 132, 252, 0.84) 0%, rgba(192, 132, 252, 0) 36%)",
            "linear-gradient(140deg, #2e1065 0%, #7c3aed 36%, #f97316 100%)",
        ].join(","),
    },
    {
        id: "midnight-orb",
        name: "Midnight Orb",
        background: [
            "radial-gradient(circle at 50% 26%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 18%)",
            "radial-gradient(circle at 16% 82%, rgba(34, 211, 238, 0.44) 0%, rgba(34, 211, 238, 0) 30%)",
            "radial-gradient(circle at 86% 22%, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0) 26%)",
            "linear-gradient(145deg, #020617 0%, #0f172a 48%, #172554 100%)",
        ].join(","),
    },
    {
        id: "sunset-stage",
        name: "Sunset Stage",
        background: [
            "radial-gradient(circle at 48% 18%, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0) 18%)",
            "radial-gradient(circle at 18% 76%, rgba(251, 146, 60, 0.68) 0%, rgba(251, 146, 60, 0) 30%)",
            "radial-gradient(circle at 84% 72%, rgba(236, 72, 153, 0.5) 0%, rgba(236, 72, 153, 0) 32%)",
            "linear-gradient(160deg, #431407 0%, #9a3412 34%, #fb7185 100%)",
        ].join(","),
    },
    {
        id: "graphite-flow",
        name: "Graphite Flow",
        background: [
            "radial-gradient(circle at 20% 22%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 22%)",
            "radial-gradient(circle at 84% 74%, rgba(161, 161, 170, 0.32) 0%, rgba(161, 161, 170, 0) 34%)",
            "radial-gradient(circle at 60% 36%, rgba(113, 113, 122, 0.22) 0%, rgba(113, 113, 122, 0) 28%)",
            "linear-gradient(140deg, #09090b 0%, #27272a 45%, #52525b 100%)",
        ].join(","),
    },
    {
        id: "candy-cloud",
        name: "Candy Cloud",
        background: [
            "radial-gradient(circle at 18% 24%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 22%)",
            "radial-gradient(circle at 78% 18%, rgba(244, 114, 182, 0.72) 0%, rgba(244, 114, 182, 0) 30%)",
            "radial-gradient(circle at 62% 74%, rgba(125, 211, 252, 0.78) 0%, rgba(125, 211, 252, 0) 34%)",
            "linear-gradient(150deg, #fdf2f8 0%, #fbcfe8 36%, #bae6fd 100%)",
        ].join(","),
    },
    {
        id: "northern-glow",
        name: "Northern Glow",
        background: [
            "radial-gradient(circle at 18% 22%, rgba(45, 212, 191, 0.68) 0%, rgba(45, 212, 191, 0) 28%)",
            "radial-gradient(circle at 82% 20%, rgba(132, 204, 22, 0.5) 0%, rgba(132, 204, 22, 0) 30%)",
            "radial-gradient(circle at 68% 78%, rgba(96, 165, 250, 0.44) 0%, rgba(96, 165, 250, 0) 30%)",
            "linear-gradient(135deg, #022c22 0%, #083344 50%, #0f172a 100%)",
        ].join(","),
    },
    {
        id: "aurora-fold",
        name: "Aurora Fold",
        background: [
            "radial-gradient(circle at 16% 18%, rgba(103, 232, 249, 0.58) 0%, rgba(103, 232, 249, 0) 28%)",
            "radial-gradient(circle at 84% 24%, rgba(196, 181, 253, 0.62) 0%, rgba(196, 181, 253, 0) 30%)",
            "radial-gradient(circle at 62% 82%, rgba(74, 222, 128, 0.48) 0%, rgba(74, 222, 128, 0) 28%)",
            "linear-gradient(145deg, #020617 0%, #0f172a 44%, #1e3a8a 100%)",
        ].join(","),
    },
    {
        id: "lava-lamp",
        name: "Lava Lamp",
        background: [
            "radial-gradient(circle at 24% 30%, rgba(251, 113, 133, 0.76) 0%, rgba(251, 113, 133, 0) 24%)",
            "radial-gradient(circle at 72% 24%, rgba(244, 114, 182, 0.62) 0%, rgba(244, 114, 182, 0) 24%)",
            "radial-gradient(circle at 62% 76%, rgba(251, 191, 36, 0.68) 0%, rgba(251, 191, 36, 0) 26%)",
            "linear-gradient(150deg, #3b0764 0%, #7e22ce 38%, #ea580c 100%)",
        ].join(","),
    },
    {
        id: "copper-haze",
        name: "Copper Haze",
        background: [
            "radial-gradient(circle at 18% 20%, rgba(255, 237, 213, 0.72) 0%, rgba(255, 237, 213, 0) 22%)",
            "radial-gradient(circle at 78% 18%, rgba(251, 146, 60, 0.74) 0%, rgba(251, 146, 60, 0) 30%)",
            "radial-gradient(circle at 68% 72%, rgba(217, 119, 6, 0.52) 0%, rgba(217, 119, 6, 0) 30%)",
            "linear-gradient(140deg, #431407 0%, #9a3412 45%, #f59e0b 100%)",
        ].join(","),
    },
    {
        id: "ultraviolet-fog",
        name: "Ultraviolet Fog",
        background: [
            "radial-gradient(circle at 20% 20%, rgba(224, 231, 255, 0.58) 0%, rgba(224, 231, 255, 0) 22%)",
            "radial-gradient(circle at 82% 24%, rgba(129, 140, 248, 0.66) 0%, rgba(129, 140, 248, 0) 28%)",
            "radial-gradient(circle at 60% 78%, rgba(216, 180, 254, 0.58) 0%, rgba(216, 180, 254, 0) 30%)",
            "linear-gradient(145deg, #0f172a 0%, #312e81 50%, #7c3aed 100%)",
        ].join(","),
    },
    {
        id: "sea-glass",
        name: "Sea Glass",
        background: [
            "radial-gradient(circle at 16% 18%, rgba(236, 254, 255, 0.82) 0%, rgba(236, 254, 255, 0) 22%)",
            "radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.62) 0%, rgba(34, 211, 238, 0) 30%)",
            "radial-gradient(circle at 66% 76%, rgba(45, 212, 191, 0.56) 0%, rgba(45, 212, 191, 0) 30%)",
            "linear-gradient(145deg, #083344 0%, #0f766e 46%, #67e8f9 100%)",
        ].join(","),
    },
    {
        id: "acid-pop",
        name: "Acid Pop",
        background: [
            "radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 18%)",
            "radial-gradient(circle at 78% 20%, rgba(190, 242, 100, 0.82) 0%, rgba(190, 242, 100, 0) 26%)",
            "radial-gradient(circle at 64% 74%, rgba(250, 204, 21, 0.62) 0%, rgba(250, 204, 21, 0) 28%)",
            "linear-gradient(150deg, #14532d 0%, #65a30d 46%, #facc15 100%)",
        ].join(","),
    },
    {
        id: "paper-sunrise",
        name: "Paper Sunrise",
        background: [
            "radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.84) 0%, rgba(255, 255, 255, 0) 20%)",
            "radial-gradient(circle at 76% 20%, rgba(251, 191, 36, 0.46) 0%, rgba(251, 191, 36, 0) 26%)",
            "radial-gradient(circle at 64% 74%, rgba(251, 113, 133, 0.4) 0%, rgba(251, 113, 133, 0) 30%)",
            "linear-gradient(145deg, #fff7ed 0%, #ffedd5 50%, #fecdd3 100%)",
        ].join(","),
    },
    {
        id: "obsidian-iris",
        name: "Obsidian Iris",
        background: [
            "radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 18%)",
            "radial-gradient(circle at 82% 18%, rgba(139, 92, 246, 0.54) 0%, rgba(139, 92, 246, 0) 28%)",
            "radial-gradient(circle at 60% 78%, rgba(96, 165, 250, 0.34) 0%, rgba(96, 165, 250, 0) 26%)",
            "linear-gradient(145deg, #09090b 0%, #18181b 46%, #312e81 100%)",
        ].join(","),
    },
    {
        id: "red-velvet",
        name: "Red Velvet",
        background: [
            "radial-gradient(circle at 16% 18%, rgba(254, 242, 242, 0.2) 0%, rgba(254, 242, 242, 0) 18%)",
            "radial-gradient(circle at 78% 20%, rgba(244, 63, 94, 0.68) 0%, rgba(244, 63, 94, 0) 28%)",
            "radial-gradient(circle at 60% 78%, rgba(153, 27, 27, 0.46) 0%, rgba(153, 27, 27, 0) 28%)",
            "linear-gradient(150deg, #450a0a 0%, #881337 48%, #f43f5e 100%)",
        ].join(","),
    },
    {
        id: "jade-mirror",
        name: "Jade Mirror",
        background: [
            "radial-gradient(circle at 18% 18%, rgba(236, 253, 245, 0.78) 0%, rgba(236, 253, 245, 0) 20%)",
            "radial-gradient(circle at 80% 18%, rgba(110, 231, 183, 0.62) 0%, rgba(110, 231, 183, 0) 30%)",
            "radial-gradient(circle at 66% 76%, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0) 28%)",
            "linear-gradient(145deg, #022c22 0%, #065f46 46%, #6ee7b7 100%)",
        ].join(","),
    },
    {
        id: "moon-ice",
        name: "Moon Ice",
        background: [
            "radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0) 18%)",
            "radial-gradient(circle at 76% 20%, rgba(191, 219, 254, 0.72) 0%, rgba(191, 219, 254, 0) 28%)",
            "radial-gradient(circle at 62% 76%, rgba(148, 163, 184, 0.38) 0%, rgba(148, 163, 184, 0) 28%)",
            "linear-gradient(145deg, #e0f2fe 0%, #dbeafe 46%, #e2e8f0 100%)",
        ].join(","),
    },
    {
        id: "topographic",
        name: "Topographic",
        background: [
            "repeating-radial-gradient(circle at 18% 24%, rgba(255,255,255,0.12) 0 2px, transparent 2px 22px)",
            "repeating-radial-gradient(circle at 78% 72%, rgba(125,211,252,0.16) 0 2px, transparent 2px 26px)",
            "repeating-radial-gradient(circle at 52% 50%, rgba(255,255,255,0.08) 0 1px, transparent 1px 32px)",
            "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
        ].join(","),
    },
    {
        id: "diagonal-weave",
        name: "Diagonal Weave",
        background: [
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0 2px, transparent 2px 20px)",
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 24px)",
            "linear-gradient(135deg, #111827 0%, #4c1d95 50%, #7c3aed 100%)",
        ].join(","),
    },
    {
        id: "checker-depth",
        name: "Checker Depth",
        background: [
            "repeating-conic-gradient(from 45deg, rgba(255,255,255,0.1) 0deg 25deg, transparent 25deg 50deg) 0 0 / 56px 56px",
            "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 20%)",
            "linear-gradient(145deg, #111827 0%, #374151 100%)",
        ].join(","),
    },
    {
        id: "sunburst-stage",
        name: "Sunburst Stage",
        background: [
            "repeating-conic-gradient(from 180deg at 50% 115%, rgba(255,255,255,0.14) 0deg 8deg, transparent 8deg 16deg)",
            "radial-gradient(circle at 50% 18%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0) 18%)",
            "linear-gradient(180deg, #431407 0%, #9a3412 100%)",
        ].join(","),
    },
    {
        id: "folded-paper",
        name: "Folded Paper",
        background: [
            "linear-gradient(135deg, rgba(255,255,255,0) 0 36%, rgba(255,255,255,0.72) 36% 44%, rgba(214,211,209,0.92) 44% 58%, rgba(255,255,255,0) 58%)",
            "linear-gradient(35deg, rgba(255,255,255,0) 0 48%, rgba(212,212,216,0.68) 48% 54%, rgba(255,255,255,0.74) 54% 64%, rgba(255,255,255,0) 64%)",
            "linear-gradient(160deg, #fafaf9 0%, #e7e5e4 100%)",
        ].join(","),
    },
    {
        id: "prism-facets",
        name: "Prism Facets",
        background: [
            "conic-gradient(from 210deg at 18% 20%, rgba(255,255,255,0.22), transparent 30%, rgba(255,255,255,0.1) 52%, transparent 72%)",
            "conic-gradient(from 140deg at 82% 24%, rgba(192,132,252,0.34), transparent 26%, rgba(59,130,246,0.22) 56%, transparent 74%)",
            "conic-gradient(from 20deg at 58% 74%, rgba(251,146,60,0.24), transparent 28%, rgba(244,114,182,0.18) 58%, transparent 80%)",
            "linear-gradient(145deg, #0f172a 0%, #312e81 52%, #1d4ed8 100%)",
        ].join(","),
    },
    {
        id: "ripple-rings",
        name: "Ripple Rings",
        background: [
            "repeating-radial-gradient(circle at 50% 54%, rgba(255,255,255,0.12) 0 2px, transparent 2px 26px)",
            "radial-gradient(circle at 50% 54%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 18%)",
            "linear-gradient(160deg, #111827 0%, #0f766e 54%, #67e8f9 100%)",
        ].join(","),
    },
    {
        id: "cinema-stripes",
        name: "Cinema Stripes",
        background: [
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.14) 0 18px, rgba(255,255,255,0) 18px 56px)",
            "linear-gradient(180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0.2) 100%)",
            "linear-gradient(145deg, #111827 0%, #7c2d12 48%, #f97316 100%)",
        ].join(","),
    },
];

export const DEFAULT_BACKGROUND_PRESET_ID: BackgroundPresetId = "studio-sky";

export type TemplateImageFit = "cover" | "contain" | "fill";

export interface TemplateProps {
    title: string;
    textColor?: string;
    logoImage?: string;
    image?: string;
    tag?: string;
    logo?: string;
    detailOne?: string;
    detailTwo?: string;
    detailThree?: string;
    fontStyle: string;
    fontWeight: string;
    textDecoration: string;
    fontFamily: string;
    backgroundMode?: BackgroundMode;
    gradientStart?: string;
    gradientEnd?: string;
    gradientAngle?: number;
    backgroundPresetId?: BackgroundPresetId;
    gridOverlay?: GridOverlay;
    gridColor?: string;
    gridOpacity?: number;
    gridBlur?: number;
    /** Headline size override in px. Falls back to the template default. */
    titleSize?: number | null;
    /** Headline tracking override in em. Falls back to the template default. */
    titleTracking?: number;
    imageFit?: TemplateImageFit;
    imageRadius?: number;
}

export const resolveTitleFontSize = (titleSize: number | null | undefined, fallbackPx: number) =>
    typeof titleSize === "number" && Number.isFinite(titleSize) && titleSize > 0 ? titleSize : fallbackPx;

/** sRGB luma, good enough to tell a light card from a dark one. */
const getLuminance = (hexColor: string) => {
    const [r, g, b] = hexToRgb(hexColor);
    return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
};

/**
 * Every template derives its hierarchy from the user's text colour instead of
 * hardcoding accent hues. One colour, expressed at fixed opacities, so a card
 * stays in a single family whatever background or text colour it is given.
 */
export interface CardTone {
    /** True when the text colour is dark, which means the card itself is light. */
    isDarkText: boolean;
    /** Neutral off-black or off-white, used for image scrims. Never pure #000 or #fff. */
    veil: string;
    primary: string;
    secondary: string;
    tertiary: string;
    hairline: string;
    fill: string;
    wash: string;
}

export const getCardTone = (textColor: string): CardTone => {
    const isDarkText = getLuminance(textColor) > 0.5;

    return {
        isDarkText,
        veil: isDarkText ? "#101013" : "#fcfcfd",
        primary: textColor,
        secondary: hexToRgba(textColor, 0.68),
        tertiary: hexToRgba(textColor, 0.46),
        hairline: hexToRgba(textColor, isDarkText ? 0.16 : 0.14),
        fill: hexToRgba(textColor, isDarkText ? 0.07 : 0.05),
        wash: hexToRgba(textColor, isDarkText ? 0.05 : 0.04),
    };
};

/**
 * Lines ship as "Added: something useful". Splitting the keyword into its own
 * column is what lets a changelog read as a ledger instead of a bullet list.
 */
export const splitPrefixedLine = (line: string) => {
    const value = line.trim();
    const separator = value.indexOf(":");

    if (separator <= 0 || separator > 18) {
        return { label: "", body: value };
    }

    const label = value.slice(0, separator).trim();
    const body = value.slice(separator + 1).trim();

    if (!body || !/^[\w +]+$/.test(label)) {
        return { label: "", body: value };
    }

    return { label, body };
};

export const resolveTitleTracking = (titleTracking: number | undefined, fallbackEm: number) =>
    typeof titleTracking === "number" && Number.isFinite(titleTracking) ? titleTracking : fallbackEm;

export const resolveImageRadius = (imageRadius: number | undefined) =>
    typeof imageRadius === "number" && Number.isFinite(imageRadius) && imageRadius > 0 ? `${imageRadius}px` : undefined;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

export const hexToRgb = (hexColor: string): [number, number, number] => {
    let hex = hexColor.replace("#", "").trim();

    if (hex.length === 3) {
        hex = hex
            .split("")
            .map((char) => `${char}${char}`)
            .join("");
    }

    if (hex.length !== 6 || Number.isNaN(Number.parseInt(hex, 16))) {
        return [255, 255, 255];
    }

    const intValue = Number.parseInt(hex, 16);

    return [(intValue >> 16) & 255, (intValue >> 8) & 255, intValue & 255];
};

export const hexToRgba = (hexColor: string, alpha: number) => {
    const safeAlpha = clamp(alpha, 0, 1);
    const [r, g, b] = hexToRgb(hexColor);

    return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
};

export const getBackgroundFill = (
    backgroundMode: BackgroundMode,
    gradientStart: string,
    gradientEnd: string,
    gradientAngle: number,
    backgroundPresetId: BackgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID
) => {
    if (backgroundMode === "Solid Color") {
        return gradientStart;
    }

    if (backgroundMode === "Background") {
        return getBackgroundPresetById(backgroundPresetId).background;
    }

    return `linear-gradient(${gradientAngle}deg, ${gradientStart} 0%, ${gradientEnd} 100%)`;
};

export const getBackgroundPresetById = (presetId: BackgroundPresetId) =>
    BACKGROUND_PRESETS.find((preset) => preset.id === presetId) ?? BACKGROUND_PRESETS[0];

export const getGridOverlayStyle = (
    gridOverlay: GridOverlay,
    gridColor: string,
    gridOpacity: number
): CSSProperties => {
    const clampedOpacity = clamp(gridOpacity, 0, 1);
    const overlayColor = hexToRgba(gridColor, clampedOpacity);
    const graphMinorColor = hexToRgba(gridColor, clampedOpacity * 0.35);
    const graphMajorColor = hexToRgba(gridColor, clampedOpacity);

    if (gridOverlay === "dots") {
        return {
            backgroundImage: `radial-gradient(circle, ${overlayColor} 1.2px, transparent 1.2px)`,
            backgroundSize: "16px 16px",
        };
    }

    if (gridOverlay === "graph") {
        return {
            backgroundImage: [
                `linear-gradient(${graphMinorColor} 1px, transparent 1px)`,
                `linear-gradient(90deg, ${graphMinorColor} 1px, transparent 1px)`,
                `linear-gradient(${graphMajorColor} 1px, transparent 1px)`,
                `linear-gradient(90deg, ${graphMajorColor} 1px, transparent 1px)`,
            ].join(","),
            backgroundSize: "16px 16px, 16px 16px, 80px 80px, 80px 80px",
        };
    }

    return {
        backgroundImage: [
            `linear-gradient(${overlayColor} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${overlayColor} 1px, transparent 1px)`,
        ].join(","),
        backgroundSize: "32px 32px, 32px 32px",
    };
};

export const getBrandMark = (logo = "", tag = "", fallback = "") => {
    const seed = (logo || tag).replace(/[^a-zA-Z0-9]/g, "").slice(0, 2);
    return (seed || fallback).toUpperCase();
};

export const resolveFontWeight = (fontWeight: string, emphasizedWeight = 700) => {
    if (fontWeight === "normal") {
        return 400;
    }

    if (fontWeight === "bold") {
        return emphasizedWeight;
    }

    return emphasizedWeight;
};

export const clampGridBlur = (gridBlur: number) => clamp(gridBlur, 0, 8);
