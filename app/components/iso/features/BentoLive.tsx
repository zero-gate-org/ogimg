"use client";

import * as React from "react";
import { useInView, useLoop, useStillness } from "../kit/react/live";

/**
 * Runs the declarative track format baked into each scene's SVG.
 *
 * - data-pose on a <g>:  "t,dx,dy,rot,ease;..." (seconds, SVG px, degrees)
 * - data-alpha on a <g>: "t,alpha,ease;..."
 * - data-draw on a <path>: "from,to" seconds
 * - data-loop / data-offset / data-still on the root <svg>
 *
 * All five scenes share this one engine, so the motion stays consistent and
 * only the art modules author timing. It only runs while the card is on screen
 * and parks at a chosen pose under prefers-reduced-motion.
 */

type Ease = "inout" | "out" | "in" | "lin" | "snap";
type PoseFrame = { t: number; x: number; y: number; r: number; ease: Ease };
type AlphaFrame = { t: number; a: number; ease: Ease };
type PoseEntry = {
    el: Element;
    frames: PoseFrame[];
    pivot: [number, number] | null;
    last: string;
};
type AlphaEntry = { el: Element; frames: AlphaFrame[]; last: number };
type DrawEntry = { el: Element; from: number; to: number; last: number };
type Scene = { loop: number; offset: number; still: number; poses: PoseEntry[]; alphas: AlphaEntry[]; draws: DrawEntry[] };

const EASES: Record<Ease, (t: number) => number> = {
    lin: (t) => t,
    in: (t) => t * t * t,
    out: (t) => 1 - (1 - t) ** 4,
    snap: (t) => 1 - (1 - t) ** 5,
    inout: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
};

const easeOf = (name: string | undefined): Ease =>
    name === "out" || name === "in" || name === "lin" || name === "snap" ? name : "inout";

const parsePose = (text: string): PoseFrame[] =>
    text
        .split(";")
        .map((frame) => frame.trim())
        .filter(Boolean)
        .map((frame) => {
            const [t, x, y, r, ease] = frame.split(",");
            return { t: Number(t), x: Number(x || 0), y: Number(y || 0), r: Number(r || 0), ease: easeOf(ease) };
        })
        .sort((a, b) => a.t - b.t);

const parseAlpha = (text: string): AlphaFrame[] =>
    text
        .split(";")
        .map((frame) => frame.trim())
        .filter(Boolean)
        .map((frame) => {
            const [t, a, ease] = frame.split(",");
            return { t: Number(t), a: Number(a), ease: easeOf(ease) };
        })
        .sort((a, b) => a.t - b.t);

const segment = (t: number, frames: Array<{ t: number }>) => {
    if (t <= frames[0].t) return { from: 0, to: 0, k: 0 };
    for (let i = 1; i < frames.length; i += 1) {
        if (t <= frames[i].t) {
            const span = frames[i].t - frames[i - 1].t || 1;
            return { from: i - 1, to: i, k: (t - frames[i - 1].t) / span };
        }
    }
    return { from: frames.length - 1, to: frames.length - 1, k: 0 };
};

const collect = (root: Element): Scene => {
    const svg = root.querySelector("svg[data-bento-scene]");
    if (!svg) return { loop: 10, offset: 0, still: 0, poses: [], alphas: [], draws: [] };
    const loop = Number(svg.getAttribute("data-loop") || 10);
    const offset = Number(svg.getAttribute("data-offset") || 0);
    const still = Number(svg.getAttribute("data-still") || 0);
    const poses = [...svg.querySelectorAll("[data-pose]")].map((el) => {
        const pivot = el.getAttribute("data-pivot");
        const [px, py] = pivot ? pivot.split(" ").map(Number) : [0, 0];
        return {
            el,
            frames: parsePose(el.getAttribute("data-pose") || ""),
            pivot: pivot ? ([px, py] as [number, number]) : null,
            last: "",
        };
    });
    const alphas = [...svg.querySelectorAll("[data-alpha]")].map((el) => ({
        el,
        frames: parseAlpha(el.getAttribute("data-alpha") || ""),
        last: Number.NaN,
    }));
    const draws = [...svg.querySelectorAll("[data-draw]")].map((el) => {
        const [from, to] = (el.getAttribute("data-draw") || "0,1").split(",").map(Number);
        return { el, from, to, last: Number.NaN };
    });
    return { loop, offset, still, poses, alphas, draws };
};

const apply = (scene: Scene, time: number) => {
    const local = ((time + scene.offset) % scene.loop + scene.loop) % scene.loop;
    for (const entry of scene.poses) {
        if (!entry.frames.length) continue;
        const { from, to, k } = segment(local, entry.frames);
        const a = entry.frames[from];
        const b = entry.frames[to];
        const e = EASES[b.ease](k);
        const x = a.x + (b.x - a.x) * e;
        const y = a.y + (b.y - a.y) * e;
        const r = a.r + (b.r - a.r) * e;
        const transform =
            Math.abs(r) > 0.01 && entry.pivot
                ? `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(2)} ${entry.pivot[0]} ${entry.pivot[1]})`
                : `translate(${x.toFixed(2)} ${y.toFixed(2)})`;
        if (transform !== entry.last) {
            entry.el.setAttribute("transform", transform);
            entry.last = transform;
        }
    }
    for (const entry of scene.alphas) {
        if (!entry.frames.length) continue;
        const { from, to, k } = segment(local, entry.frames);
        const a = entry.frames[from];
        const b = entry.frames[to];
        const value = a.a + (b.a - a.a) * EASES[b.ease](k);
        const rounded = Math.round(value * 1000) / 1000;
        if (rounded !== entry.last) {
            entry.el.setAttribute("opacity", String(rounded));
            entry.last = rounded;
        }
    }
    for (const entry of scene.draws) {
        const span = entry.to - entry.from || 1;
        const raw = Math.max(0, Math.min(1, (local - entry.from) / span));
        const value = Math.round((1 - EASES.inout(raw)) * 1000) / 1000;
        if (value !== entry.last) {
            entry.el.setAttribute("stroke-dashoffset", String(value));
            entry.last = value;
        }
    }
};

export default function BentoLive({
    className = "",
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInView(ref);
    const still = useStillness();
    const scene = React.useRef<Scene | null>(null);
    const clock = React.useRef(0);

    useLoop(
        (dt) => {
            if (!ref.current) return true;
            if (!scene.current) scene.current = collect(ref.current);
            clock.current += dt;
            apply(scene.current, clock.current);
            return true;
        },
        inView && !still,
    );

    React.useEffect(() => {
        if (!still || !ref.current) return;
        if (!scene.current) scene.current = collect(ref.current);
        apply(scene.current, scene.current.still);
    }, [still]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
