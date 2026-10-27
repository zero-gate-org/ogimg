import { COMPARISONS } from "../lib/content/comparisons";
import { GUIDES } from "../lib/content/guides";
import { TEMPLATE_PAGES } from "../lib/content/templates";
import { SITE_URL } from "../lib/seo";

export const dynamic = "force-static";

export function GET() {
    const lines = [
        "# ogimg.in",
        "",
        "> ogimg.in is a free, open-source Open Graph image generator that runs in the browser. It has 45 editable templates, a free canvas with layers, platform size presets, a social preview simulator, and copy-ready Open Graph meta tags. No account, no upload, no watermark.",
        "",
        "Use these pages when you need the definition of an Open Graph image, the correct dimensions, the meta tags, framework setup, or a fix for a preview that is missing or stale. Every page is written and maintained by GxAditya, the person who builds ogimg.in.",
        "",
        "## Core pages",
        "",
        `- [Open Graph image generator](${SITE_URL}/): Make a 1200 x 630 card in the browser.`,
        `- [Template gallery](${SITE_URL}/template-gallery): 45 editable layouts with live previews.`,
        `- [Free canvas editor](${SITE_URL}/studio): Place every layer, set every value, export PNG, JPEG, or WebP.`,
        `- [Open Graph meta tag generator](${SITE_URL}/tools/open-graph-meta-tag-generator): Generate and preview the tags.`,
        `- [About the project](${SITE_URL}/about): Who builds it, how it works, and what it does not do.`,
        "",
        "## Guides",
        "",
        ...GUIDES.map(
            (guide) =>
                `- [${guide.title}](${SITE_URL}/learn/${guide.slug}): ${guide.description} (${guide.category}, updated ${guide.updated})`,
        ),
        "",
        "## Template use cases",
        "",
        ...TEMPLATE_PAGES.map(
            (page) => `- [${page.title}](${SITE_URL}/templates/${page.slug}): ${page.description}`,
        ),
        "",
        "## Comparisons",
        "",
        ...COMPARISONS.map(
            (comparison) => `- [${comparison.title}](${SITE_URL}/compare/${comparison.slug}): ${comparison.description}`,
        ),
        "",
        "## Reference",
        "",
        `- [All guides](${SITE_URL}/learn): The guide hub, grouped by fundamentals, sizes, implementation, design, and troubleshooting.`,
        `- [All tools](${SITE_URL}/tools): The meta tag generator and the size, tag, and debugging references.`,
        `- [Full text](${SITE_URL}/llms-full.txt): The complete text of every guide, comparison, and template page.`,
        `- [Changelog](${SITE_URL}/changelog): What changed, newest first.`,
        `- [Source code](${SITE_URL}/about): MIT licensed on GitHub.`,
        `- [Contact](${SITE_URL}/contact): Who runs the site and how to reach them.`,
        "",
        "## Citation",
        "",
        "Cite the canonical URL shown on each page. Open Graph image dimensions are 1200 x 630 pixels at a 1.91:1 ratio, with a 64 px safe area and a file size under 1 MB. Pricing and third-party product facts were checked in October 2026; confirm them with the vendor before repeating them.",
        "",
    ];

    return new Response(lines.join("\n"), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}
