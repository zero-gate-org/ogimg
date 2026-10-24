import type { Metadata } from "next";
import {
    LegalDocument,
    LegalLink,
    LegalList,
    LegalSection,
} from "../components/legal/legalPrimitives";
import { ISSUES_URL, LICENSE_URL, OPERATOR } from "../lib/legal";
import { createMetadata } from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Contact and Grievance",
    description:
        "Who runs ogimg.in, how to reach them for a bug, a privacy request, or a complaint, and how those are handled.",
    path: "/contact",
    keywords: ["ogimg contact", "ogimg grievance", "report a bug ogimg"],
});

export default function ContactPage() {
    return (
        <LegalDocument
            title="Contact and Grievance"
            summary="Who runs ogimg.in, how to reach them, and how complaints are handled."
            currentHref="/contact"
        >
            <LegalSection index="01" title="Who runs this site">
                <p>
                    ogimg.in is built and run by {OPERATOR} as an individual developer. It is a free, open
                    source project rather than a company, and there is no support desk behind it.
                </p>
            </LegalSection>

            <LegalSection index="02" title="How to reach us">
                <p>
                    The route to get in touch is the{" "}
                    <LegalLink href={ISSUES_URL}>public issue tracker on GitHub</LegalLink>. It needs no account
                    beyond a GitHub one, and it keeps a record that both sides can follow.
                </p>
                <p>It helps to include:</p>
                <LegalList
                    items={[
                        "What you were doing when the problem appeared.",
                        "The browser you were using, and its version.",
                        "A screenshot, if the problem is something you can see.",
                    ]}
                />
                <p>
                    One warning: issues are public. Do not paste personal details, private documents, or images
                    you would not want anyone else to see.
                </p>
            </LegalSection>

            <LegalSection index="03" title="Privacy requests">
                <p>
                    This site keeps no personal data, so most requests about your data are answered by clearing
                    this site&apos;s data in your browser. There is no account to close, and nothing on our side to
                    delete.
                </p>
                <p>
                    If you think something about you is held anyway, open an issue and it will be looked into.
                </p>
            </LegalSection>

            <LegalSection index="04" title="Complaints and grievances">
                <p>
                    Complaints are handled by {OPERATOR}, who is the grievance contact for this site. Raising
                    them in the issue tracker keeps a public record, which is the fairest way to settle a
                    dispute about the site.
                </p>
                <p>
                    This is a project run by one person in their own time, so there is no guaranteed reply time.
                    Issues are read and answered as time allows.
                </p>
            </LegalSection>

            <LegalSection index="05" title="Copyright and licence">
                <p>
                    Copyright in this site, its name, and its logo belongs to {OPERATOR}. The source code is
                    released under the <LegalLink href={LICENSE_URL}>MIT License</LegalLink>, so the code itself
                    can be reused on those terms.
                </p>
                <p>
                    The typefaces bundled with the editor come from their own projects, and stay under their own
                    open source licences. Anything you make in the editor is yours, as the{" "}
                    <LegalLink href="/terms">Terms of Service</LegalLink> describes.
                </p>
            </LegalSection>

            <LegalSection index="06" title="Changes to this page">
                <p>
                    The policies linked below are updated when something changes. The date at the top of each
                    one shows the version currently in force.
                </p>
            </LegalSection>
        </LegalDocument>
    );
}