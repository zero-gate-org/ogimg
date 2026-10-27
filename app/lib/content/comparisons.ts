import type { Comparison } from "./types";

export const COMPARISONS: Comparison[] = [
    {
        slug: "bannerbear",
        title: "ogimg.in vs Bannerbear",
        seoTitle: "ogimg.in vs Bannerbear: An Honest Comparison",
        description:
            "A fair comparison of ogimg.in and Bannerbear for Open Graph images: price, API, templates, automation, privacy, and which one fits your workflow.",
        published: "2026-10-26",
        updated: "2026-10-27",
        readingTime: 6,
        quickAnswer:
            "Bannerbear is an API-first image and video generation service with paid plans starting at $49 per month and a 30-credit trial. It is the better choice when you need automated rendering at scale, video, PDFs, or integrations. ogimg.in is a free, browser-based Open Graph image editor with 45 templates, no account, and no upload. It is the better choice when a person is designing a card by hand and wants the file to stay on their machine.",
        keyFacts: [
            { label: "Bannerbear price", value: "From $49/mo" },
            { label: "ogimg.in price", value: "Free" },
            { label: "Bannerbear model", value: "API-first" },
            { label: "ogimg.in model", value: "Browser editor" },
            { label: "Bannerbear trial", value: "30 API credits" },
            { label: "ogimg.in account", value: "Not required" },
        ],
        sections: [
            {
                type: "p",
                lead: true,
                text: "These tools overlap on one job, making an Open Graph image, and diverge on almost everything else. Bannerbear is built to render images from a template at scale, through an API, as part of an automated publishing pipeline. ogimg.in is built for a person who wants to make a card in a browser and leave with a file. Neither is a downgrade of the other; they are different shapes.",
            },
            {
                type: "h2",
                text: "The short version",
            },
            {
                type: "table",
                head: ["", "ogimg.in", "Bannerbear"],
                rows: [
                    ["Price", "Free", "From $49/mo; 30-credit trial"],
                    ["Account", "Not required", "Required for the trial and paid plans"],
                    ["Primary interface", "Browser canvas and templates", "Template editor plus REST API, MCP, integrations"],
                    ["Automation", "Not yet; bulk generation is on the roadmap", "Core feature: API, workflows, instant URLs"],
                    ["Output types", "PNG, JPEG, WebP", "Images, video, PDFs, animations"],
                    ["Where work lives", "In your browser; nothing uploaded", "In Bannerbear's workspace and cloud"],
                    ["Open source", "Yes, MIT", "No"],
                    ["Best for", "A person designing a card by hand", "A team rendering many assets automatically"],
                ],
                caption:
                    "Bannerbear pricing checked October 2026. Always confirm current pricing on the vendor's site.",
            },
            {
                type: "h2",
                text: "What Bannerbear is good at",
            },
            {
                type: "ul",
                items: [
                    "**Automated rendering.** A template plus a JSON payload produces an image, so a CMS or CI pipeline can generate a card per page without a designer.",
                    "**Breadth of output.** Images, animations, PDFs, and video operations are part of the same product, not separate tools.",
                    "**Integrations.** A REST API, an MCP server for AI assistants, 50+ app integrations, and hosted forms.",
                    "**Instant URLs.** A signed URL renders an image from query parameters on demand, which is useful for Open Graph images that change per request.",
                    "**Operational features.** Team members, SSO, audit logs, and custom S3 storage on higher plans.",
                ],
            },
            {
                type: "p",
                text: "If your problem is \"we publish 500 pages a month and each one needs a card,\" Bannerbear is aimed directly at you. The value is not the editor; it is the pipeline around the editor.",
            },
            {
                type: "h2",
                text: "What ogimg.in is good at",
            },
            {
                type: "ul",
                items: [
                    "**No account, no upload.** Rendering, fonts, and export run in the browser. Images, copy, projects, and brand kits stay in local storage.",
                    "**A real canvas.** Layers, snapping, rotation, per-layer typography, and platform size presets, not just a form over a fixed template.",
                    "**45 templates with editable controls.** Each template exposes the fields that matter for its layout, so you are not rebuilding the composition from scratch.",
                    "**A preview simulator.** See the card inside X, LinkedIn, Discord, and Slack, and copy the Open Graph tags from the same panel.",
                    "**Open source.** The code is MIT licensed, so you can inspect it, self-host it, or adapt a template.",
                    "**Free.** No watermark, no paid tier, no per-image credit.",
                ],
            },
            {
                type: "h2",
                text: "Price, in plain terms",
            },
            {
                type: "p",
                text: "Bannerbear's public pricing at the time of writing is $49 per month for the Automate plan, $149 per month for Scale, and $299 per month for Enterprise. The trial includes 30 API credits and no credit card, with trial limits on workspaces and templates. That is a fair price for an automated rendering service; it is simply a different purchase from a free browser editor.",
            },
            {
                type: "p",
                text: "ogimg.in has no paid tier, no credits, and no per-image cost. The trade-off is that it does not render images for you on a server. You make the card, export the file, and host it yourself. For a handful of pages, that is faster than setting up an API. For thousands of pages, it is not.",
            },
            {
                type: "h2",
                text: "The workflow difference",
            },
            {
                type: "p",
                text: "With Bannerbear, the template is an asset in a system. A developer creates the template, the API fills in the text and image, and the output is stored or served. The designer's job is done before the first request.",
            },
            {
                type: "p",
                text: "With ogimg.in, the template is a starting point. A person opens it, changes the words, adjusts the type, checks the preview, and exports. The designer's job is the request. If your publishing cadence is human and your volume is modest, this is the shorter path.",
            },
            {
                type: "h2",
                text: "When to choose Bannerbear",
            },
            {
                type: "ul",
                items: [
                    "You need to generate images from a CMS, a database, or a CI pipeline.",
                    "You need video, PDFs, or animations as well as images.",
                    "You want an API, webhooks, and integrations rather than a manual editor.",
                    "You need team roles, SSO, audit logs, or custom storage.",
                    "You are comfortable paying a monthly fee for infrastructure.",
                ],
            },
            {
                type: "h2",
                text: "When to choose ogimg.in",
            },
            {
                type: "ul",
                items: [
                    "You need a card now and do not want to create an account.",
                    "You want the image and the copy to stay on your machine.",
                    "You want to design on a canvas, not fill in a form.",
                    "You publish a few pages a week and can export the image yourself.",
                    "You want an open-source tool you can inspect or self-host.",
                ],
            },
            {
                type: "h2",
                text: "Can you use both?",
            },
            {
                type: "p",
                text: "Yes, and some teams do. Design the card system in a browser editor, then rebuild the winning layout as a Bannerbear template for automated pages. The design decisions transfer; only the rendering path changes.",
            },
            {
                type: "links",
                title: "Related",
                items: [
                    {
                        href: "/learn/how-to-create-an-open-graph-image",
                        label: "How to create an OG image",
                        description: "The manual workflow, from headline to preview check.",
                    },
                    {
                        href: "/learn/nextjs-open-graph-image",
                        label: "Next.js dynamic OG images",
                        description: "A free code route for per-page cards.",
                    },
                    {
                        href: "/learn/open-graph-image-size",
                        label: "OG image size guide",
                        description: "The dimensions both tools need to output.",
                    },
                ],
            },
        ],
        faqs: [
            {
                question: "Is ogimg.in a free alternative to Bannerbear?",
                answer:
                    "For manual Open Graph image design, yes. ogimg.in is free and browser-based. It does not offer Bannerbear's API, automated rendering at scale, video, or PDF output.",
            },
            {
                question: "How much does Bannerbear cost?",
                answer:
                    "Bannerbear's public pricing at the time of writing starts at $49 per month for the Automate plan, with Scale at $149 and Enterprise at $299. The trial includes 30 API credits. Check the Bannerbear pricing page for current numbers.",
            },
            {
                question: "Does ogimg.in have an API?",
                answer:
                    "Not yet. API and headless rendering are on the roadmap, with export parity as a requirement. Today the product is a browser editor and a template gallery.",
            },
            {
                question: "Which tool is better for automated OG images?",
                answer:
                    "Bannerbear, because automation is its core product. If you want a free code route instead, Next.js can generate cards with ImageResponse; see the Next.js guide.",
            },
            {
                question: "Does Bannerbear store my images?",
                answer:
                    "Bannerbear is a cloud service, so templates and renders live in its workspace. ogimg.in runs in your browser and does not upload your images or copy. Check Bannerbear's documentation for its current storage and retention terms.",
            },
            {
                question: "Can I use ogimg.in for commercial work?",
                answer:
                    "Yes. The editor is free to use for commercial projects, with no watermark. The source is MIT licensed. Check the terms for the specific assets you upload.",
            },
        ],
        sources: [
            { label: "Bannerbear pricing", href: "https://bannerbear.com/pricing" },
            { label: "Bannerbear documentation", href: "https://www.bannerbear.com/help/" },
            { label: "ogimg.in license", href: "https://github.com/GxAditya/ogimg/blob/main/LICENSE" },
        ],
        related: ["how-to-create-an-open-graph-image", "nextjs-open-graph-image", "open-graph-image-size"],
    },
    {
        slug: "canva",
        title: "ogimg.in vs Canva for Open Graph images",
        seoTitle: "Canva vs ogimg.in for OG Images: Honest Comparison",
        description:
            "Canva is a general design platform; ogimg.in is a focused Open Graph image editor. Compare speed, control, privacy, price, and the right job for each.",
        published: "2026-10-26",
        updated: "2026-10-27",
        readingTime: 5,
        quickAnswer:
            "Canva is the better choice when you need a general design tool for presentations, social posts, print, and brand assets in one place. ogimg.in is the better choice when you specifically need an Open Graph image: it starts at 1200 x 630, has a social preview simulator, generates the meta tags, requires no account, and keeps the file in your browser.",
        keyFacts: [
            { label: "Canva price", value: "Free tier plus paid plans" },
            { label: "ogimg.in price", value: "Free" },
            { label: "Canva scope", value: "General design platform" },
            { label: "ogimg.in scope", value: "Open Graph images" },
            { label: "Canva account", value: "Required" },
            { label: "ogimg.in account", value: "Not required" },
        ],
        sections: [
            {
                type: "p",
                lead: true,
                text: "Canva can make an Open Graph image. It can also make a pitch deck, a poster, an Instagram story, and a logo. That breadth is the point. ogimg.in does one thing: it makes a 1200 x 630 card and gives you the tags. The question is whether you want a design suite or a focused tool.",
            },
            {
                type: "h2",
                text: "The short version",
            },
            {
                type: "table",
                head: ["", "ogimg.in", "Canva"],
                rows: [
                    ["Scope", "Open Graph images", "General design platform"],
                    ["Price", "Free", "Free tier plus paid plans"],
                    ["Account", "Not required", "Required"],
                    ["Starting point", "1200 x 630 templates and presets", "Custom size or a social template"],
                    ["Social preview", "Built-in X, LinkedIn, Discord, Slack simulator", "Not the focus; preview is the canvas"],
                    ["Meta tags", "Generated and copyable", "Not generated"],
                    ["Where work lives", "Your browser", "Canva's cloud"],
                    ["Best for", "A quick, correct OG card", "A whole brand and design workflow"],
                ],
            },
            {
                type: "h2",
                text: "What Canva is good at",
            },
            {
                type: "ul",
                items: [
                    "**Breadth.** One tool for decks, social posts, print, video, and brand assets.",
                    "**Template library.** A very large catalog, including social and marketing layouts.",
                    "**Collaboration.** Shared folders, comments, brand kits, and team workflows on paid plans.",
                    "**Asset library.** Stock photos, illustrations, fonts, and elements in the same editor.",
                    "**Recognition.** Most people already know how it works, which lowers the training cost.",
                ],
            },
            {
                type: "p",
                text: "If your team already lives in Canva, adding a separate OG tool can feel like unnecessary fragmentation. A custom 1200 x 630 design in Canva is a reasonable path, especially if the card reuses brand assets that already exist there.",
            },
            {
                type: "h2",
                text: "What ogimg.in is good at",
            },
            {
                type: "ul",
                items: [
                    "**The right starting point.** The canvas opens at 1200 x 630 with Open Graph, X, LinkedIn, Product Hunt, YouTube, square, and story presets.",
                    "**OG-specific controls.** A safe area you can see, a social preview simulator, and copy-ready Open Graph tags.",
                    "**Speed.** No account, no onboarding, no project setup. Open the canvas and export.",
                    "**Privacy.** Images, copy, projects, and brand kits stay in local storage. Nothing is uploaded.",
                    "**Cost.** Free, with no watermark and no paid tier.",
                    "**Open source.** MIT licensed, so the tool can be inspected or self-hosted.",
                ],
            },
            {
                type: "h2",
                text: "The Open Graph-specific gap",
            },
            {
                type: "p",
                text: "Canva is a canvas. It does not know that the image is destined for an `og:image` tag, so it cannot warn you that the headline sits outside the safe area, show you the card inside a Slack unfurl, or generate the tag block. You can do all of that manually, but the manual steps are exactly where previews break.",
            },
            {
                type: "p",
                text: "ogimg.in is built around that last mile. The social preview panel renders the live canvas inside X, LinkedIn, Discord, and Slack, and the export panel produces the `og:image`, `og:image:width`, `og:image:height`, and `twitter:card` tags. That is not a feature Canva is trying to have; it is a different product.",
            },
            {
                type: "h2",
                text: "Price and privacy",
            },
            {
                type: "p",
                text: "Canva has a free tier and paid plans; the exact price depends on the plan, the region, and whether you pay monthly or annually. Some templates and assets are premium. ogimg.in is free with no paid tier. The more meaningful difference is where the work lives: Canva is a cloud product, while ogimg.in renders in the browser and stores projects locally. If the card contains an unreleased product screenshot, that difference matters.",
            },
            {
                type: "h2",
                text: "When to choose Canva",
            },
            {
                type: "ul",
                items: [
                    "You need a general design tool, not just an OG image.",
                    "Your brand assets, fonts, and templates already live in Canva.",
                    "You want collaboration, comments, and shared folders.",
                    "You are designing a campaign with several formats, not one card.",
                ],
            },
            {
                type: "h2",
                text: "When to choose ogimg.in",
            },
            {
                type: "ul",
                items: [
                    "You need a correct 1200 x 630 card in the next few minutes.",
                    "You want the social preview and the meta tags in the same place.",
                    "You do not want to create an account or upload an unreleased screenshot.",
                    "You want a free tool with no watermark.",
                    "You want to inspect or self-host the source.",
                ],
            },
            {
                type: "h2",
                text: "Can you use both?",
            },
            {
                type: "p",
                text: "Yes. Use Canva for the campaign and the brand system, and ogimg.in for the link cards that need to be technically correct. The two jobs are different enough that keeping both is reasonable.",
            },
            {
                type: "links",
                title: "Related",
                items: [
                    {
                        href: "/learn/open-graph-image-best-practices",
                        label: "OG image best practices",
                        description: "The design rules that apply in any editor.",
                    },
                    {
                        href: "/learn/open-graph-meta-tags",
                        label: "Open Graph meta tags",
                        description: "What Canva does not generate for you.",
                    },
                    {
                        href: "/learn/open-graph-image-size",
                        label: "OG image size guide",
                        description: "The dimensions to set in a custom canvas.",
                    },
                ],
            },
        ],
        faqs: [
            {
                question: "Can I make an Open Graph image in Canva?",
                answer:
                    "Yes. Create a custom 1200 x 630 design, add the headline and brand mark, export a PNG or JPG, and add the og:image tag to your page. Canva does not generate the meta tags or simulate the social preview for you.",
            },
            {
                question: "Is ogimg.in better than Canva for OG images?",
                answer:
                    "For a focused OG card, ogimg.in is faster because it starts at the right size, shows the social preview, and generates the tags. Canva is better when you need a general design tool or a full campaign.",
            },
            {
                question: "Is Canva free?",
                answer:
                    "Canva has a free tier and paid plans. Some templates, assets, and team features require a paid plan. Check Canva's pricing page for current details in your region.",
            },
            {
                question: "Does ogimg.in require an account?",
                answer:
                    "No. The editor runs in the browser, and projects are stored in local storage. There is no sign-up, no upload, and no watermark.",
            },
            {
                question: "Which one is more private?",
                answer:
                    "ogimg.in keeps the image and copy in your browser and does not upload them. Canva is a cloud product, so designs are stored in your Canva account. Choose based on how sensitive the asset is.",
            },
            {
                question: "Can I export the same file for X and LinkedIn?",
                answer:
                    "Yes. A 1200 x 630 card works for both, though LinkedIn lists 1200 x 627. The difference is rounding. Keep the content inside the safe area and one file is enough.",
            },
        ],
        sources: [
            { label: "Canva", href: "https://www.canva.com/" },
            { label: "Canva pricing", href: "https://www.canva.com/pricing/" },
            { label: "The Open Graph protocol", href: "https://ogp.me/" },
        ],
        related: ["open-graph-image-best-practices", "open-graph-meta-tags", "open-graph-image-size"],
    },
];

export function getComparison(slug: string) {
    return COMPARISONS.find((comparison) => comparison.slug === slug);
}
