import { DEFAULT_BACKGROUND_PRESET_ID, type BackgroundPresetId, type GridOverlay } from "../../components/templates/templateShared";
import type { TemplateFontId } from "../../components/templates/fontCatalog";
import type { TemplateId } from "../../components/templates/templateRegistry";
import type {
    BrandKit,
    CanvasBackground,
    FreeDocument,
    ImageFit,
    Layer,
    ShapeKind,
    TemplateDocument,
} from "./types";

let sequence = 0;

export const createId = (prefix: string) => {
    sequence += 1;
    return `${prefix}-${Date.now().toString(36)}-${sequence.toString(36)}`;
};

export const slugify = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 48) || "og-image";

export const DEFAULT_CANVAS_BACKGROUND: CanvasBackground = {
    mode: "gradient",
    color: "#0B0B0D",
    gradientStart: "#111827",
    gradientEnd: "#0B0B0D",
    gradientAngle: 145,
    presetId: DEFAULT_BACKGROUND_PRESET_ID,
    overlay: "none",
    overlayColor: "#E5E7EB",
    overlayOpacity: 0.18,
    overlayBlur: 0,
    noise: true,
};

interface TextLayerInput {
    text?: string;
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fontId?: TemplateFontId;
    fontSize?: number;
    fontWeight?: number;
    color?: string;
    align?: "left" | "center" | "right";
    lineHeight?: number;
    letterSpacing?: number;
    uppercase?: boolean;
}

/**
 * Default headline size for a given canvas width.
 *
 * A fixed default looks small on a wide card and oversized on a story, so the
 * size is derived from the canvas: roughly 8% of the width, which lands on
 * 96px for a 1200px Open Graph card.
 */
export const headlineSizeForWidth = (canvasWidth: number) =>
    Math.round(Math.min(200, Math.max(48, canvasWidth * 0.08)));

export const createTextLayer = (input: TextLayerInput = {}): Layer => {
    const fontSize = input.fontSize ?? 96;

    return {
        id: createId("layer"),
        kind: "text",
        name: input.name ?? "Text",
        x: input.x ?? 80,
        y: input.y ?? 200,
        width: input.width ?? 1040,
        height: input.height ?? Math.round(fontSize * 2.2),
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        text: input.text ?? "Your headline here",
        fontId: input.fontId ?? "geist-sans",
        fontSize,
        fontWeight: input.fontWeight ?? 700,
        italic: false,
        lineHeight: input.lineHeight ?? 1.08,
        letterSpacing: input.letterSpacing ?? -0.03,
        align: input.align ?? "left",
        verticalAlign: "top",
        color: input.color ?? "#FAFAFA",
        uppercase: input.uppercase ?? false,
        shadow: false,
    };
};

export const createShapeLayer = (shape: ShapeKind = "rect"): Layer => {
    const isLine = shape === "line";
    return {
        id: createId("layer"),
        kind: "shape",
        name: shape === "ellipse" ? "Ellipse" : isLine ? "Line" : "Rectangle",
        x: isLine ? 80 : 860,
        y: isLine ? 520 : 400,
        width: isLine ? 260 : 240,
        height: isLine ? 6 : 160,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        shape,
        fillEnabled: !isLine,
        fill: "#C9F24D",
        strokeEnabled: isLine,
        stroke: "#FAFAFA",
        strokeWidth: 4,
        radius: 0,
    };
};

export const createImageLayer = (src: string, name: string): Layer => ({
    id: createId("layer"),
    kind: "image",
    name: name.replace(/\.[^.]+$/, "") || "Image",
    x: 760,
    y: 140,
    width: 360,
    height: 360,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    src,
    alt: name,
    fit: "cover",
    radius: 0,
});

export const createFreeDocument = (): FreeDocument => ({
    kind: "free",
    id: createId("doc"),
    name: "Untitled card",
    width: 1200,
    height: 630,
    background: { ...DEFAULT_CANVAS_BACKGROUND },
    layers: [],
});

