import type { Metadata } from "next";
import StudioEditor from "../components/editor/StudioEditor";
import { createMetadata } from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Free Canvas Editor",
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
    return <StudioEditor backHref="/" />;
}