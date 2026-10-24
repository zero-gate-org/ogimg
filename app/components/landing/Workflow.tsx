import { Fragment, type CSSProperties } from "react";
import { Reveal } from "./landingPrimitives";

/**
 * The workflow as three physical stages. Each block carries a small animated
 * diagram of the action, and a hairline runs through the gaps between blocks:
 * a white pulse travels left to right through those gaps, lighting the edge
 * nodes as it arrives, so the order is read before the copy is.
 */
const STEPS = [
    {
        verb: "Pick a base",
        body: "Open a template when the layout is already right, or start on an empty canvas when it is not.",
    },
    {
        verb: "Tune the details",
        body: "Set copy, fonts, colours, and layer positions. Save the result as a project or a brand kit.",
    },
    {
        verb: "Export and paste",
        body: "Download PNG, JPEG, or WebP, then copy the head tags from the preview panel into your page.",
    },
];

export default function Workflow() {
    return (
        <section id="workflow" className="scroll-mt-20 py-20 md:py-28">
            <div className="shell">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <Reveal className="max-w-[46ch]">
                        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                            The workflow
                        </p>
                        <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[40px]">
                            Three steps, no handoff
                        </h2>
                    </Reveal>
                    <Reveal delay={0.06}>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            Templates → layers → export
                        </p>
                    </Reveal>
                </div>

                <ol className="mt-12 flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)_4.5rem_minmax(0,1fr)]">
                    {STEPS.map((step, index) => (
                        <Fragment key={step.verb}>
                            <li className="min-w-0">
                                <Reveal delay={index * 0.08} className="h-full">
                                    <article className="group flex h-full flex-col border border-border bg-surface transition-colors duration-300 hover:border-border-strong">
                                        <div className="canvas-grid relative flex h-[220px] items-center justify-center overflow-hidden border-b border-border px-5 py-5 md:h-[200px] lg:h-[244px] lg:px-8">
                                            <StepArt index={index} />
                                        </div>
                                        <div className="flex flex-1 flex-col p-6">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                                Step {String(index + 1).padStart(2, "0")}
                                            </p>
                                            <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.01em] text-foreground">
                                                {step.verb}
                                            </h3>
                                            <p className="mt-2 max-w-[38ch] text-[13px] leading-relaxed text-muted-foreground">
                                                {step.body}
                                            </p>
                                        </div>
                                    </article>
                                </Reveal>
                            </li>
                            {index < STEPS.length - 1 ? <StepLink index={index} /> : null}
                        </Fragment>
                    ))}
                </ol>
            </div>
        </section>
    );
}

/**
 * A connector lives in its own grid cell, so the line can only ever occupy the
 * gap between two blocks. The pulse is drawn per gap, one after the other, so
 * the eye is pulled left to right instead of watching three lines at once.
 */
function StepLink({ index }: { index: number }) {
    return (
        <li
            aria-hidden="true"
            className="step-link relative w-full md:w-auto md:self-stretch"
            style={{ "--link-delay": `${index * 1.9}s` } as CSSProperties}
        >
            <span className="step-link-rail">
                <span className="step-link-line" />
                <span className="step-link-pulse" />
            </span>
            <span className="step-link-node step-link-node-start" />
            <span className="step-link-node step-link-node-end" />
        </li>
    );
}

function StepArt({ index }: { index: number }) {
    if (index === 0) return <PickArt />;
    if (index === 1) return <TuneArt />;
    return <ExportArt />;
}

