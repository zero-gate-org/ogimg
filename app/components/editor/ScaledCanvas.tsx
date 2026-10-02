"use client";

import type { ReactNode } from "react";
import { useMeasuredWidth } from "../landing/useMeasuredWidth";

/**
 * Renders fixed size canvas content scaled to the width of its container.
 *
 * Every preview surface (gallery tiles, hero card, social preview cards) goes
 * through this so nothing renders at its raw 1200px width and pushes a page
 * into horizontal overflow on narrow viewports.
 */
export default function ScaledCanvas({
    width,
    height,
    maxWidth = 1200,
    maxHeight,
    children,
    className = "",
    frameClassName = "",
}: {
    width: number;
    height: number;
    maxWidth?: number;
    /** Caps the rendered height. Preview cards use it so a 9:16 canvas does not become a very tall block. */
    maxHeight?: number;
    children: ReactNode;
    className?: string;
    frameClassName?: string;
}) {
    const { ref, width: measured } = useMeasuredWidth<HTMLDivElement>();
    const available = measured > 0 ? Math.min(measured, maxWidth) : maxWidth;
    const scale = Math.min(available / width, maxHeight ? maxHeight / height : Infinity);
    const renderedWidth = Math.round(width * scale);

    return (
        <div
            ref={ref}
            className={`relative mx-auto overflow-hidden ${className}`}
            style={{ width: "100%", maxWidth: renderedWidth, aspectRatio: `${width} / ${height}` }}
        >
            <div
                className={`absolute left-0 top-0 origin-top-left ${frameClassName}`}
                style={{
                    width,
                    height,
                    transform: `scale(${scale})`,
                }}
            >
                {children}
            </div>
        </div>
    );
}