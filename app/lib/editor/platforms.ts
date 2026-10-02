export interface SizePreset {
    id: string;
    label: string;
    hint: string;
    width: number;
    height: number;
}

/**
 * Real platform crops. Sizes come from each platform's own preview spec rather
 * than invented values, so a user picking one gets a card that is not cropped.
 */
export const SIZE_PRESETS: SizePreset[] = [
    {
        id: "og",
        label: "Open Graph",
        hint: "1200 x 630, Facebook and Slack link previews",
        width: 1200,
        height: 630,
    },
    {
        id: "x",
        label: "X Summary Large",
        hint: "1200 x 628, the closest match to Open Graph",
        width: 1200,
        height: 628,
    },
    {
        id: "linkedin",
        label: "LinkedIn",
        hint: "1200 x 627, recommended feed card ratio",
        width: 1200,
        height: 627,
    },
    {
        id: "product-hunt",
        label: "Product Hunt",
        hint: "1274 x 760, gallery thumbnail crop",
        width: 1274,
        height: 760,
    },
    {
        id: "youtube",
        label: "YouTube Thumbnail",
        hint: "1280 x 720, 16:9 max resolution",
        width: 1280,
        height: 720,
    },
    {
        id: "square",
        label: "Square Post",
        hint: "1080 x 1080, feed posts and pinned cards",
        width: 1080,
        height: 1080,
    },
    {
        id: "story",
        label: "Story",
        hint: "1080 x 1920, full screen vertical stories",
        width: 1080,
        height: 1920,
    },
];

export const DEFAULT_SIZE_PRESET_ID = "og";

export const MIN_CANVAS_EDGE = 64;
export const MAX_CANVAS_EDGE = 3000;

export const clampDimension = (value: number) =>
    Math.round(Math.min(MAX_CANVAS_EDGE, Math.max(MIN_CANVAS_EDGE, value || MIN_CANVAS_EDGE)));

export const getSizePresetById = (id: string) =>
    SIZE_PRESETS.find((preset) => preset.id === id) ?? SIZE_PRESETS[0];

export const matchSizePreset = (width: number, height: number) =>
    SIZE_PRESETS.find((preset) => preset.width === width && preset.height === height);