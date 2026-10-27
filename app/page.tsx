import type { Metadata } from "next";
import SiteHeader from "./components/landing/SiteHeader";
import Hero from "./components/landing/Hero";
import LearnTeaser from "./components/landing/LearnTeaser";
import TemplateShowcase from "./components/landing/TemplateShowcase";
import EditorShowcase from "./components/landing/EditorShowcase";
import Workflow from "./components/landing/Workflow";
import PreviewShowcase from "./components/landing/PreviewShowcase";
import Faq from "./components/landing/Faq";
import SiteFooter from "./components/landing/SiteFooter";
import { JsonLd } from "./components/content/JsonLd";
import { HOME_FAQS } from "./lib/faqs";
import {
    createMetadata,
    faqSchema,
    webPageSchema,
} from "./lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Open Graph Image Generator & OG Image Maker | ogimg.in",
    absoluteTitle: true,
    description:
        "Make a 1200 x 630 Open Graph image in your browser. 45 editable templates, a free canvas, live social previews, and copy-ready meta tags. Free, with no account.",
    path: "/",
    keywords: [
        "open graph image generator",
        "og image generator",
        "og image maker",
        "free og image generator",
        "open graph image maker",
        "social preview image generator",
        "twitter card image generator",
        "open graph templates",
        "1200x630 open graph image",
    ],
});

export default function LandingPage() {
    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <JsonLd
                items={[
                    webPageSchema({
                        title: "Open Graph Image Generator and Free OG Image Maker",
                        description:
                            "Create Open Graph images in the browser with editable templates, a free canvas, platform size presets, and copy-ready meta tags.",
                        path: "/",
                    }),
                    faqSchema(HOME_FAQS, "/"),
                ]}
            />

            <SiteHeader />
            <main>
                <Hero />
                <LearnTeaser />
                <TemplateShowcase />
                <EditorShowcase />
                <Workflow />
                <PreviewShowcase />
                <Faq />
            </main>
            <SiteFooter />
        </div>
    );
}
