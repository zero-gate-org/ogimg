import type { Guide } from "../types";

export const openGraphImageBestPractices: Guide = {
    slug: "open-graph-image-best-practices",
    title: "Open Graph image best practices that survive every feed",
    seoTitle: "OG Image Best Practices That Improve Click-Through",
    description:
        "Practical Open Graph image best practices: type sizes that survive thumbnails, safe areas for aggressive crops, contrast, file weight, and a repeatable card system.",
    category: "Design",
    published: "2026-10-23",
    updated: "2026-10-27",
    readingTime: 7,
    quickAnswer:
        "Use 1200 x 630 pixels, one six-to-ten-word headline, a brand mark inside the central safe area, and high contrast. Keep type at least 64 px from every edge, set the headline around 72-96 px, and export a file under 1 MB. Make the card readable at 300 px wide, test the real crop on X and in a messaging app, and change the image filename when you update the design so caches refresh.",
    keyFacts: [
        { label: "Canvas", value: "1200 x 630 px" },
        { label: "Headline size", value: "72-96 px at 1200 px wide" },
        { label: "Safe padding", value: "64 px minimum" },
        { label: "Words", value: "6-10" },
        { label: "File weight", value: "Under 1 MB" },
        { label: "Thumbnail test", value: "Readable at 300 px wide" },
    ],
    sections: [
        {
            type: "p",
            lead: true,
            text: "Most OG image advice stops at \"use 1200 x 630\". The size is the easy part. The harder part is making a card that still works when a platform crops it, shrinks it, and places it next to a dozen competing links. These are the rules that hold up across those containers.",
        },
        {
            type: "h2",
            text: "Start with the thumbnail, not the canvas",
        },
        {
            type: "p",
            text: "The card you design at 1200 px wide will often be seen at 300 px or smaller. Open your canvas, zoom out to roughly the width of a phone thumbnail, and judge it there. If the headline is not readable and the brand is not recognisable, the card is not finished, no matter how good it looks at full size.",
        },
        {
            type: "callout",
            tone: "tip",
            title: "The three-second test",
            text: "Show the card to someone for three seconds, then hide it. Ask what the link is about and who published it. If they cannot answer both, the hierarchy is wrong.",
        },
        {
            type: "h2",
            text: "One idea, six to ten words",
        },
        {
            type: "p",
            text: "A card is a billboard. The headline should name the specific thing and give one reason to care. \"How we cut build times by 40 percent\" works. \"Introducing our new platform for modern teams\" does not, because it could describe a thousand companies.",
        },
        {
            type: "table",
            head: ["Weak headline", "Why it fails", "Stronger version"],
            rows: [
                ["Introducing our new platform", "No specific noun, no outcome", "Ship previews in 90 seconds"],
                ["A better way to work", "Could be any product", "One canvas for every social size"],
                ["Blog post", "A label, not an idea", "Why your OG image is being cropped"],
                ["We raised a round", "News without a reason to click", "What we are building with the new funding"],
                ["New features", "Too broad to picture", "Brand kits, now in the free canvas"],
            ],
        },
        {
            type: "p",
            text: "If the headline needs a second sentence to make sense, the card needs a smaller idea, not smaller type. The description below the card carries the context. The image carries the hook.",
        },
        {
            type: "h2",
            text: "Type sizes that survive a crop",
        },
        {
            type: "p",
            text: "At 1200 x 630, a headline between 72 and 96 px is a reliable starting range. A single line at 88 px fits roughly 18-22 characters; two lines at 72 px fit more. Anything below 48 px starts to disappear in a Slack sidebar. Anything above 110 px usually forces an awkward line break that loses the point.",
        },
        {
            type: "ul",
            items: [
                "**Headline:** 72-96 px, 1.02-1.1 line height, tight tracking (-0.02 to -0.04 em).",
                "**Kicker or label:** 22-28 px, uppercase, generous tracking. It is secondary; do not let it compete.",
                "**Domain or wordmark:** 24-32 px. Keep it inside the safe area, not in a corner.",
                "**Body copy:** avoid it. A card is not a slide. If you need a sentence, use the `og:description`.",
            ],
        },
        {
            type: "p",
            text: "Line height matters as much as size. Display type set at 1.4 leading looks loose and pushes the block into the crop. Set it between 1.0 and 1.1, and use `text-wrap: balance` where you can so the lines break evenly.",
        },
        {
            type: "h2",
            text: "Design for the aggressive crop",
        },
        {
            type: "p",
            text: "Every platform uses its own container. A 1.91:1 card may be shown closer to 2:1, cropped to a square in a messaging app, or reduced to a thumbnail in a dense feed. Keep the meaning in the centre and treat the edges as decoration.",
        },
        {
            type: "template",
            templateId: "centered-container",
            alt: "A centred Open Graph card with a short headline, a rule, and a small wordmark",
            caption:
                "A centred composition survives a 2:1 or square crop because the meaning never sits near an edge.",
        },
        {
            type: "ul",
            items: [
                "Keep type and the logo at least 64 px from every edge. Use 80 px for serif or decorative faces.",
                "Put the headline in the middle 80 percent of the canvas, not against the left or right edge.",
                "Avoid corner marks, corner text, and decorative elements that carry meaning.",
                "Repeat the test with a square crop. If a square removes the point, move the content inward.",
            ],
        },
        {
            type: "h2",
            text: "Contrast beats decoration",
        },
        {
            type: "p",
            text: "The most common legibility failure is mid-tone type on a mid-tone gradient. Light type on a dark field or dark type on a light field is more reliable. If the background is a photograph, add a scrim or place the type in a solid panel; do not rely on the photo being dark where the text lands.",
        },
        {
            type: "table",
            head: ["Combination", "Works?", "Why"],
            rows: [
                ["White on #0A0A0A", "Yes", "Very high contrast, stable at small sizes"],
                ["Black on #FAFAFA", "Yes", "The light counterpart; good for editorial cards"],
                ["White on a bright photo", "No", "The photo's highlights will swallow the type"],
                ["Grey on a coloured gradient", "Risky", "Contrast changes across the canvas"],
                ["White on a dark photo with a 40% scrim", "Yes", "The scrim stabilises the value behind the type"],
                ["Thin light type on a pastel field", "No", "Low contrast and thin strokes disappear first"],
            ],
        },
        {
            type: "p",
            text: "Aim for a contrast ratio of at least 4.5:1 for body-sized text and 3:1 for large display type. You do not need a calculator for every card, but if you squint and the type fades into the background, it will fail in a feed.",
        },
        {
            type: "h2",
            text: "Make the brand recognisable, not loud",
        },
        {
            type: "p",
            text: "The brand mark tells people where the link goes before they read the title. A wordmark or domain line is usually enough. A full logo lockup can work if it stays legible at 300 px, but a detailed symbol often turns into a smudge. Keep the mark in the same place across cards so a series feels like a series.",
        },
        {
            type: "template",
            templateId: "editorial-pixel",
            alt: "An editorial Open Graph card with a flush-left headline, a small wordmark, and a pixel grid",
            caption:
                "A small, consistent wordmark and a generous type block make a card feel like part of a publication, not a one-off graphic.",
        },
        {
            type: "h2",
            text: "Build a system, not a pile of one-offs",
        },
        {
            type: "p",
            text: "If you publish more than a few times a month, consistency is a ranking asset in its own right: people start to recognise the card before they read the headline. Pick one layout per content type, then vary only the headline, the label, and the image. That is what a template does well.",
        },
        {
            type: "ul",
            items: [
                "**One layout per content type.** Blog posts, launches, changelogs, and episodes can each have a fixed composition.",
                "**One typeface pairing.** A display face for the headline and a neutral sans for the small line. More than two faces looks like a poster.",
                "**One accent rule.** A single colour, gradient, or texture that appears across the series.",
                "**A fixed wordmark position.** Same place, same size, every card.",
                "**A versioned filename.** `card.png` becomes `card-v2.png` when the design changes, so caches refresh.",
            ],
        },
        {
            type: "h2",
            text: "File weight and format",
        },
        {
            type: "p",
            text: "The card is fetched by a scraper, often on a phone, often while the reader is in a chat app. A 2 MB PNG is a liability. Target under 1 MB, and under 300 KB when you can. JPG at 85 percent or WebP at 80 percent is usually indistinguishable from PNG for a card with a photographic background. Use PNG when the design is flat colour and sharp type.",
        },
        {
            type: "callout",
            tone: "warning",
            title: "Do not ship a transparent PNG",
            text: "Transparency is composited differently by different platforms. A card that looks correct on a dark background can appear on white, or the other way around. Export a solid background.",
        },
        {
            type: "h2",
            text: "Write alt text as if the image were missing",
        },
        {
            type: "p",
            text: "`og:image:alt` and `twitter:image:alt` describe the image for people who cannot see it. Do not repeat the headline verbatim and do not stuff keywords. Describe what is visible: \"Dark card with the headline 'Ship previews in 90 seconds' and the ogimg.in wordmark\". That is also the text some platforms show when the image fails to load.",
        },
        {
            type: "h2",
            text: "A pre-publish checklist",
        },
        {
            type: "ul",
            items: [
                "1200 x 630, 1.91:1, with the important content inside the middle 80 percent.",
                "One headline of six to ten words, readable at 300 px wide.",
                "High contrast between type and background; no mid-tone gradients behind text.",
                "Brand mark inside the safe area, same position as the rest of the series.",
                "Solid background, sRGB, JPG/PNG/WebP, under 1 MB.",
                "Absolute HTTPS image URL that returns 200 without a login.",
                "`og:image:width` and `og:image:height` match the real file.",
                "`og:image:alt` describes the image literally.",
                "Facebook, LinkedIn, X, Slack, and Discord previews checked.",
                "New filename if the design changed, so the cache refreshes.",
            ],
        },
        {
            type: "links",
            title: "Related",
            items: [
                {
                    href: "/learn/open-graph-image-size",
                    label: "OG image size guide",
                    description: "The full platform table and safe-area measurements.",
                },
                {
                    href: "/learn/open-graph-image-examples",
                    label: "OG image examples",
                    description: "Annotated cards you can open and edit.",
                },
                {
                    href: "/learn/og-image-not-showing",
                    label: "OG image not showing?",
                    description: "The technical checklist for broken previews.",
                },
                {
                    href: "/template-gallery",
                    label: "Template gallery",
                    description: "Layouts that already follow these rules.",
                },
            ],
        },
    ],
    faqs: [
        {
            question: "What is the best font size for an Open Graph image?",
            answer:
                "Start with a 72-96 px headline on a 1200 x 630 canvas, with a line height around 1.02-1.1. Keep secondary labels at 22-28 px and the wordmark at 24-32 px. Check the card at 300 px wide before exporting.",
        },
        {
            question: "How much text should an OG image have?",
            answer:
                "One headline of six to ten words, plus a small label or wordmark. A card is a billboard, not a summary. Put the supporting sentence in og:description, where the platform can render it as text.",
        },
        {
            question: "Should I put my logo on an OG image?",
            answer:
                "Yes, a wordmark or domain line is enough. Keep it inside the safe area and in the same place across your cards. A detailed logo can turn into a smudge at thumbnail size.",
        },
        {
            question: "Is a dark or light OG image better?",
            answer:
                "Neither is universally better. Pick the one that matches your brand and gives the strongest contrast. Dark cards tend to stand out in light feeds; light cards tend to stand out in dark feeds. Test in the actual surface where your audience sees the link.",
        },
        {
            question: "What file size should an OG image be?",
            answer:
                "Under 1 MB, ideally under 300 KB. Facebook accepts up to 8 MB and X up to 5 MB, but smaller files load faster and fail less often in chat clients and scrapers.",
        },
        {
            question: "Should I use the same OG image for every post?",
            answer:
                "Use the same layout and brand system, but change the headline for each page. A generic card wastes the chance to say something specific; a completely different design for every post loses recognition.",
        },
        {
            question: "How do I stop platforms from cropping my OG image?",
            answer:
                "You cannot control the container. Design for the crop instead: keep the meaning in the centre, keep text at least 64 px from the edges, and test a square crop as well as the wide card.",
        },
        {
            question: "Does a better OG image improve SEO?",
            answer:
                "Not directly. Open Graph images are not a Google ranking factor. They improve click-through when the link is shared, which can lead to more traffic, links, and discovery. Treat them as a distribution asset, not a ranking switch.",
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
        {
            label: "W3C: Web Content Accessibility Guidelines, contrast",
            href: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html",
        },
    ],
    related: ["open-graph-image-size", "open-graph-image-examples", "how-to-create-an-open-graph-image"],
};
