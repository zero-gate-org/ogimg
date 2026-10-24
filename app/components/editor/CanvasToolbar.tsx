"use client";

import Link from "next/link";
import {
    ArrowClockwise,
    ArrowCounterClockwise,
    CaretLeft,
    Eye,
    FloppyDisk,
    PencilSimple,
} from "@phosphor-icons/react";

type ToolbarSaveState = "idle" | "saving" | "saved";

const SAVE_LABEL: Record<ToolbarSaveState, string> = {
    idle: "Save",
    saving: "Saving",
    saved: "Saved",
};

/**
 * Canva-style command bar.
 *
 * It floats over the top of the canvas instead of taking a full-width row, so
 * the side rails can run the entire height of the window. The wrapper ignores
 * pointer events; only the bar itself is interactive, which keeps the
 * pasteboard usable around it.
 */
export default function CanvasToolbar({
    backHref,
    backLabel,
    name,
    onNameChange,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onPreview,
    onSave,
    saveState,
}: {
    backHref: string;
    backLabel: string;
    name: string;
    onNameChange: (name: string) => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onPreview: () => void;
    onSave: () => void;
    saveState: ToolbarSaveState;
}) {
    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-2 pt-2 sm:px-4 sm:pt-3">
            <div
                role="toolbar"
                aria-label="Canvas actions"
                className="pointer-events-auto flex w-full max-w-[660px] items-center gap-0.5 border border-border bg-surface/90 p-1 shadow-[0_18px_44px_-20px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md"
            >
                <Link
                    href={backHref}
                    aria-label={backLabel}
                    title={backLabel}
                    className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground"
                >
                    <CaretLeft size={15} />
                </Link>

                <span className="mx-1 hidden h-5 w-px shrink-0 bg-border sm:block" />

                <div className="flex min-w-0 flex-1 items-center gap-1.5 px-1.5">
                    <PencilSimple size={12} className="hidden shrink-0 text-muted-foreground sm:block" />
                    <input
                        type="text"
                        value={name}
                        aria-label="Design name"
                        title={name}
                        placeholder="Untitled card"
                        onChange={(event) => onNameChange(event.target.value)}
                        className="w-full min-w-0 truncate border-0 bg-transparent p-0 text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                </div>

                <span className="hidden h-5 w-px shrink-0 bg-border sm:block" />

                <button
                    type="button"
                    onClick={onUndo}
                    disabled={!canUndo}
                    aria-label="Undo"
                    title="Undo (Ctrl+Z)"
                    className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
                >
                    <ArrowCounterClockwise size={15} />
                </button>
                <button
                    type="button"
                    onClick={onRedo}
                    disabled={!canRedo}
                    aria-label="Redo"
                    title="Redo (Ctrl+Shift+Z)"
                    className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
                >
                    <ArrowClockwise size={15} />
                </button>

                <span className="mx-1 hidden h-5 w-px shrink-0 bg-border sm:block" />

                <button
                    type="button"
                    onClick={onPreview}
                    className="flex h-8 shrink-0 items-center gap-1.5 border border-border bg-surface px-2 text-[12px] font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface-raised sm:px-2.5"
                >
                    <Eye size={14} />
                    <span className="hidden md:inline">Preview</span>
                </button>

                <button
                    type="button"
                    onClick={onSave}
                    disabled={saveState === "saving"}
                    className="flex h-8 shrink-0 items-center gap-1.5 bg-brand px-2 text-[12px] font-semibold text-brand-ink transition-colors hover:bg-brand-strong disabled:cursor-wait disabled:opacity-80 sm:px-3"
                >
                    <FloppyDisk size={14} />
                    <span className="hidden min-w-[40px] text-left sm:inline">{SAVE_LABEL[saveState]}</span>
                </button>
            </div>
        </div>
    );
}
