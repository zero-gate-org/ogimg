"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { FreeDocument, Layer } from "../../lib/editor/types";

type InteractionMode = "move" | "resize" | "rotate";
type ResizeHandle = "nw" | "ne" | "sw" | "se";

interface Interaction {
    mode: InteractionMode;
    handle?: ResizeHandle;
    startPointerX: number;
    startPointerY: number;
    startLayer: Layer;
}

interface Guide {
    axis: "x" | "y";
    position: number;
}

const SNAP_THRESHOLD = 7;

const HANDLES: { id: ResizeHandle; position: string; cursor: string }[] = [
    { id: "nw", position: "-left-1 -top-1", cursor: "cursor-nwse-resize" },
    { id: "ne", position: "-right-1 -top-1", cursor: "cursor-nesw-resize" },
    { id: "sw", position: "-left-1 -bottom-1", cursor: "cursor-nesw-resize" },
    { id: "se", position: "-right-1 -bottom-1", cursor: "cursor-nwse-resize" },
];

/**
 * Returns the offset that snaps one of the layer's edges onto a guide, or null
 * when nothing is close enough.
 */
const snapOffset = (targets: number[], guides: number[]) => {
    let best: number | null = null;
    let bestDistance = SNAP_THRESHOLD;
    let matchedGuide: number | null = null;

    for (const guide of guides) {
        for (const target of targets) {
            const distance = Math.abs(guide - target);
            if (distance <= bestDistance) {
                bestDistance = distance;
                best = guide - target;
                matchedGuide = guide;
            }
        }
    }

    return { offset: best, guide: matchedGuide };
};

/**
 * Interactive surface for the free editor.
 *
 * The design renders into `canvasNode`, which is what the exporter serialises.
 * Hit areas, selection frames, handles and snap guides are siblings of that node
 * inside the same scaled coordinate space, so none of the editing chrome can end
 * up in the exported file.
 */
