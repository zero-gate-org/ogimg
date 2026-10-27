import type { Guide } from "../types";

export const howToCreateAnOpenGraphImage: Guide = {
    slug: "how-to-create-an-open-graph-image",
    title: "How to create an Open Graph image",
    seoTitle: "How to Create an Open Graph Image (Free, 2026)",
    description:
        "A step-by-step guide to creating an Open Graph image at 1200 x 630, exporting it, adding the og:image tag, and checking the preview on each platform.",
    category: "Fundamentals",
    published: "2026-10-22",
    updated: "2026-10-27",
    readingTime: 8,
    quickAnswer:
        "Create a 1200 x 630 canvas, put one six-to-ten-word headline and your brand mark inside the central safe area, export a JPG or PNG under 1 MB, upload it to a public HTTPS URL, then add `og:image`, `og:image:width`, `og:image:height`, and `og:url` to the page's head. Finish by checking the live URL in the Facebook Sharing Debugger, LinkedIn Post Inspector, and an X draft.",
    keyFacts: [
        { label: "Canvas", value: "1200 x 630 px (1.91:1)" },
        { label: "Headline", value: "6-10 words" },
        { label: "Export", value: "JPG, PNG, or WebP under 1 MB" },
        { label: "Upload", value: "Public HTTPS URL" },
        { label: "Minimum tags", value: "og:title, og:type, og:image, og:url" },
        { label: "Check", value: "Debugger plus a real composer preview" },
    ],
    sections: [
        {
            type: "p",
            lead: true,
            text: "An Open Graph image has two halves: the picture and the tag that points at it. Most guides cover one and skip the other. This one walks through both, in the order that prevents rework: decide the message, design the card, export it, publish it, declare it, and check what the platforms actually show.",
        },
        {
            type: "h2",
            text: "Before you design: choose the one thing",
        },
        {
            type: "p",
            text: "A link card is not a landing page. It has one job: earn the click from someone scrolling a feed. The card that tries to say three things says nothing. Write the headline first, as a sentence, and cut it until it is six to ten words. Then decide whether the card needs a product shot, an abstract background, or type alone.",
        },
        {
            type: "table",
            head: ["Page type", "Card idea", "What to show"],
            rows: [
                ["Blog post", "The argument, not the category", "The headline plus a small label such as `Engineering`"],
                ["Product launch", "The outcome", "The product name, one benefit, and a screenshot or mark"],
                ["Changelog", "The version and the change", "A version number, a short summary, and the date"],
                ["Podcast episode", "The guest or the question", "Episode title, guest name, and cover art"],
                ["Documentation", "The task", "The exact task, the product mark, and a code-like detail"],
                ["Home page", "The category", "The product name and the category it belongs to"],
            ],
        },
        {
            type: "h2",
            text: "The eight-step workflow",
        },
        {
            type: "ol",
            items: [
                "**Write the headline.** Six to ten words. Put the specific noun first.",
                "**Open a 1200 x 630 canvas.** Use a template, a design tool, or code. Do not start from a square.",
                "**Lay out inside the safe area.** Keep type and the logo at least 64 px from every edge, and keep the headline in the middle 80 percent.",
                "**Set the type large.** A headline around 72-96 px at 1200 px wide is a good starting point. Check it at 300 px wide.",
                "**Add the brand.** A wordmark, a domain, or a small logo. It should be identifiable at thumbnail size.",
                "**Export a compressed file.** JPG or WebP for photographic backgrounds, PNG for flat colour. Target under 1 MB.",
                "**Upload to a public URL.** It must return HTTP 200 without a login. Use the final CDN URL, not a preview URL.",
                "**Add the tags and test.** Put the Open Graph tags in the head, then check the URL in the platform debuggers.",
            ],
        },
        {
            type: "callout",
            tone: "tip",
            title: "Design at 1200 px, judge at 300 px",
            text: "Zoom the canvas out until the whole card is roughly the width of a phone thumbnail. If the headline is still readable and the brand is still recognisable, the card will survive a feed. If not, cut words and increase the type size.",
        },
        {
            type: "h2",
            text: "Method 1: use a template",
        },
        {
            type: "p",
            text: "A template is the fastest path when the layout is not the point. Pick a card that matches the job, replace the headline, swap the logo, and export. The advantage is composition: the spacing, type scale, and safe area are already decided, so you are not rebuilding the same card for every post.",
        },
        {
            type: "ol",
            items: [
                "Open the [template gallery](/template-gallery) and choose a layout by job, not by colour.",
                "Replace the headline with your six-to-ten-word line.",
                "Set the logo or wordmark. Keep it inside the safe area.",
                "Switch the background if the brand needs it, then check the contrast.",
                "Open the preview panel and confirm the 1200 x 630 crop.",
                "Export PNG, JPEG, or WebP at 1x. Copy the meta tags from the preview panel.",
            ],
        },
        {
            type: "p",
            text: "The [free canvas](/studio) is the better choice when the card needs a specific composition that no template covers, such as a screenshot with callouts or a data-heavy launch card. It exposes every layer, so you can place the headline, the product shot, and the mark exactly where you want them.",
        },
        {
            type: "h2",
            text: "Method 2: design it yourself",
        },
        {
            type: "p",
            text: "Any editor that supports a custom canvas works. The rules are the same: 1200 x 630, one idea, high contrast, a brand mark, and a safe area. A few practical constraints save time:",
        },
        {
            type: "ul",
            items: [
                "**Use one typeface.** A display face for the headline and a neutral sans for the small line is enough. More than two faces starts to look like a poster, not a card.",
                "**Use one accent colour.** The background can be a gradient, but the type should sit on a predictable value. Mid-tone gradients behind body text are the most common legibility failure.",
                "**Do not rely on transparency.** Export a solid background. Some platforms composite transparent PNGs onto black or white.",
                "**Leave the corners empty.** A square crop is common in messaging apps. Corner decoration disappears; corner text looks broken.",
                "**Check the file size.** A 1200 x 630 PNG with a photographic background can easily pass 1 MB. Export a JPG at 85 percent or a WebP at 80 percent instead.",
            ],
        },
        {
            type: "h2",
            text: "Method 3: generate it in code",
        },
        {
            type: "p",
            text: "If the image has to change per page, generate it at request time or build time. The advantage is consistency: every article gets a card with its own title, and no one has to open a design tool. The trade-off is that the layout has to be expressed as code, so keep it simple.",
        },
        {
            type: "code",
            language: "tsx",
            label: "Next.js App Router: a dynamic OG image",
            code: `// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, textTransform: "uppercase" }}>
          example.com
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -3 }}>
          {post.title}
        </div>
        <div style={{ fontSize: 26, color: "#a3a3a3" }}>{post.category}</div>
      </div>
    ),
    size,
  );
}`,
        },
        {
            type: "p",
            text: "Next.js automatically adds the generated image to the page's metadata when the file convention is used. If you need the URL in a custom tag, use `generateMetadata` and point `openGraph.images` at it. The [Next.js Open Graph guide](/learn/nextjs-open-graph-image) covers the metadata side and the caching rules.",
        },
        {
            type: "h2",
            text: "Upload and declare the image",
        },
        {
            type: "p",
            text: "The image has to live at a public, stable URL. The simplest option is a static file in your site's public directory or on a CDN. The URL should not require a session, a cookie, or a referrer header. If your CDN has hotlink protection, allow the social crawlers or the preview will fail even though the image opens in your browser.",
        },
        {
            type: "code",
            language: "html",
            label: "The minimum tags for the page",
            code: `<meta property="og:title" content="How to create an Open Graph image" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://example.com/blog/open-graph-image" />
<meta property="og:image" content="https://example.com/og/open-graph-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="A dark card with the headline: How to create an Open Graph image" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://example.com/og/open-graph-image.png" />`,
        },
        {
            type: "p",
            text: "The image URL and the page URL are different. `og:url` is the page; `og:image` is the picture. Mixing them up is one of the most common reasons a preview shows a page instead of an image.",
        },
        {
            type: "h2",
            text: "Test the preview like a stranger",
        },
        {
            type: "ol",
            items: [
                "Open the image URL in a private window. If it asks for a login, the crawler cannot fetch it.",
                "Run the page URL through the Facebook Sharing Debugger. Confirm the image, title, and description.",
                "Run it through the LinkedIn Post Inspector. LinkedIn caches separately from Facebook.",
                "Paste the URL into an X draft. Look at the card, not just the title.",
                "Paste it into Slack and Discord. Both show a different container and both cache.",
                "Open it on a phone. The preview should still read at arm's length.",
            ],
        },
        {
            type: "callout",
            tone: "warning",
            title: "Changing the image at the same URL",
            text: "Platforms cache by URL. If you replace `card.png` with a new design, the old preview can stick around for weeks. Publish the new file as `card-v2.png` and update `og:image`, or force a re-scrape in the platform's debugger.",
        },
        {
            type: "h2",
            text: "A note on automation",
        },
        {
            type: "p",
            text: "If you publish often, generate the card as part of the build. A template with a fixed layout and a variable headline is easier to keep consistent than a folder of one-off exports. Keep the type size and the safe area in the template, and let the headline be the only variable. That is the difference between a card system and a pile of images.",
        },
        {
            type: "links",
            title: "Related",
            items: [
                {
                    href: "/learn/what-is-an-open-graph-image",
                    label: "What is an Open Graph image?",
                    description: "The definition, the required tags, and where previews appear.",
                },
                {
                    href: "/learn/open-graph-image-size",
                    label: "OG image size guide",
                    description: "Platform sizes, safe areas, and file weight.",
                },
                {
                    href: "/learn/open-graph-image-best-practices",
                    label: "OG image best practices",
                    description: "The design rules that survive every feed.",
                },
                {
                    href: "/template-gallery",
                    label: "Start from a template",
                    description: "45 editable 1200 x 630 layouts, free and browser-based.",
                },
            ],
        },
    ],
    howTo: [
        {
            name: "Write the headline",
            text: "Write a six-to-ten-word line that gives one reason to click. Put the specific noun first.",
        },
        {
            name: "Open a 1200 x 630 canvas",
            text: "Use a template, a design tool, or code. Start from 1200 x 630 so the 1.91:1 crop is correct from the beginning.",
        },
        {
            name: "Lay out inside the safe area",
            text: "Keep the headline, logo, and any text at least 64 pixels from every edge, and inside the middle 80 percent of the canvas.",
        },
        {
            name: "Set the type large",
            text: "Start around 72-96 pixels for the headline at 1200 pixels wide. Check it at 300 pixels wide before exporting.",
        },
        {
            name: "Add the brand",
            text: "Add a wordmark, domain, or small logo that stays recognisable at thumbnail size.",
        },
        {
            name: "Export a compressed file",
            text: "Export JPG or WebP for photographic backgrounds, PNG for flat colour, and keep the file under 1 MB.",
        },
        {
            name: "Upload to a public URL",
            text: "Upload the image to a stable HTTPS URL that returns HTTP 200 without a login, a cookie, or hotlink protection.",
        },
        {
            name: "Add the tags and test",
            text: "Add og:title, og:type, og:url, og:image, and the image dimensions to the page head, then check the URL in the platform debuggers and a real composer preview.",
        },
    ],
    faqs: [
        {
            question: "How do I create an Open Graph image for free?",
            answer:
                "Use a free 1200 x 630 template or the free canvas on ogimg.in, replace the headline and logo, and export a PNG, JPEG, or WebP. No account is required and nothing is uploaded.",
        },
        {
            question: "Do I need Photoshop to make an OG image?",
            answer:
                "No. A browser editor, a template, or even a well-composed screenshot at 1200 x 630 works. The important parts are the ratio, the readable headline, and the safe area.",
        },
        {
            question: "What should the headline say?",
            answer:
                "Six to ten words that name the specific thing and give one reason to click. Avoid repeating the site name; the card already shows the domain. Put the most important noun near the start.",
        },
        {
            question: "Where do I upload the image?",
            answer:
                "Any public HTTPS location that returns HTTP 200 without authentication. A static file in your site's public directory, an object storage bucket, or a CDN all work. Avoid signed URLs that expire.",
        },
        {
            question: "How do I add the image to my page?",
            answer:
                "Add an og:image meta tag with the absolute image URL to the page head, plus og:title, og:type, og:url, og:image:width, and og:image:height. Add twitter:card and twitter:image for X.",
        },
        {
            question: "Why does the preview still show the old image?",
            answer:
                "The platform cached the preview by URL. Change the image filename and update og:image, or force a re-scrape in the Facebook Sharing Debugger or LinkedIn Post Inspector.",
        },
        {
            question: "Can I use the same image on every page?",
            answer:
                "You can, but a generic card wastes the chance to say something specific. A template with a variable headline gives each page a relevant card without a new design each time.",
        },
        {
            question: "How long does it take?",
            answer:
                "About ten minutes once the template exists: five for the design and export, five for the upload, tags, and preview checks. Automated pipelines can generate a card per page at build time.",
        },
    ],
    sources: [
        { label: "The Open Graph protocol", href: "https://ogp.me/" },
        {
            label: "Meta: Sharing best practices",
            href: "https://developers.facebook.com/docs/sharing/webmasters/",
        },
        {
            label: "X: Cards markup",
            href: "https://developer.x.com/en/docs/x-for-websites/cards/overview/markup",
        },
        {
            label: "Next.js: Metadata and OG images",
            href: "https://nextjs.org/docs/app/getting-started/metadata-and-og-images",
        },
    ],
    related: ["what-is-an-open-graph-image", "open-graph-image-size", "open-graph-image-best-practices"],
};
