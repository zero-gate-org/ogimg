import type { TemplateId } from "../../components/templates/templateRegistry";

export type TemplateTextSlot = "title" | "tag" | "logo" | "detailOne" | "detailTwo" | "detailThree";

export interface TemplateTextField {
    slot: TemplateTextSlot;
    label: string;
    placeholder: string;
    multiline?: boolean;
}

/**
 * Per template control schema.
 *
 * The editor renders its content panel from this instead of branching on
 * `templateId === ...` in JSX, so adding a template means adding an entry here
 * rather than editing the editor.
 */
export interface TemplateSchema {
    supportsLogoImage: boolean;
    supportsImage: boolean;
    imageHint: string;
    fields: TemplateTextField[];
}

const headline = (label = "Headline", placeholder = "A headline people stop on"): TemplateTextField => ({
    slot: "title",
    label,
    placeholder,
});

const brandName = (label = "Brand", placeholder = "Acme"): TemplateTextField => ({
    slot: "logo",
    label,
    placeholder,
});

export const TEMPLATE_SCHEMAS: Record<TemplateId, TemplateSchema> = {
    "minimalist-tech": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Screenshot placed on the right side of the card.",
        fields: [
            brandName("Logo text", "ogimg.in"),
            { slot: "tag", label: "Tag", placeholder: "Built with ogimg.in" },
            headline("Title", "Create beautiful OG images for free"),
        ],
    },
    "app-showcase": {
        supportsLogoImage: false,
        supportsImage: true,
        imageHint: "Product UI image. The template falls back to a placeholder frame.",
        fields: [
            brandName("Brand name", "ogimg.in"),
            headline("Brand tagline", "One line that explains the product"),
        ],
    },
    "centered-container": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Logo mark", "og"),
            headline("Main headline", "Design better OG cards"),
            {
                slot: "tag",
                label: "Subtext",
                placeholder: "One sentence of supporting detail",
                multiline: true,
            },
        ],
    },
    "brand-pitch": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Brand name", "ogimg.in"),
            headline("Main headline", "What the product does for the reader"),
            {
                slot: "tag",
                label: "Subheading",
                placeholder: "One sentence of supporting detail",
                multiline: true,
            },
            { slot: "detailOne", label: "Benefit 1", placeholder: "First benefit" },
            { slot: "detailTwo", label: "Benefit 2", placeholder: "Second benefit" },
            { slot: "detailThree", label: "Benefit 3", placeholder: "Third benefit" },
        ],
    },
    "editorial-pixel": {
        supportsLogoImage: false,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            headline("Headline", "Something worth announcing"),
            { slot: "tag", label: "Waitlist line", placeholder: "Join the waitlist" },
            { slot: "logo", label: "Supporting line", placeholder: "One more line of context" },
            { slot: "detailOne", label: "CTA text", placeholder: "Get early access" },
        ],
    },
    "saas-launch": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Dashboard screenshot shown on the left half.",
        fields: [
            brandName("Brand name", "ogimg.in"),
            headline("Title", "What is new in this release"),
            { slot: "tag", label: "Tag", placeholder: "Launching on ogimg.in" },
            { slot: "detailOne", label: "Key outcome 1", placeholder: "Added: something useful" },
            { slot: "detailTwo", label: "Key outcome 2", placeholder: "Improved: something faster" },
        ],
    },
    "blog-post": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Article cover or guest visual shown on the left.",
        fields: [
            brandName("Byline", "Your name"),
            headline("Title", "The article headline"),
            { slot: "tag", label: "Tag", placeholder: "Engineering" },
        ],
    },
    "podcast-cover": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Guest portrait shown on the left half.",
        fields: [
            brandName("Show name", "The show"),
            headline("Title", "Episode title"),
            { slot: "tag", label: "Tag", placeholder: "Guest name, role" },
        ],
    },
    changelog: {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Product name", "ogimg.in"),
            headline("Release title", "Release name and version"),
            { slot: "tag", label: "Footer CTA", placeholder: "Read the full changelog" },
            { slot: "detailOne", label: "Line 1", placeholder: "Added: something" },
            { slot: "detailTwo", label: "Line 2", placeholder: "Improved: something" },
            { slot: "detailThree", label: "Line 3", placeholder: "Fixed: something" },
        ],
    },
};

export const getTemplateSchema = (templateId: TemplateId): TemplateSchema => TEMPLATE_SCHEMAS[templateId];