import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "../../components/content/GuideArticle";
import { getComparison, COMPARISONS } from "../../lib/content/comparisons";
import { getGuide } from "../../lib/content/guides";
import type { Guide } from "../../lib/content/types";
import { createMetadata } from "../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
    return COMPARISONS.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
    const { slug } = await params;
    const comparison = getComparison(slug);

    if (!comparison) {
        return createMetadata({
            title: "Comparison not found",
            description: "The requested comparison could not be found.",
            path: "/compare",
            index: false,
        });
    }

    return createMetadata({
        title: comparison.seoTitle,
        description: comparison.description,
        path: `/compare/${comparison.slug}`,
        keywords: [comparison.title, "og image generator comparison", "open graph image tool"],
        type: "article",
        article: {
            publishedTime: `${comparison.published}T00:00:00.000Z`,
            modifiedTime: `${comparison.updated}T00:00:00.000Z`,
            section: "Comparison",
            authors: ["GxAditya"],
        },
    });
}

export default async function ComparisonPage({
    params,
}: {
    params: Promise<{ slug: string }> | { slug: string };
}) {
    const { slug } = await params;
    const comparison = getComparison(slug);

    if (!comparison) notFound();

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

    const relatedGuides = comparison.related
        .map((relatedSlug) => getGuide(relatedSlug))
        .filter((entry): entry is Guide => Boolean(entry))
        .map((entry) => ({
            href: `/learn/${entry.slug}`,
            title: entry.title,
            description: entry.description,
        }));

    const otherComparisons = COMPARISONS.filter((entry) => entry.slug !== comparison.slug).map((entry) => ({
        href: `/compare/${entry.slug}`,
        title: entry.title,
        description: entry.description,
    }));

    return (
        <GuideArticle
            guide={guide}
            path={`/compare/${comparison.slug}`}
            related={[...relatedGuides, ...otherComparisons]}
            section={{ label: "Compare", href: "/compare" }}
            eyebrow={`Comparison · ${comparison.readingTime} min read`}
        />
    );
}
