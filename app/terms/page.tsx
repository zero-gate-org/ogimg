import type { Metadata } from "next";
import {
    LegalDocument,
    LegalLink,
    LegalList,
    LegalSection,
} from "../components/legal/legalPrimitives";
import { LICENSE_URL, OPERATOR, REPO_URL } from "../lib/legal";
import { createMetadata } from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Terms of Service",
    description:
        "The rules for using the ogimg.in editor, who owns what you make, and what the site answers for.",
    path: "/terms",
    keywords: ["ogimg terms of service", "open graph editor terms", "og image generator terms of use"],
});

export default function TermsPage() {
    return (
        <LegalDocument
            title="Terms of Service"
            summary="The rules for using the editor, what you own, and what we answer for."
            currentHref="/terms"
        >
            <LegalSection index="01" title="Agreeing to these terms">
                <p>
                    By using ogimg.in you agree to these terms. If you do not agree with them, please do not use
                    the site.
                </p>
            </LegalSection>

            <LegalSection index="02" title="What the service is">
                <p>
                    ogimg.in is a browser based tool for making Open Graph and social preview images. It is
                    free, needs no account, and runs inside the browser tab you opened it in.
                </p>
                <p>
                    It is offered as it stands today. Features can change, and the site can be changed or
                    withdrawn at any time.
                </p>
            </LegalSection>

            <LegalSection index="03" title="Your work stays yours">
                <p>
                    You keep every right you already had in the images, the words, and the designs you make
                    here. No licence over your work is claimed by this site, and no ownership of it is claimed,
                    so nothing you make is used to promote it.
                </p>
                <p>Since your work never reaches us, it could not be reused even if we wanted to.</p>
            </LegalSection>

            <LegalSection index="04" title="What you must not do">
                <LegalList
                    items={[
                        "Use the editor to create or share anything that is unlawful where you are.",
                        "Use it to infringe anyone else's rights, including copyright, trade marks, and other people's privacy.",
                        "Use it to mislead people, for example by making a card that appears to come from an organisation you do not represent.",
                        "Attack or overload the site, try to break its security, or scrape it in a way that harms it.",
                        "Present the site as your own product, or suggest that it endorses you.",
                    ]}
                />
            </LegalSection>

            <LegalSection index="05" title="The code is open source">
                <p>
                    The source code is released under the{" "}
                    <LegalLink href={LICENSE_URL}>MIT License</LegalLink>. That licence lets you copy, change,
                    and host the code, including for commercial work, as long as the licence notice travels with
                    it.
                </p>
                <p>
                    The ogimg.in name and logo are not covered by that licence, and stay with the operator.
                </p>
            </LegalSection>

            <LegalSection index="06" title="Files you add">
                <p>
                    You are responsible for any image, font, or file you load into the editor, including having
                    the right to use it.
                </p>
                <p>
                    Keep your own copy of anything you cannot lose. Your work lives only in your browser, so
                    clearing site data, or losing the device, loses it too.
                </p>
            </LegalSection>

            <LegalSection index="07" title="No warranty">
                <p>
                    The site is provided as is, without warranties of any kind. Nothing here promises that the
                    site will always be available, that it will be free of mistakes, or that an export will
                    satisfy the rules of any particular platform.
                </p>
            </LegalSection>

            <LegalSection index="08" title="Limits on our responsibility">
                <p>
                    To the extent the law allows, this site is not responsible for indirect or unexpected
                    losses, or for lost profits, lost data, or lost reputation, that come from using the site or
                    from being unable to use it.
                </p>
                <p>
                    Where responsibility cannot be excluded, it is limited to what you have paid for the site,
                    which is nothing, because the site is free.
                </p>
            </LegalSection>

            <LegalSection index="09" title="Ending your use">
                <p>
                    You can stop using the site whenever you like, and you can remove your work by clearing this
                    site&apos;s data in your browser.
                </p>
                <p>Access can be blocked if these terms are broken.</p>
            </LegalSection>

            <LegalSection index="10" title="Changes to these terms">
                <p>
                    These terms can be updated. The date at the top of the page shows the version in force, and
                    carrying on after a change means you accept it.
                </p>
            </LegalSection>

            <LegalSection index="11" title="If something goes wrong">
                <p>
                    Nothing in these terms takes away a protection that the law where you live gives you, where
                    that protection cannot be given up by agreement.
                </p>
                <p>
                    If a disagreement comes up, please raise it through the{" "}
                    <LegalLink href="/contact">contact route</LegalLink> first, so there is a chance to settle
                    it directly.
                </p>
            </LegalSection>

            <LegalSection index="12" title="Who runs this site">
                <p>
                    ogimg.in is run by {OPERATOR} as an individual, and the source is{" "}
                    <LegalLink href={REPO_URL}>public</LegalLink>. The contact route is on the{" "}
                    <LegalLink href="/contact">Contact and Grievance</LegalLink> page.
                </p>
            </LegalSection>
        </LegalDocument>
    );
}