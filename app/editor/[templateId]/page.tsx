import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TemplateEditor from "../../components/editor/TemplateEditor";
import { TEMPLATE_LIBRARY, TemplateId } from "../../components/templates/templateRegistry";
import { createMetadata } from "../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
    return TEMPLATE_LIBRARY.map((template) => ({
        templateId: template.id,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ templateId: string }> | { templateId: string };
}): Promise<Metadata> {
    const { templateId } = await params;
    const template = TEMPLATE_LIBRARY.find((entry) => entry.id === templateId);

    if (!template) {
        return createMetadata({
            title: "Template Editor",
            description: "Customize Open Graph image templates in the ogimg.in editor.",
            path: "/template-gallery",
            index: false,
        });
    }

    return createMetadata({
        title: `${template.name} Editor`,
        description: `Customize the ${template.name} template and export a share-ready Open Graph image from your browser.`,
        path: `/editor/${template.id}`,
        keywords: [
            `${template.name} open graph template`,
            `${template.name} og image editor`,
            "open graph image editor",
        ],
        index: false,
    });
}

export default async function TemplateEditorPage({
    params,
}: {
    params: Promise<{ templateId: string }> | { templateId: string };
}) {
    const { templateId } = await params;
    const isKnownTemplate = TEMPLATE_LIBRARY.some((template) => template.id === templateId);

    if (!isKnownTemplate) {
        notFound();
    }

    return <TemplateEditor templateId={templateId as TemplateId} backHref="/template-gallery" />;
}
