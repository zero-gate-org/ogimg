import type { FaqEntry } from "../seo";

export type ContentBlock =
    | { type: "p"; text: string; lead?: boolean }
    | { type: "h2"; text: string; id?: string }
    | { type: "h3"; text: string; id?: string }
    | { type: "ul"; items: string[] }
    | { type: "ol"; items: string[] }
    | { type: "code"; code: string; language?: string; label?: string }
    | { type: "table"; head: string[]; rows: string[][]; caption?: string }
    | { type: "callout"; title?: string; text: string; tone?: "note" | "tip" | "warning" }
    | { type: "quote"; text: string; cite?: string }
    | { type: "links"; title?: string; items: { href: string; label: string; description?: string }[] }
    | { type: "template"; templateId: string; caption?: string; alt: string }
    | { type: "divider" };

export type Source = {
    label: string;
    href: string;
};

export type Guide = {
    slug: string;
    /** H1 and Article headline. */
    title: string;
    /** Search-facing title, usually shorter and keyword-led. */
    seoTitle: string;
    description: string;
    category: "Fundamentals" | "Sizes" | "Implementation" | "Design" | "Troubleshooting" | "Comparison";
    published: string;
    updated: string;
    readingTime: number;
    /** Two or three sentences an AI answer can lift verbatim. */
    quickAnswer: string;
    keyFacts: { label: string; value: string }[];
    sections: ContentBlock[];
    faqs: FaqEntry[];
    sources?: Source[];
    related: string[];
    /** Optional HowTo steps for the how-to guide. */
    howTo?: { name: string; text: string }[];
};

export type Comparison = {
    slug: string;
    title: string;
    seoTitle: string;
    description: string;
    published: string;
    updated: string;
    readingTime: number;
    quickAnswer: string;
    keyFacts: { label: string; value: string }[];
    sections: ContentBlock[];
    faqs: FaqEntry[];
    sources?: Source[];
    related: string[];
};

export type TemplatePage = {
    slug: string;
    title: string;
    seoTitle: string;
    description: string;
    published: string;
    updated: string;
    readingTime: number;
    quickAnswer: string;
    /** Template ids rendered as live previews on the page. */
    templateIds: string[];
    sections: ContentBlock[];
    faqs: FaqEntry[];
    related: string[];
};
