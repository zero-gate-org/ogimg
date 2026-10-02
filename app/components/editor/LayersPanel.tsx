"use client";

import {
    ArrowDown,
    ArrowUp,
    Copy,
    Eye,
    EyeSlash,
    ImageSquare,
    LockSimple,
    LockSimpleOpen,
    Minus,
    Square,
    Circle,
    Trash,
    TextT,
} from "@phosphor-icons/react";
import type { Layer, ShapeKind } from "../../lib/editor/types";
import { layerLabel, layerSubLabel } from "./FreeCanvasRender";
import { IconButton, PanelCollapseAll, PanelEmptyState, PanelSection } from "./fields";

const KIND_ICON: Record<Layer["kind"], typeof TextT> = {
    text: TextT,
    shape: Square,
    image: ImageSquare,
};

export default function LayersPanel({
    layers,
    selectedId,
    onSelect,
    onToggleHidden,
    onToggleLocked,
    onReorder,
    onDuplicate,
    onDelete,
    onAddText,
    onAddShape,
    onUploadImage,
    isUploading,
}: {
    layers: Layer[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onToggleHidden: (id: string) => void;
    onToggleLocked: (id: string) => void;
    onReorder: (id: string, direction: "up" | "down") => void;
    onDuplicate: (id: string) => void;
    onDelete: (id: string) => void;
    onAddText: () => void;
    onAddShape: (shape: ShapeKind) => void;
    onUploadImage: (file: File) => void;
    isUploading: boolean;
}) {
    return (
        <div className="flex h-full flex-col">
            <div className="scroll-y min-h-0 flex-1">
                <PanelSection title="Add layer" sectionKey="layers-add">
                    <div className="flex flex-wrap items-center gap-1 pt-2">
                        <IconButton onClick={onAddText} label="Add text layer">
                            <TextT size={15} />
                        </IconButton>
                        <IconButton onClick={() => onAddShape("rect")} label="Add rectangle">
                            <Square size={15} />
                        </IconButton>
                        <IconButton onClick={() => onAddShape("ellipse")} label="Add ellipse">
                            <Circle size={15} />
                        </IconButton>
                        <IconButton onClick={() => onAddShape("line")} label="Add line">
                            <Minus size={15} />
                        </IconButton>

                        <label
                            className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 border border-border bg-surface px-2 text-[12px] font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground ${
                                isUploading ? "opacity-50" : ""
                            }`}
                        >
                            <ImageSquare size={15} />
                            {isUploading ? "Reading" : "Image"}
                            <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                disabled={isUploading}
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) onUploadImage(file);
                                    event.target.value = "";
                                }}
                            />
                        </label>
                    </div>
                </PanelSection>

                <PanelSection
                    title="Layers"
                    sectionKey="layers-list"
                    action={
                        <span className="pr-1 font-mono text-[11px] text-muted-foreground">
                            {layers.length}
                        </span>
                    }
                >
                    {layers.length === 0 ? (
                        <div className="pt-2">
                            <PanelEmptyState
                                title="No layers yet"
                                body="Add a text layer, a shape, or upload an image. Every element stays editable after you place it."
                            />
                        </div>
                    ) : (
                        <ul className="space-y-0.5 pt-1">
                            {layers.map((layer) => {
                                const Icon = KIND_ICON[layer.kind];
                                const active = layer.id === selectedId;

                                return (
                                    <li key={layer.id}>
                                        <div
                                            className={`group flex items-center gap-2 border px-2 py-1.5 transition-colors ${
                                                active
                                                    ? "border-brand bg-brand/10"
                                                    : "border-transparent hover:border-border hover:bg-surface-raised"
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => onSelect(layer.id)}
                                                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                            >
                                                <Icon size={14} className="shrink-0 text-muted-foreground" />
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-[12px] text-foreground">
                                                        {layerLabel(layer)}
                                                    </span>
                                                    <span className="block truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                                        {layerSubLabel(layer)}
                                                    </span>
                                                </span>
                                            </button>

                                            <div className="flex shrink-0 items-center opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                                                <IconButton
                                                    onClick={() => onReorder(layer.id, "up")}
                                                    label="Bring forward"
                                                >
                                                    <ArrowUp size={12} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => onReorder(layer.id, "down")}
                                                    label="Send backward"
                                                >
                                                    <ArrowDown size={12} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => onDuplicate(layer.id)}
                                                    label="Duplicate layer"
                                                >
                                                    <Copy size={12} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => onToggleLocked(layer.id)}
                                                    label={layer.locked ? "Unlock layer" : "Lock layer"}
                                                >
                                                    {layer.locked ? (
                                                        <LockSimple size={12} />
                                                    ) : (
                                                        <LockSimpleOpen size={12} />
                                                    )}
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => onToggleHidden(layer.id)}
                                                    label={layer.hidden ? "Show layer" : "Hide layer"}
                                                >
                                                    {layer.hidden ? <EyeSlash size={12} /> : <Eye size={12} />}
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => onDelete(layer.id)}
                                                    label="Delete layer"
                                                    className="hover:text-destructive"
                                                >
                                                    <Trash size={12} />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </PanelSection>
            </div>

            <div className="flex shrink-0 items-center justify-end border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
                <PanelCollapseAll />
            </div>
        </div>
    );
}