"use client";

import { CaretLineLeft, CaretLineRight } from "@phosphor-icons/react";

type Side = "left" | "right";

/**
 * Collapse/expand control shared by both rails.
 *
 * The icon always points at the edge the panel folds toward, so the same
 * button reads correctly while open and while collapsed. The `handle` variant
 * is the tab that appears on the canvas edge once a rail is out of the way.
 */
export default function PanelToggle({
    side,
    open,
    onToggle,
    variant = "inline",
}: {
    side: Side;
    open: boolean;
    onToggle: () => void;
    variant?: "inline" | "bare" | "handle";
}) {
    const Icon = open
        ? side === "left"
            ? CaretLineLeft
            : CaretLineRight
        : side === "left"
          ? CaretLineRight
          : CaretLineLeft;

    const label = `${open ? "Collapse" : "Expand"} ${
        side === "left" ? "layers" : "inspector"
    } panel`;

    if (variant === "handle") {
        return (
            <button
                type="button"
                onClick={onToggle}
                aria-label={label}
                title={label}
                className={`absolute top-1/2 z-20 hidden h-16 w-6 -translate-y-1/2 items-center justify-center border border-border bg-surface/95 text-muted-foreground shadow-[0_10px_30px_-16px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors hover:text-foreground lg:flex ${
                    side === "left" ? "left-0 border-l-0" : "right-0 border-r-0"
                }`}
            >
                <Icon size={13} />
            </button>
        );
    }

    if (variant === "bare") {
        return (
            <button
                type="button"
                onClick={onToggle}
                aria-label={label}
                title={label}
                className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
                <Icon size={15} />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={label}
            title={label}
            className="hidden h-8 w-8 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground lg:flex"
        >
            <Icon size={15} />
        </button>
    );
}
