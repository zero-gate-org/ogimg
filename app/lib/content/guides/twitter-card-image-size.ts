import type { Guide } from "../types";

export const twitterCardImageSize: Guide = {
    slug: "twitter-card-image-size",
    title: "Twitter card image size for X",
    seoTitle: "Twitter Card Image Size for X (2026 Guide)",
    description:
        "The right image size for X cards: 1200 x 628 for summary_large_image, a square for summary, plus the tags, safe areas, and common cropping fixes.",
    category: "Sizes",
    published: "2026-10-26",
    updated: "2026-10-27",
    readingTime: 6,
    quickAnswer:
        "For X's `summary_large_image` card, use 1200 x 628 pixels with a 1.91:1 ratio. A 1200 x 630 Open Graph image works too. For the compact `summary` card, use a square image around 400 x 400. Keep the file under 5 MB (under 1 MB is safer), use JPG, PNG, or WebP, and add `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` to the page head.",
    keyFacts: [
        { label: "Large card", value: "1200 x 628 px (1.91:1)" },
        { label: "Summary card", value: "400 x 400 px (1:1)" },
        { label: "File limit", value: "5 MB, target under 1 MB" },
        { label: "Formats", value: "JPG, PNG, WebP" },
        { label: "Card tag", value: "`twitter:card`" },
        { label: "Fallback", value: "Open Graph tags" },
    ],
    sections: [
        {
            type: "p",
            lead: true,
            text: "X reads Open Graph tags as a fallback, but the `twitter:*` tags control the card. That is why a page can have a perfect Facebook preview and a blank or badly cropped card on X. The fix is usually two lines: choose the card type and point `twitter:image` at the right file.",
        },
        {
            type: "h2",
            text: "The two card types",
        },
        {
            type: "table",
            head: ["Card", "Image size", "Ratio", "When to use it"],
            rows: [
                ["`summary_large_image`", "1200 x 628 px", "1.91:1", "Articles, launches, and pages with a purpose-built wide card"],
                ["`summary`", "400 x 400 px", "1:1", "Profiles, small utilities, and pages without a wide image"],
            ],
        },
        {
            type: "p",
            text: "The large card is almost always the right choice for content. It gives the headline room and makes the link look like an article rather than an attachment. The compact card is useful when the image is a logo or an avatar, because it does not stretch a square into a wide container.",
        },
        {
            type: "code",
            language: "html",
            label: "The large card tags",
            code: `<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="A clearer way to ship" />
<meta name="twitter:description" content="What changed, why it matters, and what to try first." />
<meta name="twitter:image" content="https://example.com/og/a-clearer-way-to-ship.png" />
<meta name="twitter:image:alt" content="Dark card with the headline: A clearer way to ship" />
<meta name="twitter:site" content="@yourhandle" />
<meta name="twitter:creator" content="@authorhandle" />`,
        },
        {
            type: "p",
            text: "The `twitter:site` and `twitter:creator` tags are optional but useful: they attribute the card to an account and can add the handle to the preview. The `twitter:image:alt` tag is not optional if you care about accessibility; it is what screen readers and some fallback states use.",
        },
        {
            type: "h2",
            text: "1200 x 628 or 1200 x 630?",
        },
        {
            type: "p",
            text: "Both are the same shape within rounding. X documents the large card around 1.91:1, and 1200 x 628 is the commonly cited size. A 1200 x 630 Open Graph image is 1.904:1, which is close enough that the crop difference is a couple of pixels. Do not maintain a separate file just to match the two-pixel difference.",
        },
        {
            type: "p",
            text: "What does matter is the crop in the timeline. Some X placements show a container closer to 2:1, so a 1.91:1 card loses a small amount from the top and bottom. Keep the headline and logo inside the middle 80 percent and the difference is invisible.",
        },
        {
            type: "callout",
            tone: "tip",
            title: "One file, both tags",
            text: "Point `og:image` and `twitter:image` at the same 1200 x 630 file. Use `twitter:card` to choose the layout. There is no reason to export a second image unless you want X-specific copy baked into the card.",
        },
        {
            type: "h2",
            text: "Safe area for X",
        },
        {
            type: "ul",
            items: [
                "Keep the headline and logo at least 64 px from every edge of a 1200 x 630 canvas.",
                "Keep the meaning inside the middle 80 percent, because the timeline crop is close to 2:1.",
                "Use a headline around 72-96 px. X renders the card at different widths on desktop and mobile.",
                "Avoid text in the bottom 10 percent; some layouts place the title and domain below the image and the composition can feel crowded.",
                "Check the card in the composer on a phone, not only on desktop.",
            ],
        },
        {
            type: "h2",
            text: "File format and weight",
        },
        {
            type: "p",
            text: "X accepts JPG, PNG, WebP, and GIF. The documented limit is 5 MB, but a 5 MB card is a bad idea: it loads slowly and can fail in a busy timeline. Target under 1 MB, and under 300 KB when the design allows it. JPG at 85 percent or WebP at 80 percent is usually indistinguishable from PNG for a photographic card.",
        },
        {
            type: "p",
            text: "Transparency is not your friend. X may composite a transparent PNG onto a dark or light surface, and the result depends on the client. Export a solid background. If the card uses a gradient, make sure the type sits on a stable value.",
        },
        {
            type: "h2",
            text: "Why the X card is blank",
        },
        {
            type: "table",
            head: ["Symptom", "Likely cause", "Fix"],
            rows: [
                ["No image at all", "`twitter:image` missing and `og:image` not picked up", "Add both tags with an absolute HTTPS URL"],
                ["Small thumbnail", "`summary` card or a small image", "Use `summary_large_image` and a 1200 px wide file"],
                ["Old image", "X cached the card", "Change the image filename or update `twitter:image`"],
                ["Cropped headline", "Text near the edge", "Keep content inside the middle 80 percent"],
                ["Wrong title", "Duplicate tags or a stale page cache", "Check the source for one title tag and clear the cache"],
                ["No preview in a DM", "X may not unfurl privately shared links the same way", "Check the public post composer; some DM clients do not render cards"],
            ],
        },
        {
            type: "h2",
            text: "How to test an X card",
        },
        {
            type: "ol",
            items: [
                "Confirm `twitter:card` and `twitter:image` are in the server-rendered HTML.",
                "Open the image URL in a private window; it must return 200 without a login.",
                "Paste the URL into a new post draft and look at the card.",
                "Try it on mobile and desktop; the timeline container is different.",
                "If the card is stale, change the image filename and try again.",
            ],
        },
        {
            type: "p",
            text: "X's own Card Validator has been unreliable for years. The composer preview is the practical test because it uses the same pipeline as a published post. For a second opinion, the Facebook Sharing Debugger will at least confirm that the Open Graph fallback is correct.",
        },
        {
            type: "h2",
            text: "Twitter card vs. Open Graph: what wins?",
        },
        {
            type: "p",
            text: "When both sets of tags are present, X uses the `twitter:*` values for the fields it supports. Open Graph fills the gaps. That is why a page with only `og:image` can still show a card on X, and why a page with a mismatched `twitter:image` can show the wrong image on X while Facebook looks correct.",
        },
        {
            type: "table",
            head: ["Field", "X-specific tag", "Open Graph fallback"],
            rows: [
                ["Card type", "`twitter:card`", "None; X chooses a default"],
                ["Title", "`twitter:title`", "`og:title`"],
                ["Description", "`twitter:description`", "`og:description`"],
                ["Image", "`twitter:image`", "`og:image`"],
                ["Image alt", "`twitter:image:alt`", "`og:image:alt`"],
                ["Attribution", "`twitter:site` / `twitter:creator`", "None"],
            ],
        },
        {
            type: "links",
            title: "Related",
            items: [
                {
                    href: "/learn/open-graph-image-size",
                    label: "OG image size guide",
                    description: "Every platform size, including X's place in the table.",
                },
                {
                    href: "/learn/open-graph-meta-tags",
                    label: "Open Graph meta tags",
                    description: "The full tag reference and a copy-paste block.",
                },
                {
                    href: "/learn/og-image-not-showing",
                    label: "OG image not showing?",
                    description: "The checklist for a broken or stale preview.",
                },
                {
                    href: "/studio",
                    label: "Make a 1200 x 630 card",
                    description: "Free templates and a layer canvas, no account.",
                },
            ],
        },
    ],
    faqs: [
        {
            question: "What size is a Twitter card image?",
            answer:
                "Use 1200 x 628 for a summary_large_image card and around 400 x 400 for a summary card. A 1200 x 630 Open Graph image also works for the large card because the ratio is effectively the same.",
        },
        {
            question: "Does X use og:image or twitter:image?",
            answer:
                "X prefers twitter:image when it is present and falls back to og:image otherwise. It is safest to provide both, pointing at the same file.",
        },
        {
            question: "What is the maximum file size for an X card image?",
            answer:
                "X documents a 5 MB limit. Keep the file under 1 MB for fast loading, and under 300 KB where the design allows. Smaller files fail less often in the timeline.",
        },
        {
            question: "Why is my Twitter card image cropped?",
            answer:
                "X uses a container close to 2:1 in some placements. A 1.91:1 image loses a few pixels at the top and bottom. Keep the headline and logo inside the middle 80 percent of the canvas.",
        },
        {
            question: "What is the difference between summary and summary_large_image?",
            answer:
                "summary shows a compact square image; summary_large_image shows a wide image above the title and description. Use the large card for articles, launches, and any page with a purpose-built 1.91:1 card.",
        },
        {
            question: "Do I need a separate image for X and Facebook?",
            answer:
                "Usually not. One 1200 x 630 file works for both. A separate asset is only worth it if you want X-specific copy or a different crop baked into the card.",
        },
        {
            question: "Why does my card show no image in a DM?",
            answer:
                "Some X clients do not render link cards in direct messages the same way as public posts. Test in the public composer first. If the card is correct there, the DM behaviour is a client limitation, not a tag problem.",
        },
        {
            question: "Can I use a GIF for a Twitter card?",
            answer:
                "X accepts GIFs for some card types, but support is inconsistent and the file is heavier. Use a static 1200 x 628 image for the card and let the destination page carry any animation.",
        },
    ],
    sources: [
        {
            label: "X: Cards markup",
            href: "https://developer.x.com/en/docs/x-for-websites/cards/overview/markup",
        },
        {
            label: "X: Summary card with large image",
            href: "https://developer.x.com/en/docs/x-for-websites/cards/guides/getting-started",
        },
        { label: "The Open Graph protocol", href: "https://ogp.me/" },
    ],
    related: ["open-graph-image-size", "open-graph-meta-tags", "og-image-not-showing"],
};
