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
                    body="Most image generators stop at the file. This one shows the rendered result inside X, LinkedIn, Discord, and Slack previews, next to the title and description people will read."
                />

                <div className="min-w-0 border border-border bg-surface p-4 md:p-6">
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