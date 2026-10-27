import type { Guide } from "../types";

export const openGraphImageSize: Guide = {
    slug: "open-graph-image-size",
    title: "Open Graph image size: the 1200 x 630 guide",
    seoTitle: "OG Image Size: 1200x630 and Every Platform Size",
    description:
        "The complete Open Graph image size guide: 1200 x 630 for OG, 1200 x 628 for X, 1200 x 627 for LinkedIn, plus safe areas, file sizes, and crop behaviour.",
    category: "Sizes",
    published: "2026-10-21",
    updated: "2026-10-27",
    readingTime: 7,
    quickAnswer:
        "Use 1200 x 630 pixels for an Open Graph image. That is a 1.91:1 ratio and works for Facebook, LinkedIn, Slack, Discord, WhatsApp, and most other link previews. X's large card is usually listed as 1200 x 628 and LinkedIn as 1200 x 627; the difference is rounding, so the same 1200 x 630 file works everywhere. Keep the file under 1 MB and the important content inside the middle 80 percent.",
    keyFacts: [
        { label: "Open Graph", value: "1200 x 630 px" },
        { label: "Aspect ratio", value: "1.91:1" },
        { label: "X large card", value: "1200 x 628 px" },
        { label: "LinkedIn", value: "1200 x 627 px" },
        { label: "Safe file size", value: "Under 1 MB" },
        { label: "Edge padding", value: "At least 64 px" },
    ],
    sections: [
        {
            type: "p",
            lead: true,
            text: "There is no single official Open Graph image size. The protocol defines a tag, not a canvas. The 1200 x 630 number is a convention that grew around the 1.91:1 link card used by Facebook, LinkedIn, and most other platforms. It is the size that survives the most containers with the least cropping.",
        },
        {
            type: "h2",
            text: "Open Graph image sizes by platform",
        },
        {
            type: "table",
            head: ["Platform", "Recommended", "Ratio", "Notes"],
            rows: [
                ["Open Graph / Facebook", "1200 x 630", "1.91:1", "The baseline. A large card needs at least 600 x 315 to render sharply."],
                ["X large card", "1200 x 628", "1.91:1", "Displayed closer to 2:1 in some timelines; keep content centred."],
                ["X summary card", "400 x 400", "1:1", "A small square card. Use it only when you deliberately want the compact layout."],
                ["LinkedIn", "1200 x 627", "1.91:1", "Shared link previews. LinkedIn often places the image beside the copy."],
                ["Slack", "1200 x 630", "1.91:1", "Unfurls vary by client and workspace; smaller files load more reliably."],
                ["Discord", "1200 x 630", "1.91:1", "Large embeds crop toward 1.91:1; thumbnails are much smaller."],
                ["WhatsApp", "1200 x 630", "1.91:1", "Preview shape varies by client and platform. Keep the file small."],
                ["iMessage", "1200 x 630", "1.91:1", "Uses the Open Graph tags for the rich link card."],
                ["Telegram", "1200 x 630", "1.91:1", "Wide previews; refresh with the Webpage Bot when testing."],
                ["Google Discover", "1200 x 628", "1.91:1", "Google may use a page image when large previews are allowed."],
                ["Pinterest", "1000 x 1500", "2:3", "A pin is not an OG card. Make a separate vertical asset."],
                ["YouTube thumbnail", "1280 x 720", "16:9", "A different surface entirely. Do not reuse the OG crop."],
            ],
            caption:
                "Recommended sizes, not hard limits. Platforms change their containers without changing the Open Graph spec.",
        },
        {
            type: "p",
            text: "The three headline numbers people quote, 1200 x 630, 1200 x 628, and 1200 x 627, are all the same 1.91:1 shape with different rounding. A two- or three-pixel difference is invisible after compression. Do not maintain three files for the sake of matching a table.",
        },
        {
            type: "h2",
            text: "Why 1200 pixels wide is the sweet spot",
        },
        {
            type: "ul",
            items: [
                "**Wide enough for a headline.** At 1200 px, a 72 px headline has room for six to ten words without wrapping into a wall of text.",
                "**Large enough for retina displays.** A 1200 px file stays acceptable when the card is rendered at 600 CSS pixels wide on a 2x screen.",
                "**Small enough to load quickly.** A well-compressed 1200 x 630 JPG is usually 80-250 KB. That matters when a chat client fetches it on a phone.",
                "**Close to the most common crop.** The 1.91:1 shape is used by the largest number of surfaces, so it loses the least in the places that crop it differently.",
            ],
        },
        {
            type: "p",
            text: "While 1200 x 630 is enough for almost every case, exporting at 2400 x 1260 keeps more detail for high-density displays and gives you room to crop a square variant later. The trade-off is file size. If you go larger, compress it back down; a 2400 px PNG can easily cross 1 MB.",
        },
        {
            type: "h2",
            text: "The safe area that survives every crop",
        },
        {
            type: "p",
            text: "Platforms do not just scale your image. They crop it to fit their own container. X may show something closer to 2:1, a messaging client may show a square, and a dense feed may show a thumbnail the size of a postage stamp. Design for the smallest and most aggressive crop, not the widest one.",
        },
        {
            type: "table",
            head: ["Zone", "Pixels on a 1200 x 630 canvas", "What to put there"],
            rows: [
                ["Full canvas", "1200 x 630", "Background, texture, decoration"],
                ["Safe area", "1072 x 502 (64 px inset)", "Headline, logo, domain, any text that must survive"],
                ["Aggressive 2:1 crop", "1200 x 600, centred", "The headline and brand mark"],
                ["Square crop", "630 x 630, centred", "The single most important word or mark"],
                ["Thumbnail", "About 300 x 158", "One readable line, high contrast, no fine detail"],
            ],
            caption:
                "If the headline is unreadable at 300 px wide, it will be unreadable in a Slack sidebar or a dense feed.",
        },
        {
            type: "callout",
            tone: "tip",
            title: "The 64 px rule",
            text: "Keep every piece of type and every logo at least 64 px from the edge of a 1200 x 630 canvas. That single rule prevents most crop failures. For a serif or decorative face, use 80 px.",
        },
        {
            type: "h2",
            text: "File format and weight",
        },
        {
            type: "table",
            head: ["Format", "Best for", "Watch out for"],
            rows: [
                ["JPG", "Photographic backgrounds, gradients, screenshots", "Visible ringing around sharp type at low quality"],
                ["PNG", "Flat colour, logos, crisp text", "Large files on photographic backgrounds"],
                ["WebP", "Smaller files with good quality", "Older scrapers and some chat clients may not fetch it"],
                ["GIF", "Almost never", "Inconsistent support; animation is not part of the OG spec"],
                ["SVG", "Almost never", "Many social crawlers do not render it"],
            ],
        },
        {
            type: "ul",
            items: [
                "**Target under 1 MB.** Facebook and X accept larger files, but smaller images fail less often and load faster in chat clients.",
                "**Use sRGB.** CMYK files can shift colour or fail to render.",
                "**Avoid transparency.** Some platforms composite transparent PNGs onto black, others onto white. The result is unpredictable.",
                "**Do not upscale a small image.** A 600 px file stretched to 1200 px looks soft, and some platforms refuse to show a large card.",
                "**Export at 1x for most cards.** A 1200 x 630 file is already 2x for a 600 px card. Exporting at 3x is usually waste.",
            ],
        },
        {
            type: "h2",
            text: "Designing for the crop, not the canvas",
        },
        {
            type: "p",
            text: "The most common OG image mistake is treating the 1200 x 630 canvas as the final composition. It is not. It is the largest version of a composition that has to work at several sizes. Put the idea in the centre, keep the decoration at the edges, and test the result at 300 px wide before you publish.",
        },
        {
            type: "ol",
            items: [
                "Place the headline in the middle of the canvas, not against the left or right edge.",
                "Keep the logo inside the safe area. A corner mark is the first thing a square crop removes.",
                "Use one type size for the headline. A second, much smaller line can work as a kicker, but it will disappear in a thumbnail.",
                "Leave negative space. A card with one strong line and a lot of air reads better at small sizes than a dense layout.",
                "Check the card on a phone, in a chat app, and in a feed. Those are the places it will actually appear.",
            ],
        },
        {
            type: "h2",
            text: "Square, vertical, and story sizes",
        },
        {
            type: "p",
            text: "Not every surface wants a wide card. Pinterest pins are 2:3, Instagram stories are 9:16, and some messaging clients show a square. Those are separate assets, not different crops of the same file. If a channel matters to you, make a variant for it and point the platform's own image tag at that variant.",
        },
        {
            type: "table",
            head: ["Placement", "Size", "Ratio"],
            rows: [
                ["Instagram feed", "1080 x 1350", "4:5"],
                ["Instagram story / Reel cover", "1080 x 1920", "9:16"],
                ["Pinterest pin", "1000 x 1500", "2:3"],
                ["YouTube thumbnail", "1280 x 720", "16:9"],
                ["Square social post", "1080 x 1080", "1:1"],
                ["Open Graph / link card", "1200 x 630", "1.91:1"],
            ],
        },
        {
            type: "h2",
            text: "How to check your image size",
        },
        {
            type: "p",
            text: "In a browser, right-click the image and choose Inspect, or open the image URL in a new tab and read the dimensions in the title bar. On a Mac, Preview's Inspector shows the pixel size. On Windows, File Explorer's Details tab does the same. For a live page, the Facebook Sharing Debugger and LinkedIn Post Inspector show the scraped image URL and dimensions, which is the number that actually matters.",
        },
        {
            type: "callout",
            tone: "warning",
            title: "The tag and the file must agree",
            text: "If you declare `og:image:width` as 1200 but the file is 600 px wide, some platforms will lay out the card for a 1200 px image and then show a soft one. Set the width and height tags to the real pixel dimensions.",
        },
        {
            type: "links",
            title: "Related",
            items: [
                {
                    href: "/learn/what-is-an-open-graph-image",
                    label: "What is an Open Graph image?",
                    description: "The definition, the tags, and why the preview matters.",
                },
                {
                    href: "/learn/open-graph-meta-tags",
                    label: "Open Graph meta tags",
                    description: "The full tag reference with a copy-paste example.",
                },
                {
                    href: "/learn/twitter-card-image-size",
                    label: "Twitter card image size",
                    description: "X-specific sizes for summary and summary_large_image.",
                },
                {
                    href: "/template-gallery",
                    label: "1200 x 630 templates",
                    description: "Start from a layout that already respects the safe area.",
                },
            ],
        },
    ],
    faqs: [
        {
            question: "Is 1200 x 630 the same as 1.91:1?",
            answer:
                "Close enough. 1200 / 630 = 1.904, while 1.91:1 is 1.91. The difference is less than half a percent and is invisible after compression. If you want an exact 1.91:1 file, use 1200 x 628.",
        },
        {
            question: "What is the minimum Open Graph image size?",
            answer:
                "Aim for at least 600 x 315 for a large link card. Smaller images may still display, but they look soft and some platforms fall back to a compact layout. A 1200 x 630 file is the safest default.",
        },
        {
            question: "What is the maximum file size for an OG image?",
            answer:
                "Facebook accepts up to 8 MB and X up to 5 MB, but those are ceilings, not targets. Keep the file under 1 MB for fast loading and fewer scraper failures. Most well-compressed 1200 x 630 JPGs land between 80 and 250 KB.",
        },
        {
            question: "Should I use PNG or JPG for an Open Graph image?",
            answer:
                "Use JPG or WebP for photographic backgrounds, and PNG for flat colour, logos, and crisp type. If you are unsure, a high-quality JPG at 85 percent is a safe default. Keep the file under 1 MB.",
        },
        {
            question: "Why does X crop my 1200 x 630 image?",
            answer:
                "X's large card container is close to 2:1 in some placements, so a 1.91:1 image loses a few pixels at the top and bottom. Keep the headline and logo inside the middle 80 percent of the canvas and the crop will not matter.",
        },
        {
            question: "Do I need a separate image for LinkedIn?",
            answer:
                "Usually not. LinkedIn recommends 1200 x 627, which is the same 1.91:1 shape as 1200 x 630. Use one file and add `og:image` plus the image dimensions. A dedicated variant is only worth it if you want LinkedIn-specific copy baked into the card.",
        },
        {
            question: "What size is a Twitter card image?",
            answer:
                "For a summary_large_image card, 1200 x 628 with a 1.91:1 ratio. For a summary card, a square image around 400 x 400. X accepts JPG, PNG, WebP, and GIF, with a 5 MB limit.",
        },
        {
            question: "Can I use the same image for Open Graph and Twitter cards?",
            answer:
                "Yes. Point both og:image and twitter:image at the same 1200 x 630 file. The two tags exist because X gives twitter:* precedence, not because the image has to be different.",
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
            label: "LinkedIn: Link previews",
            href: "https://www.linkedin.com/help/linkedin/answer/a521928",
        },
        {
            label: "Google: Image previews",
            href: "https://developers.google.com/search/docs/appearance/google-images",
        },
    ],
    related: ["what-is-an-open-graph-image", "open-graph-meta-tags", "twitter-card-image-size"],
};
