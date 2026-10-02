"use client";

import { useState } from "react";
import { Check, Plus, Trash, UploadSimple } from "@phosphor-icons/react";
import { getTemplateFontFamily, type TemplateFontId } from "../templates/fontCatalog";
import { BACKGROUND_PRESETS, type GridOverlay } from "../templates/templateShared";
import { createBrandKit } from "../../lib/editor";
import type { BrandKit } from "../../lib/editor/types";
import { ColorInput, Field, FontSelect, GhostButton, PanelEmptyState, PanelSection } from "./fields";

const DEFAULT_KIT: Omit<BrandKit, "id"> = {
    name: "My brand",
    logoImage: "",
    logoImageName: "",
    textColor: "#FAFAFA",
    fontId: "geist-sans",
    backgroundMode: "Gradient",
    gradientStart: "#111827",
    gradientEnd: "#0B0B0D",
    gradientAngle: 145,
    backgroundPresetId: "studio-sky",
    gridOverlay: "none",
    gridColor: "#E5E7EB",
    gridOpacity: 0.18,
};

export default function BrandKitsPanel({
    kits,
    onChange,
    onApply,
    onDelete,
}: {
    kits: BrandKit[];
    onChange: (kits: BrandKit[]) => void;
    onApply: (kit: BrandKit) => void;
    onDelete: (kitId: string) => void;
}) {
    const [draft, setDraft] = useState<BrandKit | null>(null);

    const patchDraft = (patch: Partial<BrandKit>) => {
        setDraft((current) => (current ? { ...current, ...patch } : current));
    };

    const startNew = () => setDraft({ ...DEFAULT_KIT, id: "" });

    const commitNew = () => {
        if (!draft) return;
        const name = draft.name.trim() || "Untitled kit";
        onChange([createBrandKit({ ...draft, name }), ...kits]);
        setDraft(null);
    };

    return (
        <div>
            <PanelSection
                title="Brand kits"
                sectionKey="kits"
                action={
                    <button
                        type="button"
                        onClick={startNew}
                        className="inline-flex items-center gap-1 border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                    >
                        <Plus size={11} />
                        New
                    </button>
                }
            >
                {kits.length === 0 && !draft ? (
                    <PanelEmptyState
                        title="No kits yet"
                        body="A kit stores your logo, type colour, font, and background so every card starts on brand."
                    />
                ) : null}

                <ul className="space-y-2">
                    {kits.map((kit) => (
                        <li key={kit.id} className="border border-border bg-surface-sunken">
                            <div className="flex items-center gap-2 px-2.5 py-2">
                                <span
                                    className="h-7 w-7 shrink-0 border border-border"
                                    style={{
                                        background: `linear-gradient(${kit.gradientAngle}deg, ${kit.gradientStart}, ${kit.gradientEnd})`,
                                    }}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[12px] font-medium text-foreground">{kit.name}</p>
                                    <p
                                        className="truncate text-[10px] uppercase tracking-wider text-muted-foreground"
                                        style={{ fontFamily: getTemplateFontFamily(kit.fontId) }}
                                    >
                                        {kit.textColor} {kit.gridOverlay}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onApply(kit)}
                                    className="shrink-0 border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                                >
                                    Apply
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(kit.id)}
                                    aria-label={`Delete ${kit.name}`}
                                    className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-destructive"
                                >
                                    <Trash size={14} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {draft ? (
                    <div className="mt-3 border border-brand bg-surface-sunken p-3">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                            New kit
                        </p>

                        <Field label="Name" htmlFor="kit-name">
                            <input
                                id="kit-name"
                                type="text"
                                value={draft.name}
                                onChange={(event) => patchDraft({ name: event.target.value })}
                                className="h-10 w-full border border-border bg-surface px-3 text-[13px] focus:border-brand focus:outline-none"
                                placeholder="Acme brand"
                            />
                        </Field>

                        <Field label="Logo" hint="Used on templates that have a logo slot.">
                            <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-border bg-surface px-3 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong">
                                <UploadSimple size={14} />
                                {draft.logoImageName || "Upload"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (typeof reader.result === "string") {
                                                patchDraft({ logoImage: reader.result, logoImageName: file.name });
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                        event.target.value = "";
                                    }}
                                />
                            </label>
                        </Field>

                        <Field label="Type colour" htmlFor="kit-color">
                            <ColorInput
                                id="kit-color"
                                value={draft.textColor}
                                onChange={(textColor) => patchDraft({ textColor })}
                            />
                        </Field>

                        <Field label="Font" htmlFor="kit-font">
                            <FontSelect
                                id="kit-font"
                                value={draft.fontId}
                                onChange={(fontId: TemplateFontId) => patchDraft({ fontId })}
                            />
                        </Field>

                        <Field label="Background preset">
                            <select
                                value={draft.backgroundPresetId}
                                onChange={(event) =>
                                    patchDraft({
                                        backgroundPresetId: event.target
                                            .value as BrandKit["backgroundPresetId"],
                                        backgroundMode: "Background",
                                    })
                                }
                                className="h-10 w-full appearance-none border border-border bg-surface px-3 text-[13px] focus:border-brand focus:outline-none"
                            >
                                {BACKGROUND_PRESETS.map((preset) => (
                                    <option key={preset.id} value={preset.id}>
                                        {preset.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Pattern overlay">
                            <select
                                value={draft.gridOverlay}
                                onChange={(event) => patchDraft({ gridOverlay: event.target.value as GridOverlay })}
                                className="h-10 w-full appearance-none border border-border bg-surface px-3 text-[13px] focus:border-brand focus:outline-none"
                            >
                                <option value="none">None</option>
                                <option value="grid">Grid</option>
                                <option value="graph">Graph</option>
                                <option value="dots">Dots</option>
                            </select>
                        </Field>

                        <div className="mt-3 flex gap-2">
                            <GhostButton onClick={() => setDraft(null)} className="flex-1">
                                Cancel
                            </GhostButton>
                            <button
                                type="button"
                                onClick={commitNew}
                                className="inline-flex h-10 flex-1 items-center justify-center gap-2 bg-brand px-3 text-[13px] font-semibold text-brand-ink transition-colors hover:bg-brand-strong"
                            >
                                <Check size={14} />
                                Save kit
                            </button>
                        </div>
                    </div>
                ) : null}
            </PanelSection>
        </div>
    );
}