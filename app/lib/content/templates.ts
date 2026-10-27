import type { TemplatePage } from "./types";

export const TEMPLATE_PAGES: TemplatePage[] = [
    {
        slug: "blog-post",
        title: "Blog post OG image template",
        seoTitle: "Blog Post OG Image Template — Free and Editable",
        description:
            "A free blog post OG image template at 1200 x 630. Add the headline, category, and image, then export a share-ready card from your browser.",
        published: "2026-10-22",
        updated: "2026-10-27",
        readingTime: 5,
        quickAnswer:
            "Use a 1200 x 630 card with a small category label, a six-to-ten-word headline, and an optional image on one side. Keep the headline readable at 300 pixels wide, put the brand mark inside the central safe area, and export a JPG or PNG under 1 MB. The blog post template below is free, editable in the browser, and does not add a watermark.",
        templateIds: ["blog-post", "editorial-pixel", "centered-container"],
        sections: [
            {
                type: "p",
                lead: true,
                text: "A blog post card has one job: earn the click from someone who has not read the article. The category tells them what kind of thing it is; the headline tells them why it matters. Everything else is decoration.",
            },
            {
                type: "h2",
                text: "Why this layout works",
            },
            {
                type: "template",
                templateId: "blog-post",
                alt: "A blog post Open Graph card with a category label, a headline, and an image on the right",
                caption:
                    "The split layout separates the metadata from the idea. The image supports the headline instead of competing with it.",
            },
            {
                type: "p",
                text: "The small label answers the context question before the headline does the persuasive work. The image gives the eye a place to land and makes the card feel finished, but the headline remains the largest element. That hierarchy is what survives a feed.",
            },
            {
                type: "h2",
                text: "What to put on the card",
            },
            {
                type: "ul",
                items: [
                    "**Category:** `Engineering`, `Design`, `Product`, or the name of the series. Two or three words at most.",
                    "**Headline:** the argument, not the topic. `Why our build got 40 percent faster` beats `Build performance update`.",
                    "**Image:** a crop that proves the claim. A screenshot, a diagram, or a texture. If it is dense, crop tighter.",
                    "**Brand mark:** the publication name or a small logo, in the same place across posts.",
                    "**Date or read time:** optional. It adds context only if the post is time-sensitive.",
                ],
            },
            {
                type: "template",
                templateId: "editorial-pixel",
                alt: "A type-only editorial Open Graph card with a flush-left headline and a small wordmark",
                caption:
                    "For essays and opinionated posts, a type-only card is often stronger than a generic illustration.",
            },
            {
                type: "p",
                text: "If the article is text-led, try a type-only card before adding a decorative image. The absence of a picture can make the headline feel more confident. If the article is visual, use the split layout and let the screenshot carry the proof.",
            },
            {
                type: "h2",
                text: "Size and export",
            },
            {
                type: "table",
                head: ["Setting", "Value", "Why"],
                rows: [
                    ["Canvas", "1200 x 630", "The common 1.91:1 link card"],
                    ["Headline", "72-96 px", "Readable at thumbnail size"],
                    ["Safe area", "64 px inset", "Survives a square or 2:1 crop"],
                    ["Format", "JPG or WebP", "Smaller files with photographic images"],
                    ["File size", "Under 1 MB", "Faster fetch and fewer failures"],
                ],
            },
            {
                type: "h2",
                text: "How to make it yours",
            },
            {
                type: "ol",
                items: [
                    "Open the [blog post template](/editor/blog-post).",
                    "Replace the category and headline with the actual article.",
                    "Swap the image for a crop that supports the headline.",
                    "Set the wordmark or domain line.",
                    "Check the preview at 300 px wide and in the social preview panel.",
                    "Export and copy the meta tags from the preview panel.",
                ],
            },
            {
                type: "h2",
                text: "Common mistakes",
            },
            {
                type: "ul",
                items: [
                    "Using the article title as the headline when the title is a label, not an argument.",
                    "Putting the image behind the text and losing contrast.",
                    "Letting the category label compete with the headline.",
                    "Forgetting to update the card when the headline changes.",
                ],
            },
            {
                type: "links",
                title: "Related",
                items: [
                    {
                        href: "/learn/open-graph-image-examples",
                        label: "OG image examples",
                        description: "See this layout beside seven other jobs.",
                    },
                    {
                        href: "/learn/open-graph-image-best-practices",
                        label: "Best practices",
                        description: "The type, contrast, and safe-area rules.",
                    },
                    {
                        href: "/template-gallery",
                        label: "All templates",
                        description: "45 live layouts, all editable for free.",
                    },
                ],
            },
        ],
        faqs: [
            {
                question: "What size is a blog post OG image?",
                answer:
                    "1200 x 630 pixels with a 1.91:1 ratio. It works for Facebook, LinkedIn, X, Slack, Discord, and messaging apps. Keep the headline inside the middle 80 percent.",
            },
            {
                question: "Should a blog OG image include the article title?",
                answer:
                    "Use the article's argument, not necessarily its title. A title can be a label; the card needs a reason to click. If the title is already specific and short, it can work as the headline.",
            },
            {
                question: "Can I use the featured image as the OG image?",
                answer:
                    "Only if the featured image is already a 1200 x 630 card with readable type. A square or portrait featured image will be cropped and may lose the point.",
            },
            {
                question: "Do I need a different card for every post?",
                answer:
                    "Use the same layout and brand system, but change the headline, category, and image. That keeps the series recognizable while giving each post a relevant card.",
            },
            {
                question: "Is this template free?",
                answer:
                    "Yes. It is free to edit and export, with no account and no watermark. The project is open source under the MIT license.",
            },
        ],
        related: ["open-graph-image-examples", "open-graph-image-best-practices", "how-to-create-an-open-graph-image"],
    },
    {
        slug: "podcast-cover",
        title: "Podcast cover and OG image template",
        seoTitle: "Podcast Cover Template for OG Images and Episodes",
        description:
            "A free podcast OG image template for episode links, show notes, and social posts. Add the episode title, guest, and cover art, then export at 1200 x 630.",
        published: "2026-10-22",
        updated: "2026-10-27",
        readingTime: 5,
        quickAnswer:
            "Use a 1200 x 630 card with the episode title as the headline, the guest name as the secondary line, and the show's cover art as a supporting image. Keep the show name in the domain line, not the headline. Export a JPG or PNG under 1 MB and check the card at 300 pixels wide.",
        templateIds: ["podcast-cover", "night-arc", "violet-console"],
        sections: [
            {
                type: "p",
                lead: true,
                text: "A podcast episode link competes with every other link in a feed. The show name is not the hook; the episode is. The card should make the specific conversation feel worth an hour, not remind people that the show exists.",
            },
            {
                type: "h2",
                text: "Why this layout works",
            },
            {
                type: "template",
                templateId: "podcast-cover",
                alt: "A podcast episode Open Graph card with the episode title, guest name, and cover art",
                caption:
                    "The episode title takes the largest type, the guest sits underneath, and the cover art supplies recognition.",
            },
            {
                type: "p",
                text: "The cover art is a brand asset, not an information layer. It should be placed, not stretched, and it should never crowd the headline. If the art is detailed, give it a smaller slot; a complete small image reads better than a cropped face.",
            },
            {
                type: "h2",
                text: "What to put on the card",
            },
            {
                type: "ul",
                items: [
                    "**Episode title:** the question or the promise. `How to ship a design system alone` beats `Episode 42`.",
                    "**Guest:** a name and, if useful, a role. Keep it to one line.",
                    "**Show name:** in the domain line or the wordmark, not the headline.",
                    "**Cover art:** the show's existing artwork, placed rather than stretched.",
                    "**Episode number:** optional. Useful for a long-running series, but never the main type.",
                ],
            },
            {
                type: "template",
                templateId: "night-arc",
                alt: "A dark podcast episode card with a centred headline and a product window",
                caption:
                    "A centred, atmospheric layout works for interview shows where the conversation is the draw.",
            },
            {
                type: "p",
                text: "Two shapes are worth having: a split card for guest-led episodes, where the portrait or cover art matters, and a centred card for topic-led episodes, where the question is the draw. Both use the same brand mark and type system, so the show stays recognizable.",
            },
            {
                type: "h2",
                text: "Size and export",
            },
            {
                type: "table",
                head: ["Setting", "Value", "Why"],
                rows: [
                    ["Canvas", "1200 x 630", "The common link card"],
                    ["Cover art", "Placed, not stretched", "Cropping a face is worse than showing it smaller"],
                    ["Headline", "72-88 px", "Long episode titles need room"],
                    ["Format", "JPG", "Photographic cover art compresses well"],
                    ["File size", "Under 1 MB", "Fast loading in chat apps"],
                ],
            },
            {
                type: "h2",
                text: "How to make it yours",
            },
            {
                type: "ol",
                items: [
                    "Open the [podcast cover template](/editor/podcast-cover).",
                    "Set the episode title and guest.",
                    "Place the show's cover art and check that it is not cropped.",
                    "Set the show name in the domain line.",
                    "Check the card at 300 px wide and in a messaging preview.",
                    "Export and add the image to the episode page.",
                ],
            },
            {
                type: "h2",
                text: "Common mistakes",
            },
            {
                type: "ul",
                items: [
                    "Making the show name the largest element. The episode is the hook.",
                    "Stretching square cover art into a wide slot. Place it and let the background do the work.",
                    "Using an episode number as the headline. It means nothing to a new listener.",
                    "Putting the guest name in a tiny line that disappears at thumbnail size.",
                ],
            },
            {
                type: "links",
                title: "Related",
                items: [
                    {
                        href: "/learn/open-graph-image-examples",
                        label: "OG image examples",
                        description: "See the podcast layout beside seven other jobs.",
                    },
                    {
                        href: "/learn/open-graph-image-size",
                        label: "OG image size guide",
                        description: "Dimensions and safe areas for every platform.",
                    },
                    {
                        href: "/learn/open-graph-meta-tags",
                        label: "Open Graph meta tags",
                        description: "Add the card to the episode page.",
                    },
                ],
            },
        ],
        faqs: [
            {
                question: "What size is a podcast OG image?",
                answer:
                    "1200 x 630 pixels, the same 1.91:1 link card used by most platforms. Podcast apps may also use the show's square cover art, which is a separate asset.",
            },
            {
                question: "Should the podcast cover art be the OG image?",
                answer:
                    "Not by itself. Square cover art is designed for a podcast app, not a wide link card. Use it as a supporting element in a 1200 x 630 card with the episode title.",
            },
            {
                question: "What should the headline say?",
                answer:
                    "The question or promise of the episode, in six to ten words. `How to ship a design system alone` is stronger than `Episode 42 with Jane Doe`.",
            },
            {
                question: "Can I use the same card for every episode?",
                answer:
                    "Use the same layout, type, and brand mark, but change the episode title, guest, and cover art. A series should be recognizable without being identical.",
            },
            {
                question: "Does the podcast card need the show name?",
                answer:
                    "Yes, but as a small wordmark or domain line. The episode title is the hook; the show name is the attribution.",
            },
        ],
        related: ["open-graph-image-examples", "open-graph-image-size", "open-graph-meta-tags"],
    },
    {
        slug: "saas-launch",
        title: "SaaS launch OG image template",
        seoTitle: "SaaS Launch OG Image Template — Free to Edit",
        description:
            "A free SaaS launch OG image template with a product screenshot, a short claim, and a brand mark. Edit it in the browser and export at 1200 x 630.",
        published: "2026-10-23",
        updated: "2026-10-27",
        readingTime: 5,
        quickAnswer:
            "Use a 1200 x 630 card with the outcome as the headline, a product screenshot as proof, and the product name or domain as the brand mark. Keep the claim to six to ten words and the screenshot cropped to the part that proves it. Export a JPG or PNG under 1 MB.",
        templateIds: ["saas-launch", "app-showcase", "prism-frame"],
        sections: [
            {
                type: "p",
                lead: true,
                text: "A launch card has to do two jobs at once: name the thing and show that it is real. A headline alone is a claim; a headline plus a product shot is evidence. The best launch cards keep the claim short and let the screenshot carry the detail.",
            },
            {
                type: "h2",
                text: "Why this layout works",
            },
            {
                type: "template",
                templateId: "saas-launch",
                alt: "A SaaS launch Open Graph card with a bold claim and a product screenshot",
                caption:
                    "The screenshot is the proof. The headline is the reason to care. The brand mark is the attribution.",
            },
            {
                type: "p",
                text: "The common failure is a full app window shrunk until every label is unreadable. Crop to the one panel that proves the claim. If the claim is about speed, show the fast path. If it is about clarity, show the clean view. A screenshot is not a diagram; it should look like the product, not explain it.",
            },
            {
                type: "h2",
                text: "What to put on the card",
            },
            {
                type: "ul",
                items: [
                    "**Headline:** the outcome, not the feature list. `Ship previews in 90 seconds` beats `Introducing our new preview engine`.",
                    "**Screenshot:** a crop of the product that proves the headline. One panel, not the whole window.",
                    "**Brand mark:** the product name or domain. Keep it inside the safe area.",
                    "**Label:** optional. `Now in beta` or `v2.0` adds context without competing.",
                    "**Background:** a solid or a restrained gradient. The screenshot should be the busiest element.",
                ],
            },
            {
                type: "template",
                templateId: "app-showcase",
                alt: "A product showcase card with an identity column and a full-height product shot",
                caption:
                    "A split layout gives the product half the canvas and the identity the other half. Good for a home page or a feature page.",
            },
            {
                type: "p",
                text: "If the product is not visual, do not fake a screenshot. Use a type-led card with a concrete number or a short proof line. A generic dashboard mockup reads as filler and makes the launch look less real, not more.",
            },
            {
                type: "h2",
                text: "Size and export",
            },
            {
                type: "table",
                head: ["Setting", "Value", "Why"],
                rows: [
                    ["Canvas", "1200 x 630", "The common link card"],
                    ["Headline", "72-96 px", "The claim has to land at thumbnail size"],
                    ["Screenshot", "One panel", "A full window becomes noise"],
                    ["Format", "PNG or JPG", "PNG for flat UI, JPG for photographic backgrounds"],
                    ["File size", "Under 1 MB", "Fast loading on launch day"],
                ],
            },
            {
                type: "h2",
                text: "How to make it yours",
            },
            {
                type: "ol",
                items: [
                    "Open the [SaaS launch template](/editor/saas-launch).",
                    "Write the outcome, not the feature name.",
                    "Crop the screenshot to the panel that proves it.",
                    "Set the product name and a label if the launch has a stage.",
                    "Check the card at 300 px wide; the screenshot should still read.",
                    "Export and copy the tags into the launch page.",
                ],
            },
            {
                type: "h2",
                text: "Common mistakes",
            },
            {
                type: "ul",
                items: [
                    "Using a full-window screenshot with 11 px labels. Crop to the proof.",
                    "Writing a feature list instead of an outcome.",
                    "Putting the product name in the headline and the outcome in a tiny subline.",
                    "Using a busy gradient behind the screenshot so the UI loses its edges.",
                ],
            },
            {
                type: "links",
                title: "Related",
                items: [
                    {
                        href: "/learn/open-graph-image-best-practices",
                        label: "OG image best practices",
                        description: "Hierarchy, contrast, and the thumbnail test.",
                    },
                    {
                        href: "/learn/open-graph-image-examples",
                        label: "OG image examples",
                        description: "See the launch layout beside seven other jobs.",
                    },
                    {
                        href: "/template-gallery",
                        label: "All templates",
                        description: "45 layouts, all free and editable.",
                    },
                ],
            },
        ],
        faqs: [
            {
                question: "What size is a SaaS launch OG image?",
                answer:
                    "1200 x 630 pixels with a 1.91:1 ratio. It works for the launch page, the announcement post, and the changelog entry.",
            },
            {
                question: "Should a launch OG image include a screenshot?",
                answer:
                    "Yes, when the product is visual and the screenshot proves the claim. Crop to one panel and make sure it is readable at thumbnail size. A full app window becomes noise.",
            },
            {
                question: "What should the headline say?",
                answer:
                    "The outcome in six to ten words. `Ship previews in 90 seconds` is stronger than `Introducing our new preview engine`, because it names the change in the reader's terms.",
            },
            {
                question: "Can I use the same card for Product Hunt and the launch page?",
                answer:
                    "Yes, if the card is 1200 x 630. Product Hunt and most launch surfaces accept a wide image. Check the specific listing's requirements before uploading.",
            },
            {
                question: "What if the product is not visual?",
                answer:
                    "Use a type-led card with a concrete number, a short proof line, or a diagram. Do not use a generic dashboard mockup; it reads as filler.",
            },
        ],
        related: ["open-graph-image-best-practices", "open-graph-image-examples", "open-graph-meta-tags"],
    },
    {
        slug: "changelog",
        title: "Changelog OG image template",
        seoTitle: "Changelog OG Image Template for Product Updates",
        description:
            "A free changelog OG image template for release notes and product updates. Add the version, date, and summary, then export at 1200 x 630.",
        published: "2026-10-23",
        updated: "2026-10-27",
        readingTime: 5,
        quickAnswer:
            "Use a 1200 x 630 card with the version number as the largest element, the release date as a small label, and a one-sentence summary a customer would understand. Keep the layout identical across releases so the series is recognizable. Export a PNG or JPG under 1 MB.",
        templateIds: ["changelog", "stat-rail", "graphite-window"],
        sections: [
            {
                type: "p",
                lead: true,
                text: "A changelog card is part of a series, so consistency matters more than novelty. The version number is the recognizable element; the summary is the reason to click. Keep both in the same place every release and the archive starts to look like a publication instead of a pile of announcements.",
            },
            {
                type: "h2",
                text: "Why this layout works",
            },
            {
                type: "template",
                templateId: "changelog",
                alt: "A changelog Open Graph card with a version number, a release date, and a summary",
                caption:
                    "The version and date give the card a place in time. The summary explains the change in customer language.",
            },
            {
                type: "p",
                text: "The version number is doing the work of a series mark. It should be large enough to read at thumbnail size and always in the same position. The date is secondary. The summary should pass the \"would a customer say this?\" test; internal commit language fails it immediately.",
            },
            {
                type: "h2",
                text: "What to put on the card",
            },
            {
                type: "ul",
                items: [
                    "**Version:** `v2.4`, `2026.10`, or the release name. Keep the format consistent.",
                    "**Date:** a short label such as `October 2026` or `27 Oct 2026`.",
                    "**Summary:** one sentence in customer language. `Brand kits now apply in one click` beats `Refactored brand kit application`. ",
                    "**Brand mark:** the product name or domain, in the same place as the rest of the series.",
                    "**Visual:** optional. A before/after crop or a single UI detail. Do not show the whole app.",
                ],
            },
            {
                type: "template",
                templateId: "stat-rail",
                alt: "A metrics card with a large number, a supporting label, and a brand mark",
                caption:
                    "For a performance release, a single number can carry the card better than a screenshot.",
            },
            {
                type: "p",
                text: "If the release is about a number, use the metrics layout: one figure, one label, one source. A card with three numbers has no number. If the release is about a flow, show the before/after in two small panels rather than one dense screenshot.",
            },
            {
                type: "h2",
                text: "Size and export",
            },
            {
                type: "table",
                head: ["Setting", "Value", "Why"],
                rows: [
                    ["Canvas", "1200 x 630", "The common link card"],
                    ["Version", "96-140 px", "The series mark; it has to read at thumbnail size"],
                    ["Summary", "36-44 px", "Secondary, but still legible"],
                    ["Format", "PNG", "Flat colour and crisp type"],
                    ["File size", "Under 1 MB", "Fast loading in a feed"],
                ],
            },
            {
                type: "h2",
                text: "How to make it yours",
            },
            {
                type: "ol",
                items: [
                    "Open the [changelog template](/editor/changelog).",
                    "Set the version and date.",
                    "Write the summary in customer language.",
                    "Add a visual only if it proves the change.",
                    "Keep the layout identical to the previous release.",
                    "Export and add the card to the release page.",
                ],
            },
            {
                type: "h2",
                text: "Common mistakes",
            },
            {
                type: "ul",
                items: [
                    "Using internal commit language in the summary.",
                    "Changing the layout every release, so the series loses recognition.",
                    "Making the date larger than the version.",
                    "Showing a full app screenshot for a one-line change.",
                ],
            },
            {
                type: "links",
                title: "Related",
                items: [
                    {
                        href: "/learn/open-graph-image-examples",
                        label: "OG image examples",
                        description: "See the changelog layout beside seven other jobs.",
                    },
                    {
                        href: "/learn/open-graph-image-best-practices",
                        label: "Best practices",
                        description: "Build a recognizable card system.",
                    },
                    {
                        href: "/changelog",
                        label: "The ogimg.in changelog",
                        description: "See the pattern in use.",
                    },
                ],
            },
        ],
        faqs: [
            {
                question: "What size is a changelog OG image?",
                answer:
                    "1200 x 630 pixels with a 1.91:1 ratio. Use the same size for every release so the archive has a consistent rhythm.",
            },
            {
                question: "What should a changelog card say?",
                answer:
                    "The version, the date, and one sentence a customer would understand. Put the version in the largest type and the summary underneath. Avoid internal language and commit messages.",
            },
            {
                question: "Should every changelog entry have its own image?",
                answer:
                    "Yes, if you share the entries individually. Use the same layout and change the version, date, and summary. A series should be recognizable at a glance.",
            },
            {
                question: "Can I use a screenshot for a changelog card?",
                answer:
                    "Only if the screenshot proves the change. Crop to the before/after or the single panel that matters. A full app window is too dense for a card.",
            },
            {
                question: "Do I need a changelog card for an internal release?",
                answer:
                    "No. Make cards for releases customers can see. Internal refactors do not need a public card unless they change something a customer would notice.",
            },
        ],
        related: ["open-graph-image-examples", "open-graph-image-best-practices", "open-graph-meta-tags"],
    },
    {
        slug: "github-social-preview",
        title: "GitHub social preview template",
        seoTitle: "GitHub Social Preview Template (1280x640)",
        description:
            "A free GitHub social preview template at 1280 x 640. Add the repo name, tagline, and language, then export an image GitHub can use for link cards.",
        published: "2026-10-24",
        updated: "2026-10-27",
        readingTime: 5,
        quickAnswer:
            "GitHub's social preview image is 1280 x 640 pixels (2:1), not 1200 x 630. Use the repo name as the headline, a one-line description, and a simple brand or language mark. Keep the file under 1 MB and upload it in the repository settings under Social preview.",
        templateIds: ["minimalist-tech", "graphite-window", "editorial-pixel"],
        sections: [
            {
                type: "p",
                lead: true,
                text: "GitHub uses a social preview image when a repository link is shared on social platforms, in chat, and in some search results. It is a different surface from an Open Graph card, with a different size and a different job: explain the repository, not a single article.",
            },
            {
                type: "callout",
                tone: "warning",
                title: "1280 x 640, not 1200 x 630",
                text: "GitHub's social preview is 2:1. A 1200 x 630 file will be cropped or letterboxed. Use the custom size controls in the editor and export at 1280 x 640.",
            },
            {
                type: "h2",
                text: "Why this layout works",
            },
            {
                type: "template",
                templateId: "minimalist-tech",
                alt: "A repository social preview card with a narrow text rail and a product screenshot",
                caption:
                    "The repo name and one-line description are enough. A screenshot is optional; a code sample or a diagram can work better.",
            },
            {
                type: "p",
                text: "The repository name is the headline. The description is the supporting line. A language badge, a star count, or a small logo can add context, but none of them should compete with the name. This is an identity card, not a launch poster, so clarity beats decoration.",
            },
            {
                type: "h2",
                text: "What to put on the card",
            },
            {
                type: "ul",
                items: [
                    "**Repository name:** the exact `owner/repo` or the project name. Make it the largest element.",
                    "**Description:** one line, six to twelve words. The same line as the GitHub description works.",
                    "**Language or stack:** a small badge, if it helps the right person self-select.",
                    "**Brand mark:** an icon or wordmark, small and consistent.",
                    "**Visual:** a code snippet, a diagram, or a screenshot. Keep it legible at 300 px wide.",
                ],
            },
            {
                type: "template",
                templateId: "editorial-pixel",
                alt: "An editorial repository card with a flush-left headline and a small wordmark",
                caption:
                    "For libraries and writing-heavy projects, a type-only card is often stronger than a screenshot.",
            },
            {
                type: "p",
                text: "If the project is a library, show the API call or the import line rather than a generic gradient. If it is an app, show the one screen that explains it. If it is a list or a guide, show the title and let the type carry it.",
            },
            {
                type: "h2",
                text: "Size and upload",
            },
            {
                type: "table",
                head: ["Setting", "Value", "Why"],
                rows: [
                    ["Canvas", "1280 x 640", "GitHub's 2:1 social preview"],
                    ["Headline", "80-110 px", "The repo name has to read at thumbnail size"],
                    ["Description", "32-40 px", "One line, not a paragraph"],
                    ["Format", "PNG", "Crisp type and flat colour"],
                    ["File size", "Under 1 MB", "GitHub's limit and a faster fetch"],
                ],
            },
            {
                type: "h2",
                text: "How to make it yours",
            },
            {
                type: "ol",
                items: [
                    "Open a template and switch the canvas to 1280 x 640.",
                    "Set the repository name as the headline.",
                    "Add the one-line description and a stack badge.",
                    "Add a code snippet or screenshot only if it explains the project.",
                    "Export a PNG under 1 MB.",
                    "Upload it in the repository settings under Social preview.",
                ],
            },
            {
                type: "h2",
                text: "Common mistakes",
            },
            {
                type: "ul",
                items: [
                    "Using 1200 x 630 for a 2:1 GitHub slot.",
                    "Putting the owner name above the repo name and making it larger.",
                    "Using a screenshot of the README instead of a designed card.",
                    "Adding six badges that turn into noise at thumbnail size.",
                ],
            },
            {
                type: "links",
                title: "Related",
                items: [
                    {
                        href: "/learn/open-graph-image-size",
                        label: "OG image size guide",
                        description: "How GitHub's 2:1 slot differs from the 1.91:1 Open Graph card.",
                    },
                    {
                        href: "/learn/open-graph-image-best-practices",
                        label: "Best practices",
                        description: "Type, contrast, and the safe area.",
                    },
                    {
                        href: "/studio",
                        label: "Custom canvas",
                        description: "Set 1280 x 640 and build the card from scratch.",
                    },
                ],
            },
        ],
        faqs: [
            {
                question: "What size is a GitHub social preview image?",
                answer:
                    "1280 x 640 pixels, a 2:1 ratio. It is not the same as the 1200 x 630 Open Graph card, so export a separate file for GitHub.",
            },
            {
                question: "Where do I upload the GitHub social preview?",
                answer:
                    "In the repository settings, under Social preview. The image is used when the repository link is shared on social platforms and in some chat clients.",
            },
            {
                question: "What should the GitHub social preview say?",
                answer:
                    "The repository name as the headline and a one-line description underneath. Add a stack badge or a small visual only if it helps someone decide whether the project is for them.",
            },
            {
                question: "Can I use the same image for GitHub and my site's OG card?",
                answer:
                    "Not without cropping. GitHub uses 2:1; Open Graph uses 1.91:1. Make a 1280 x 640 variant and keep the 1200 x 630 card for the site.",
            },
            {
                question: "Does GitHub generate a social preview automatically?",
                answer:
                    "GitHub can use a default image, but a custom social preview gives you control over the headline, description, and brand. Upload a designed 1280 x 640 image instead of relying on the default.",
            },
        ],
        related: ["open-graph-image-size", "open-graph-image-best-practices", "open-graph-meta-tags"],
    },
    {
        slug: "linkedin",
        title: "LinkedIn OG image template",
        seoTitle: "LinkedIn OG Image Template (1200x627)",
        description:
            "A free LinkedIn link preview template at 1200 x 627. Add a short headline and brand mark, then export a card that survives LinkedIn's shared link layout.",
        published: "2026-10-24",
        updated: "2026-10-27",
        readingTime: 5,
        quickAnswer:
            "LinkedIn recommends 1200 x 627 pixels for shared link previews, a 1.91:1 ratio. Keep the headline to six to ten words inside the central safe area, put the brand mark in the same place as your other cards, and export a PNG or JPG under 1 MB.",
        templateIds: ["centered-container", "teal-grid", "app-showcase"],
        sections: [
            {
                type: "p",
                lead: true,
                text: "LinkedIn often places the preview image beside the post copy rather than above it, so the card has less room than it does on Facebook. That makes hierarchy more important, not less: the headline has to be readable at a glance and the brand has to be recognizable without a second look.",
            },
            {
                type: "h2",
                text: "Why this layout works",
            },
            {
                type: "template",
                templateId: "centered-container",
                alt: "A centred LinkedIn link preview card with a short headline, a rule, and a wordmark",
                caption:
                    "A centred composition survives LinkedIn's smaller, side-by-side preview because the meaning is never near an edge.",
            },
            {
                type: "p",
                text: "LinkedIn is a professional feed, so the card can be quieter than a consumer social card. A short claim, a clear brand mark, and a restrained background often outperform a busy illustration. If the post is a job listing or a report, name the specific role or finding; do not use a generic corporate gradient.",
            },
            {
                type: "h2",
                text: "What to put on the card",
            },
            {
                type: "ul",
                items: [
                    "**Headline:** the finding, the role, or the argument. Six to ten words.",
                    "**Brand mark:** the company or publication name, inside the safe area.",
                    "**Label:** optional. `Report`, `Hiring`, or `Webinar` gives context quickly.",
                    "**Visual:** a chart, a product shot, or nothing. Do not add a stock photo that says nothing.",
                    "**Contrast:** dark type on light or light type on dark. LinkedIn feeds are often bright.",
                ],
            },
            {
                type: "template",
                templateId: "teal-grid",
                alt: "A teal LinkedIn preview card with a bold headline and a structured grid",
                caption:
                    "A structured background gives the card a professional tone without adding another competing element.",
            },
            {
                type: "p",
                text: "LinkedIn's shared link card can show the image at a smaller width than X or Facebook, depending on the placement. Test the card at 300 px wide and make sure the headline is still legible. If it is not, cut words before shrinking the type.",
            },
            {
                type: "h2",
                text: "Size and export",
            },
            {
                type: "table",
                head: ["Setting", "Value", "Why"],
                rows: [
                    ["Canvas", "1200 x 627", "LinkedIn's recommended shared-link size"],
                    ["Headline", "72-92 px", "Readable in a smaller side-by-side preview"],
                    ["Safe area", "64 px inset", "Survives the container crop"],
                    ["Format", "PNG or JPG", "PNG for flat colour, JPG for photos"],
                    ["File size", "Under 1 MB", "Fast loading in the feed"],
                ],
            },
            {
                type: "h2",
                text: "How to make it yours",
            },
            {
                type: "ol",
                items: [
                    "Open a template and set the canvas to 1200 x 627.",
                    "Write the finding, role, or argument in six to ten words.",
                    "Set the brand mark and an optional label.",
                    "Check the card at 300 px wide.",
                    "Export and add the image to the shared page.",
                    "Inspect the URL with the LinkedIn Post Inspector.",
                ],
            },
            {
                type: "h2",
                text: "Common mistakes",
            },
            {
                type: "ul",
                items: [
                    "Using a square image that LinkedIn crops into a wide slot.",
                    "Putting the company name in the headline and the idea in a subline.",
                    "Using a stock photo that adds no information.",
                    "Forgetting to refresh the preview with the Post Inspector after a change.",
                ],
            },
            {
                type: "links",
                title: "Related",
                items: [
                    {
                        href: "/learn/open-graph-image-size",
                        label: "OG image size guide",
                        description: "LinkedIn's 1200 x 627 beside every other platform.",
                    },
                    {
                        href: "/learn/open-graph-image-best-practices",
                        label: "Best practices",
                        description: "The thumbnail test and the safe area.",
                    },
                    {
                        href: "/learn/og-image-not-showing",
                        label: "Preview not updating?",
                        description: "The LinkedIn Post Inspector and cache fixes.",
                    },
                ],
            },
        ],
        faqs: [
            {
                question: "What size is a LinkedIn OG image?",
                answer:
                    "LinkedIn recommends 1200 x 627 pixels for shared link previews, a 1.91:1 ratio. A 1200 x 630 Open Graph image is close enough and works in practice.",
            },
            {
                question: "Does LinkedIn use og:image or twitter:image?",
                answer:
                    "LinkedIn reads Open Graph tags, primarily og:image, og:title, and og:description. It does not rely on twitter:image.",
            },
            {
                question: "Why is my LinkedIn preview image cropped?",
                answer:
                    "LinkedIn uses its own container and may show the image beside the post copy. Keep the headline and brand mark inside the middle 80 percent and at least 64 pixels from the edges.",
            },
            {
                question: "How do I refresh a LinkedIn preview?",
                answer:
                    "Use the LinkedIn Post Inspector with the page URL. If the old image persists, change the image filename and update og:image, then inspect again.",
            },
            {
                question: "Should a LinkedIn card use a stock photo?",
                answer:
                    "Only if the photo adds information. A generic stock image makes the card look like an ad. A chart, a product shot, or a type-only layout is usually stronger.",
            },
        ],
        related: ["open-graph-image-size", "open-graph-image-best-practices", "og-image-not-showing"],
    },
];

export function getTemplatePage(slug: string) {
    return TEMPLATE_PAGES.find((page) => page.slug === slug);
}
