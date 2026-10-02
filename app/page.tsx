import type { Metadata } from "next";
import SiteHeader from "./components/landing/SiteHeader";
import Hero from "./components/landing/Hero";
import TemplateShowcase from "./components/landing/TemplateShowcase";
import EditorShowcase from "./components/landing/EditorShowcase";
import Workflow from "./components/landing/Workflow";
import PreviewShowcase from "./components/landing/PreviewShowcase";
import Faq from "./components/landing/Faq";
import SiteFooter from "./components/landing/SiteFooter";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_NAME, SITE_URL } from "./lib/seo";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Open Graph Image Generator with a Free Canvas Editor",
        template: "%s | ogimg.in",
    },
    description:
        "Build Open Graph images from a template or a free canvas with layer control, snapping guides, platform sizes, social preview simulation, and PNG, JPEG, or WebP export. Runs entirely in your browser.",
    applicationName: SITE_NAME,
    keywords: [
        "open graph image generator",
        "og image generator",
        "og image editor",
        "social preview image generator",
        "twitter card image generator",
        "open graph templates",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Open Graph images your links deserve",
        description:
            "Start from a template or compose one from scratch. Export PNG, JPEG, or WebP in the browser, with no upload.",
        url: "/",
        siteName: SITE_NAME,
        type: "website",
        locale: "en_US",
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: DEFAULT_OG_IMAGE_ALT,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Open Graph images your links deserve",
        description:
            "Start from a template or compose one from scratch. Export PNG, JPEG, or WebP in the browser, with no upload.",
        images: [DEFAULT_OG_IMAGE],
    },
};

const SOFTWARE_APPLICATION_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DesignApplication",
    applicationSubCategory: "Open Graph Image Generator",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
    url: SITE_URL,
    description:
        "Browser based Open Graph image generator with template mode, a free canvas editor, layer control, and PNG, JPEG, or WebP export.",
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    featureList: [
        "Template driven editor",
        "Free canvas editor with layers",
        "Platform size presets",
        "Social preview simulator",
        "PNG, JPEG, and WebP export",
    ],
    sameAs: ["https://github.com/GxAditya/ogimg"],
};

const FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            question: "Do I need design skills?",
            answer:
                "No. Templates handle layout if you want a finished look quickly, and the free canvas is there for exact control.",
        },
        {
            question: "What is the difference between a template and the free canvas?",
            answer:
                "A template fixes the layout and exposes the controls that matter for that design. The canvas has no fixed layout: you place every element and set every value.",
        },
        {
            question: "What formats and sizes can I export?",
            answer:
                "PNG, JPEG, and WebP at 1x, 2x, or 3x, with canvas sizes for Open Graph, LinkedIn, Product Hunt, YouTube, square posts, stories, and custom dimensions.",
        },
        {
            question: "Is it really free?",
            answer: "Yes. There is no account, no watermark, and no paid tier.",
        },
        {
            question: "Do you store my uploads or my text?",
            answer:
                "Nothing is sent anywhere. Images, copy, saved projects, and brand kits stay in your browser.",
        },
    ].map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: entry.answer,
        },
    })),
};

export default function LandingPage() {
    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APPLICATION_SCHEMA) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
            />

            <SiteHeader />
            <main>
                <Hero />
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