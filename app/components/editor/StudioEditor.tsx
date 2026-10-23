"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SquaresFour, TextT } from "@phosphor-icons/react";
import CanvasStage from "./CanvasStage";
import CanvasToolbar from "./CanvasToolbar";
import PanelToggle from "./PanelToggle";
import InteractiveCanvas from "./InteractiveCanvas";
import {
    CanvasBackgroundEffects,
    FreeCanvasLayers,
    getCanvasBackgroundStyle,
} from "./FreeCanvasRender";
import LayersPanel from "./LayersPanel";
import LayerPropertiesPanel from "./LayerPropertiesPanel";
import BackgroundPanel from "./BackgroundPanel";
import ExportPanel from "./ExportPanel";
import ProjectsPanel from "./ProjectsPanel";
import BrandKitsPanel from "./BrandKitsPanel";
import PreviewDrawer from "./PreviewDrawer";
import { PanelCollapseAll, PanelTabs, SegmentedControl } from "./fields";
import { PanelStateProvider } from "./panelState";
import {
    applyBrandKitToFree,
    clampDimension,
    createFreeDocument,
    createId,
    createImageLayer,
    createShapeLayer,
    createTextLayer,
    headlineSizeForWidth,
    deleteProject,
    exportDesignImage,
    formatSavedAt,
    loadBrandKits,
    loadProjects,
    loadStudioDraft,
    saveBrandKits,
    saveProjects,
    saveStudioDraft,
    slugify,
    upsertProject,
    useDocumentHistory,
    type BrandKit,
    type ExportFormat,
    type FreeDocument,
    type Layer,
    type SavedProject,
    type ShapeKind,
} from "../../lib/editor";
import type { TemplateFontId } from "../templates/fontCatalog";

type Tab = "design" | "background" | "export" | "projects" | "kits";
type SaveState = "idle" | "saved" | "saving";

const TABS: { id: Tab; label: string }[] = [
    { id: "design", label: "Design" },
    { id: "background", label: "Canvas" },
    { id: "export", label: "Export" },
    { id: "projects", label: "Files" },
    { id: "kits", label: "Kits" },
];

