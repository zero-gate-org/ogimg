type JsonLdObject = Record<string, unknown>;

/**
 * Renders one or more JSON-LD objects as a single @graph. Keeping it in one
 * script makes the entity relationships (Organization -> WebSite -> Article)
 * explicit instead of leaving several disconnected blobs on the page.
 */
export function JsonLd({ items }: { items: JsonLdObject[] }) {
    if (!items.length) return null;

    const payload = {
        "@context": "https://schema.org",
        "@graph": items,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
            }}
        />
    );
}
