import type { TemplateId } from "./templateRegistry";

export type TemplateFontId =
    | "geist-sans"
    | "geist-mono"
    | "geist-pixel-square"
    | "geist-pixel-grid"
    | "geist-pixel-circle"
    | "geist-pixel-triangle"
    | "geist-pixel-line"
    | "inter"
    | "poppins"
    | "dm-sans"
    | "playfair-display"
    | "space-grotesk"
    | "montserrat"
    | "lora"
    | "outfit"
    | "manrope"
    | "sora";

export interface TemplateFontOption {
    id: TemplateFontId;
    label: string;
    fontFaceName: string;
    fontFamily: string;
}

export const TEMPLATE_FONT_OPTIONS: TemplateFontOption[] = [
    {
        id: "geist-sans",
        label: "Geist Sans",
        fontFaceName: "Geist Sans",
        fontFamily: "\"Geist Sans\", ui-sans-serif, system-ui, sans-serif",
    },
    {
        id: "geist-mono",
        label: "Geist Mono",
        fontFaceName: "Geist Mono",
        fontFamily: "\"Geist Mono\", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
    },
    {
        id: "geist-pixel-square",
        label: "Geist Pixel Square",
        fontFaceName: "Geist Pixel Square",
        fontFamily: "\"Geist Pixel Square\", \"Geist Mono\", ui-monospace, monospace",
    },
    {
        id: "geist-pixel-grid",
        label: "Geist Pixel Grid",
        fontFaceName: "Geist Pixel Grid",
        fontFamily: "\"Geist Pixel Grid\", \"Geist Mono\", ui-monospace, monospace",
    },
    {
        id: "geist-pixel-circle",
        label: "Geist Pixel Circle",
        fontFaceName: "Geist Pixel Circle",
        fontFamily: "\"Geist Pixel Circle\", \"Geist Mono\", ui-monospace, monospace",
    },
    {
        id: "geist-pixel-triangle",
        label: "Geist Pixel Triangle",
        fontFaceName: "Geist Pixel Triangle",
        fontFamily: "\"Geist Pixel Triangle\", \"Geist Mono\", ui-monospace, monospace",
    },
    {
        id: "geist-pixel-line",
        label: "Geist Pixel Line",
        fontFaceName: "Geist Pixel Line",
        fontFamily: "\"Geist Pixel Line\", \"Geist Mono\", ui-monospace, monospace",
    },
    {
        id: "inter",
        label: "Inter",
        fontFaceName: "Inter",
        fontFamily: "\"Inter\", ui-sans-serif, system-ui, sans-serif",
    },
    {
        id: "poppins",
        label: "Poppins",
        fontFaceName: "Poppins",
        fontFamily: "\"Poppins\", ui-sans-serif, system-ui, sans-serif",
    },
    {
        id: "dm-sans",
        label: "DM Sans",
        fontFaceName: "DM Sans",
        fontFamily: "\"DM Sans\", ui-sans-serif, system-ui, sans-serif",
    },
    {
        id: "playfair-display",
        label: "Playfair Display",
        fontFaceName: "Playfair Display",
        fontFamily: "\"Playfair Display\", ui-serif, Georgia, serif",
    },
    {
        id: "space-grotesk",
        label: "Space Grotesk",
        fontFaceName: "Space Grotesk",
        fontFamily: "\"Space Grotesk\", ui-sans-serif, system-ui, sans-serif",
    },
    {
        id: "montserrat",
        label: "Montserrat",
        fontFaceName: "Montserrat",
        fontFamily: "\"Montserrat\", ui-sans-serif, system-ui, sans-serif",
    },
    {
        id: "lora",
        label: "Lora",
        fontFaceName: "Lora",
        fontFamily: "\"Lora\", ui-serif, Georgia, serif",
    },
    {
        id: "outfit",
        label: "Outfit",
        fontFaceName: "Outfit",
        fontFamily: "\"Outfit\", ui-sans-serif, system-ui, sans-serif",
    },
    {
        id: "manrope",
        label: "Manrope",
        fontFaceName: "Manrope",
        fontFamily: "\"Manrope\", ui-sans-serif, system-ui, sans-serif",
    },
    {
        id: "sora",
        label: "Sora",
        fontFaceName: "Sora",
        fontFamily: "\"Sora\", ui-sans-serif, system-ui, sans-serif",
    },
];

export const TEMPLATE_DEFAULT_FONT_BY_ID: Record<TemplateId, TemplateFontId> = {
    "minimalist-tech": "manrope",
    "app-showcase": "geist-sans",
    "centered-container": "space-grotesk",
    "brand-pitch": "geist-sans",
    "editorial-pixel": "geist-pixel-square",
    "saas-launch": "geist-sans",
    "blog-post": "playfair-display",
    "podcast-cover": "sora",
    "changelog": "geist-mono",
};

const TEMPLATE_FONT_OPTION_BY_ID = new Map(
    TEMPLATE_FONT_OPTIONS.map((option) => [option.id, option] as const)
);

export const getTemplateDefaultFontId = (templateId: TemplateId): TemplateFontId => {
    return TEMPLATE_DEFAULT_FONT_BY_ID[templateId] ?? "inter";
};

export const getTemplateFontFamily = (fontId: TemplateFontId): string => {
    return TEMPLATE_FONT_OPTION_BY_ID.get(fontId)?.fontFamily ?? TEMPLATE_FONT_OPTIONS[0].fontFamily;
};

export const getTemplateFontFaceName = (fontId: TemplateFontId): string => {
    return TEMPLATE_FONT_OPTION_BY_ID.get(fontId)?.fontFaceName ?? TEMPLATE_FONT_OPTIONS[0].fontFaceName;
};
