"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useAfterPaint } from "./useAfterPaint";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Reveal state shared by the landing primitives.
 *
 * The animated element is mounted on the server and on the first client paint
 * with `initial={false}` and an already visible state, so content is never hidden
 * without JavaScript and the DOM node never changes identity. That last part
 * matters: swapping between a plain div and a motion div would detach the node
 * the intersection observer was watching, and the reveal would never fire.
 *
 * Motion is layered on after the first paint, and only when the visitor has not
 * asked for reduced motion.
 */
function useReveal<T extends HTMLElement>(amount = 0.2) {
    const reduce = useReducedMotion();
    const afterPaint = useAfterPaint();
    const ref = useRef<T>(null);
    const inView = useInView(ref, { once: true, amount });

    const animate = afterPaint && !reduce;
    return { ref, animate, shown: inView };
}

export function Reveal({
    children,
    delay = 0,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    const { ref, animate, shown } = useReveal<HTMLDivElement>(0.2);

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={false}
            animate={!animate || shown ? "shown" : "hidden"}
            variants={{
                hidden: { opacity: 0, y: 22 },
                shown: { opacity: 1, y: 0, transition: { duration: 0.62, delay, ease: EASE } },
            }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Staggers RevealItem children as the group enters the viewport, so a grid
 * arrives as one gesture rather than a row of separate pops.
 */
export function RevealGroup({
    children,
    className = "",
    stagger = 0.07,
}: {
    children: ReactNode;
    className?: string;
    stagger?: number;
}) {
    const { ref, animate, shown } = useReveal<HTMLDivElement>(0.12);

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={false}
            animate={!animate || shown ? "shown" : "hidden"}
            variants={{
                hidden: {},
                shown: { transition: { staggerChildren: stagger } },
            }}
        >
            {children}
        </motion.div>
    );
}

export function RevealItem({ children, className = "" }: { children: ReactNode; className?: string }) {
    const reduce = useReducedMotion();

    if (reduce) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 16 },
                shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Section heading. Headline and supporting copy stack vertically, because a
 * section carries one idea and splitting it across columns adds nothing.
 */
export function SectionHeading({
    eyebrow,
    title,
    body,
    align = "left",
    className = "",
}: {
    eyebrow?: string;
    title: ReactNode;
    body?: ReactNode;
    align?: "left" | "center";
    className?: string;
}) {
    const alignment = align === "center" ? "mx-auto text-center" : "";

    return (
        <Reveal className={`max-w-[60ch] ${alignment} ${className}`}>
            {eyebrow ? (
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
            ) : null}
            <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[42px]">
                {title}
            </h2>
            {body ? (
                <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-muted-foreground md:text-[16px]">
                    {body}
                </p>
            ) : null}
        </Reveal>
    );
}