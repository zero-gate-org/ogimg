import type { Metadata } from "next";
import {
    LegalDocument,
    LegalLink,
    LegalSection,
} from "../components/legal/legalPrimitives";
import { createMetadata } from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Cookie Policy",
    description:
        "ogimg.in sets no cookies. This page lists the browser storage it uses instead, what each record holds, and how to clear it.",
    path: "/cookies",
    keywords: ["ogimg cookie policy", "no cookies", "browser local storage"],
});

const STORED_RECORDS = [
    {
        name: "ogimg:projects:v1",
        holds: "Projects you saved, including their text, their layers, and any image inside them.",
        lifetime: "Until you delete the project, or clear this site's data.",
    },
    {
        name: "ogimg:brand-kits:v1",
        holds: "Brand kits: the logo you uploaded, its colours, its typeface, and the background settings.",
        lifetime: "Until you delete the brand kit, or clear this site's data.",
    },
    {
        name: "ogimg:studio-draft:v1",
        holds: "An automatic draft of the free canvas, so a refresh does not lose your place.",
        lifetime: "Until the next draft replaces it, or you clear this site's data.",
    },
];

export default function CookiePolicyPage() {
    return (
        <LegalDocument
            title="Cookie Policy"
            summary="The site sets no cookies. This lists what it stores on your device instead."
            currentHref="/cookies"
        >
            <LegalSection index="01" title="No cookies">
                <p>
                    ogimg.in sets no cookies. Not for signing in, not for remembering settings, not for
                    advertising, and not for measuring traffic. Because there are none, there is no consent
                    banner, and nothing to accept or refuse.
                </p>
            </LegalSection>

            <LegalSection index="02" title="What is used instead">
                <p>
                    The editor uses local storage, which is a private store your browser keeps for this site on
                    this device. Unlike a cookie, it is not attached to every request the browser makes. It is
                    read only by the page that is running in your browser.
                </p>
            </LegalSection>

            <LegalSection index="03" title="What is stored">
                <p>Three records are written, all of them so the editor can work:</p>
                <div className="overflow-x-auto border border-border">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-surface-raised">
                                <th className="border-b border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                    Record
                                </th>
                                <th className="border-b border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                    What it holds
                                </th>
                                <th className="border-b border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                    How long it stays
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {STORED_RECORDS.map((record) => (
                                <tr key={record.name} className="border-b border-border last:border-b-0">
                                    <td className="px-4 py-3 align-top font-mono text-[13px] text-foreground">
                                        {record.name}
                                    </td>
                                    <td className="px-4 py-3 align-top text-[14px] leading-relaxed text-muted-foreground">
                                        {record.holds}
                                    </td>
                                    <td className="px-4 py-3 align-top text-[14px] leading-relaxed text-muted-foreground">
                                        {record.lifetime}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p>
                    Uploaded logos and background photos are stored inside those records as text, which is why a
                    saved project still looks right after a reload.
                </p>
            </LegalSection>

            <LegalSection index="04" title="Why it is stored">
                <p>
                    Without local storage, the editor would forget everything the moment the page reloaded or
                    the tab closed. Keeping your work on your own device is what lets a project be reopened
                    later and what keeps brand kits between visits.
                </p>
                <p>None of it is a cookie, and none of it is sent anywhere.</p>
            </LegalSection>

            <LegalSection index="05" title="How to remove it">
                <p>
                    Clearing site data for ogimg.in in your browser settings removes all three records at once.
                    Deleting a project or a brand kit inside the editor removes that one.
                </p>
                <p>
                    Removal is permanent, because no copy is held anywhere else. Exports you already downloaded
                    are separate files on your device, and stay until you delete them.
                </p>
            </LegalSection>

            <LegalSection index="06" title="If storage is blocked">
                <p>
                    Some browsers block local storage, for example in a strict private window, or when storage
                    is full. The editor still works in that tab, but nothing is saved once you close it.
                </p>
            </LegalSection>

            <LegalSection index="07" title="Changes to this page">
                <p>
                    If cookies or analytics are ever added, they will be listed here by name and purpose, and
                    the date at the top of the page will change. The{" "}
                    <LegalLink href="/privacy">Privacy Policy</LegalLink> covers everything else about what this
                    site does and does not collect.
                </p>
            </LegalSection>
        </LegalDocument>
    );
}