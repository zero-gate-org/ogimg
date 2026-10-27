import type { ContentBlock, Guide } from "./types";
import { SITE_URL } from "../seo";

/** Relative links are useless in a file a model may read out of context. */
export function absoluteLinks(markdown: string) {
    return markdown.replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`);
}

function tableToMarkdown(head: string[], rows: string[][]) {
    const clean = (cell: string) => cell.replace(/\|/g, "\\|").replace(/\n/g, " ");
    const header = `| ${head.map(clean).join(" | ")} |`;
    const divider = `| ${head.map(() => "---").join(" | ")} |`;
    const body = rows.map((row) => `| ${row.map(clean).join(" | ")} |`);
    return [header, divider, ...body].join("\n");
}

export function blocksToMarkdown(blocks: ContentBlock[]): string {
    const parts: string[] = [];

    for (const block of blocks) {
        switch (block.type) {
            case "p":
                parts.push(block.text);
                break;
            case "h2":
                parts.push(`## ${block.text}`);
                break;
            case "h3":
                parts.push(`### ${block.text}`);
                break;
            case "ul":
                parts.push(block.items.map((item) => `- ${item}`).join("\n"));
                break;
            case "ol":
                parts.push(block.items.map((item, index) => `${index + 1}. ${item}`).join("\n"));
                break;
            case "code":
                parts.push(`\`\`\`${block.language ?? ""}\n${block.code.trim()}\n\`\`\``);
                break;
            case "table":
                parts.push(tableToMarkdown(block.head, block.rows));
                if (block.caption) parts.push(`*${block.caption}*`);
                break;
            case "callout":
                parts.push(`> **${block.title ?? "Note"}:** ${block.text}`);
                break;
            case "quote":
                parts.push(`> ${block.text}${block.cite ? `\n> — ${block.cite}` : ""}`);
                break;
            case "links":
                parts.push(
                    [
                        block.title ? `**${block.title}**` : "",
                        ...block.items.map(
                            (item) => `- [${item.label}](${item.href})${item.description ? `: ${item.description}` : ""}`,
                        ),
                    ]
                        .filter(Boolean)
                        .join("\n"),
                );
                break;
            case "template":
                parts.push(
                    `*Live template preview:* [${block.templateId}](${SITE_URL}/editor/${block.templateId})${
                        block.caption ? `\n\n${block.caption}` : ""
                    }`,
                );
                break;
            case "divider":
                parts.push("---");
                break;
            default:
                break;
        }
    }

    return absoluteLinks(parts.join("\n\n"));
}

export function guideToMarkdown(guide: Guide, path: string, section: string) {
    const lines = [
        `# ${guide.title}`,
        "",
        `Canonical: ${SITE_URL}${path}`,
        `Section: ${section}`,
        `Published: ${guide.published}`,
        `Updated: ${guide.updated}`,
        `Reading time: ${guide.readingTime} minutes`,
        "",
        guide.description,
        "",
        "## Short answer",
        "",
        guide.quickAnswer,
        "",
        "## Key facts",
        "",
        ...guide.keyFacts.map((fact) => `- ${fact.label}: ${fact.value}`),
        "",
        blocksToMarkdown(guide.sections),
        "",
        "## Frequently asked questions",
        "",
        ...guide.faqs.flatMap((faq) => [`### ${faq.question}`, "", faq.answer, ""]),
    ];

    if (guide.sources?.length) {
        lines.push("## Sources", "", ...guide.sources.map((source) => `- [${source.label}](${source.href})`), "");
    }

    if (guide.related.length) {
        lines.push(
            "## Related",
            "",
            ...guide.related.map((slug) => `- ${SITE_URL}/learn/${slug}`),
            "",
        );
    }

    return absoluteLinks(lines.join("\n"));
}
