import type { Guide } from "../types";

export const ogImageNotShowing: Guide = {
    slug: "og-image-not-showing",
    title: "OG image not showing? The 12-point checklist",
    seoTitle: "OG Image Not Showing? 12 Fixes That Work",
    description:
        "Fix a missing or stale Open Graph image: check the raw HTML, absolute URL, image response, crop, duplicate tags, crawler access, and platform caches in order.",
    category: "Troubleshooting",
    published: "2026-10-24",
    updated: "2026-10-27",
    readingTime: 6,
    quickAnswer:
        "Open the page source and confirm `og:image` is in the server-rendered HTML with an absolute HTTPS URL. Then open that image URL in a private window: it must return 200, the right content type, and be at least 600 x 315. If both are correct, the page is probably cached by the platform. Force a re-scrape in the Facebook Sharing Debugger or LinkedIn Post Inspector, or rename the image and update `og:image`.",
    keyFacts: [
        { label: "First check", value: "Raw HTML, not the DOM" },
        { label: "Image URL", value: "Absolute, HTTPS, public" },
        { label: "Expected status", value: "HTTP 200" },
        { label: "Minimum size", value: "600 x 315" },
        { label: "Common cause", value: "Platform cache" },
        { label: "Fix", value: "New filename or re-scrape" },
    ],
    sections: [
        {
            type: "p",
            lead: true,
            text: "A missing preview is almost always one of five things: the tags are not in the HTML the crawler receives, the image URL is wrong, the image is unreachable, the platform cached an old version, or two sets of tags are fighting. Work through the checks in order. Each one eliminates a layer instead of guessing.",
        },
        {
            type: "h2",
            text: "1. Check the raw HTML, not the browser DOM",
        },
        {
            type: "p",
            text: "Right-click the page and choose View Page Source, or run `curl -sL https://example.com/page | grep -i og:image`. If the tag appears in DevTools but not in the source, it is being injected by JavaScript. Many social crawlers do not execute JavaScript, so they never see it.",
        },
        {
            type: "code",
            language: "bash",
            label: "What a crawler sees",
            code: `curl -sL https://example.com/blog/post | grep -iE 'og:|twitter:'`,
        },
        {
            type: "p",
            text: "If that command prints nothing, the problem is upstream of every platform. Fix the server rendering first: use the framework's metadata API, a CMS plugin that renders on the server, or a static tag in the head.",
        },
        {
            type: "h2",
            text: "2. Confirm the image URL is absolute and public",
        },
        {
            type: "p",
            text: "The tag should contain a full URL starting with `https://`. A relative path such as `/og.png` is resolved inconsistently. A `localhost` URL is only reachable from your machine. A signed URL may expire before the crawler fetches it.",
        },
        {
            type: "code",
            language: "html",
            label: "Correct",
            code: `<meta property="og:image" content="https://example.com/og/post.png" />`,
        },
        {
            type: "h2",
            text: "3. Open the image URL in a private window",
        },
        {
            type: "p",
            text: "Paste the exact `og:image` URL into a private browser window with no session. It should render the image, not a login page, not a 404, and not a redirect loop. Check the response headers as well: the status should be 200 and the content type should be `image/png`, `image/jpeg`, or `image/webp`.",
        },
        {
            type: "code",
            language: "bash",
            label: "Check status, type, and size",
            code: `curl -sI https://example.com/og/post.png | grep -iE 'HTTP/|content-type|content-length'`,
        },
        {
            type: "ul",
            items: [
                "**403 or 401:** the image is behind authentication, a firewall, or hotlink protection. Allow the social crawlers or move the image to a public bucket.",
                "**404:** the path is wrong or the file was never deployed. Check case sensitivity; `/OG.png` and `/og.png` are different on most servers.",
                "**302 or 307:** the crawler may follow a redirect, but some platforms do not. Point the tag at the final URL.",
                "**200 but `text/html`:** the URL is returning an error page, not an image. Open it and look.",
            ],
        },
        {
            type: "h2",
            text: "4. Check the dimensions and file size",
        },
        {
            type: "p",
            text: "A tiny image can be rejected or displayed as a small thumbnail. Aim for at least 600 x 315 for a large card, ideally 1200 x 630. Confirm the dimensions in an image editor or with `identify` from ImageMagick. If the file is several megabytes, compress it; some scrapers time out or fall back to no image.",
        },
        {
            type: "code",
            language: "bash",
            label: "ImageMagick",
            code: `identify https://example.com/og/post.png
# post.png PNG 1200x630 1200x630+0+0 8-bit sRGB 184KB`,
        },
        {
            type: "h2",
            text: "5. Look for duplicate tags",
        },
        {
            type: "p",
            text: "A CMS plugin, a theme, and a hand-written snippet can all emit `og:image`. When a page has two different images, the platform may pick the first, the last, or the one it parsed most recently. Search the source for every occurrence and keep one source of truth.",
        },
        {
            type: "code",
            language: "bash",
            label: "Count the tags",
            code: `curl -sL https://example.com/blog/post | grep -c 'property="og:image"'`,
        },
        {
            type: "p",
            text: "If the count is greater than one, disable the duplicate. In WordPress, that usually means turning off the social module in one plugin or removing the theme's hand-written tags. In a custom app, check the layout, the page, and any SEO component that runs on both.",
        },
        {
            type: "h2",
            text: "6. Check the crop, not just the file",
        },
        {
            type: "p",
            text: "The image may be present and still look wrong because the platform cropped the headline out. A square image in a wide card loses the top and bottom. A 1.91:1 image with the text at the far left can lose it to a square crop. This is a design failure, not a tag failure: move the content into the middle 80 percent and export a new file.",
        },
        {
            type: "callout",
            tone: "tip",
            title: "A quick crop test",
            text: "Crop the image to a square in any editor. If the headline and logo disappear, the card is not safe for messaging apps. Rebuild it with the meaning in the centre.",
        },
        {
            type: "h2",
            text: "7. Clear the platform cache",
        },
        {
            type: "p",
            text: "Platforms cache previews aggressively. If the tags and image are correct but the old preview persists, the cache is the problem. The fix is either a forced re-scrape or a new image URL.",
        },
        {
            type: "table",
            head: ["Platform", "Refresh method", "Notes"],
            rows: [
                ["Facebook", "Sharing Debugger: paste the URL, then click Scrape Again", "The most reliable cache refresh"],
                ["LinkedIn", "Post Inspector: paste the URL and inspect", "LinkedIn caches separately from Facebook"],
                ["X", "Paste the URL into a new post draft", "The composer preview is the practical check"],
                ["Slack", "Re-paste the URL, or add a query string", "Workspace-level unfurl settings can block previews"],
                ["Discord", "Re-paste the URL, or change the filename", "Embeds are cached by URL"],
                ["Telegram", "Use @WebpageBot with the URL", "The bot reports the current preview"],
                ["WhatsApp", "Re-send the link in a new chat", "Caches per client and per device"],
            ],
        },
        {
            type: "p",
            text: "If a platform still refuses to refresh, publish the image under a new filename (`post-v2.png`) and update `og:image`. That is the only refresh that works everywhere, including clients with no debugger.",
        },
        {
            type: "h2",
            text: "8. Check crawler access",
        },
        {
            type: "p",
            text: "A `robots.txt` rule that blocks the page or the image can prevent a preview. Some platforms respect robots directives for unfurling; others fetch anyway. Check both the page and the image path. Also check `X-Robots-Tag` headers and any CDN bot rules that block unknown user agents.",
        },
        {
            type: "code",
            language: "text",
            label: "robots.txt should not block the image",
            code: `User-agent: *
Allow: /
Allow: /og/
Disallow: /admin/`,
        },
        {
            type: "h2",
            text: "9. Check the page's canonical and URL",
        },
        {
            type: "p",
            text: "If the page is served at several URLs, the preview may be built for a different one. Use the canonical URL in `og:url` and share that URL. A tracking parameter can create a separate cache entry that still points at the right page but has never been scraped.",
        },
        {
            type: "h2",
            text: "10. Check the image itself",
        },
        {
            type: "ul",
            items: [
                "**Transparency:** some platforms composite it onto black or white. Export a solid background.",
                "**Colour profile:** use sRGB. CMYK images can fail or shift.",
                "**Corrupt file:** open it in a second viewer. A file that renders in one browser can fail in a scraper.",
                "**Animated GIF:** support is inconsistent. Use a static image.",
                "**SVG:** many social crawlers do not render it. Export a PNG or JPG.",
            ],
        },
        {
            type: "h2",
            text: "11. Test the exact URL you shared",
        },
        {
            type: "p",
            text: "It is easy to test the canonical URL and share a variant with a query string, a trailing slash, or a different subdomain. Paste the exact URL that appears in the post, not the one in your address bar after a redirect. If the site redirects `http` to `https` or `www` to apex, test the final URL.",
        },
        {
            type: "h2",
            text: "12. If everything looks right, wait",
        },
        {
            type: "p",
            text: "Platforms can take hours to refresh a preview, and some clients cache for weeks. If the debugger shows the correct image and the live composer still shows the old one, you have done the work. Change the filename if the old card is actively harmful, or accept the delay.",
        },
        {
            type: "callout",
            tone: "warning",
            title: "The most common non-bug",
            text: "The image was replaced at the same URL. Every tag is correct, the file is correct, and the preview is old. Rename the file. It takes less time than another round of debugging.",
        },
        {
            type: "links",
            title: "Related",
            items: [
                {
                    href: "/learn/open-graph-meta-tags",
                    label: "Open Graph meta tags",
                    description: "The tag reference, including requirements and common errors.",
                },
                {
                    href: "/learn/open-graph-image-size",
                    label: "OG image size guide",
                    description: "The dimensions and file weights platforms expect.",
                },
                {
                    href: "/tools/open-graph-meta-tag-generator",
                    label: "Meta tag generator",
                    description: "Build a correct tag block and preview it live.",
                },
                {
                    href: "/learn/what-is-an-open-graph-image",
                    label: "What is an Open Graph image?",
                    description: "Start here if the concept is still fuzzy.",
                },
            ],
        },
    ],
    faqs: [
        {
            question: "Why is my Open Graph image not showing?",
            answer:
                "Check four things in order: the tag is in the server-rendered HTML, the image URL is absolute and public, the image returns HTTP 200 with the right content type, and the platform cache has been refreshed. One of those four explains almost every missing preview.",
        },
        {
            question: "Why does Facebook show the old OG image?",
            answer:
                "Facebook caches previews by URL. Replacing the file at the same path does not invalidate the cache. Use the Sharing Debugger to re-scrape, or publish the image under a new filename and update og:image.",
        },
        {
            question: "Why is my OG image cropped?",
            answer:
                "Each platform uses its own container. A square image in a wide card, or a 1.91:1 image in a square container, gets cropped from the centre. Keep the headline and logo inside the middle 80 percent and at least 64 pixels from the edges.",
        },
        {
            question: "Does LinkedIn use og:image or twitter:image?",
            answer:
                "LinkedIn uses Open Graph tags, primarily og:image, og:title, and og:description. It does not rely on twitter:image. Use the LinkedIn Post Inspector to see exactly what it scraped.",
        },
        {
            question: "Why is my OG image not updating on X?",
            answer:
                "X caches card data. Paste the URL into a fresh post draft to see the current card. If the old image persists, change the image filename and update og:image, then try again.",
        },
        {
            question: "Does og:image need to be HTTPS?",
            answer:
                "In practice, yes. HTTPS is required or strongly preferred by every major platform, and some will refuse an HTTP image. Use an absolute HTTPS URL with a valid certificate.",
        },
        {
            question: "Can an OG image be too large?",
            answer:
                "Yes. Facebook accepts up to 8 MB and X up to 5 MB, but large files load slowly and can time out in chat clients or scrapers. Keep the file under 1 MB and ideally under 300 KB.",
        },
        {
            question: "Why does Slack show no preview?",
            answer:
                "Slack may block unfurls at the workspace level, or the page may be behind a login. Check the workspace's link preview setting, confirm the page is public, and re-paste the URL. A Slack unfurl also uses the page's Open Graph tags, not a separate image.",
        },
    ],
    sources: [
        { label: "Meta: Sharing Debugger", href: "https://developers.facebook.com/tools/debug/" },
        {
            label: "LinkedIn: Post Inspector",
            href: "https://www.linkedin.com/post-inspector/",
        },
        { label: "The Open Graph protocol", href: "https://ogp.me/" },
        {
            label: "X: Cards markup",
            href: "https://developer.x.com/en/docs/x-for-websites/cards/overview/markup",
        },
    ],
    related: ["open-graph-meta-tags", "open-graph-image-size", "what-is-an-open-graph-image"],
};
