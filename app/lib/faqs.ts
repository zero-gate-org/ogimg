import type { FaqEntry } from "./seo";

/**
 * Homepage FAQ copy.
 *
 * The visible accordion and the FAQPage schema both read this list, so an edit
 * cannot leave the structured data claiming something the page does not say.
 */
export const HOME_FAQS: FaqEntry[] = [
    {
        question: "What is an Open Graph image?",
        answer:
            "An Open Graph image, also called an OG image or opengraph image, is the card that appears when a link is shared on X, LinkedIn, Discord, Slack, Facebook, or iMessage. The page points to it with an og:image meta tag, and the platform fetches that file to build the preview.",
    },
    {
        question: "Is there a free OG image generator tool?",
        answer:
            "Yes. ogimg.in is a free OG image generator tool that runs in your browser. Pick one of 45 templates or start from a blank 1200 x 630 canvas, then export PNG, JPEG, or WebP with no account, watermark, or upload.",
    },
    {
        question: "What size should an Open Graph image be?",
        answer:
            "1200 x 630 pixels, a 1.91:1 ratio. That size works across X, LinkedIn, Facebook, Discord, and Slack. Keep the file under 1 MB and the important content inside a 64 px safe area so square and 2:1 crops do not clip it.",
    },
    {
        question: "Do I need design skills?",
        answer:
            "No. Templates handle layout if you want a finished look in under a minute, and the free canvas is there when you want exact control over every layer.",
    },
    {
        question: "What is the difference between a template and the free canvas?",
        answer:
            "A template fixes the layout and exposes the controls that matter for that design. The canvas has no fixed layout: you place every element and set every value yourself.",
    },
    {
        question: "What formats and sizes can I export?",
        answer:
            "PNG, JPEG, and WebP at 1x, 2x, or 3x. Canvas sizes include Open Graph, LinkedIn, Product Hunt, YouTube thumbnails, square posts, and stories, plus custom dimensions.",
    },
    {
        question: "Can I use my own fonts?",
        answer:
            "The bundled set covers sixteen families, including the Geist pixel faces. They are self-hosted and embedded into the exported file, so the image renders the same on any machine.",
    },
    {
        question: "Is it really free?",
        answer: "Yes. There is no account, no watermark, and no paid tier. Everything runs in your browser tab.",
    },
    {
        question: "Do you store my uploads or my text?",
        answer:
            "Nothing is sent anywhere. Images, copy, and projects stay in your browser. Clearing site data removes saved projects and brand kits.",
    },
];
