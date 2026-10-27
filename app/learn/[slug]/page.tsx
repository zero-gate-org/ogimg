import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "../../components/content/GuideArticle";
import { GUIDES, getGuide, getRelatedGuides } from "../../lib/content/guides";
import { createMetadata } from "../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
    return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGuide(slug);

    if (!guide) {
        return createMetadata({
            title: "Guide not found",
            description: "The requested guide could not be found.",
            path: "/learn",
            index: false,
        });
    }

    return createMetadata({
        title: guide.seoTitle,
        description: guide.description,
        path: `/learn/${guide.slug}`,
        keywords: [guide.title, guide.category.toLowerCase(), "open graph image", "og image"],
        type: "article",
        article: {
            publishedTime: `${guide.published}T00:00:00.000Z`,
            modifiedTime: `${guide.updated}T00:00:00.000Z`,
            section: guide.category,
            authors: ["GxAditya"],
        },
    });
}

export default async function GuidePage({
    params,
}: {
    params: Promise<{ slug: string }> | { slug: string };
}) {
    const { slug } = await params;
    const guide = getGuide(slug);

    if (!guide) notFound();

    return <GuideArticle guide={guide} path={`/learn/${guide.slug}`} related={getRelatedGuides(guide)} />;
}
