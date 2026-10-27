import type { Guide } from "../types";

export const whatIsAnOpenGraphImage: Guide = {
    slug: "what-is-an-open-graph-image",
    title: "What is an Open Graph image?",
    seoTitle: "What Is an Open Graph Image? OG Image Explained",
    description:
        "An Open Graph image is the preview card shown when a link is shared. Learn what og:image does, why 1200 x 630 is the standard, and how to add it correctly.",
    category: "Fundamentals",
    published: "2026-10-20",
    updated: "2026-10-27",
    readingTime: 8,
    quickAnswer:
        "An Open Graph image is the picture that appears when a link is shared on social platforms, messaging apps, and some search surfaces. You declare it with the `og:image` meta tag in the page's `<head>`, usually at 1200 x 630 pixels with a 1.91:1 aspect ratio. It is a separate asset from the page's hero image unless you deliberately point the tag at the same file.",
    keyFacts: [
        { label: "Standard size", value: "1200 x 630 px (1.91:1)" },
        { label: "Defining tag", value: "`og:image` in the page head" },
        { label: "Formats", value: "JPG, PNG, or WebP" },
        { label: "Safe file size", value: "Under 1 MB" },
        { label: "Required OG tags", value: "title, type, image, url" },
        { label: "Absolute URL", value: "Required in practice" },
    ],
    sections: [
        {
            type: "p",
            lead: true,
            text: "An Open Graph image is the visual part of a link preview. When someone pastes your URL into LinkedIn, X, Slack, Discord, WhatsApp, or iMessage, the app reads the page's meta tags and builds a card: title, description, domain, and image. The image is the part people notice first, and it is the part most sites leave to chance.",
        },
        {
            type: "p",
            text: "The name comes from the [Open Graph protocol](https://ogp.me/), originally introduced by Facebook in 2010 and now read by most social and messaging platforms. Some articles write the phrase as one word, opengraph image; it describes the same asset. The protocol does not describe a design system. It describes a small set of metadata fields that tell a platform what to show when a URL is shared outside the browser.",
        },
        {
            type: "h2",
            text: "Where an Open Graph image appears",
        },
        {
            type: "p",
            text: "The same `og:image` can produce very different cards. Each platform picks its own container, crop, and text layout, which is why a design that looks correct on Facebook can lose its headline on X or Slack.",
        },
        {
            type: "table",
            head: ["Surface", "Typical card", "What it does with your image"],
            rows: [
                ["Facebook", "Large link card", "Crops to roughly 1.91:1; shows title, description, and domain"],
                ["LinkedIn", "Shared link card", "Crops to 1.91:1; often shows a smaller image beside the copy"],
                ["X", "`summary_large_image` card", "Crops toward 2:1 in some timelines; keeps the centre"],
                ["Slack", "Unfurl", "Shows a thumbnail or a large preview depending on the client and workspace"],
                ["Discord", "Embed", "Uses the image as the embed thumbnail; can show a large preview"],
                ["WhatsApp", "Link preview", "Small square or wide preview, depending on the client"],
                ["iMessage", "Rich link", "Wide preview with title and domain"],
                ["Google Discover", "Article card", "May use the page image when `max-image-preview:large` is allowed"],
            ],
            caption:
                "Platform behaviour changes. Treat this as a map of the containers, not a fixed specification.",
        },
        {
            type: "h2",
            text: "What the og:image tag actually does",
        },
        {
            type: "p",
            text: "The tag lives in the document head and points at an image URL. The platform fetches that URL independently when it builds the preview. That last detail explains most broken previews: the image has to be publicly reachable, not hidden behind a login, a local development host, or a signed URL that expires.",
        },
        {
            type: "code",
            language: "html",
            label: "A complete, copy-ready set",
            code: `<head>
  <meta property="og:title" content="A clearer way to ship" />
  <meta property="og:description" content="What changed, why it matters, and what to try first." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://example.com/blog/a-clearer-way-to-ship" />
  <meta property="og:site_name" content="Example" />
  <meta property="og:image" content="https://example.com/og/a-clearer-way-to-ship.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Dark card with the headline: A clearer way to ship" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="A clearer way to ship" />
  <meta name="twitter:description" content="What changed, why it matters, and what to try first." />
  <meta name="twitter:image" content="https://example.com/og/a-clearer-way-to-ship.png" />
  <meta name="twitter:image:alt" content="Dark card with the headline: A clearer way to ship" />
</head>`,
        },
        {
            type: "p",
            text: "The Open Graph protocol names four required properties: `og:title`, `og:type`, `og:image`, and `og:url`. `og:description` is optional in the specification but is used by nearly every platform, so leaving it out wastes the second most visible line in the card.",
        },
        {
            type: "table",
            head: ["Tag", "Required?", "What to put in it"],
            rows: [
                ["`og:title`", "Yes", "The headline people see. Keep it under about 60 characters."],
                ["`og:type`", "Yes", "`website`, `article`, `product`, `profile`, or another registered type."],
                ["`og:image`", "Yes", "An absolute URL to a public image, ideally 1200 x 630."],
                ["`og:url`", "Yes", "The canonical URL of the page, not the image URL."],
                ["`og:description`", "Recommended", "One or two sentences that add context to the headline."],
                ["`og:site_name`", "Recommended", "The publication or product name."],
                ["`og:image:width` / `height`", "Recommended", "The real pixel dimensions, so the platform can lay out the card before the image loads."],
                ["`og:image:alt`", "Recommended", "A literal description of the image for accessibility."],
                ["`og:locale`", "Optional", "`en_US` and similar. Useful on multilingual sites."],
            ],
        },
        {
            type: "callout",
            tone: "warning",
            title: "og:url is not the image URL",
            text: "A surprising number of pages set `og:url` to their homepage on every article, or set `og:image` to a relative path such as `/og.png`. Platforms resolve relative paths inconsistently. Use absolute HTTPS URLs for both.",
        },
        {
            type: "h2",
            text: "Open Graph image vs. the image on your page",
        },
        {
            type: "p",
            text: "The `og:image` does not have to be the hero image, the first image in the article, or even an image that appears on the page. In fact, a purpose-built card is usually better: it can carry the headline, the brand mark, and a single supporting idea without inheriting the page's layout.",
        },
        {
            type: "table",
            head: ["Asset", "Job", "Typical size"],
            rows: [
                ["Page hero", "Sets the scene inside the page", "Varies; often 1600 px wide or more"],
                ["Open Graph image", "Sells the link in a feed or chat", "1200 x 630"],
                ["Twitter card image", "Sells the link on X", "1200 x 628 or the same 1200 x 630 file"],
                ["Favicon", "Identifies the tab", "32 x 32 and up"],
                ["App icon", "Identifies an installed app", "192 x 192 and 512 x 512"],
            ],
        },
        {
            type: "p",
            text: "The exception is a page whose hero is already a well-composed 1.91:1 card with readable type. In that case, pointing `og:image` at it saves an asset. Just check the crop at small sizes before you ship.",
        },
        {
            type: "h2",
            text: "Why 1200 x 630 is the standard",
        },
        {
            type: "p",
            text: "1200 x 630 is 1.904:1, close to the 1.91:1 ratio that Facebook, LinkedIn, and several other platforms use for large link cards. It is wide enough to hold a headline and a brand mark, large enough to stay sharp on high-density displays, and small enough to load quickly. X's large card is often described as 1200 x 628; the two-pixel difference does not matter in practice.",
        },
        {
            type: "p",
            text: "The ratio matters more than the exact dimensions. A 2400 x 1260 image has the same shape and twice the pixels. A 1200 x 1200 square does not: platforms will crop it, usually from the centre, and any text near the top or bottom can disappear. If you need one asset for every surface, design at 1200 x 630 and keep the important content inside the middle 80 percent.",
        },
        {
            type: "callout",
            tone: "tip",
            title: "A safe area that travels well",
            text: "Keep the headline and logo at least 64 px from every edge. Keep text inside a centred 1000 x 500 region. That survives a 2:1 crop on X, a square crop in a messaging app, and a small thumbnail in a dense feed.",
        },
        {
            type: "h2",
            text: "What makes an Open Graph image work",
        },
        {
            type: "ul",
            items: [
                "**One idea.** A headline of six to ten words beats a paragraph. The card is a billboard, not a summary.",
                "**Type you can read at 300 px wide.** If the headline disappears in a Slack thumbnail, it is too small.",
                "**High contrast.** Dark type on a light field or light type on a dark field. Avoid mid-tone gradients behind body text.",
                "**A visible brand mark.** The logo or domain tells people where the link goes before they read the title.",
                "**Deliberate spacing.** Text near an edge is the first thing a crop removes.",
                "**A file under 1 MB.** Smaller images load faster and fail less often. JPG or WebP is usually enough; use PNG when you need crisp flat colour.",
            ],
        },
        {
            type: "p",
            text: "The best cards are not always the most decorative. A solid background, one strong line of type, and a logo can outperform a busy illustration because it survives every container. If you want a system rather than one-off cards, start with a template and change the words, not the layout.",
        },
        {
            type: "h2",
            text: "How to add an Open Graph image to a page",
        },
        {
            type: "ol",
            items: [
                "**Make the image.** Use a template or a blank 1200 x 630 canvas. Export a JPG, PNG, or WebP under 1 MB.",
                "**Upload it to a public URL.** It must return HTTP 200 without a login. Do not use a local path or a data URL.",
                "**Add the tags to the head.** At minimum `og:title`, `og:type`, `og:image`, and `og:url`. Add the image dimensions and alt text.",
                "**Add X card tags if you want control there.** `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image`.",
                "**Fetch the page as a crawler.** Confirm the tags are in the server-rendered HTML, not injected only after JavaScript runs.",
                "**Test with each platform's debugger.** Refresh the cache after changing an image at the same URL.",
            ],
        },
        {
            type: "p",
            text: "If you use a framework, the mechanics are the same; only the file changes. Next.js exposes the tags through its metadata API, WordPress plugins write them for you, and static HTML needs them written by hand. The [Open Graph meta tags guide](/learn/open-graph-meta-tags) has a tag-by-tag reference, and the [Next.js guide](/learn/nextjs-open-graph-image) shows the App Router version.",
        },
        {
            type: "h2",
            text: "How to test an Open Graph image",
        },
        {
            type: "ul",
            items: [
                "**Facebook Sharing Debugger** shows the scraped tags and lets you re-scrape a URL. It is the most useful single check because it exposes exactly what the crawler sees.",
                "**LinkedIn Post Inspector** does the same for LinkedIn and reveals cache state.",
                "**X composer preview** is the practical check. Paste the URL into a draft post and look at the card before publishing.",
                "**Slack and Discord** refetch when you paste the URL again. If the old card persists, change the image filename or append a version query string.",
                "**Your own browser** is not a test. A page can look fine to you and still serve different tags to a crawler, especially when the tags are injected client-side.",
            ],
        },
        {
            type: "callout",
            tone: "warning",
            title: "Caching is the most common false alarm",
            text: "Platforms cache previews by URL, sometimes for weeks. If you replaced the image but kept the same path, the old card can survive long after the file changed. Publish the new image under a new filename and update `og:image`, or force a re-scrape in the platform's debugger.",
        },
        {
            type: "h2",
            text: "Common mistakes",
        },
        {
            type: "ul",
            items: [
                "Using a relative image path, or a URL that only works on your local machine.",
                "Pointing `og:image` at a page instead of an image file.",
                "Serving an image behind authentication, hotlink protection, or a CDN rule that blocks social crawlers.",
                "Letting a CMS plugin and hand-written tags both emit `og:image`, so the platform picks the wrong one.",
                "Injecting the tags with client-side JavaScript only. Many crawlers do not run your app.",
                "Using a square image and losing the headline to a centre crop.",
                "Setting the image to 1200 x 630 in the tag but serving a 600 x 315 file, which looks soft on retina displays.",
                "Forgetting `og:url`, so shares of syndicated copies all point at the original page.",
            ],
        },
        {
            type: "h2",
            text: "Do Open Graph images affect Google rankings?",
        },
        {
            type: "p",
            text: "Not directly. Google has said Open Graph metadata is not a ranking signal, and Google's rich results use schema.org structured data rather than Open Graph. What Open Graph images do affect is how a link looks when it is shared: a clear card earns more clicks, and more clicks from real people can lead to more links and more discovery. That is an indirect effect, not a ranking switch.",
        },
        {
            type: "p",
            text: "There is one Google surface worth knowing about: Discover. Google may use a page's image for Discover cards, and allowing large image previews with `max-image-preview:large` keeps that option open. That is a different mechanism from `og:image`, but the same design rules apply: a clean, wide, high-contrast image with a readable subject.",
        },
        {
            type: "links",
            title: "Keep going",
            items: [
                {
                    href: "/learn/open-graph-image-size",
                    label: "OG image size guide",
                    description: "1200 x 630 plus every platform dimension in one table.",
                },
                {
                    href: "/learn/open-graph-meta-tags",
                    label: "Open Graph meta tags",
                    description: "Every tag, what it does, and a copy-paste example.",
                },
                {
                    href: "/learn/how-to-create-an-open-graph-image",
                    label: "How to create an OG image",
                    description: "The full workflow, from headline to cache refresh.",
                },
                {
                    href: "/studio",
                    label: "Make one in the browser",
                    description: "Free canvas, 45 templates, no account, no upload.",
                },
            ],
        },
    ],
    faqs: [
        {
            question: "Is an Open Graph image the same as a social preview image?",
            answer:
                "Yes, in everyday use. A social preview image, link preview image, and OG image all describe the picture declared by og:image. Twitter card images are the same idea with a different tag set.",
        },
        {
            question: "What size should an Open Graph image be?",
            answer:
                "Use 1200 x 630 pixels with a 1.91:1 aspect ratio. It is the safest common shape for Facebook, LinkedIn, X, Slack, Discord, and messaging apps. Keep the important content inside the middle 80 percent so crops do not remove it.",
        },
        {
            question: "Does the image have to be exactly 1200 x 630?",
            answer:
                "No. The ratio matters more than the exact pixels. Any 1.91:1 image works, including 2400 x 1260 for extra sharpness. Avoid square or very tall images unless you are targeting a platform that specifically uses that shape.",
        },
        {
            question: "Can I use a JPG instead of a PNG?",
            answer:
                "Yes. JPG, PNG, and WebP are all widely accepted. JPG and WebP produce smaller files for photographic backgrounds; PNG is better for flat colour and crisp type. Keep the file under 1 MB where you can.",
        },
        {
            question: "Why is my Open Graph image not showing?",
            answer:
                "The most common causes are a relative image URL, an image that returns a 404, tags injected only by client-side JavaScript, a conflicting second og:image from a plugin, or a cached preview. Start with the troubleshooting checklist and verify the raw HTML first.",
        },
        {
            question: "Does Google use Open Graph images for search results?",
            answer:
                "Google does not use Open Graph for ranking and uses schema.org for most rich results. Some Google surfaces, including Discover, may use a page image, so it is still worth providing a clean, large, high-contrast asset.",
        },
        {
            question: "Do I need separate tags for X (Twitter)?",
            answer:
                "X can fall back to Open Graph, but the twitter:* tags give you control over the card type, title, description, and image. If you care about how the link looks on X, add twitter:card and twitter:image at minimum.",
        },
        {
            question: "Can an Open Graph image be a GIF or a video?",
            answer:
                "The Open Graph protocol is built around images. Some platforms support animated GIFs or video previews, but support is inconsistent. Use a static image for the preview and let the destination page carry the motion.",
        },
    ],
    sources: [
        { label: "The Open Graph protocol (ogp.me)", href: "https://ogp.me/" },
        {
            label: "Meta: Webmasters guide to sharing",
            href: "https://developers.facebook.com/docs/sharing/webmasters/",
        },
        {
            label: "X: Cards markup and required tags",
            href: "https://developer.x.com/en/docs/x-for-websites/cards/overview/markup",
        },
        {
            label: "LinkedIn: Share on LinkedIn overview",
            href: "https://www.linkedin.com/help/linkedin/answer/a521928",
        },
        {
            label: "Google: Image previews and max-image-preview",
            href: "https://developers.google.com/search/docs/appearance/google-images",
        },
    ],
    related: ["open-graph-image-size", "open-graph-meta-tags", "how-to-create-an-open-graph-image"],
};
