import type { BackgroundMode, BackgroundPresetId, GridOverlay } from "./templateShared";
import { DEFAULT_BACKGROUND_PRESET_ID } from "./templateShared";

export type TemplateId =
    | "minimalist-tech"
    | "app-showcase"
    | "centered-container"
    | "brand-pitch"
    | "editorial-pixel"
    | "saas-launch"
    | "blog-post"
    | "podcast-cover"
    | "changelog";

export interface TemplateDefaults {
    title: string;
    textColor: string;
    tag: string;
    logo: string;
    detailOne?: string;
    detailTwo?: string;
    detailThree?: string;
    image: string;
    imageFileName: string;
    backgroundMode: BackgroundMode;
    gradientStart: string;
    gradientEnd: string;
    gradientAngle: number;
    backgroundPresetId: BackgroundPresetId;
    gridOverlay: GridOverlay;
    gridColor: string;
    gridOpacity: number;
    gridBlur: number;
}

export interface TemplateDefinition {
    id: TemplateId;
    name: string;
    subtitle: string;
    previewGradient: [string, string];
    supportsImage: boolean;
    defaults: TemplateDefaults;
}

export const DEFAULT_TEMPLATE_ID: TemplateId = "minimalist-tech";

export const TEMPLATE_LIBRARY: TemplateDefinition[] = [
    {
        id: "minimalist-tech",
        name: "Minimalist Tech",
        subtitle: "Clean grid with app screenshot",
        previewGradient: ["#8b95a8", "#3d475a"],
        supportsImage: true,
        defaults: {
            title: "Create beautiful OG images for free with ogimg.in.",
            textColor: "#020617",
            tag: "Built with ogimg.in",
            logo: "ogimg.in",
            image: "/editor-preview.png",
            imageFileName: "editor-preview.png",
            backgroundMode: "Gradient",
            gradientStart: "#8B95A8",
            gradientEnd: "#3D475A",
            gradientAngle: 120,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "grid",
            gridColor: "#E5E7EB",
            gridOpacity: 0.24,
            gridBlur: 0.6,
        },
    },
    {
        id: "app-showcase",
        name: "App Showcase",
        subtitle: "Brand header + full UI image",
        previewGradient: ["#f3f4f6", "#cbd5e1"],
        supportsImage: true,
        defaults: {
            title: "Create beautiful OG images for free with ogimg.in.",
            textColor: "#111827",
            tag: "ogimg.in app preview",
            logo: "ogimg.in",
            image: "/editor-preview.png",
            imageFileName: "editor-preview.png",
            backgroundMode: "Gradient",
            gradientStart: "#F3F4F6",
            gradientEnd: "#D1D5DB",
            gradientAngle: 136,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#6B7280",
            gridOpacity: 0.12,
            gridBlur: 0,
        },
    },
    {
        id: "centered-container",
        name: "Centered Container",
        subtitle: "Logo mark, headline, and divider subtext",
        previewGradient: ["#1e293b", "#0f172a"],
        supportsImage: false,
        defaults: {
            title: "Design better OG cards with ogimg.in",
            textColor: "#F8FAFC",
            tag: "Create and export social images in minutes on ogimg.in.",
            logo: "og",
            image: "",
            imageFileName: "",
            backgroundMode: "Gradient",
            gradientStart: "#1E293B",
            gradientEnd: "#0F172A",
            gradientAngle: 140,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#94A3B8",
            gridOpacity: 0.16,
            gridBlur: 0.4,
        },
    },
    {
        id: "brand-pitch",
        name: "Brand Pitch",
        subtitle: "Logo, benefits, and headline split",
        previewGradient: ["#0f172a", "#1e293b"],
        supportsImage: false,
        defaults: {
            title: "Launch your next post with ogimg.in OG templates.",
            textColor: "#F8FAFC",
            tag: "Use ogimg.in to turn product updates into share-ready social cards.",
            logo: "ogimg.in",
            detailOne: "Generate OG images directly in browser",
            detailTwo: "Customize text, colors, and layout",
            detailThree: "Export PNG, JPEG, or WebP instantly",
            image: "",
            imageFileName: "",
            backgroundMode: "Gradient",
            gradientStart: "#0F172A",
            gradientEnd: "#1E293B",
            gradientAngle: 136,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#94A3B8",
            gridOpacity: 0.14,
            gridBlur: 0.4,
        },
    },
    {
        id: "editorial-pixel",
        name: "Editorial Pixel",
        subtitle: "Centered waitlist announcement",
        previewGradient: ["#2b3154", "#6948b7"],
        supportsImage: false,
        defaults: {
            title: "ogimg.in v2 is coming soon",
            textColor: "#f8fafc",
            tag: "Join the ogimg.in waitlist",
            logo: "Be first to try new OG image templates",
            detailOne: "Get early access",
            image: "",
            imageFileName: "",
            backgroundMode: "Gradient",
            gradientStart: "#1A1F36",
            gradientEnd: "#5B3B8F",
            gradientAngle: 140,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "dots",
            gridColor: "#FBCFE8",
            gridOpacity: 0.24,
            gridBlur: 0.2,
        },
    },
    {
        id: "saas-launch",
        name: "SaaS Launch",
        subtitle: "Split layout with launch bullets",
        previewGradient: ["#081120", "#1d4ed8"],
        supportsImage: true,
        defaults: {
            title: "Generate Open Graph images with ogimg.in.",
            textColor: "#f8fafc",
            tag: "Launching new features on ogimg.in",
            logo: "ogimg.in",
            detailOne: "Added: New OG templates for launches",
            detailTwo: "Improved: Faster OG image export",
            image: "/editor-preview.png",
            imageFileName: "editor-preview.png",
            backgroundMode: "Gradient",
            gradientStart: "#081120",
            gradientEnd: "#172554",
            gradientAngle: 125,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "graph",
            gridColor: "#60A5FA",
            gridOpacity: 0.2,
            gridBlur: 0.8,
        },
    },
    {
        id: "blog-post",
        name: "Blog Post",
        subtitle: "Split cover with guest visual",
        previewGradient: ["#f5e8c9", "#dec39d"],
        supportsImage: true,
        defaults: {
            title: "Ship OG cards your audience clicks with ogimg.in.",
            textColor: "#1f2937",
            tag: "Built by the ogimg.in team",
            logo: "ogimg.in",
            image: "/editor-preview.png",
            imageFileName: "editor-preview.png",
            backgroundMode: "Gradient",
            gradientStart: "#F7F0DB",
            gradientEnd: "#E5D7B8",
            gradientAngle: 130,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#6B7280",
            gridOpacity: 0.15,
            gridBlur: 0,
        },
    },
    {
        id: "podcast-cover",
        name: "Podcast Cover",
        subtitle: "Guest image + episode details",
        previewGradient: ["#1a1142", "#5f31b0"],
        supportsImage: true,
        defaults: {
            title: "ogimg.in product update",
            textColor: "#fdf2f8",
            tag: "Hosted by the ogimg.in team",
            logo: "ogimg.in",
            image: "/editor-preview.png",
            imageFileName: "editor-preview.png",
            backgroundMode: "Gradient",
            gradientStart: "#1A1142",
            gradientEnd: "#5F31B0",
            gradientAngle: 145,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "dots",
            gridColor: "#A78BFA",
            gridOpacity: 0.28,
            gridBlur: 1.1,
        },
    },
    {
        id: "changelog",
        name: "Changelog",
        subtitle: "Structured release note board",
        previewGradient: ["#0a1015", "#1f3c53"],
        supportsImage: false,
        defaults: {
            title: "ogimg.in Changelog v2.4.0",
            textColor: "#E5E7EB",
            tag: "Read full update at ogimg.in",
            logo: "ogimg.in",
            detailOne: "Added: AI-assisted OG copy suggestions",
            detailTwo: "Improved: Faster template rendering",
            detailThree: "Fixed: Better mobile preview exports",
            image: "",
            imageFileName: "",
            backgroundMode: "Gradient",
            gradientStart: "#0A1015",
            gradientEnd: "#1F3C53",
            gradientAngle: 130,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "graph",
            gridColor: "#34D399",
            gridOpacity: 0.2,
            gridBlur: 0.4,
        },
    },
];

export const getTemplateById = (templateId: TemplateId) => {
    return TEMPLATE_LIBRARY.find((template) => template.id === templateId) ?? TEMPLATE_LIBRARY[0];
};
