import type { TemplateId } from "../../components/templates/templateRegistry";

type TemplateTextSlot = "title" | "tag" | "logo" | "detailOne" | "detailTwo" | "detailThree";

interface TemplateTextField {
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
interface TemplateSchema {
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
    "neon-grid": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "Upload a logo to replace the mark beside the wordmark.",
        fields: [
            headline("Wordmark", "Never Settle"),
            {
                slot: "tag",
                label: "Tagline",
                placeholder: "A short line under the wordmark",
                multiline: true,
            },
        ],
    },
    spotlight: {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Product screenshot shown inside a dark device frame that bleeds off the right edge.",
        fields: [
            brandName("Brand", "ogimg.in"),
            headline("Headline", "Built for teams that ship weekly"),
            {
                slot: "tag",
                label: "Support line",
                placeholder: "One sentence of supporting detail",
                multiline: true,
            },
        ],
    },
    "grid-glow": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Dashboard or product shot anchored along the bottom edge, bleeding off it.",
        fields: [
            headline("Headline", "One editor for every social card"),
            {
                slot: "tag",
                label: "Subtext",
                placeholder: "One sentence of supporting detail",
                multiline: true,
            },
        ],
    },
    arc: {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Wordmark", "ogimg.in"),
            headline("Headline", "Design that never leaves the browser"),
            { slot: "tag", label: "Domain line", placeholder: "ogimg.in" },
        ],
    },
    "teal-grid": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Wide dashboard shot anchored along the bottom edge, bleeding off it.",
        fields: [
            headline("Headline", "Your dashboard, framed for the feed"),
            {
                slot: "tag",
                label: "Subtext",
                placeholder: "One sentence of supporting detail",
                multiline: true,
            },
        ],
    },
    mesh: {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Brand", "ogimg.in"),
            headline("Headline", "A launch card people stop on"),
            {
                slot: "tag",
                label: "Support line",
                placeholder: "One sentence of supporting detail",
                multiline: true,
            },
        ],
    },
    dusk: {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Brand", "ogimg.in"),
            headline("Headline", "Quiet cards, loud results"),
            {
                slot: "tag",
                label: "Support line",
                placeholder: "One sentence of supporting detail",
                multiline: true,
            },
        ],
    },
    spectrum: {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Product shot anchored along the bottom edge, bleeding off it.",
        fields: [
            headline("Headline", "Every feed, one canvas"),
            {
                slot: "tag",
                label: "Subtext",
                placeholder: "One sentence of supporting detail",
                multiline: true,
            },
        ],
    },
    ticket: {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Wordmark", "ogimg.in"),
            headline("Headline", "The free canvas is open"),
            { slot: "tag", label: "Domain line", placeholder: "ogimg.in" },
        ],
    },
    deck: {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Screenshot shown in the front card of a small stack at the bottom.",
        fields: [
            headline("Headline", "Stack your best work"),
            {
                slot: "tag",
                label: "Subtext",
                placeholder: "One sentence of supporting detail",
                multiline: true,
            },
        ],
    },
    bento: {
        supportsLogoImage: false,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            headline("Headline", "Numbers that sell the launch"),
            brandName("Domain", "ogimg.in"),
            { slot: "detailOne", label: "Stat 1", placeholder: "120k: followers on social" },
            { slot: "detailTwo", label: "Stat 2", placeholder: "50+: templates and fonts" },
            { slot: "detailThree", label: "Stat 3", placeholder: "0: servers to pay for" },
        ],
    },
    crossglow: {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Wordmark", "ogimg.in"),
            headline("Headline", "Made for people who ship"),
            { slot: "tag", label: "Domain line", placeholder: "ogimg.in" },
        ],
    },
    "horizon-bloom": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Wordmark", "ogimg.in"),
            headline("Headline", "Cards that hold up in every feed"),
        ],
    },
    "corner-flare": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Product shot in a tall panel that runs off the right and bottom edges.",
        fields: [
            brandName("Brand", "ogimg.in"),
            headline("Headline", "Designed for teams that ship weekly"),
            {
                slot: "tag",
                label: "Support line",
                placeholder: "One canvas for every feed size",
                multiline: true,
            },
        ],
    },
    "solar-mesh": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Wordmark", "ogimg.in"),
            headline("Headline", "The launch card, done"),
            { slot: "tag", label: "Domain line", placeholder: "ogimg.in" },
        ],
    },
    "violet-rail": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Screenshot in a large panel that fills the right half.",
        fields: [
            brandName("Brand", "ogimg.in"),
            headline("Headline", "Your app, at 2x"),
        ],
    },
    "tilt-plate": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Wordmark", "ogimg.in"),
            headline("Headline", "A frame for the work you just shipped"),
            { slot: "tag", label: "Domain line", placeholder: "ogimg.in" },
        ],
    },
    "stat-rail": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Brand", "ogimg.in"),
            headline("Headline", "What the card did in a week"),
            { slot: "detailOne", label: "Stat 1", placeholder: "3x: clicks" },
            { slot: "detailTwo", label: "Stat 2", placeholder: "18k: previews served" },
            { slot: "detailThree", label: "Stat 3", placeholder: "0: servers to pay for" },
            // The tag slot carries the fourth stat so the field can hold the
            // reference's full four panel grid.
            { slot: "tag", label: "Stat 4", placeholder: "10M: downloads" },
        ],
    },
    "prism-frame": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Screenshot inside a rainbow bezel that runs off the right edge.",
        fields: [
            brandName("Brand", "ogimg.in"),
            headline("Headline", "Your product, framed for the feed"),
        ],
    },
    "arch-glow": {
        supportsLogoImage: false,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            headline("Headline", "One card, every feed"),
            { slot: "tag", label: "Tagline", placeholder: "ogimg.in" },
        ],
    },
    "facet-field": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Wordmark", "ogimg.in"),
            headline("Headline", "Built for launch day"),
            { slot: "tag", label: "Domain line", placeholder: "ogimg.in" },
        ],
    },
    "cyan-rim": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Product shot in a tall panel that fills the right side.",
        fields: [
            brandName("Brand", "ogimg.in"),
            headline("Headline", "Every size, from one canvas"),
            {
                slot: "tag",
                label: "Support line",
                placeholder: "Open Graph, X, LinkedIn and more",
                multiline: true,
            },
        ],
    },
    "light-column": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Wordmark", "ogimg.in"),
            headline("Headline", "Ship the card first"),
            { slot: "tag", label: "Domain line", placeholder: "ogimg.in" },
        ],
    },
    "soft-mesh": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This layout is typographic, so it has no image slot.",
        fields: [
            brandName("Wordmark", "ogimg.in"),
            headline("Headline", "A card worth clicking"),
            { slot: "tag", label: "Domain line", placeholder: "ogimg.in" },
        ],
    },
    "agile-startup": {
        supportsLogoImage: true,
        supportsImage: false,
        imageHint: "This reference is a fixed SVG composition, so it has no editable image slot.",
        fields: [
            brandName("Brand", "ogimg.in"),
            headline("Reference label", "Agile Startup"),
            { slot: "tag", label: "URL", placeholder: "ogimg.in" },
        ],
    },
    "og-image-studio": {
        supportsLogoImage: false,
        supportsImage: true,
        imageHint: "Replace the full dashboard artwork with your own image; the hero copy remains editable.",
        fields: [
            headline("Hero headline", "Create cards that get clicked"),
        ],
    },
    "violet-console": {
        supportsLogoImage: true,
        supportsImage: true,
        imageHint: "Fills the editor window edge to edge, framed by its glass and 8px corners.",
        fields: [
            brandName("Wordmark", "ogimg studio"),
            headline("Headline", "Made for launch day"),
        ],
    },
};

export const getTemplateSchema = (templateId: TemplateId): TemplateSchema => TEMPLATE_SCHEMAS[templateId];