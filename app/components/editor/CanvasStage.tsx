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

        // The toolbar floats over the pasteboard, so the fit is based on the
        // padded content box rather than the raw frame size.
        const styles = window.getComputedStyle(frame);
        const availableWidth =
            frame.clientWidth -
            parseFloat(styles.paddingLeft || "0") -
            parseFloat(styles.paddingRight || "0");
        const availableHeight =
            frame.clientHeight -
            parseFloat(styles.paddingTop || "0") -
            parseFloat(styles.paddingBottom || "0");
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
            className="canvas-grid scroll-y relative flex min-h-0 flex-1 items-center justify-center overflow-auto px-6 pb-16 pt-20 sm:px-10 sm:pb-20 sm:pt-24"
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

            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center px-2">
                <div className="pointer-events-auto flex items-center gap-0.5 border border-border bg-surface/90 p-1 font-mono text-[11px] text-muted-foreground shadow-[0_14px_34px_-18px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
                    <span className="hidden px-2 tabular-nums sm:inline">
                        {width} × {height}
                    </span>
                    <span className="mx-1 hidden h-4 w-px bg-border sm:block" />

                    {[0.25, 0.5, 1].map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => {
                                setZoom(preset);
                                setIsFit(false);
                            }}
                            className={`px-2 py-1 transition-colors ${
                                !isFit && Math.abs(zoom - preset) < 0.02
                                    ? "bg-brand text-brand-ink"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {preset * 100}%
                        </button>
                    ))}

                    <span className="mx-1 h-4 w-px bg-border" />

                    <button
                        type="button"
                        onClick={() => {
                            setIsFit(true);
                            fit();
                        }}
                        className={`px-2 py-1 transition-colors ${
                            isFit
                                ? "bg-brand text-brand-ink"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Fit
                    </button>
                </div>
            </div>
        </div>
    );
}