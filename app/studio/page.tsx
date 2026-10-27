import type { Metadata } from "next";
import StudioEditor from "../components/editor/StudioEditor";
import { JsonLd } from "../components/content/JsonLd";
import { createMetadata, webPageSchema } from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Open Graph Canvas Editor",
    description:
        "Build an Open Graph image from scratch. Place every layer, control the typography, match any platform size, and export PNG, JPEG, or WebP without uploading anything.",
    path: "/studio",
    keywords: [
        "open graph image editor",
        "og image canvas editor",
        "custom social image maker",
        "og image builder",
    ],
});

export default function StudioPage() {
    return (
        <>
            <JsonLd
                items={[
                    webPageSchema({
                        title: "Open Graph canvas editor",
                        description:
                            "Build an Open Graph image from scratch with layers, typography controls, platform size presets, and PNG, JPEG, or WebP export.",
                        path: "/studio",
                    }),
                ]}
            />
            <h1 className="sr-only">Open Graph image editor</h1>
            <StudioEditor backHref="/" />
        </>
    );
}
