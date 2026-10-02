export type ChangelogGroup = {
    label: "New" | "Improved" | "Fixed";
    items: string[];
};

export type ChangelogEntry = {
    version: string;
    date: string;
    summary: string;
    groups: ChangelogGroup[];
};

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
    {
        version: "v2.0.0",
        date: "October 2, 2026",
        summary: "A free canvas editor with layer control, alongside the template gallery.",
        groups: [
            {
                label: "New",
                items: [
                    "Added a free canvas editor with a reorderable layer stack for text, shapes, and images.",
                    "Added drag, resize, rotate, and nudge controls with snap guides to canvas edges and other layers.",
                    "Added platform size presets for Open Graph, LinkedIn, Product Hunt, YouTube, square posts, and stories, plus custom dimensions.",
                    "Added a social preview drawer for X, LinkedIn, Discord, and Slack, with copyable head tags.",
                    "Added a crop warning when the canvas ratio does not match the platform card ratio.",
                    "Added saved projects and brand kits, stored in the browser with an autosaved draft.",
                    "Added 1x, 2x, and 3x export resolution alongside PNG, JPEG, and WebP.",
                ],
            },
            {
                label: "Improved",
                items: [
                    "Rewrote the landing page around the two ways to work: templates and the free canvas.",
                    "Raised the default text layer size and made new layers size themselves from the canvas width.",
                    "Moved the design name into the centre of the editor header so it no longer reads as a tab.",
                    "Panel tabs now wrap instead of scrolling sideways.",
                    "Rebuilt the template editor on a shared shell with undo, redo, and keyboard shortcuts.",
                    "Replaced per template editor conditionals with a control schema, so a new template is one registry entry.",
                    "Added headline size, tracking, image fit, and corner radius controls to every template.",
                    "Moved font embedding into a shared export pipeline that supports multiple fonts in one file.",
                ],
            },
            {
                label: "Fixed",
                items: [
                    "Fixed template previews drifting from the exported file when zoomed.",
                    "Fixed long headlines overflowing their frame on narrow cards.",
                ],
            },
        ],
    },
    {
        version: "v1.5.0",
        date: "March 11, 2026",
        summary: "Preset expansion and changelog refresh.",
        groups: [
            {
                label: "New",
                items: [
                    "Added a dedicated changelog preview section to the landing page.",
                    "Added many more gradient, solid color, and background presets in the editor.",
                    "Added patterned background presets such as Topographic, Checker Depth, Prism Facets, Ripple Rings, and Folded Paper.",
                ],
            },
            {
                label: "Improved",
                items: [
                    "Updated changelog entries to use grouped release-note formatting instead of a flat bullet list.",
                    "Expanded background preset variety beyond mesh glows to include more structural patterns.",
                ],
            },
            {
                label: "Fixed",
                items: [
                    "Removed redundant background presets that overlapped with the existing grid, graph, and dots overlay controls.",
                ],
            },
        ],
    },
    {
        version: "v1.4.0",
        date: "March 3, 2026",
        summary: "Editor flow and export reliability update.",
        groups: [
            {
                label: "New",
                items: [
                    "Added dedicated route flow from landing page to template gallery to editor.",
                    "Added expanded typography controls with curated font selection in the editor.",
                ],
            },
            {
                label: "Improved",
                items: [
                    "Improved the local-safe export pipeline for more reliable PNG and JPEG output.",
                ],
            },
            {
                label: "Fixed",
                items: [
                    "Fixed a few export edge cases by tightening the render and asset inlining path.",
                ],
            },
        ],
    },
    {
        version: "v1.3.0",
        date: "March 2, 2026",
        summary: "Template and export expansion.",
        groups: [
            {
                label: "New",
                items: [
                    "Added new OG templates including Podcast Cover and Changelog layouts.",
                    "Added multi-format export support for PNG, JPEG, and WebP.",
                ],
            },
            {
                label: "Improved",
                items: [
                    "Improved background controls with grid, graph, and dots overlays.",
                    "Improved template customization inputs for faster editing.",
                    "Improved template preview scaling behavior across screen sizes.",
                ],
            },
            {
                label: "Fixed",
                items: [
                    "Fixed several spacing and visual polish issues across the landing experience.",
                ],
            },
        ],
    },
];