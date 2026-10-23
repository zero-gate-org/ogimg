// Emits every feature scene into one generated TypeScript module.
//
//   node app/components/iso/features/build.mjs
//
// The art modules are server-side Node scripts. This build keeps all geometry
// out of the client bundle: React only receives the finished SVG strings.

import { readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ORDER = ["layers", "snap", "type", "sizes", "local"];
const folders = readdirSync(join(here, "scenes"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => {
        const at = ORDER.indexOf(a);
        const bt = ORDER.indexOf(b);
        return (at < 0 ? 99 : at) - (bt < 0 ? 99 : bt);
    });

const rows = [];
for (const folder of folders) {
    const { default: art } = await import(`./scenes/${folder}/art.mjs`);
    for (const key of ["width", "height", "label", "loop", "still", "svg"]) {
        if (art[key] === undefined) throw new Error(`${folder}: missing ${key}`);
    }
    rows.push(
        `  ${folder}: { width: ${art.width}, height: ${art.height}, label: ${JSON.stringify(art.label)}, loop: ${art.loop}, offset: ${art.offset ?? 0}, still: ${art.still ?? 0}, svg: ${JSON.stringify(art.svg)} },`,
    );
    console.log(`${folder.padEnd(8)} ${String(art.svg.length).padStart(6)} bytes  ${art.width}x${art.height}`);
}

const output = `// GENERATED FILE - do not edit by hand.
// Source of truth: app/components/iso/features/scenes/<scene>/art.mjs
// Refresh with: node app/components/iso/features/build.mjs

export interface SceneArt {
    width: number;
    height: number;
    label: string;
    loop: number;
    offset: number;
    still: number;
    svg: string;
}

export const SCENES = {
${rows.join("\n")}
} as const satisfies Record<string, SceneArt>;

export type SceneId = keyof typeof SCENES;
`;

writeFileSync(join(here, "generated", "scenes.generated.ts"), output);
console.log(`wrote ${rows.length} scenes`);