export default function InteractiveCanvas({
    document,
    selectedId,
    onSelect,
    onChangeLayer,
    canvasRef,
    canvasStyle,
    children,
}: {
    document: FreeDocument;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onChangeLayer: (id: string, patch: Partial<Layer>, mergeKey?: string) => void;
    canvasRef: (node: HTMLDivElement | null) => void;
    canvasStyle?: React.CSSProperties;
    children: ReactNode;
}) {
    const spaceRef = useRef<HTMLDivElement>(null);
    const interactionRef = useRef<Interaction | null>(null);
    const [guides, setGuides] = useState<Guide[]>([]);

    const selected = document.layers.find((layer) => layer.id === selectedId) ?? null;

    const scaleFactor = () => {
        const node = spaceRef.current;
        if (!node) return 1;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 ? document.width / rect.width : 1;
    };

    const guideValues = (layerId: string) => {
        const xGuides = new Set<number>([0, document.width / 2, document.width]);
        const yGuides = new Set<number>([0, document.height / 2, document.height]);

        for (const other of document.layers) {
            if (other.id === layerId || other.hidden) continue;
            xGuides.add(other.x);
            xGuides.add(other.x + other.width / 2);
            xGuides.add(other.x + other.width);
            yGuides.add(other.y);
            yGuides.add(other.y + other.height / 2);
            yGuides.add(other.y + other.height);
        }

        return { xGuides: Array.from(xGuides), yGuides: Array.from(yGuides) };
    };

    const begin = (
        event: React.PointerEvent<HTMLElement>,
        layer: Layer,
        mode: InteractionMode,
        handle?: ResizeHandle,
    ) => {
        event.stopPropagation();
        event.preventDefault();
        onSelect(layer.id);
        event.currentTarget.setPointerCapture?.(event.pointerId);

        interactionRef.current = {
            mode,
            handle,
            startPointerX: event.clientX,
            startPointerY: event.clientY,
            startLayer: { ...layer },
        };
    };

    const move = (event: React.PointerEvent<HTMLElement>) => {
        const interaction = interactionRef.current;
        if (!interaction) return;

        const factor = scaleFactor();
        const start = interaction.startLayer;
        const deltaX = (event.clientX - interaction.startPointerX) * factor;
        const deltaY = (event.clientY - interaction.startPointerY) * factor;

        if (interaction.mode === "move") {
            let nextX = Math.round(start.x + deltaX);
            let nextY = Math.round(start.y + deltaY);

            const { xGuides, yGuides } = guideValues(start.id);
            const horizontal = snapOffset(
                [nextX, nextX + start.width / 2, nextX + start.width],
                xGuides,
            );
            const vertical = snapOffset([nextY, nextY + start.height / 2, nextY + start.height], yGuides);

            const activeGuides: Guide[] = [];
            if (horizontal.offset !== null) {
                nextX += horizontal.offset;
                activeGuides.push({ axis: "x", position: horizontal.guide ?? 0 });
            }
            if (vertical.offset !== null) {
                nextY += vertical.offset;
                activeGuides.push({ axis: "y", position: vertical.guide ?? 0 });
            }

            onChangeLayer(start.id, { x: Math.round(nextX), y: Math.round(nextY) }, `move-${start.id}`);
            setGuides(activeGuides);
            return;
        }

        if (interaction.mode === "resize") {
            const handle = interaction.handle ?? "se";
            let width = start.width;
            let height = start.height;

            if (handle.includes("e")) width = start.width + deltaX;
            if (handle.includes("s")) height = start.height + deltaY;
            if (handle.includes("w")) width = start.width - deltaX;
            if (handle.includes("n")) height = start.height - deltaY;

            if (event.shiftKey && start.kind !== "text") {
                const ratio = start.width / Math.max(1, start.height);
                if (Math.abs(deltaX) >= Math.abs(deltaY)) height = width / ratio;
                else width = height * ratio;
            }

            width = Math.max(24, Math.round(width));
            height = Math.max(24, Math.round(height));

            const x = handle.includes("w") ? Math.round(start.x + start.width - width) : Math.round(start.x);
            const y = handle.includes("n") ? Math.round(start.y + start.height - height) : Math.round(start.y);

            onChangeLayer(start.id, { x, y, width, height }, `resize-${start.id}-${handle}`);
            return;
        }

        const rect = spaceRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerX = start.x + start.width / 2;
        const centerY = start.y + start.height / 2;
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;
        const angle = (Math.atan2(pointerY - centerY, pointerX - centerX) * 180) / Math.PI + 90;
        const snapped = event.shiftKey ? Math.round(angle / 15) * 15 : Math.round(angle);

        onChangeLayer(start.id, { rotation: snapped }, `rotate-${start.id}`);
    };

    const end = (event?: React.PointerEvent<HTMLElement>) => {
        if (event) event.currentTarget.releasePointerCapture?.(event.pointerId);
        interactionRef.current = null;
        setGuides([]);
    };

    useEffect(() => {
        const cancel = () => {
            interactionRef.current = null;
            setGuides([]);
        };
        window.addEventListener("pointerup", cancel);
        window.addEventListener("pointercancel", cancel);
        return () => {
            window.removeEventListener("pointerup", cancel);
            window.removeEventListener("pointercancel", cancel);
        };
    }, []);

    return (
        <div ref={spaceRef} className="relative select-none" style={{ width: document.width, height: document.height }}>
            <div
                ref={canvasRef}
                data-export-canvas="true"
                className="absolute inset-0"
                style={canvasStyle}
                onPointerDown={(event) => {
                    if (event.target === event.currentTarget) onSelect(null);
                }}
            >
                {children}
            </div>

            {document.layers.map((layer) => {
                if (layer.hidden) return null;
                return (
                    <div
                        key={layer.id}
                        role="presentation"
                        onPointerDown={(event) => {
                            if (layer.locked) return;
                            begin(event, layer, "move");
                        }}
                        onPointerMove={move}
                        onPointerUp={end}
                        className={`absolute ${layer.locked ? "cursor-not-allowed" : "cursor-move"}`}
                        style={{
                            left: layer.x,
                            top: layer.y,
                            width: layer.width,
                            height: layer.height,
                            transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
                        }}
                    />
                );
            })}

            {selected && !selected.hidden ? (
                <div
                    className="pointer-events-none absolute"
                    style={{
                        left: selected.x,
                        top: selected.y,
                        width: selected.width,
                        height: selected.height,
                        transform: selected.rotation ? `rotate(${selected.rotation}deg)` : undefined,
                        transformOrigin: "center center",
                    }}
                >
                    <div className="absolute -inset-px border border-brand" />

                    {selected.locked ? (
                        <span className="absolute -top-6 left-0 bg-brand px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand-ink">
                            Locked
                        </span>
                    ) : (
                        <>
                            <div className="pointer-events-auto absolute -top-8 left-1/2 flex -translate-x-1/2 flex-col items-center">
                                <button
                                    type="button"
                                    aria-label="Rotate layer"
                                    onPointerDown={(event) => begin(event, selected, "rotate")}
                                    onPointerMove={move}
                                    onPointerUp={end}
                                    className="flex h-5 w-5 cursor-grab items-center justify-center border border-brand bg-brand active:cursor-grabbing"
                                >
                                    <span className="block h-1.5 w-1.5 rotate-45 bg-brand-ink" />
                                </button>
                                <span className="block h-3 w-px bg-brand" />
                            </div>

                            {HANDLES.map((handle) => (
                                <button
                                    key={handle.id}
                                    type="button"
                                    aria-label={`Resize from ${handle.id}`}
                                    onPointerDown={(event) => begin(event, selected, "resize", handle.id)}
                                    onPointerMove={move}
                                    onPointerUp={end}
                                    className={`pointer-events-auto absolute h-2.5 w-2.5 border border-brand bg-background ${handle.position} ${handle.cursor}`}
                                />
                            ))}
                        </>
                    )}
                </div>
            ) : null}

            {guides.map((guide, index) => (
                <div
                    key={`${guide.axis}-${guide.position}-${index}`}
                    className="pointer-events-none absolute bg-brand"
                    style={
                        guide.axis === "x"
                            ? { left: guide.position, top: 0, width: 1, height: document.height }
                            : { top: guide.position, left: 0, height: 1, width: document.width }
                    }
                />
            ))}
        </div>
    );
}