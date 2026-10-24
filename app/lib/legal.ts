export const OPERATOR = "GxAditya";
export const REPO_URL = "https://github.com/GxAditya/ogimg";
export const ISSUES_URL = `${REPO_URL}/issues`;
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;

/**
 * Shown at the top of every legal page. Bump this in the same change as any
 * edit to the copy, because readers treat it as the effective date.
 */
export const LEGAL_LAST_UPDATED = "24 October 2026";

export type LegalPageLink = {
    href: string;
    label: string;
    summary: string;
};

export const LEGAL_PAGES: LegalPageLink[] = [
    {
        href: "/privacy",
        label: "Privacy Policy",
        summary: "What stays on your device, what we never receive, and how to remove it.",
    },
    {
        href: "/terms",
        label: "Terms of Service",
        summary: "The rules for using the editor, what you own, and what we answer for.",
    },
    {
        href: "/cookies",
        label: "Cookie Policy",
        summary: "No cookies are set. This lists what the site stores on your device instead.",
    },
    {
        href: "/contact",
        label: "Contact and Grievance",
        summary: "Who runs ogimg.in, how to reach them, and how complaints are handled.",
    },
];