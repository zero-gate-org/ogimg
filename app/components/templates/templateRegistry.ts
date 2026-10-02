import type { BackgroundMode, BackgroundPresetId, GridOverlay, TemplateImageFit } from "./templateShared";
import { DEFAULT_BACKGROUND_PRESET_ID } from "./templateShared";

type ImageFit = TemplateImageFit;

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
    /** Headline baseline in px, so the editor slider reports the real value. */
    defaultTitleSize: number;
    /** Headline tracking baseline in em, so the editor slider reports the real value. */
    defaultTitleTracking: number;
    /**
     * Image fit baseline. "cover" suits slots that are meant to bleed or that are
     * roughly square; "contain" suits tall narrow slots, where cropping a wide
     * screenshot would hide most of it.
     */
    defaultImageFit: ImageFit;
    defaults: TemplateDefaults;
}

export const DEFAULT_TEMPLATE_ID: TemplateId = "minimalist-tech";

/**
 * Default copy per template. Each one demonstrates a different job: a product
 * claim, a launch, a release, an article, an episode. Nothing here needs to be
 * filled in before export, so it is written to be usable as shipped.
 */

export const TEMPLATE_LIBRARY: TemplateDefinition[] = [
    {
        id: "minimalist-tech",
        defaultImageFit: "cover",
        defaultTitleTracking: -0.038,
        defaultTitleSize: 68,
        name: "Minimalist Tech",
        subtitle: "Narrow text rail with a screenshot that bleeds off the right edge",
        previewGradient: ["#8b95a8", "#3d475a"],
        supportsImage: true,
        defaults: {
            title: "The card decides whether anyone clicks",
            textColor: "#FAFAFA",
            tag: "Open Graph editor",
            logo: "ogimg.in",
            image: "/editor-preview.png",
            imageFileName: "editor-preview.png",
            backgroundMode: "Gradient",
            gradientStart: "#0B0B0D",
            gradientEnd: "#1C1C20",
            gradientAngle: 155,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#FAFAFA",
            gridOpacity: 0.12,
            gridBlur: 0,
        },
    },
    {
        id: "app-showcase",
        defaultImageFit: "cover",
        defaultTitleTracking: -0.032,
        defaultTitleSize: 54,
        name: "App Showcase",
        subtitle: "Identity column beside a full height product shot",
        previewGradient: ["#f3f4f6", "#cbd5e1"],
        supportsImage: true,
        defaults: {
            title: "Sized for every feed it lands in",
            textColor: "#09090B",
            tag: "Open Graph, X, LinkedIn, Product Hunt, and YouTube from one editor.",
            logo: "ogimg.in",
            image: "/editor-preview.png",
            imageFileName: "editor-preview.png",
            backgroundMode: "Gradient",
            gradientStart: "#F4F4F5",
            gradientEnd: "#E4E4E7",
            gradientAngle: 160,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#09090B",
            gridOpacity: 0.12,
            gridBlur: 0,
        },
    },
    {
        id: "centered-container",
        defaultImageFit: "cover",
        defaultTitleTracking: -0.04,
        defaultTitleSize: 76,
        name: "Centered Container",
        subtitle: "Pure type: mark, headline, and a rule above the subtext",
        previewGradient: ["#1e293b", "#0f172a"],
        supportsImage: false,
        defaults: {
            title: "One image, sent to every feed that matters",
            textColor: "#FAFAFA",
            tag: "Rescales to X, LinkedIn, YouTube, and stories without redoing the layout.",
            logo: "og",
            image: "",
            imageFileName: "",
            backgroundMode: "Gradient",
            gradientStart: "#111318",
            gradientEnd: "#1A1D24",
            gradientAngle: 165,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#FAFAFA",
            gridOpacity: 0.14,
            gridBlur: 0,
        },
    },
    {
        id: "brand-pitch",
        defaultImageFit: "cover",
        defaultTitleTracking: -0.036,
        defaultTitleSize: 64,
        name: "Brand Pitch",
        subtitle: "Headline left, benefits as a ruled list on the right",
        previewGradient: ["#0f172a", "#1e293b"],
        supportsImage: false,
        defaults: {
            title: "A launch post people open",
            textColor: "#111111",
            tag: "Set the copy once, then switch the background when the announcement lands.",
            logo: "ogimg.in",
            detailOne: "Nine templates, each with its own controls",
            detailTwo: "Fonts embedded in the exported file",
            detailThree: "Nothing is uploaded to a server",
            image: "",
            imageFileName: "",
            backgroundMode: "Gradient",
            gradientStart: "#F5F5F4",
            gradientEnd: "#E7E7E5",
            gradientAngle: 155,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#111111",
            gridOpacity: 0.14,
            gridBlur: 0,
        },
    },
    {
        id: "editorial-pixel",
        defaultImageFit: "cover",
        defaultTitleTracking: -0.012,
        defaultTitleSize: 82,
        name: "Editorial Pixel",
        subtitle: "Poster layout with a flush left headline and small mark",
        previewGradient: ["#0b0b0d", "#141418"],
        supportsImage: false,
        defaults: {
            title: "The free canvas is open, and it stays in your browser",
            textColor: "#FAFAFA",
            tag: "Now shipping",
            logo: "ogimg.in",
            detailOne: "Read the announcement",
            image: "",
            imageFileName: "",
            backgroundMode: "Gradient",
            gradientStart: "#0B0B0D",
            gradientEnd: "#141418",
            gradientAngle: 160,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "dots",
            gridColor: "#FAFAFA",
            gridOpacity: 0.22,
            gridBlur: 0,
        },
    },
    {
        id: "saas-launch",
        defaultImageFit: "contain",
        defaultTitleTracking: -0.036,
        defaultTitleSize: 60,
        name: "SaaS Launch",
        subtitle: "Stacked card with a shot and a keyword ledger",
        previewGradient: ["#081120", "#1d4ed8"],
        supportsImage: true,
        defaults: {
            title: "Bulk generation, out of beta",
            textColor: "#F4F7FB",
            tag: "Release 2.4",
            logo: "ogimg.in",
            detailOne: "Added: map CSV columns onto template fields",
            detailTwo: "Improved: template gallery renders at 2x",
            image: "/editor-preview.png",
            imageFileName: "editor-preview.png",
            backgroundMode: "Gradient",
            gradientStart: "#0A1220",
            gradientEnd: "#14243F",
            gradientAngle: 150,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#F4F7FB",
            gridOpacity: 0.14,
            gridBlur: 0,
        },
    },
    {
        id: "blog-post",
        defaultImageFit: "contain",
        defaultTitleTracking: -0.018,
        defaultTitleSize: 54,
        name: "Blog Post",
        subtitle: "Serif headline with a wide cover that bleeds off two edges",
        previewGradient: ["#f5e8c9", "#dec39d"],
        supportsImage: true,
        defaults: {
            title: "A smaller image budget, honestly argued",
            textColor: "#111111",
            tag: "Performance",
            logo: "Rhea Kapoor",
            image: "/editor-preview.png",
            imageFileName: "editor-preview.png",
            backgroundMode: "Gradient",
            gradientStart: "#FAFAF9",
            gradientEnd: "#E7E5E4",
            gradientAngle: 150,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#111111",
            gridOpacity: 0.14,
            gridBlur: 0,
        },
    },
    {
        id: "podcast-cover",
        defaultImageFit: "cover",
        defaultTitleTracking: -0.038,
        defaultTitleSize: 48,
        name: "Podcast Cover",
        subtitle: "Square artwork beside a top aligned episode title",
        previewGradient: ["#1a1142", "#5f31b0"],
        supportsImage: true,
        defaults: {
            title: "Cutting our image build to nothing",
            textColor: "#F7F2FA",
            tag: "with Priya Raman, staff designer",
            logo: "The Off Hours",
            image: "/editor-preview.png",
            imageFileName: "editor-preview.png",
            backgroundMode: "Gradient",
            gradientStart: "#16111C",
            gradientEnd: "#241B2E",
            gradientAngle: 155,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "dots",
            gridColor: "#F7F2FA",
            gridOpacity: 0.2,
            gridBlur: 0,
        },
    },
    {
        id: "changelog",
        defaultImageFit: "cover",
        defaultTitleTracking: -0.03,
        defaultTitleSize: 54,
        name: "Changelog",
        subtitle: "Release title over a ruled ledger of entries",
        previewGradient: ["#0a1015", "#1f3c53"],
        supportsImage: false,
        defaults: {
            title: "Release 2.4",
            textColor: "#E8EAED",
            tag: "Full notes at ogimg.in/changelog",
            logo: "ogimg.in",
            detailOne: "Added: bulk generation from CSV and JSON input",
            detailTwo: "Improved: template gallery renders at 2x",
            detailThree: "Fixed: crop warning when the canvas ratio does not match",
            image: "",
            imageFileName: "",
            backgroundMode: "Gradient",
            gradientStart: "#0C1013",
            gradientEnd: "#151A1F",
            gradientAngle: 155,
            backgroundPresetId: DEFAULT_BACKGROUND_PRESET_ID,
            gridOverlay: "none",
            gridColor: "#E8EAED",
            gridOpacity: 0.14,
            gridBlur: 0,
        },
    },
];

export const getTemplateById = (templateId: TemplateId) => {
    return TEMPLATE_LIBRARY.find((template) => template.id === templateId) ?? TEMPLATE_LIBRARY[0];
};
