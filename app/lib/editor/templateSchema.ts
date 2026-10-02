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
        imageHint: "Screenshot in a wide frame that sits on the bottom edge and bleeds off the right.",
        fields: [
            brandName("Brand", "ogimg.in"),
            { slot: "tag", label: "Status line", placeholder: "Open Graph editor" },
            headline("Headline", "The card decides whether anyone clicks"),
        ],
    },
    "app-showcase": {
        supportsLogoImage: false,
        supportsImage: true,
        imageHint: "Product UI image, shown full height on the right.",
        fields: [
            brandName("Brand", "ogimg.in"),
            headline("Headline", "Sized for every feed it lands in"),
            {
                slot: "tag",
                label: "Subtext",
                placeholder: "One sentence of supporting detail",
                multiline: true,
            },
        ],
    },
    "centered-container": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Logo mark", "OG"),
            headline("Main headline", "One image, sent to every feed that matters"),
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
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Brand", "Your name"),
            headline("Headline", "The free canvas is open, and it stays in your browser"),
            { slot: "tag", label: "Status line", placeholder: "Now shipping" },
            { slot: "detailOne", label: "Link line", placeholder: "Read the announcement" },
        ],
    },
    "saas-launch": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Screenshot shown beside the outcome list. Add a keyword before the colon to label it.",
        fields: [
            brandName("Brand name", "ogimg.in"),
            headline("Title", "What is new in this release"),
            { slot: "tag", label: "Status line", placeholder: "Release 2.4" },
            { slot: "detailOne", label: "Outcome 1", placeholder: "Added: something useful" },
            { slot: "detailTwo", label: "Outcome 2", placeholder: "Improved: something faster" },
        ],
    },
    "blog-post": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Article cover shown in a wide frame that bleeds off two edges.",
        fields: [
            brandName("Byline", "Author name"),
            headline("Title", "The article headline"),
            { slot: "tag", label: "Category", placeholder: "Engineering" },
        ],
    },
    "podcast-cover": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Square episode artwork shown on the left.",
        fields: [
            brandName("Show name", "The show"),
            headline("Episode title", "What this episode is about"),
            { slot: "tag", label: "Guest", placeholder: "Guest name and role" },
        ],
    },
    changelog: {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Product name", "ogimg.in"),
            headline("Release title", "Release name and version"),
            { slot: "tag", label: "Link line", placeholder: "Full notes at your site" },
            { slot: "detailOne", label: "Entry 1", placeholder: "Added: something" },
            { slot: "detailTwo", label: "Entry 2", placeholder: "Improved: something" },
            { slot: "detailThree", label: "Entry 3", placeholder: "Fixed: something" },
        ],
    },
};

export const getTemplateSchema = (templateId: TemplateId): TemplateSchema => TEMPLATE_SCHEMAS[templateId];