import type { Guide } from "../types";

export const wordpressOpenGraphImage: Guide = {
    slug: "wordpress-open-graph-image",
    title: "WordPress Open Graph images: plugins, defaults, and code",
    seoTitle: "WordPress Open Graph Images: Yoast, Rank Math, Code",
    description:
        "Set a WordPress Open Graph image with Yoast, Rank Math, or a small code snippet. Fix missing previews, set defaults, and avoid duplicate og:image tags.",
    category: "Implementation",
    published: "2026-10-25",
    updated: "2026-10-27",
    readingTime: 7,
    quickAnswer:
        "The safest WordPress setup is one SEO plugin owning the Open Graph tags. In Yoast SEO, set a default social image in Social settings, then override it per post with the Social tab or the featured image. In Rank Math, use Titles & Meta > Social and the Social tab on the post. If you add tags by hand, disable the plugin's social module first so the page does not emit two different `og:image` tags.",
    keyFacts: [
        { label: "Best path", value: "One SEO plugin owns the tags" },
        { label: "Yoast", value: "Social settings plus per-post Social tab" },
        { label: "Rank Math", value: "Titles & Meta > Social" },
        { label: "Image size", value: "1200 x 630 px" },
        { label: "Common failure", value: "Duplicate `og:image` tags" },
        { label: "Cache", value: "Clear page cache and social cache" },
    ],
    sections: [
        {
            type: "p",
            lead: true,
            text: "WordPress can produce Open Graph tags from a plugin, a theme, or a few lines of code. The problem is that it often produces them from all three at once. The page renders, the preview looks fine in one place, and then a different platform picks the other image. The fix is almost always to choose one owner and remove the rest.",
        },
        {
            type: "h2",
            text: "Option 1: let an SEO plugin own the tags",
        },
        {
            type: "p",
            text: "Yoast SEO, Rank Math, and All in One SEO all generate Open Graph tags. If one of them is active, it should be the only source. The exact labels move between versions, but the model is the same: a site-wide default image, a per-post override, and a social preview tab.",
        },
        {
            type: "table",
            head: ["Plugin", "Default image", "Per-post override"],
            rows: [
                ["Yoast SEO", "Yoast SEO > Settings > Social > Facebook", "Post editor > Yoast panel > Social tab"],
                ["Rank Math", "Rank Math > Titles & Meta > Social", "Post editor > Rank Math > Social tab"],
                ["All in One SEO", "All in One SEO > Social Networks", "Post editor > AIOSEO Settings > Social"],
            ],
            caption:
                "Menu names vary by plugin version. If you cannot find the setting, search the plugin documentation for \"default social image\".",
        },
        {
            type: "p",
            text: "Set a default image that works for pages without a featured image, then use the featured image or the social tab for posts that need a specific card. A default is not a substitute for a per-post card; it is the fallback that prevents an empty preview on archive pages and older posts.",
        },
        {
            type: "callout",
            tone: "tip",
            title: "Use the featured image carefully",
            text: "Many plugins fall back to the featured image, which is often a square or a portrait crop. A 1200 x 1500 featured image will be cropped by the platform. If you rely on the featured image, set the social image explicitly for the posts that matter.",
        },
        {
            type: "h2",
            text: "Option 2: add the tags in code",
        },
        {
            type: "p",
            text: "If you are building a custom theme and do not want a plugin, add the tags in `functions.php` or a small site-specific plugin. Use the featured image when it exists, then fall back to a default. Escape the URL and skip the output if no image exists.",
        },
        {
            type: "code",
            language: "php",
            label: "functions.php or a site-specific plugin",
            code: `<?php
add_action('wp_head', function () {
    if (!is_singular()) {
        return;
    }

    $post_id = get_queried_object_id();
    $image_id = get_post_thumbnail_id($post_id);
    $image = $image_id ? wp_get_attachment_image_url($image_id, 'full') : '';

    if (!$image) {
        $image = get_option('og_default_image');
    }

    if (!$image) {
        return;
    }

    $title = get_the_title($post_id);
    $description = get_the_excerpt($post_id);
    $url = get_permalink($post_id);

    echo '<meta property="og:title" content="' . esc_attr($title) . '" />' . "\\n";
    echo '<meta property="og:description" content="' . esc_attr(wp_strip_all_tags($description)) . '" />' . "\\n";
    echo '<meta property="og:type" content="article" />' . "\\n";
    echo '<meta property="og:url" content="' . esc_url($url) . '" />' . "\\n";
    echo '<meta property="og:image" content="' . esc_url($image) . '" />' . "\\n";
    echo '<meta property="og:image:width" content="1200" />' . "\\n";
    echo '<meta property="og:image:height" content="630" />' . "\\n";
}, 5);
`,
        },
        {
            type: "p",
            text: "The dimensions above assume the uploaded file is actually 1200 x 630. If the featured image is a different size, either generate a 1200 x 630 crop with `add_image_size('og', 1200, 630, true)` and use that size, or read the real dimensions with `wp_get_attachment_image_src` and print those. Declaring 1200 x 630 for a 800 x 800 file is worse than omitting the tags.",
        },
        {
            type: "code",
            language: "php",
            label: "A real 1200 x 630 crop",
            code: `add_image_size('og-card', 1200, 630, true);

// In the meta output:
$image_data = wp_get_attachment_image_src($image_id, 'og-card');
$image = $image_data ? $image_data[0] : '';
$width = $image_data ? $image_data[1] : 1200;
$height = $image_data ? $image_data[2] : 630;`,
        },
        {
            type: "callout",
            tone: "warning",
            title: "Do not run this alongside a plugin",
            text: "If Yoast, Rank Math, or AIOSEO is active and its social module is on, this snippet will create a second og:image. Disable the plugin's social output first, or skip the snippet entirely.",
        },
        {
            type: "h2",
            text: "Why WordPress sites get duplicate tags",
        },
        {
            type: "p",
            text: "A typical WordPress site has a theme, a child theme, an SEO plugin, and a social plugin. Any of them can call `wp_head` and print Open Graph tags. When two do, the page has two `og:image` values and the platform chooses one. The page source reveals it immediately.",
        },
        {
            type: "code",
            language: "bash",
            label: "Count the tags on a live post",
            code: `curl -sL https://example.com/blog/post | grep -c 'property="og:image"'`,
        },
        {
            type: "p",
            text: "If the count is greater than one, find the second source. Common culprits are a theme's `functions.php`, a \"social share\" plugin, and a page builder's SEO module. Remove one, then clear the page cache and re-scrape the URL.",
        },
        {
            type: "h2",
            text: "Set a default image that is not a disaster",
        },
        {
            type: "p",
            text: "The fallback image appears on pages that have no featured image: archives, the home page, author pages, and older posts. Make it a proper 1200 x 630 card with the site name, a short value line, and the brand mark. Do not use the site logo on a transparent background; it will composite unpredictably.",
        },
        {
            type: "ul",
            items: [
                "1200 x 630, 1.91:1, with the text inside the safe area.",
                "A solid background, not a transparent PNG.",
                "The site name and the category or value line.",
                "A file under 1 MB, ideally under 300 KB.",
                "A filename that changes when the design changes, so caches refresh.",
            ],
        },
        {
            type: "h2",
            text: "Cache layers to clear",
        },
        {
            type: "p",
            text: "WordPress adds several caches between your edit and the social crawler. If the tags are correct in the page source but the preview is stale, clear them in this order:",
        },
        {
            type: "ol",
            items: [
                "The page cache (WP Rocket, LiteSpeed Cache, W3 Total Cache, or your host's cache).",
                "The CDN cache (Cloudflare, Fastly, or the host's edge).",
                "The SEO plugin's social cache, if it has one.",
                "The platform's own preview cache, via the Facebook Sharing Debugger or LinkedIn Post Inspector.",
            ],
        },
        {
            type: "p",
            text: "If the image itself changed, the platform may still hold the old file even after the page cache is clear. Change the image filename or append a version query string, then update the social image setting.",
        },
        {
            type: "h2",
            text: "A quick WordPress checklist",
        },
        {
            type: "ul",
            items: [
                "One SEO plugin owns the Open Graph output; no theme or hand-written duplicates.",
                "A default 1200 x 630 social image is set.",
                "Important posts have a specific social image, not just the featured image.",
                "The image URL is absolute and publicly reachable.",
                "The tags are in the initial HTML, not added by a client-side page builder.",
                "The post's canonical URL matches `og:url`.",
                "The page cache and CDN are cleared after a change.",
                "The live URL has been checked in the Facebook and LinkedIn debuggers.",
            ],
        },
        {
            type: "links",
            title: "Related",
            items: [
                {
                    href: "/learn/open-graph-meta-tags",
                    label: "Open Graph meta tags",
                    description: "The full tag reference and the duplicate-tag problem.",
                },
                {
                    href: "/learn/og-image-not-showing",
                    label: "OG image not showing?",
                    description: "The 12-point checklist for a broken preview.",
                },
                {
                    href: "/learn/nextjs-open-graph-image",
                    label: "Next.js Open Graph images",
                    description: "The same job in the App Router.",
                },
                {
                    href: "/template-gallery",
                    label: "A default card",
                    description: "Start from a 1200 x 630 layout and export it.",
                },
            ],
        },
    ],
    faqs: [
        {
            question: "How do I set an Open Graph image in WordPress?",
            answer:
                "Use one SEO plugin. In Yoast SEO, set a default image under Social settings and override it per post in the Social tab. In Rank Math, use Titles & Meta > Social and the post's Social tab. If you use code, hook into wp_head and print the tags from the featured image or a default.",
        },
        {
            question: "Why does WordPress show two different OG images?",
            answer:
                "A plugin, the theme, and a hand-written snippet are all emitting og:image. Search the page source for every occurrence, then disable one source. Do not run a code snippet while the plugin's social module is active.",
        },
        {
            question: "Does Yoast set Open Graph images automatically?",
            answer:
                "Yoast generates Open Graph tags and can use the featured image as the social image. For a reliable 1.91:1 card, set a dedicated social image per post or a site-wide default at 1200 x 630.",
        },
        {
            question: "What size should the default WordPress OG image be?",
            answer:
                "1200 x 630 pixels, 1.91:1, under 1 MB. Use a solid background and keep the site name and any text inside the central safe area.",
        },
        {
            question: "Why is my WordPress OG image not updating?",
            answer:
                "Clear the page cache, the CDN cache, and the SEO plugin's social cache, then re-scrape the URL in the Facebook Sharing Debugger and LinkedIn Post Inspector. If the image file changed at the same URL, rename it and update the setting.",
        },
        {
            question: "Can I add Open Graph tags without a plugin?",
            answer:
                "Yes. Hook into wp_head in a child theme or a site-specific plugin, print the tags with escaped values, and make sure no SEO plugin is already doing the same. Use the featured image or a default 1200 x 630 card.",
        },
        {
            question: "Should I use the featured image as the OG image?",
            answer:
                "Only if the featured image is already a 1200 x 630 card. A square or portrait featured image will be cropped by the platform. Generate a dedicated og-card image size or set the social image explicitly.",
        },
        {
            question: "Does the WordPress media library resize my OG image?",
            answer:
                "WordPress creates several sizes, but the social tag may point at the full-size file. If you want a guaranteed 1200 x 630 crop, register an image size with add_image_size and reference that size in the tag output.",
        },
    ],
    sources: [
        { label: "Yoast SEO: Social previews", href: "https://yoast.com/help/social-previews/" },
        {
            label: "Rank Math: Social meta",
            href: "https://rankmath.com/kb/social-meta/",
        },
        {
            label: "WordPress: add_image_size",
            href: "https://developer.wordpress.org/reference/functions/add_image_size/",
        },
        { label: "The Open Graph protocol", href: "https://ogp.me/" },
    ],
    related: ["open-graph-meta-tags", "og-image-not-showing", "nextjs-open-graph-image"],
};
