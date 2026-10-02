"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fits a fixed-size canvas into its container with a zoom factor.
 * Uses a ResizeObserver instead of a scroll listener, so the measurement only
 * runs when the container actually changes size.
 */
export default function CanvasStage({
    width,
    height,
    children,
    minZoom = 0.1,
    maxZoom = 1,
}: {
    width: number;
    height: number;
    children: ReactNode;
    minZoom?: number;
    maxZoom?: number;
}) {
    const frameRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [isFit, setIsFit] = useState(true);

    const fit = useCallback(() => {
        const frame = frameRef.current;
        if (!frame) return;

        const availableWidth = frame.clientWidth - 80;
        const availableHeight = frame.clientHeight - 80;
        if (availableWidth <= 0 || availableHeight <= 0) return;

        const next = Math.min(availableWidth / width, availableHeight / height, 1);
        setZoom(Math.max(minZoom, Math.min(maxZoom, next)));
    }, [width, height, minZoom, maxZoom]);

    useEffect(() => {
        fit();
        const frame = frameRef.current;
        if (!frame) return;

        const observer = new ResizeObserver(fit);
        observer.observe(frame);
        return () => observer.disconnect();
    }, [fit]);

    return (
        <div
            ref={frameRef}
            className="canvas-grid scroll-y relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-10"
        >
            <div
                className="relative shrink-0 shadow-[0_28px_70px_-40px_rgba(0,0,0,0.95)] ring-1 ring-white/12"
                style={{ width: width * zoom, height: height * zoom }}
            >
                <div
                    style={{
                        width,
                        height,
                        transform: `scale(${zoom})`,
                        transformOrigin: "top left",
                    }}
                >
                    {children}
                </div>
            </div>

            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="pointer-events-auto flex items-center gap-1 border border-border bg-surface px-1 py-1">
                    {[0.25, 0.5, 1].map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => {
                                setZoom(preset);
                                setIsFit(false);
                            }}
                            className={`px-2 py-1 font-mono text-[11px] transition-colors ${
                                !isFit && Math.abs(zoom - preset) < 0.02
                                    ? "bg-brand text-brand-ink"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {preset * 100}%
                        </button>
                    ))}
                    <span className="px-1 font-mono text-[11px] text-muted-foreground">
                        {Math.round(zoom * 100)}%
                    </span>
                    {isFit ? (
                        <span className="border-l border-border pl-2 pr-1 font-mono text-[11px] text-muted-foreground">
                            fit
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setIsFit(true);
                                fit();
                            }}
                            className="border-l border-border px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                        >
                            fit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}