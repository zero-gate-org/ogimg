import type { Guide } from "../types";

export const openGraphMetaTags: Guide = {
    slug: "open-graph-meta-tags",
    title: "Open Graph meta tags: the complete reference",
    seoTitle: "Open Graph Meta Tags: Copy-Paste Examples",
    description:
        "Every Open Graph meta tag, what it does, and a copy-paste example. Includes the minimum viable set, Twitter card tags, and the mistakes that break previews.",
    category: "Implementation",
    published: "2026-10-21",
    updated: "2026-10-27",
    readingTime: 9,
    quickAnswer:
        "Open Graph meta tags go in the page's `<head>` and describe how a link should look when shared. The minimum viable set is `og:title`, `og:type`, `og:image`, and `og:url`; add `og:description`, `og:site_name`, `og:image:width`, `og:image:height`, and `og:image:alt`. Use absolute HTTPS URLs, serve the tags in the initial HTML, and add `twitter:card` plus `twitter:image` for X.",
    keyFacts: [
        { label: "Placement", value: "Inside `<head>`" },
        { label: "Required", value: "title, type, image, url" },
        { label: "Image URL", value: "Absolute, public, HTTPS" },
        { label: "Image size", value: "1200 x 630 px" },
        { label: "X card tag", value: "`twitter:card`" },
        { label: "Validation", value: "Facebook Debugger, LinkedIn Inspector" },
    ],
    sections: [
        {
            type: "p",
            lead: true,
            text: "Open Graph tags are ordinary `<meta>` elements. They do not change the page, they do not appear in the browser, and they do not need JavaScript. Their only job is to give a scraper a clean description of the page so it can build a link preview without guessing.",
        },
        {
            type: "p",
            text: "That simplicity is why the mistakes are so repetitive. A tag in the wrong place, a relative image path, or a second set of tags from a plugin can break the preview while the page itself looks perfect. This reference covers the tags worth using, the order to add them in, and the checks that catch the failures.",
        },
        {
            type: "h2",
            text: "The minimum viable set",
        },
        {
            type: "code",
            language: "html",
            label: "Four tags that make a valid preview",
            code: `<meta property="og:title" content="A clearer way to ship" />
<meta property="og:type" content="article" />
<meta property="og:image" content="https://example.com/og/a-clearer-way-to-ship.png" />
<meta property="og:url" content="https://example.com/blog/a-clearer-way-to-ship" />`,
        },
        {
            type: "p",
            text: "Those four are the properties the Open Graph protocol lists as required. In practice, a card without `og:description` looks unfinished, and a card without image dimensions can jump while it loads. The recommended set is longer, and it is worth using.",
        },
        {
            type: "code",
            language: "html",
            label: "The full set for a page",
            code: `<meta property="og:title" content="A clearer way to ship" />
<meta property="og:description" content="What changed, why it matters, and what to try first." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://example.com/blog/a-clearer-way-to-ship" />
<meta property="og:site_name" content="Example" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="https://example.com/og/a-clearer-way-to-ship.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Dark card with the headline: A clearer way to ship" />
<meta property="og:image:type" content="image/png" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="A clearer way to ship" />
<meta name="twitter:description" content="What changed, why it matters, and what to try first." />
<meta name="twitter:image" content="https://example.com/og/a-clearer-way-to-ship.png" />
<meta name="twitter:image:alt" content="Dark card with the headline: A clearer way to ship" />
<meta name="twitter:site" content="@yourhandle" />`,
        },
        {
            type: "h2",
            text: "Every tag, and when to use it",
        },
        {
            type: "table",
            head: ["Tag", "Required", "What it does", "Practical rule"],
            rows: [
                ["`og:title`", "Yes", "The card headline", "Keep it under about 60 characters; do not duplicate the site name"],
                ["`og:type`", "Yes", "The kind of object", "`website` for home pages, `article` for posts, `product` for products"],
                ["`og:image`", "Yes", "The preview image", "Absolute HTTPS URL, 1200 x 630, public, under 1 MB"],
                ["`og:url`", "Yes", "The canonical page URL", "The page, not the image; use the canonical URL"],
                ["`og:description`", "Recommended", "The supporting line", "One or two sentences, about 100-160 characters"],
                ["`og:site_name`", "Recommended", "The publication name", "The brand, not the page title"],
                ["`og:locale`", "Optional", "The content locale", "`en_US`, `en_GB`, `de_DE`; useful on multilingual sites"],
                ["`og:image:width`", "Recommended", "Image width in pixels", "Must match the real file"],
                ["`og:image:height`", "Recommended", "Image height in pixels", "Must match the real file"],
                ["`og:image:alt`", "Recommended", "Image description", "Describe the image literally; do not repeat the title"],
                ["`og:image:type`", "Optional", "MIME type", "`image/png`, `image/jpeg`, `image/webp`"],
                ["`og:image:secure_url`", "Optional", "HTTPS image URL", "Only needed when the image URL differs from `og:image`"],
                ["`og:video`", "Optional", "Video URL", "Rarely useful for link cards; check platform support"],
                ["`og:audio`", "Optional", "Audio URL", "Rarely used by modern platforms"],
                ["`article:published_time`", "Optional", "Publication date", "ISO 8601; helps some readers and crawlers"],
                ["`article:modified_time`", "Optional", "Last update", "ISO 8601"],
                ["`article:author`", "Optional", "Author profile", "A URL, not a name"],
                ["`article:section`", "Optional", "Article section", "A short category label"],
                ["`article:tag`", "Optional", "Article tags", "One tag per meta element"],
            ],
        },
        {
            type: "callout",
            tone: "warning",
            title: "Property, not name",
            text: "Open Graph tags use `property=\"og:...\"`. Twitter tags use `name=\"twitter:...\"`. Mixing the two attributes is a common copy-paste error and some scrapers will ignore the tag.",
        },
        {
            type: "h2",
            text: "The Twitter card tags",
        },
        {
            type: "p",
            text: "X reads Open Graph tags as a fallback, but the `twitter:*` tags take precedence and control the card type. If you care about how the link looks on X, add them rather than relying on the fallback.",
        },
        {
            type: "table",
            head: ["Tag", "What it does", "Common values"],
            rows: [
                ["`twitter:card`", "Selects the card layout", "`summary_large_image` or `summary`"],
                ["`twitter:title`", "Card headline", "Usually the same as `og:title`"],
                ["`twitter:description`", "Card description", "Usually the same as `og:description`"],
                ["`twitter:image`", "Card image", "1200 x 628 or the same 1200 x 630 file"],
                ["`twitter:image:alt`", "Image description", "Literal description for accessibility"],
                ["`twitter:site`", "The site's X handle", "`@yourhandle`"],
                ["`twitter:creator`", "The author's X handle", "`@authorhandle`"],
            ],
        },
        {
            type: "p",
            text: "Use `summary_large_image` when you have a purpose-built 1.91:1 card. Use `summary` when you want the compact square layout, which is more common for a profile or a small utility page. X's [card markup reference](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup) is the source of truth for the current tags.",
        },
        {
            type: "h2",
            text: "Where the tags go, and why order matters",
        },
        {
            type: "p",
            text: "Put the tags inside `<head>`, before the closing `</head>`. Order among the meta tags does not matter to the protocol, with one exception: if the same property appears more than once, scrapers typically use the first or the last value depending on the platform. That ambiguity is the problem. There should be exactly one `og:image` per page unless you are deliberately providing multiple images and have checked the platform's behaviour.",
        },
        {
            type: "code",
            language: "html",
            label: "The shape of a document",
            code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>A clearer way to ship</title>
    <meta name="description" content="What changed, why it matters, and what to try first." />

    <!-- Open Graph -->
    <meta property="og:title" content="A clearer way to ship" />
    <meta property="og:description" content="What changed, why it matters, and what to try first." />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://example.com/blog/a-clearer-way-to-ship" />
    <meta property="og:image" content="https://example.com/og/a-clearer-way-to-ship.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://example.com/og/a-clearer-way-to-ship.png" />

    <link rel="canonical" href="https://example.com/blog/a-clearer-way-to-ship" />
  </head>
  <body>
    ...
  </body>
</html>`,
        },
        {
            type: "p",
            text: "Keep `og:url` and the canonical link in sync. They do different jobs, but a mismatch tells the platform that the preview belongs to one URL while search engines treat another as canonical. On a site with query parameters, tracking links, or syndicated copies, that mismatch is common and easy to miss.",
        },
        {
            type: "h2",
            text: "Absolute URLs are not optional",
        },
        {
            type: "p",
            text: "The scraper fetches the image from outside your page. It has no reliable way to resolve `/og.png` against your domain, and different platforms handle the ambiguity differently. Always write the full URL, including the protocol and host:",
        },
        {
            type: "code",
            language: "html",
            label: "Do this",
            code: `<meta property="og:image" content="https://example.com/og/card.png" />`,
        },
        {
            type: "code",
            language: "html",
            label: "Not this",
            code: `<meta property="og:image" content="/og/card.png" />
<meta property="og:image" content="http://localhost:3000/og/card.png" />
<meta property="og:image" content="https://example.com/api/image?id=123" />`,
        },
        {
            type: "p",
            text: "The last example is not always wrong, but it is risky. If the endpoint requires a session, rate-limits requests, or returns a redirect chain, the scraper may fail. A static file or a stable public image endpoint is more reliable.",
        },
        {
            type: "h2",
            text: "The mistakes that break previews",
        },
        {
            type: "ul",
            items: [
                "**Tags injected only by JavaScript.** Many social crawlers do not execute your app. Server-render the tags or use your framework's metadata API.",
                "**Duplicate tags.** A CMS plugin and a hand-written set can both emit `og:image`, and the platform may pick the wrong one. Pick one source of truth.",
                "**A 404 or hotlink-protected image.** The page can be fine while the image is blocked by a CDN rule, an authentication wall, or a referrer policy.",
                "**A relative image URL.** Use the full HTTPS URL.",
                "**A mismatch between declared and actual dimensions.** Set `og:image:width` and `height` to the real numbers.",
                "**A square image in a wide card.** The platform crops it and removes the headline. Design at 1.91:1.",
                "**A stale cache.** Replacing the file at the same URL does not refresh the preview. Change the filename or force a re-scrape.",
                "**Tags in the body.** Some scrapers ignore them. Keep them in the head.",
                "**A missing `og:url` on filtered or paginated pages.** The preview may point at the wrong canonical.",
            ],
        },
        {
            type: "callout",
            tone: "tip",
            title: "One source of truth",
            text: "Decide whether your framework, your CMS plugin, or your hand-written code owns the meta tags. If more than one layer emits Open Graph tags, you will eventually ship a page with two different images and no obvious way to tell which one a platform chose.",
        },
        {
            type: "h2",
            text: "How to validate the tags",
        },
        {
            type: "ol",
            items: [
                "**View the page source.** Confirm the tags are in the initial HTML response, not only in the DOM after hydration.",
                "**Fetch the image URL directly.** It should return 200, the right content type, and the dimensions you declared.",
                "**Use the Facebook Sharing Debugger.** It shows the scraped tags, the image, and any warnings, and it can force a re-scrape.",
                "**Use the LinkedIn Post Inspector.** It shows the preview and cache state for LinkedIn.",
                "**Paste the URL into an X draft.** The composer preview is the practical test for the card X will show.",
                "**Re-paste in Slack and Discord.** Both cache; a new query string or filename forces a fresh fetch.",
            ],
        },
        {
            type: "h2",
            text: "Framework notes",
        },
        {
            type: "ul",
            items: [
                "**Next.js App Router:** export a `metadata` object or `generateMetadata` from the page. Set `metadataBase` so relative image paths resolve to absolute URLs. Use `opengraph-image.tsx` when the image needs to be generated per page.",
                "**WordPress:** an SEO plugin usually owns the tags. Set a default social image, then override it per post. If you add tags by hand, remove the plugin's output or disable its social module first.",
                "**Static HTML:** write the tags in the head. If you use a templating language, make the image URL a variable so it cannot drift from the page URL.",
                "**Single-page apps:** the tags must be in the HTML the server returns. A client-side router that updates `document.head` after load will not help most social crawlers.",
            ],
        },
        {
            type: "p",
            text: "If you want the tags generated for you, the [Open Graph meta tag generator](/tools/open-graph-meta-tag-generator) builds the block from a form and shows a live card preview. For the Next.js implementation, see the [Next.js Open Graph guide](/learn/nextjs-open-graph-image).",
        },
        {
            type: "links",
            title: "Related",
            items: [
                {
                    href: "/learn/what-is-an-open-graph-image",
                    label: "What is an Open Graph image?",
                    description: "The concept, the required tags, and where previews appear.",
                },
                {
                    href: "/learn/open-graph-image-size",
                    label: "OG image size guide",
                    description: "1200 x 630, platform variants, and safe areas.",
                },
                {
                    href: "/tools/open-graph-meta-tag-generator",
                    label: "Meta tag generator",
                    description: "Fill a form, copy the finished tags and preview.",
                },
                {
                    href: "/learn/og-image-not-showing",
                    label: "OG image not showing?",
                    description: "A checklist for the preview that refuses to update.",
                },
            ],
        },
    ],
    faqs: [
        {
            question: "What are the required Open Graph tags?",
            answer:
                "The Open Graph protocol lists four required properties: og:title, og:type, og:image, and og:url. Add og:description, og:site_name, and the image dimensions for a complete card.",
        },
        {
            question: "Where do Open Graph meta tags go?",
            answer:
                "Inside the page's <head>, in the initial server-rendered HTML. Tags injected only by client-side JavaScript are invisible to many social crawlers.",
        },
        {
            question: "Do Open Graph tags need to be absolute URLs?",
            answer:
                "The image URL should be absolute in practice. A relative path such as /og.png is resolved inconsistently by different scrapers. Use https://yourdomain.com/og.png.",
        },
        {
            question: "What is the difference between og:image and twitter:image?",
            answer:
                "og:image is the Open Graph image used by Facebook, LinkedIn, Slack, Discord, and most other platforms. twitter:image is X's override. They can point at the same file, which is the simplest setup.",
        },
        {
            question: "Can I have multiple og:image tags?",
            answer:
                "The protocol allows multiple images, but platform behaviour varies. For a predictable card, use one og:image. If you need a square variant for a specific platform, use that platform's own tag rather than stacking Open Graph images.",
        },
        {
            question: "Do Open Graph tags affect SEO?",
            answer:
                "They are not a Google ranking factor. They affect how a link looks when shared, which changes click-through and can lead to more links and discovery. Google's rich results use schema.org, not Open Graph.",
        },
        {
            question: "How long should og:title and og:description be?",
            answer:
                "Keep og:title under about 60 characters and og:description around 100-160 characters. Platforms truncate at different points, so put the important words first.",
        },
        {
            question: "Why does my CMS show two different OG images?",
            answer:
                "A plugin and a theme, or a plugin and hand-written tags, are both emitting og:image. Disable one source of truth, then re-scrape the URL. Use the page source to confirm only one image tag remains.",
        },
    ],
    sources: [
        { label: "The Open Graph protocol", href: "https://ogp.me/" },
        {
            label: "X: Cards markup",
            href: "https://developer.x.com/en/docs/x-for-websites/cards/overview/markup",
        },
        {
            label: "Meta: Webmasters guide to sharing",
            href: "https://developers.facebook.com/docs/sharing/webmasters/",
        },
        {
            label: "LinkedIn: Link previews",
            href: "https://www.linkedin.com/help/linkedin/answer/a521928",
        },
    ],
    related: ["what-is-an-open-graph-image", "open-graph-image-size", "og-image-not-showing"],
};
