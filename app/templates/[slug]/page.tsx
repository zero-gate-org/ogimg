import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "../../components/content/GuideArticle";
import { getGuide } from "../../lib/content/guides";
import { TEMPLATE_PAGES, getTemplatePage } from "../../lib/content/templates";
import type { Guide } from "../../lib/content/types";
import { createMetadata } from "../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
    return TEMPLATE_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
    const { slug } = await params;
    const page = getTemplatePage(slug);

    if (!page) {
        return createMetadata({
            title: "Template not found",
            description: "The requested template could not be found.",
            path: "/template-gallery",
            index: false,
        });
    }

    return createMetadata({
        title: page.seoTitle,
        description: page.description,
        path: `/templates/${page.slug}`,
        keywords: ["open graph template", "og image template", page.title.toLowerCase()],
        type: "article",
        article: {
            publishedTime: `${page.published}T00:00:00.000Z`,
            modifiedTime: `${page.updated}T00:00:00.000Z`,
            section: "Templates",
            authors: ["GxAditya"],
        },
    });
}

export default async function TemplatePageRoute({
    params,
}: {
    params: Promise<{ slug: string }> | { slug: string };
}) {
    const { slug } = await params;
    const page = getTemplatePage(slug);

    if (!page) notFound();

    const canvas = page.slug === "github-social-preview" ? "1280 x 640" : page.slug === "linkedin" ? "1200 x 627" : "1200 x 630";

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
        keyFacts: [
            { label: "Canvas", value: canvas },
            { label: "Safe area", value: "64 px inset" },
            { label: "Headline", value: "6-10 words" },
            { label: "File size", value: "Under 1 MB" },
            { label: "Cost", value: "Free, no account" },
            { label: "Editable", value: "In the browser" },
        ],
        sections: page.sections,
        faqs: page.faqs,
        related: page.related,
        sources: [
            { label: "The Open Graph protocol", href: "https://ogp.me/" },
            {
                label: "Meta: Sharing best practices",
                href: "https://developers.facebook.com/docs/sharing/webmasters/",
            },
        ],
    };

    const related = page.related
        .map((relatedSlug) => getGuide(relatedSlug))
        .filter((entry): entry is Guide => Boolean(entry))
        .map((entry) => ({
            href: `/learn/${entry.slug}`,
            title: entry.title,
            description: entry.description,
        }));

    const relatedTemplates = TEMPLATE_PAGES.filter((entry) => entry.slug !== page.slug)
        .slice(0, 2)
        .map((entry) => ({
            href: `/templates/${entry.slug}`,
            title: entry.title,
            description: entry.description,
        }));

    return (
        <GuideArticle
            guide={guide}
            path={`/templates/${page.slug}`}
            related={[...related, ...relatedTemplates]}
            section={{ label: "Templates", href: "/template-gallery" }}
            eyebrow={`Template · ${page.readingTime} min read`}
            cta={{
                primary: { href: `/editor/${page.templateIds[0]}`, label: "Open this template" },
                secondary: { href: "/template-gallery", label: "Browse all templates" },
            }}
        />
    );
}
