import type { Guide } from "../types";

export const openGraphImageExamples: Guide = {
    slug: "open-graph-image-examples",
    title: "Open Graph image examples, and why they work",
    seoTitle: "Open Graph Image Examples (and Why They Work)",
    description:
        "Eight annotated Open Graph image examples for blog posts, launches, changelogs, podcasts, and product pages. Open any example and edit it for free.",
    category: "Design",
    published: "2026-10-24",
    updated: "2026-10-27",
    readingTime: 8,
    quickAnswer:
        "The strongest Open Graph images share four traits: one idea, a headline readable at 300 pixels wide, a brand mark inside the safe area, and enough contrast to survive a feed. The layouts below show those traits in different jobs: a blog post, a product launch, a changelog, a podcast episode, a documentation page, and a home page.",
    keyFacts: [
        { label: "Examples", value: "8 live, editable cards" },
        { label: "Canvas", value: "1200 x 630 px" },
        { label: "Common thread", value: "One idea per card" },
        { label: "Safe area", value: "64 px inset" },
        { label: "Thumbnail test", value: "Readable at 300 px" },
        { label: "Cost", value: "Free, no account" },
    ],
    sections: [
        {
            type: "p",
            lead: true,
            text: "An example is only useful if you can see what it is doing. Each card below is rendered live, not screenshotted, and each one is annotated with the decision that makes it work. Open any of them to change the words, the type, and the background.",
        },
        {
            type: "p",
            text: "The cards are not here to be copied exactly. They are here to show the range of compositions that survive a feed: centred type, a split layout, a product shot, a data block, and an editorial poster. Pick the structure that matches the job, then make the words yours.",
        },
        {
            type: "h2",
            text: "1. The blog post card",
        },
        {
            type: "template",
            templateId: "blog-post",
            alt: "A blog post Open Graph card with a category label, a headline, and an image on the right",
            caption:
                "Blog post: the category gives context, the headline gives the argument, and the image gives the eye somewhere to land.",
        },
        {
            type: "p",
            text: "This layout works because it separates the metadata from the idea. The small category label answers \"what kind of thing is this?\" before the headline answers \"why should I click?\". The image is a supporting actor, not the subject. If you publish technical writing, the category can be the stack (`Next.js`, `Postgres`, `CSS`) and the headline can be the specific claim.",
        },
        {
            type: "p",
            text: "The failure mode is a headline that restates the category. \"Engineering blog\" says nothing. \"Why our build got 40 percent faster\" says enough to earn the click.",
        },
        {
            type: "h2",
            text: "2. The product launch card",
        },
        {
            type: "template",
            templateId: "saas-launch",
            alt: "A product launch Open Graph card with a bold headline and a product screenshot",
            caption:
                "Launch: the product is the proof, so the screenshot sits beside the claim instead of behind it.",
        },
        {
            type: "p",
            text: "A launch card has to do two jobs: name the thing and show that it exists. A screenshot is the cheapest credibility signal you have. Keep the headline to the outcome, not the feature list, and let the screenshot carry the detail. If the product is visual, this is the layout to use.",
        },
        {
            type: "p",
            text: "One caution: screenshots are usually dense. Crop to the part that proves the claim, and make sure it is still readable at thumbnail size. A full app window with 11 px text becomes visual noise.",
        },
        {
            type: "h2",
            text: "3. The changelog card",
        },
        {
            type: "template",
            templateId: "changelog",
            alt: "A changelog Open Graph card with a version number, a release date, and a summary",
            caption:
                "Changelog: the version and the date are the hook. The summary explains what changed without turning into a release note.",
        },
        {
            type: "p",
            text: "Changelog cards are a series, so consistency matters more than novelty. The version number is the recognizable element; keep it in the same place every time. The summary should be one sentence a customer would understand, not the internal commit message. If the release has a visual change, show the before and after rather than a generic gradient.",
        },
        {
            type: "h2",
            text: "4. The podcast episode card",
        },
        {
            type: "template",
            templateId: "podcast-cover",
            alt: "A podcast episode Open Graph card with the episode title, guest name, and cover art",
            caption:
                "Podcast: the guest and the question are the reasons to listen. Cover art supplies recognition, not information.",
        },
        {
            type: "p",
            text: "For an episode, the headline is usually the question or the guest, not the show name. The show name is already in the domain line and in the artwork. Keep the guest name visible but secondary. If the cover art is detailed, place it rather than stretching it; a cropped face is worse than a smaller, complete one.",
        },
        {
            type: "h2",
            text: "5. The product showcase card",
        },
        {
            type: "template",
            templateId: "app-showcase",
            alt: "A product showcase Open Graph card with an identity column and a full-height product shot",
            caption:
                "Showcase: a split layout gives the product half the canvas and the identity the other half. Good for a home page or a feature page.",
        },
        {
            type: "p",
            text: "The split layout is a workhorse. The left column carries the mark and the claim; the right column carries the proof. It works for home pages, feature pages, and app store links because the eye gets a clear order: brand, claim, product. The risk is a screenshot that is too wide for the column. Crop to the part that matters.",
        },
        {
            type: "h2",
            text: "6. The editorial card",
        },
        {
            type: "template",
            templateId: "editorial-pixel",
            alt: "An editorial Open Graph card with a flush-left headline, a small wordmark, and a pixel grid",
            caption:
                "Editorial: no image, no product shot. The type is the design. This works when the writing is the product.",
        },
        {
            type: "p",
            text: "A type-only card is the hardest to get right and the easiest to recognize. It relies on a strong headline, a confident typeface, and a deliberate amount of empty space. Use it for essays, documentation, and opinionated posts where the idea is the draw. Do not use it for a product launch; there is nothing to look at.",
        },
        {
            type: "h2",
            text: "7. The benefits card",
        },
        {
            type: "template",
            templateId: "brand-pitch",
            alt: "A benefits Open Graph card with a headline on the left and a ruled list of three benefits on the right",
            caption:
                "Benefits: the ruled list gives the eye three concrete reasons without turning the card into a slide.",
        },
        {
            type: "p",
            text: "Lists work when the value is genuinely a set of outcomes, not a set of features. Keep each line short, start with a verb or a number, and use no more than three. The moment the list needs a fourth line, the card is doing too much. At thumbnail size, the list becomes texture; the headline still has to carry the meaning.",
        },
        {
            type: "h2",
            text: "8. The metrics card",
        },
        {
            type: "template",
            templateId: "stat-rail",
            alt: "A metrics Open Graph card with a large figure, a supporting label, and a brand mark",
            caption:
                "Metrics: one number, one label, one source. A card with three numbers has no number.",
        },
        {
            type: "p",
            text: "A single number is a strong hook when it is specific and sourced. \"40 percent faster\" is better than \"blazing fast\". Put the number in the largest type, the label underneath, and the source in the description. If you need a second number to make the first one meaningful, the card probably needs a different idea.",
        },
        {
            type: "h2",
            text: "The patterns behind all eight",
        },
        {
            type: "table",
            head: ["Pattern", "Why it works", "Where it fails"],
            rows: [
                ["One idea per card", "The eye finds the point before it finds the exit", "A card that summarizes a whole article"],
                ["Type at 72-96 px", "Readable at 300 px wide", "Body copy or a 30 px subhead"],
                ["64 px safe area", "Survives a 2:1 or square crop", "Corner logos and edge text"],
                ["High contrast", "Stable at small sizes and on bad screens", "Grey type on a mid-tone gradient"],
                ["A brand mark in the same place", "Recognition across a series", "A different logo position on every card"],
                ["A versioned filename", "The cache refreshes when the design changes", "Overwriting `card.png`"],
            ],
        },
        {
            type: "callout",
            tone: "tip",
            title: "Steal the structure, not the surface",
            text: "The useful part of an example is the composition: where the headline sits, how much space it gets, where the brand goes. The colours and typefaces are the easy part to change and the least important part to copy.",
        },
        {
            type: "p",
            text: "Every card on this page is available in the [template gallery](/template-gallery). Open one, replace the copy, and export a 1200 x 630 PNG, JPEG, or WebP. If you want to start from a blank canvas instead, the [free canvas](/studio) gives you the same size presets and layer controls.",
        },
        {
            type: "links",
            title: "Related",
            items: [
                {
                    href: "/learn/open-graph-image-best-practices",
                    label: "OG image best practices",
                    description: "The rules behind these examples, in checklist form.",
                },
                {
                    href: "/learn/open-graph-image-size",
                    label: "OG image size guide",
                    description: "1200 x 630, platform sizes, and safe areas.",
                },
                {
                    href: "/template-gallery",
                    label: "Browse all templates",
                    description: "45 live layouts, editable in the browser.",
                },
                {
                    href: "/learn/how-to-create-an-open-graph-image",
                    label: "How to create an OG image",
                    description: "The full workflow from headline to preview check.",
                },
            ],
        },
    ],
    faqs: [
        {
            question: "What makes a good Open Graph image?",
            answer:
                "One idea, a six-to-ten-word headline, high contrast, a brand mark inside the safe area, and a composition that still reads at 300 pixels wide. The image should sell the link, not summarize the page.",
        },
        {
            question: "Can I use these examples for my own site?",
            answer:
                "Yes. Every card is a template in the gallery. Open one, replace the headline and logo, and export it. The templates are free and do not add a watermark.",
        },
        {
            question: "Should an OG image include a screenshot?",
            answer:
                "Use a screenshot when the product is visual and the screenshot proves the claim. Crop to the part that matters and make sure it is still readable at thumbnail size. For text-led posts, a type-only card is often stronger.",
        },
        {
            question: "How many words should be on an OG image?",
            answer:
                "Six to ten words for the headline, plus a short label or wordmark. Anything longer competes with the headline and disappears in a feed.",
        },
        {
            question: "Do I need a different image for each platform?",
            answer:
                "Usually not. A 1200 x 630 card works across Facebook, LinkedIn, X, Slack, Discord, and messaging apps. Make separate square or vertical assets only for platforms that use those shapes natively, such as Pinterest or Instagram.",
        },
        {
            question: "Can I use a photo as an OG image background?",
            answer:
                "Yes, if the type stays readable. Add a scrim or place the type in a solid panel. Avoid white type directly over a bright photo, even if it looks fine in the editor.",
        },
        {
            question: "What is the best OG image layout?",
            answer:
                "The one that matches the job. A blog post benefits from a category label and a headline; a launch benefits from a product shot; a changelog benefits from a version number and a date. Start with the idea, then choose the composition.",
        },
    ],
    sources: [
        { label: "The Open Graph protocol", href: "https://ogp.me/" },
        {
            label: "Meta: Sharing best practices",
            href: "https://developers.facebook.com/docs/sharing/webmasters/",
        },
        {
            label: "X: Cards markup",
            href: "https://developer.x.com/en/docs/x-for-websites/cards/overview/markup",
        },
    ],
    related: ["open-graph-image-best-practices", "open-graph-image-size", "how-to-create-an-open-graph-image"],
};