export default function StudioEditor({ backHref = "/" }: { backHref?: string }) {
    const router = useRouter();
    // The first render must be identical on the server and on the client, so the
    // document starts empty and the autosaved draft is restored after mount.
    const initialDocument = useMemo(() => createFreeDocument(), []);
    const history = useDocumentHistory<FreeDocument>(initialDocument);
    const document = history.document;

    const canvasRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [tab, setTab] = useState<Tab>("design");
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [projects, setProjects] = useState<SavedProject[]>([]);
    const [kits, setKits] = useState<BrandKit[]>([]);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [format, setFormat] = useState<ExportFormat>("png");
    const [scale, setScale] = useState(2);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [saveState, setSaveState] = useState<SaveState>("idle");
    const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
    const [draftRecovered, setDraftRecovered] = useState(false);

    // Saved projects, kits, and the autosaved draft all live in local storage,
    // so they are read after the first paint. That keeps the server and client
    // markup identical and avoids writing state during the commit.
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setProjects(loadProjects());
            setKits(loadBrandKits());

            const draft = loadStudioDraft();
            if (draft && draft.kind === "free" && draft.layers.length > 0) {
                history.replace(draft);
                setDraftRecovered(true);
            }
        });
        return () => cancelAnimationFrame(frame);
        // Restore runs once on mount, before any user edit can happen.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectedLayer = document.layers.find((layer) => layer.id === selectedId) ?? null;

    const usedFontIds = useMemo(() => {
        const ids = new Set<TemplateFontId>();
        for (const layer of document.layers) {
            if (layer.kind === "text") ids.add(layer.fontId);
        }
        if (ids.size === 0) ids.add("geist-sans");
        return Array.from(ids);
    }, [document.layers]);

    const updateDocument = history.update;

    const patchLayer = useCallback(
        (id: string, patch: Partial<Layer>, mergeKey?: string) => {
            updateDocument(
                (current) => ({
                    ...current,
                    layers: current.layers.map((layer) =>
                        layer.id === id ? ({ ...layer, ...patch } as Layer) : layer,
                    ),
                }),
                mergeKey,
            );
        },
        [updateDocument],
    );

    const addLayer = useCallback(
        (layer: Layer) => {
            updateDocument((current) => ({ ...current, layers: [...current.layers, layer] }));
            setSelectedId(layer.id);
        },
        [updateDocument],
    );

    const addText = useCallback(() => {
        const isFirst = document.layers.length === 0;
        const fontSize = headlineSizeForWidth(document.width);

        addLayer(
            createTextLayer({
                text: "A headline worth pausing on",
                x: isFirst ? Math.round(document.width * 0.08) : 96,
                y: isFirst ? Math.round(document.height * 0.36) : 160,
                width: document.width - (isFirst ? Math.round(document.width * 0.16) : 192),
                fontSize,
                align: "left",
            }),
        );
    }, [addLayer, document.width, document.height, document.layers.length]);

    const addShape = useCallback(
        (shape: ShapeKind) => {
            addLayer(createShapeLayer(shape));
        },
        [addLayer],
    );

    const readFile = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") resolve(reader.result);
                else reject(new Error("Could not read that file"));
            };
            reader.onerror = () => reject(new Error("Could not read that file"));
            reader.readAsDataURL(file);
        });

    const uploadImage = useCallback(
        async (file: File) => {
            if (!file.type.startsWith("image/")) {
                setExportError("That file is not an image. Pick a PNG, JPEG, or WebP.");
                return;
            }

            setIsUploading(true);
            try {
                const src = await readFile(file);
                if (selectedLayer?.kind === "image") {
                    patchLayer(selectedLayer.id, {
                        src,
                        alt: file.name,
                        name: file.name,
                    } as Partial<Layer>);
                } else {
                    addLayer(createImageLayer(src, file.name));
                }
            } catch (error) {
                setExportError(error instanceof Error ? error.message : "Could not read that file");
            } finally {
                setIsUploading(false);
            }
        },
        [addLayer, patchLayer, selectedLayer],
    );

    /** Fills the canvas itself rather than adding an image layer. */
    const uploadCanvasImage = useCallback(
        async (file: File) => {
            if (!file.type.startsWith("image/")) {
                setExportError("That file is not an image. Pick a PNG, JPEG, or WebP.");
                return;
            }

            setIsUploading(true);
            try {
                const src = await readFile(file);
                updateDocument((current) => ({
                    ...current,
                    background: {
                        ...current.background,
                        mode: "image",
                        imageSrc: src,
                        imageName: file.name,
                    },
                }));
            } catch (error) {
                setExportError(error instanceof Error ? error.message : "Could not read that file");
            } finally {
                setIsUploading(false);
            }
        },
        [updateDocument],
    );

    const deleteSelected = useCallback(() => {
        if (!selectedId) return;
        updateDocument((current) => ({
            ...current,
            layers: current.layers.filter((layer) => layer.id !== selectedId),
        }));
        setSelectedId(null);
    }, [selectedId, updateDocument]);

    const reorderLayer = useCallback(
        (id: string, direction: "up" | "down") => {
            updateDocument((current) => {
                const index = current.layers.findIndex((layer) => layer.id === id);
                if (index === -1) return current;
                const target = direction === "up" ? index + 1 : index - 1;
                if (target < 0 || target >= current.layers.length) return current;

                const layers = [...current.layers];
                const [moved] = layers.splice(index, 1);
                layers.splice(target, 0, moved);
                return { ...current, layers };
            });
        },
        [updateDocument],
    );

    const duplicateLayer = useCallback(
        (id: string) => {
            updateDocument((current) => {
                const index = current.layers.findIndex((layer) => layer.id === id);
                if (index === -1) return current;

                const source = current.layers[index];
                const copy: Layer = {
                    ...source,
                    id: createId("layer"),
                    name: `${source.name} copy`,
                    x: source.x + 24,
                    y: source.y + 24,
                };

                const layers = [...current.layers];
                layers.splice(index + 1, 0, copy);
                return { ...current, layers };
            });
        },
        [updateDocument],
    );

    // Draft recovery keeps unsaved work across a reload or a closed tab.
    useEffect(() => {
        const timer = window.setTimeout(() => {
            saveStudioDraft(document);
            setDraftRecovered(false);
        }, 900);

        return () => window.clearTimeout(timer);
    }, [document]);

    const saveProject = useCallback(() => {
        setSaveState("saving");
        const project: SavedProject = {
            id: currentProjectId ?? createId("project"),
            name: document.name.trim() || "Untitled card",
            mode: "free",
            updatedAt: Date.now(),
            document,
        };

        const next = upsertProject(project);
        saveProjects(next);
        setProjects(next);
        setCurrentProjectId(project.id);
        setLastSavedAt(project.updatedAt);
        window.setTimeout(() => setSaveState("idle"), 1200);
    }, [currentProjectId, document]);

    const openProject = useCallback(
        (project: SavedProject) => {
            if (project.document.kind !== "free") return;
            history.replace({ ...project.document, id: createId("doc") });
            setCurrentProjectId(project.id);
            setSelectedId(null);
            setTab("design");
        },
        [history],
    );

    const handleExport = useCallback(async () => {
        const node = canvasRef.current;
        if (!node) return;

        setIsExporting(true);
        setExportError(null);

        try {
            await exportDesignImage({
                sourceNode: node,
                width: document.width,
                height: document.height,
                scale,
                format,
                quality: 0.95,
                fontIds: usedFontIds,
                name: document.name,
            });
        } catch (error) {
            setExportError(
                error instanceof Error ? error.message : "The export failed. Try a smaller resolution.",
            );
        } finally {
            setIsExporting(false);
        }
    }, [document.height, document.name, document.width, format, scale, usedFontIds]);

    const resizeCanvas = useCallback(
        (width: number, height: number) => {
            const nextWidth = clampDimension(width);
            const nextHeight = clampDimension(height);
            updateDocument((current) => ({
                ...current,
                width: nextWidth,
                height: nextHeight,
                layers: current.layers.map((layer) => {
                    const scaleX = nextWidth / current.width;
                    const scaleY = nextHeight / current.height;

                    return {
                        ...layer,
                        x: Math.round(layer.x * scaleX),
                        y: Math.round(layer.y * scaleY),
                        width: Math.round(layer.width * scaleX),
                        height: Math.round(layer.height * scaleY),
                        // Type follows the canvas width, the same axis it is set
                        // in. Scaling by height would balloon a headline on a
                        // tall canvas.
                        ...(layer.kind === "text"
                            ? { fontSize: Math.round(layer.fontSize * scaleX) }
                            : {}),
                    } as Layer;
                }),
            }));
        },
        [updateDocument],
    );

    // Keyboard: undo, redo, delete, nudge, duplicate, save.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isTyping =
                target &&
                (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT");

            const modifier = event.metaKey || event.ctrlKey;

            if (modifier && event.key.toLowerCase() === "z") {
                event.preventDefault();
                if (event.shiftKey) history.redo();
                else history.undo();
                return;
            }

            if (modifier && event.key.toLowerCase() === "s") {
                event.preventDefault();
                saveProject();
                return;
            }

            if (isTyping) return;

            if (event.key === "Escape") {
                setSelectedId(null);
                return;
            }

            if ((event.key === "Backspace" || event.key === "Delete") && selectedId) {
                event.preventDefault();
                deleteSelected();
                return;
            }

            if (modifier && event.key.toLowerCase() === "d" && selectedId) {
                event.preventDefault();
                duplicateLayer(selectedId);
                return;
            }

            const nudge = event.shiftKey ? 10 : 1;
            const moves: Record<string, [number, number]> = {
                ArrowLeft: [-nudge, 0],
                ArrowRight: [nudge, 0],
                ArrowUp: [0, -nudge],
                ArrowDown: [0, nudge],
            };

            const move = moves[event.key];
            if (move && selectedId) {
                event.preventDefault();
                const layer = document.layers.find((entry) => entry.id === selectedId);
                if (!layer || layer.locked) return;
                patchLayer(selectedId, { x: layer.x + move[0], y: layer.y + move[1] }, `nudge-${selectedId}`);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [deleteSelected, document.layers, duplicateLayer, history, patchLayer, saveProject, selectedId]);

    const applyKit = (kit: BrandKit) => {
        updateDocument((current) => applyBrandKitToFree(current, kit));
    };

    const removeKit = (kitId: string) => {
        const next = kits.filter((kit) => kit.id !== kitId);
        setKits(next);
        saveBrandKits(next);
    };

    const updateKits = (next: BrandKit[]) => {
        setKits(next);
        saveBrandKits(next);
    };

    const removeProject = (project: SavedProject) => {
        const next = deleteProject(project.id);
        saveProjects(next);
        setProjects(next);
        if (project.id === currentProjectId) setCurrentProjectId(null);
    };

    return (
        <div className="flex min-h-[100dvh] flex-col bg-background text-foreground lg:h-[100dvh] lg:min-h-0 lg:flex-row lg:overflow-hidden">
            <aside className={`order-2 flex w-full shrink-0 flex-col overflow-hidden border-t border-border bg-surface transition-[width] duration-300 ease-out lg:order-1 lg:h-auto lg:border-r lg:border-t-0 ${
                leftOpen ? "lg:w-[clamp(268px,18vw,288px)]" : "lg:invisible lg:w-0 lg:border-r-0"
            }`}>
                <div className="flex shrink-0 items-center gap-2 border-b border-border p-2">
                    <SegmentedControl
                        ariaLabel="Editor mode"
                        value="studio"
                        options={[
                            { value: "studio", label: "Free canvas" },
                            { value: "templates", label: "Templates" },
                        ]}
                        onChange={(value) => {
                            if (value === "templates") router.push("/template-gallery");
                        }}
                        className="min-w-0 flex-1"
                    />
                    <PanelToggle side="left" open={leftOpen} onToggle={() => setLeftOpen((open) => !open)} />
                </div>

                <PanelStateProvider>
                    <LayersPanel
                        layers={document.layers}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onToggleHidden={(id) => {
                            const layer = document.layers.find((entry) => entry.id === id);
                            if (layer) patchLayer(id, { hidden: !layer.hidden }, `hide-${id}`);
                        }}
                        onToggleLocked={(id) => {
                            const layer = document.layers.find((entry) => entry.id === id);
                            if (layer) patchLayer(id, { locked: !layer.locked }, `lock-${id}`);
                        }}
                        onReorder={reorderLayer}
                        onDuplicate={duplicateLayer}
                        onDelete={(id) => {
                            updateDocument((current) => ({
                                ...current,
                                layers: current.layers.filter((layer) => layer.id !== id),
                            }));
                            if (selectedId === id) setSelectedId(null);
                        }}
                        onAddText={addText}
                        onAddShape={addShape}
                        onUploadImage={uploadImage}
                        isUploading={isUploading}
                    />
                </PanelStateProvider>
            </aside>

            <main className="relative order-1 flex h-[58dvh] min-h-[420px] min-w-0 flex-col bg-surface-sunken lg:order-2 lg:h-auto lg:min-h-0 lg:flex-1">
                <CanvasToolbar
                    backHref={backHref}
                    backLabel="Back to ogimg.in"
                    name={document.name}
                    onNameChange={(name) =>
                        updateDocument((current) => ({ ...current, name }), "name")
                    }
                    canUndo={history.canUndo}
                    canRedo={history.canRedo}
                    onUndo={history.undo}
                    onRedo={history.redo}
                    onPreview={() => setIsPreviewOpen(true)}
                    onSave={saveProject}
                    saveState={saveState}
                />

                {!leftOpen ? (
                    <PanelToggle
                        side="left"
                        open={leftOpen}
                        onToggle={() => setLeftOpen(true)}
                        variant="handle"
                    />
                ) : null}
                {!rightOpen ? (
                    <PanelToggle
                        side="right"
                        open={rightOpen}
                        onToggle={() => setRightOpen(true)}
                        variant="handle"
                    />
                ) : null}

                {draftRecovered && document.layers.length > 0 ? (
                    <div className="absolute inset-x-0 top-[58px] z-20 flex justify-center px-3 sm:top-[68px]">
                        <div className="flex w-full max-w-[520px] items-center justify-between gap-3 border border-border bg-surface/95 px-3 py-2 text-[12px] text-muted-foreground shadow-[0_14px_34px_-18px_rgba(0,0,0,0.95)] backdrop-blur-md">
                            <span>Recovered your last session from this browser.</span>
                            <button
                                type="button"
                                onClick={() => {
                                    saveStudioDraft(null);
                                    setDraftRecovered(false);
                                }}
                                className="shrink-0 font-medium text-foreground underline underline-offset-2"
                            >
                                Start fresh
                            </button>
                        </div>
                    </div>
                ) : null}

                    <CanvasStage width={document.width} height={document.height}>
                        <InteractiveCanvas
                            document={document}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onChangeLayer={patchLayer}
                            canvasRef={(node) => {
                                canvasRef.current = node;
                            }}
                            canvasStyle={getCanvasBackgroundStyle(document.background)}
                        >
                            <CanvasBackgroundEffects background={document.background} />
                            <FreeCanvasLayers document={document} />
                        </InteractiveCanvas>
                    </CanvasStage>

                    {document.layers.length === 0 ? (
                        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center px-6">
                            <div className="pointer-events-auto w-full max-w-[420px] border border-border bg-surface p-5">
                                <p className="text-[13px] font-semibold text-foreground">
                                    Blank canvas, full control
                                </p>
                                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                                    Start with a headline, then add a shape or drop in a logo. Everything stays
                                    editable and snaps to the canvas edges.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={addText}
                                        className="inline-flex h-9 items-center gap-1.5 bg-brand px-3 text-[12px] font-semibold text-brand-ink transition-colors hover:bg-brand-strong"
                                    >
                                        <TextT size={14} />
                                        Add headline
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => addShape("rect")}
                                        className="inline-flex h-9 items-center gap-1.5 border border-border px-3 text-[12px] font-medium text-foreground transition-colors hover:border-border-strong"
                                    >
                                        <SquaresFour size={14} />
                                        Add shape
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex h-9 items-center gap-1.5 border border-border px-3 text-[12px] font-medium text-foreground transition-colors hover:border-border-strong"
                                    >
                                        Upload image
                                    </button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file) uploadImage(file);
                                        event.target.value = "";
                                    }}
                                />
                            </div>
                        </div>
                    ) : null}
                </main>

            <aside className={`order-3 flex w-full shrink-0 flex-col overflow-hidden border-t border-border bg-surface transition-[width] duration-300 ease-out lg:h-auto lg:border-l lg:border-t-0 ${
                rightOpen ? "lg:w-[clamp(336px,23vw,368px)]" : "lg:invisible lg:w-0 lg:border-l-0"
            }`}>
                <PanelStateProvider>
                    <PanelTabs
                        tabs={TABS}
                        value={tab}
                        onChange={setTab}
                        ariaLabel="Editor panels"
                        action={
                            <PanelToggle
                                side="right"
                                open={rightOpen}
                                onToggle={() => setRightOpen((open) => !open)}
                                variant="bare"
                            />
                        }
                    />

                    <div className="scroll-y min-h-0 flex-1">
                        {tab === "design" ? (
                            <LayerPropertiesPanel
                                layer={selectedLayer}
                                documentSize={{ width: document.width, height: document.height }}
                                onChange={(patch) => {
                                    if (selectedId) patchLayer(selectedId, patch, `inspect-${selectedId}`);
                                }}
                                onDelete={deleteSelected}
                                onUploadReplacement={uploadImage}
                            />
                        ) : null}

                        {tab === "background" ? (
                            <BackgroundPanel
                                background={document.background}
                                onUploadImage={uploadCanvasImage}
                                isUploading={isUploading}
                                onChange={(patch) =>
                                    updateDocument((current) => ({
                                        ...current,
                                        background: { ...current.background, ...patch },
                                    }))
                                }
                            />
                        ) : null}

                        {tab === "export" ? (
                            <ExportPanel
                                width={document.width}
                                height={document.height}
                                onResize={resizeCanvas}
                                format={format}
                                onFormatChange={setFormat}
                                scale={scale}
                                onScaleChange={setScale}
                                onExport={handleExport}
                                isExporting={isExporting}
                                error={exportError}
                                onDismissError={() => setExportError(null)}
                            />
                        ) : null}

                        {tab === "projects" ? (
                            <div>
                                <ProjectsPanel
                                    projects={projects}
                                    onOpen={openProject}
                                    onDuplicate={(project) => {
                                        if (project.document.kind !== "free") return;
                                        const duplicated: SavedProject = {
                                            ...project,
                                            id: createId("project"),
                                            name: `${project.name} copy`,
                                            updatedAt: Date.now(),
                                        };
                                        const next = upsertProject(duplicated);
                                        saveProjects(next);
                                        setProjects(next);
                                    }}
                                    onDelete={removeProject}
                                    currentProjectId={currentProjectId}
                                />
                                {lastSavedAt ? (
                                    <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                                        Saved {formatSavedAt(lastSavedAt)}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}

                        {tab === "kits" ? (
                            <div>
                                <BrandKitsPanel
                                    kits={kits}
                                    onChange={updateKits}
                                    onApply={applyKit}
                                    onDelete={removeKit}
                                />
                            </div>
                        ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
                        <PanelCollapseAll />
                        {saveState === "saved" ? (
                            <span className="font-mono text-brand">Saved to this browser</span>
                        ) : (
                            <>
                                <span className="truncate font-mono">{slugify(document.name) || "untitled"}</span>
                                <span className="ml-auto shrink-0 font-mono">
                                    {document.layers.length} {document.layers.length === 1 ? "layer" : "layers"}
                                </span>
                            </>
                        )}
                    </div>
                </PanelStateProvider>
            </aside>

            <PreviewDrawer
                design={document}
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
            />
        </div>
    );
}