function PickArt() {
    return (
        <svg viewBox="46 40 228 140" className="step-art step-art-pick" aria-hidden="true" focusable="false">
            <g transform="translate(160 106)">
                <g className="step-art-back-a">
                    <g transform="translate(-38 0) rotate(-9)">
                        <rect
                            x="-59"
                            y="-37"
                            width="118"
                            height="74"
                            fill="#0b0b0b"
                            stroke="rgba(255,255,255,0.14)"
                        />
                        <rect x="-43" y="-20" width="58" height="4" fill="rgba(255,255,255,0.36)" />
                        <rect x="-43" y="-12" width="36" height="3.5" fill="rgba(255,255,255,0.18)" />
                        <circle cx="30" cy="16" r="11" fill="none" stroke="rgba(255,255,255,0.18)" />
                        <rect x="-43" y="24" width="20" height="2" fill="rgba(255,255,255,0.2)" />
                    </g>
                </g>

                <g className="step-art-back-b">
                    <g transform="translate(38 0) rotate(9)">
                        <rect
                            x="-59"
                            y="-37"
                            width="118"
                            height="74"
                            fill="#0b0b0b"
                            stroke="rgba(255,255,255,0.14)"
                        />
                        <rect x="-43" y="-20" width="48" height="4" fill="rgba(255,255,255,0.3)" />
                        <rect x="-43" y="-12" width="62" height="3.5" fill="rgba(255,255,255,0.16)" />
                        <path
                            d="M-43 26 L-8 8 L27 28"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="0.8"
                        />
                    </g>
                </g>

                <g transform="translate(0 6)">
                    <g className="step-art-front">
                        <rect
                            x="-59"
                            y="-37"
                            width="118"
                            height="74"
                            fill="#0f0f0f"
                            stroke="rgba(255,255,255,0.3)"
                        />
                        <text
                            x="-47"
                            y="-23"
                            fill="rgba(255,255,255,0.4)"
                            fontFamily="var(--font-mono)"
                            fontSize="4.6"
                            letterSpacing="1.1"
                        >
                            AURORA
                        </text>
                        <rect x="-47" y="-11" width="72" height="5" fill="rgba(255,255,255,0.82)" />
                        <rect x="-47" y="-2" width="46" height="5" fill="rgba(255,255,255,0.34)" />
                        <path
                            d="M-8 28 Q 16 2 46 26"
                            fill="none"
                            stroke="rgba(255,255,255,0.45)"
                            strokeWidth="0.9"
                        />
                        <rect x="-47" y="26" width="22" height="2" fill="rgba(255,255,255,0.26)" />

                        <g className="step-art-select">
                            <rect
                                x="-63"
                                y="-41"
                                width="126"
                                height="82"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="1"
                            />
                            <rect x="-65" y="-43" width="4" height="4" fill="#ffffff" />
                            <rect x="61" y="-43" width="4" height="4" fill="#ffffff" />
                            <rect x="-65" y="39" width="4" height="4" fill="#ffffff" />
                            <rect x="61" y="39" width="4" height="4" fill="#ffffff" />
                            <g transform="translate(-63 -50)">
                                <rect width="35" height="9" fill="#ffffff" />
                                <text
                                    x="17.5"
                                    y="6.2"
                                    textAnchor="middle"
                                    fill="#0a0a0a"
                                    fontFamily="var(--font-mono)"
                                    fontSize="4.4"
                                    fontWeight="600"
                                    letterSpacing="0.4"
                                >
                                    TEMPLATE
                                </text>
                            </g>
                        </g>
                    </g>
                </g>

                <g transform="translate(78 44)">
                    <g className="step-art-cursor">
                        <circle
                            cx="4"
                            cy="5"
                            r="1.6"
                            fill="none"
                            stroke="rgba(255,255,255,0.9)"
                            strokeWidth="0.8"
                            className="step-art-click"
                        />
                        <path
                            d="M0 0 L0 11 L3.2 8.2 L5.2 12.8 L7.6 11.8 L5.7 7.3 L9.8 7.1 Z"
                            fill="#ffffff"
                            stroke="#0a0a0a"
                            strokeWidth="0.8"
                            strokeLinejoin="round"
                        />
                    </g>
                </g>
            </g>
        </svg>
    );
}

function TuneArt() {
    return (
        <svg viewBox="10 32 300 136" className="step-art step-art-tune" aria-hidden="true" focusable="false">
            <rect x="20" y="44" width="182" height="112" fill="#0d0d0d" stroke="rgba(255,255,255,0.16)" />
            <text
                x="34"
                y="61"
                fill="rgba(255,255,255,0.36)"
                fontFamily="var(--font-mono)"
                fontSize="4.6"
                letterSpacing="0.8"
            >
                OGIMG.IN
            </text>
            <line x1="20" y1="68" x2="202" y2="68" stroke="rgba(255,255,255,0.1)" />

            <g className="step-art-type">
                <text
                    x="34"
                    y="94"
                    fill="rgba(255,255,255,0.92)"
                    fontFamily="var(--font-serif)"
                    fontSize="17"
                >
                    Make it
                </text>
                <text
                    x="34"
                    y="110"
                    fill="rgba(255,255,255,0.92)"
                    fontFamily="var(--font-serif)"
                    fontSize="17"
                    className="step-art-type-line2"
                >
                    yours.
                </text>
            </g>
            <line x1="34" y1="124" x2="90" y2="124" stroke="rgba(255,255,255,0.22)" />
            <rect x="34" y="132" width="112" height="2" fill="rgba(255,255,255,0.08)" />
            <rect x="34" y="138" width="84" height="2" fill="rgba(255,255,255,0.06)" />

            <g className="step-art-select-2">
                <rect x="29" y="76" width="112" height="42" fill="none" stroke="#ffffff" strokeWidth="1" />
                <rect x="27" y="74" width="4" height="4" fill="#ffffff" />
                <rect x="139" y="74" width="4" height="4" fill="#ffffff" />
                <rect x="27" y="116" width="4" height="4" fill="#ffffff" />
                <rect x="139" y="116" width="4" height="4" fill="#ffffff" />
            </g>

            <rect x="216" y="44" width="84" height="112" fill="#0b0b0b" stroke="rgba(255,255,255,0.16)" />
            <text x="226" y="63" fill="rgba(255,255,255,0.9)" fontFamily="var(--font-serif)" fontSize="14">
                Aa
            </text>
            <line x1="216" y1="71" x2="300" y2="71" stroke="rgba(255,255,255,0.1)" />

            <line x1="226" y1="91" x2="290" y2="91" stroke="rgba(255,255,255,0.18)" />
            <line x1="226" y1="91" x2="248" y2="91" stroke="rgba(255,255,255,0.5)" className="step-art-fill-a" />
            <circle cx="248" cy="91" r="2.2" fill="#ffffff" className="step-art-knob-a" />

            <line x1="226" y1="113" x2="290" y2="113" stroke="rgba(255,255,255,0.18)" />
            <line x1="226" y1="113" x2="262" y2="113" stroke="rgba(255,255,255,0.5)" className="step-art-fill-b" />
            <circle cx="262" cy="113" r="2.2" fill="#ffffff" className="step-art-knob-b" />

            <line x1="226" y1="135" x2="290" y2="135" stroke="rgba(255,255,255,0.18)" />
            <line x1="226" y1="135" x2="240" y2="135" stroke="rgba(255,255,255,0.5)" className="step-art-fill-c" />
            <circle cx="240" cy="135" r="2.2" fill="#ffffff" className="step-art-knob-c" />
        </svg>
    );
}

