import type { MetadataRoute } from "next";
import { COMPARISONS } from "./lib/content/comparisons";
import { GUIDES } from "./lib/content/guides";
import { TEMPLATE_PAGES } from "./lib/content/templates";
import { LEGAL_PAGES } from "./lib/legal";
import { SITE_LAST_UPDATED, SITE_URL } from "./lib/seo";

const asDate = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
const latest = (dates: string[]) => dates.reduce((newest, date) => (date > newest ? date : newest), dates[0]);

export default function sitemap(): MetadataRoute.Sitemap {
    const guideDates = GUIDES.map((guide) => guide.updated);
    const templateDates = TEMPLATE_PAGES.map((page) => page.updated);
    const comparisonDates = COMPARISONS.map((comparison) => comparison.updated);

    const guidesHubDate = latest([SITE_LAST_UPDATED, ...guideDates]);
    const templatesDate = latest([SITE_LAST_UPDATED, ...templateDates]);
    const compareDate = latest([SITE_LAST_UPDATED, ...comparisonDates]);

    return [
        {
            url: SITE_URL,
            lastModified: asDate(SITE_LAST_UPDATED),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/learn`,
            lastModified: asDate(guidesHubDate),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...GUIDES.map((guide) => ({
            url: `${SITE_URL}/learn/${guide.slug}`,
            lastModified: asDate(guide.updated),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),
        {
            url: `${SITE_URL}/tools`,
            lastModified: asDate(SITE_LAST_UPDATED),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/tools/open-graph-meta-tag-generator`,
            lastModified: asDate(SITE_LAST_UPDATED),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/template-gallery`,
            lastModified: asDate(templatesDate),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...TEMPLATE_PAGES.map((page) => ({
            url: `${SITE_URL}/templates/${page.slug}`,
            lastModified: asDate(page.updated),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
        {
            url: `${SITE_URL}/compare`,
            lastModified: asDate(compareDate),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        ...COMPARISONS.map((comparison) => ({
            url: `${SITE_URL}/compare/${comparison.slug}`,
            lastModified: asDate(comparison.updated),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
        {
            url: `${SITE_URL}/studio`,
            lastModified: asDate(SITE_LAST_UPDATED),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: asDate("2026-10-27"),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/changelog`,
            lastModified: asDate("2026-10-02"),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        ...LEGAL_PAGES.map((page) => ({
            url: `${SITE_URL}${page.href}`,
            lastModified: asDate("2026-10-24"),
            changeFrequency: "yearly" as const,
            priority: 0.2,
        })),
    ];
}
