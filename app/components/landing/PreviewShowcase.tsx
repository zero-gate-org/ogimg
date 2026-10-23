"use client";

import { HERO_DOCUMENT } from "./LiveCard";
import SocialPreview from "../editor/SocialPreview";
import { SectionHeading } from "./landingPrimitives";

/**
 * Reuses the editor's own preview simulator so the landing page shows the same
 * component a user gets inside the app.
 */
export default function PreviewShowcase() {
    return (
        <section id="preview" className="scroll-mt-20 border-b border-border py-20 md:py-28">
            <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                <SectionHeading
                    eyebrow="Preview simulator"
                    title="Check the card where it will land"
                    body="Most image generators stop at the file. This one shows the rendered result inside X, LinkedIn, Discord, and Slack, next to the title and description people will read."
                />

                <div className="hover-lift border border-border bg-surface p-4 hover:border-border-strong md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            Simulated, not screenshotted
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground">1 : 1.91</p>
                    </div>
                    <SocialPreview
                        document={HERO_DOCUMENT}
                        title="Open Graph images your links deserve"
                        description="Start from a template or compose one from scratch. Export happens in the browser."
                        url="https://ogimg.in"
                        compact
                    />
                </div>
            </div>
        </section>
    );
}