function ExportArt() {
    return (
        <svg viewBox="10 32 300 136" className="step-art step-art-export" aria-hidden="true" focusable="false">
            <rect x="18" y="70" width="96" height="50" fill="#0d0d0d" stroke="rgba(255,255,255,0.2)" />
            <rect x="26" y="90" width="44" height="3.4" fill="rgba(255,255,255,0.8)" />
            <rect x="26" y="97" width="30" height="3" fill="rgba(255,255,255,0.32)" />
            <path d="M26 112 Q 52 96 84 110" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="0.8" />

            <g stroke="rgba(255,255,255,0.16)" strokeWidth="0.8">
                <line x1="114" y1="95" x2="132" y2="95" />
                <line x1="186" y1="95" x2="206" y2="95" />
            </g>

            <circle className="step-art-dot-a" cx="114" cy="95" r="1.9" fill="#ffffff" />
            <circle className="step-art-dot-b" cx="186" cy="95" r="1.9" fill="#ffffff" />

            <g className="step-art-file">
                <rect x="132" y="63" width="54" height="64" fill="#0f0f0f" stroke="rgba(255,255,255,0.28)" />
                <path
                    d="M174 63 L186 75 L186 63 Z"
                    fill="#181818"
                    stroke="rgba(255,255,255,0.2)"
                    strokeLinejoin="round"
                />
                <text
                    x="159"
                    y="93"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.86)"
                    fontFamily="var(--font-mono)"
                    fontSize="6.5"
                    letterSpacing="0.6"
                >
                    PNG
                </text>
                <rect
                    x="132"
                    y="63"
                    width="54"
                    height="64"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    className="step-art-file-flash"
                />
            </g>

            <g>
                <rect x="206" y="44" width="96" height="102" fill="#0b0b0b" stroke="rgba(255,255,255,0.18)" />
                <line x1="206" y1="58" x2="302" y2="58" stroke="rgba(255,255,255,0.12)" />
                <circle cx="212" cy="51" r="1.1" fill="rgba(255,255,255,0.34)" />
                <circle cx="217" cy="51" r="1.1" fill="rgba(255,255,255,0.22)" />
                <circle cx="222" cy="51" r="1.1" fill="rgba(255,255,255,0.14)" />
                <rect
                    x="227"
                    y="47.5"
                    width="66"
                    height="7"
                    fill="rgba(255,255,255,0.05)"
                    stroke="rgba(255,255,255,0.08)"
                />

                <rect x="213" y="65" width="82" height="42" fill="#101010" stroke="rgba(255,255,255,0.14)" />
                <rect x="221" y="78" width="48" height="3.4" fill="rgba(255,255,255,0.76)" />
                <rect x="221" y="84.5" width="34" height="3" fill="rgba(255,255,255,0.3)" />
                <path d="M221 99 Q 247 88 277 97" fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="0.8" />

                <g className="step-art-meta">
                    <rect x="213" y="116" width="34" height="2.4" fill="rgba(255,255,255,0.5)" />
                    <rect x="213" y="122" width="54" height="2" fill="rgba(255,255,255,0.22)" />
                    <rect x="213" y="128" width="42" height="2.4" fill="rgba(255,255,255,0.38)" />
                    <rect x="213" y="134" width="62" height="2" fill="rgba(255,255,255,0.18)" />
                </g>
            </g>
        </svg>
    );
}
