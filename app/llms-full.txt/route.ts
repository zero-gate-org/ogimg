import { COMPARISONS } from "../lib/content/comparisons";
import { GUIDES } from "../lib/content/guides";
import { TEMPLATE_PAGES } from "../lib/content/templates";
import { guideToMarkdown } from "../lib/content/markdown";
import type { Guide } from "../lib/content/types";
import { SITE_URL } from "../lib/seo";

export const dynamic = "force-static";

export function GET() {
    const guideDocuments = GUIDES.map((guide) => guideToMarkdown(guide, `/learn/${guide.slug}`, guide.category));

    const templateDocuments = TEMPLATE_PAGES.map((page) => {
        const guide: Guide = {
            slug: page.slug,
            title: page.title,
            seoTitle: page.seoTitle,
            description: page.description,
            category: "Design",
            published: page.published,
            updated: page.updated,
            readingTime: page.readingTime,
            quickAnswer: page.quickAnswer,
            keyFacts: [],
            sections: page.sections,
            faqs: page.faqs,
            related: page.related,
        };

        return guideToMarkdown(guide, `/templates/${page.slug}`, "Templates");
    });

    const comparisonDocuments = COMPARISONS.map((comparison) => {
        const guide: Guide = {
            slug: comparison.slug,
            title: comparison.title,
            seoTitle: comparison.seoTitle,
            description: comparison.description,
            category: "Comparison",
            published: comparison.published,
            updated: comparison.updated,
            readingTime: comparison.readingTime,
            quickAnswer: comparison.quickAnswer,
            keyFacts: comparison.keyFacts,
            sections: comparison.sections,
            faqs: comparison.faqs,
            sources: comparison.sources,
            related: comparison.related,
        };

        return guideToMarkdown(guide, `/compare/${comparison.slug}`, "Comparison");
    });

    const header = [
        "# ogimg.in — full text",
        "",
        `> The complete text of the ogimg.in Open Graph guides, template use cases, and tool comparisons. Canonical site: ${SITE_URL}.`,
        "",
        "ogimg.in is a free, open-source Open Graph image generator that runs in the browser. The reference dimensions used throughout are 1200 x 630 pixels, 1.91:1, under 1 MB, with a 64 px safe area.",
        "",
        `Table of contents: ${SITE_URL}/llms.txt`,
        "",
        "---",
        "",
    ].join("\n");

    const body = [...guideDocuments, ...templateDocuments, ...comparisonDocuments].join("\n\n---\n\n");

    return new Response(`${header}${body}\n`, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}