const TEMPLATE_DEFAULT_TITLE_SIZE: Record<TemplateId, number> = {
    "minimalist-tech": 46,
    "app-showcase": 24,
    "centered-container": 44,
    "brand-pitch": 46,
    "editorial-pixel": 46,
    "saas-launch": 38,
    "blog-post": 46,
    "podcast-cover": 46,
    changelog: 42,
};

export const createTemplateDocument = (
    templateId: TemplateId,
    defaults: {
        title: string;
        textColor: string;
        tag: string;
        logo: string;
        detailOne?: string;
        detailTwo?: string;
        detailThree?: string;
        image: string;
        imageFileName: string;
        fontId: TemplateFontId;
        backgroundMode: "Gradient" | "Solid Color" | "Background";
        gradientStart: string;
        gradientEnd: string;
        gradientAngle: number;
        backgroundPresetId: BackgroundPresetId;
        gridOverlay: GridOverlay;
        gridColor: string;
        gridOpacity: number;
        gridBlur: number;
    },
): TemplateDocument => ({
    kind: "template",
    id: createId("doc"),
    name: templateId,
    templateId,
    fields: {
        title: defaults.title,
        textColor: defaults.textColor,
        tag: defaults.tag,
        logo: defaults.logo,
        detailOne: defaults.detailOne ?? "",
        detailTwo: defaults.detailTwo ?? "",
        detailThree: defaults.detailThree ?? "",
        fontId: defaults.fontId,
        titleSize: TEMPLATE_DEFAULT_TITLE_SIZE[templateId],
        titleTracking: 0,
        imageFit: "contain" as ImageFit,
        imageRadius: 0,
        backgroundMode: defaults.backgroundMode,
        gradientStart: defaults.gradientStart,
        gradientEnd: defaults.gradientEnd,
        gradientAngle: defaults.gradientAngle,
        backgroundPresetId: defaults.backgroundPresetId,
        gridOverlay: defaults.gridOverlay,
        gridColor: defaults.gridColor,
        gridOpacity: defaults.gridOpacity,
        gridBlur: defaults.gridBlur,
    },
    logoImage: "/icon.png",
    logoImageName: "icon.png",
    image: defaults.image,
    imageName: defaults.imageFileName,
});

export const applyBrandKitToFree = (document: FreeDocument, kit: BrandKit): FreeDocument => ({
    ...document,
    background: {
        ...document.background,
        mode: kit.backgroundMode === "Solid Color" ? "solid" : kit.backgroundMode === "Background" ? "preset" : "gradient",
        color: kit.gradientStart,
        gradientStart: kit.gradientStart,
        gradientEnd: kit.gradientEnd,
        gradientAngle: kit.gradientAngle,
        presetId: kit.backgroundPresetId,
        overlay: kit.gridOverlay,
        overlayColor: kit.gridColor,
        overlayOpacity: kit.gridOpacity,
    },
    layers: document.layers.map((layer) => {
        if (layer.kind === "text") {
            return { ...layer, color: kit.textColor, fontId: kit.fontId };
        }
        return layer;
    }),
});

export const applyBrandKitToTemplate = (document: TemplateDocument, kit: BrandKit): TemplateDocument => ({
    ...document,
    logoImage: kit.logoImage || document.logoImage,
    logoImageName: kit.logoImage ? kit.logoImageName : document.logoImageName,
    fields: {
        ...document.fields,
        textColor: kit.textColor,
        fontId: kit.fontId,
        backgroundMode: kit.backgroundMode,
        gradientStart: kit.gradientStart,
        gradientEnd: kit.gradientEnd,
        gradientAngle: kit.gradientAngle,
        backgroundPresetId: kit.backgroundPresetId,
        gridOverlay: kit.gridOverlay,
        gridColor: kit.gridColor,
        gridOpacity: kit.gridOpacity,
    },
});