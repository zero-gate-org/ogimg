import type { Guide } from "../types";

export const nextjsOpenGraphImage: Guide = {
    slug: "nextjs-open-graph-image",
    title: "Next.js Open Graph images: metadata and dynamic OG cards",
    seoTitle: "Next.js Open Graph Images: Metadata and Dynamic OG",
    description:
        "Add Open Graph images in the Next.js App Router with static metadata, generateMetadata, or a dynamic opengraph-image.tsx built with next/og.",
    category: "Implementation",
    published: "2026-10-25",
    updated: "2026-10-27",
    readingTime: 9,
    quickAnswer:
        "In the Next.js App Router, set `metadataBase` to your production origin, then return an `openGraph.images` array from a static `metadata` export or `generateMetadata`. For per-page generated cards, add an `opengraph-image.tsx` file that exports `size`, `contentType`, `alt`, and a default function returning `new ImageResponse(...)` from `next/og`. Next.js adds the generated image to the page metadata automatically.",
    keyFacts: [
        { label: "Router", value: "App Router" },
        { label: "Metadata API", value: "`metadata` or `generateMetadata`" },
        { label: "Generated cards", value: "`opengraph-image.tsx`" },
        { label: "Renderer", value: "`next/og` ImageResponse" },
        { label: "Card size", value: "1200 x 630" },
        { label: "Base URL", value: "`metadataBase` required for relative URLs" },
    ],
    sections: [
        {
            type: "p",
            lead: true,
            text: "Next.js has three ways to ship an Open Graph image, and they solve different problems. A static file is the simplest. A metadata object per page is the flexible middle. A generated `opengraph-image.tsx` is the right choice when every page needs its own card and you do not want a design tool in the publish path.",
        },
        {
            type: "table",
            head: ["Approach", "Best for", "Trade-off"],
            rows: [
                ["Static file plus `metadata.openGraph.images`", "A small site with a handful of pages", "One image per page, maintained by hand"],
                ["`generateMetadata` with a computed image URL", "A CMS or database-driven site", "You still need to generate and store the images"],
                ["`opengraph-image.tsx` with `next/og`", "Per-page cards generated at request or build time", "The layout lives in code; fonts and assets need care"],
            ],
        },
        {
            type: "h2",
            text: "1. Set metadataBase once",
        },
        {
            type: "p",
            text: "`metadataBase` is the origin Next.js uses to turn relative metadata URLs into absolute ones. Without it, relative image paths can resolve against `localhost` in development and produce warnings or broken previews in production. Set it in the root layout.",
        },
        {
            type: "code",
            language: "tsx",
            label: "app/layout.tsx",
            code: `import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Example",
    template: "%s | Example",
  },
  description: "A short description of the site.",
};`,
        },
        {
            type: "p",
            text: "If the production URL comes from an environment variable, read it once and pass it to `new URL()`. Do not point `metadataBase` at a preview deployment; preview URLs are usually private and the social crawler cannot fetch them.",
        },
        {
            type: "h2",
            text: "2. Add a static Open Graph image to a page",
        },
        {
            type: "p",
            text: "A page can export its own `metadata` object. The `openGraph.images` array accepts a URL, width, height, and alt text. The same image can be reused for the X card.",
        },
        {
            type: "code",
            language: "tsx",
            label: "app/blog/[slug]/page.tsx",
            code: `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A clearer way to ship",
  description: "What changed, why it matters, and what to try first.",
  alternates: { canonical: "/blog/a-clearer-way-to-ship" },
  openGraph: {
    title: "A clearer way to ship",
    description: "What changed, why it matters, and what to try first.",
    url: "/blog/a-clearer-way-to-ship",
    siteName: "Example",
    type: "article",
    locale: "en_US",
    images: [
      {
        url: "/og/a-clearer-way-to-ship.png",
        width: 1200,
        height: 630,
        alt: "Dark card with the headline: A clearer way to ship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A clearer way to ship",
    description: "What changed, why it matters, and what to try first.",
    images: ["/og/a-clearer-way-to-ship.png"],
  },
};`,
        },
        {
            type: "p",
            text: "Because `metadataBase` is set, `/og/a-clearer-way-to-ship.png` becomes an absolute URL in the rendered HTML. You can also pass an absolute URL directly. Both work; relative paths are easier to move between environments.",
        },
        {
            type: "h2",
            text: "3. Compute the image URL with generateMetadata",
        },
        {
            type: "p",
            text: "When the page data comes from a CMS, a database, or a file system, export `generateMetadata` instead of a constant. It receives the same params as the page and can return a metadata object per URL.",
        },
        {
            type: "code",
            language: "tsx",
            label: "app/blog/[slug]/page.tsx",
            code: `import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: \`/blog/\${post.slug}\` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: \`/blog/\${post.slug}\`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [
        {
          url: post.ogImage ?? \`/og/\${post.slug}.png\`,
          width: 1200,
          height: 630,
          alt: post.ogImageAlt ?? post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.ogImage ?? \`/og/\${post.slug}.png\`],
    },
  };
}`,
        },
        {
            type: "callout",
            tone: "warning",
            title: "Metadata merging is shallow",
            text: "Next.js merges metadata from the layout and the page, but nested objects such as `openGraph` are replaced by the page value rather than deep-merged. If the page sets `openGraph`, repeat the fields you need; do not assume the layout's image or site name survives.",
        },
        {
            type: "h2",
            text: "4. Generate the card with opengraph-image.tsx",
        },
        {
            type: "p",
            text: "The file convention is the cleanest way to generate a card per route. Put `opengraph-image.tsx` in the route segment. It can export `alt`, `size`, `contentType`, and a default component. Next.js renders it and adds the correct metadata tags to the page.",
        },
        {
            type: "code",
            language: "tsx",
            label: "app/blog/[slug]/opengraph-image.tsx",
            code: `import { ImageResponse } from "next/og";

export const alt = "An article card from Example";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            letterSpacing: 1,
            color: "#a3a3a3",
          }}
        >
          <span>example.com</span>
          <span>{post.category}</span>
        </div>

        <div
          style={{
            fontSize: 78,
            lineHeight: 1.04,
            letterSpacing: -3,
            maxWidth: 980,
          }}
        >
          {post.title}
        </div>

        <div style={{ fontSize: 26, color: "#a3a3a3" }}>
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    ),
    size,
  );
}`,
        },
        {
            type: "p",
            text: "The layout above is deliberately plain: a top rail, a large headline, and a bottom line. That is enough for most article cards. Keep the padding around 64-72 px so the content survives a crop on X, and keep the headline under about 100 characters.",
        },
        {
            type: "h2",
            text: "5. Load a custom font",
        },
        {
            type: "p",
            text: "`ImageResponse` uses a default sans unless you pass fonts. To match your brand, fetch a font file and include it in the options. Keep the file small and cache the fetch; generating a card should not download a 600 KB font on every request.",
        },
        {
            type: "code",
            language: "tsx",
            label: "A cached font fetch",
            code: `import { ImageResponse } from "next/og";

const fontPromise = fetch(
  new URL("./assets/Inter-Bold.ttf", import.meta.url),
).then((response) => response.arrayBuffer());

export default async function Image() {
  const font = await fontPromise;

  return new ImageResponse(
    <div style={{ fontFamily: "Inter", fontSize: 72 }}>Hello</div>,
    {
      ...size,
      fonts: [{ name: "Inter", data: font, style: "normal", weight: 700 }],
    },
  );
}`,
        },
        {
            type: "p",
            text: "Not every route needs a custom font. If the default renders cleanly and the card is legible, skip the extra weight. The card's job is recognition and readability, not typographic fidelity.",
        },
        {
            type: "h2",
            text: "6. Caching and revalidation",
        },
        {
            type: "p",
            text: "A generated image is expensive relative to a static file. If the page content changes rarely, generate at build time with `generateStaticParams` and let the CDN serve the result. If it changes often, set a revalidation window that matches the content, and make sure the image URL changes when the design changes.",
        },
        {
            type: "ul",
            items: [
                "**Static route:** `generateStaticParams` plus the default static rendering. The image is generated once per build.",
                "**Dynamic route:** set `export const revalidate = 3600` or the appropriate interval. Do not regenerate on every request if the content has not changed.",
                "**Cache busting:** if you change the card layout, change the route or append a version to the image URL. Platforms cache by URL, independently of Next.js.",
                "**Do not fetch user-specific data.** A card that varies by cookie or session cannot be cached and may leak information.",
            ],
        },
        {
            type: "h2",
            text: "7. Common Next.js mistakes",
        },
        {
            type: "ul",
            items: [
                "**Missing `metadataBase`.** Relative image paths resolve unpredictably, especially in preview deployments.",
                "**Tags in a client component.** Client-side metadata is not in the initial HTML. Use a server component or the file convention.",
                "**Not awaiting params.** In current Next.js versions, `params` is a Promise in pages and generated image routes. Await it before reading the slug.",
                "**Duplicating the file convention and a manual image.** If `opengraph-image.tsx` exists, Next.js adds it. A manual `openGraph.images` entry can override it with a different URL.",
                "**A `localhost` image URL.** The crawler cannot reach your machine. Use the production origin.",
                "**A layout object that overwrites the page image.** Remember that nested metadata objects are replaced, not deep-merged.",
                "**Too many fonts or a huge background.** Generation time and memory use grow quickly. Keep the card simple.",
            ],
        },
        {
            type: "h2",
            text: "8. Check the rendered HTML",
        },
        {
            type: "p",
            text: "Start the production build, not the dev server, and fetch the page with `curl`. The `og:image` tag should be present in the response and should contain an absolute URL. Then open that URL and run the page through the platform debuggers.",
        },
        {
            type: "code",
            language: "bash",
            label: "Verify the tags and the image",
            code: `npm run build && npm run start
curl -sL http://localhost:3000/blog/a-clearer-way-to-ship | grep -i 'og:image'
curl -sI http://localhost:3000/blog/a-clearer-way-to-ship/opengraph-image | head`,
        },
        {
            type: "p",
            text: "The exact generated image path depends on the route and the file convention. Read the tag rather than guessing the URL. For the tag reference, see the [Open Graph meta tags guide](/learn/open-graph-meta-tags); for the dimensions, see the [OG image size guide](/learn/open-graph-image-size).",
        },
        {
            type: "links",
            title: "Related",
            items: [
                {
                    href: "/learn/open-graph-meta-tags",
                    label: "Open Graph meta tags",
                    description: "The tag reference and the common mistakes.",
                },
                {
                    href: "/learn/open-graph-image-size",
                    label: "OG image size guide",
                    description: "Dimensions, safe areas, and file weight.",
                },
                {
                    href: "/learn/wordpress-open-graph-image",
                    label: "WordPress Open Graph images",
                    description: "The plugin and code routes for WordPress.",
                },
                {
                    href: "/studio",
                    label: "Design a card first",
                    description: "Build the layout in the browser, then port it to next/og.",
                },
            ],
        },
    ],
    faqs: [
        {
            question: "How do I add an Open Graph image in Next.js?",
            answer:
                "Set metadataBase in the root layout, then return an openGraph.images array from a page's metadata or generateMetadata. For generated cards, add an opengraph-image.tsx file using ImageResponse from next/og.",
        },
        {
            question: "What is the difference between metadata and generateMetadata?",
            answer:
                "A static metadata export is evaluated once and is fine for fixed pages. generateMetadata is an async function that receives params and searchParams, so it can build tags from a CMS, database, or file system for each URL.",
        },
        {
            question: "Does Next.js add the OG image automatically?",
            answer:
                "Yes, when you use the opengraph-image file convention. Next.js renders the image and adds the metadata tags. If you set openGraph.images manually as well, your value can override the generated one.",
        },
        {
            question: "Why is my Next.js OG image URL relative?",
            answer:
                "Relative URLs are expected in the metadata object. Next.js makes them absolute using metadataBase. If metadataBase is missing or points at localhost, the rendered tag will be wrong for social crawlers.",
        },
        {
            question: "Can I use next/og without Vercel?",
            answer:
                "Yes. ImageResponse runs in the Next.js runtime and works on other hosts. Check that the deployment platform supports the runtime and that the generated image route is publicly reachable.",
        },
        {
            question: "How do I use a custom font in next/og?",
            answer:
                "Fetch the font file as an ArrayBuffer and pass it in the fonts option of ImageResponse, with a name, style, and weight. Cache the fetch outside the request so the font is not downloaded for every card.",
        },
        {
            question: "Why is my generated OG image slow?",
            answer:
                "The usual causes are a large font, a large background image, or generating on every request without caching. Generate at build time where possible, set a revalidation window, and keep the layout simple.",
        },
        {
            question: "Can I generate a Twitter card image in Next.js too?",
            answer:
                "Yes. Add a twitter-image.tsx file with the same ImageResponse pattern, or point twitter.images at the same URL as the Open Graph image. Most sites use one card for both.",
        },
    ],
    sources: [
        {
            label: "Next.js: Metadata and OG images",
            href: "https://nextjs.org/docs/app/getting-started/metadata-and-og-images",
        },
        {
            label: "Next.js: generateMetadata",
            href: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata",
        },
        {
            label: "Next.js: ImageResponse",
            href: "https://nextjs.org/docs/app/api-reference/functions/image-response",
        },
        { label: "The Open Graph protocol", href: "https://ogp.me/" },
    ],
    related: ["open-graph-meta-tags", "open-graph-image-size", "wordpress-open-graph-image"],
};
