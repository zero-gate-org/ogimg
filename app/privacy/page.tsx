import type { Metadata } from "next";
import {
    LegalDocument,
    LegalLink,
    LegalList,
    LegalSection,
} from "../components/legal/legalPrimitives";
import { ISSUES_URL, OPERATOR, REPO_URL } from "../lib/legal";
import { createMetadata } from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Privacy Policy",
    description:
        "What the ogimg.in editor stores on your device, what it never sends anywhere, and how to remove it.",
    path: "/privacy",
    keywords: ["ogimg privacy policy", "browser based editor privacy", "open graph editor no upload"],
});

export default function PrivacyPage() {
    return (
        <LegalDocument
            title="Privacy Policy"
            summary="What this site stores, what it never receives, and how to remove it."
            currentHref="/privacy"
        >
            <LegalSection index="01" title="The short version">
                <p>
                    Everything you make in the editor stays in your browser. There are no accounts, no
                    analytics, and no server that receives your images or your words. We cannot see your work,
                    because it never leaves your device.
                </p>
            </LegalSection>

            <LegalSection index="02" title="What stays on your device">
                <p>
                    The editor saves your work in your browser&apos;s local storage. That is a private store
                    your browser keeps for this site on this device, and it is never sent to us. It holds:
                </p>
                <LegalList
                    items={[
                        "Saved projects, so a card can be opened and edited again later.",
                        "Brand kits, so a logo, its colours, and its typeface stay together.",
                        "An automatic draft of the free canvas, so a refresh does not lose your place.",
                        "Any file you upload, such as a background photo or a logo, kept inside the record that uses it.",
                    ]}
                />
                <p>
                    All of it sits under this site&apos;s entry in your browser settings, so you can read it
                    there at any time.
                </p>
            </LegalSection>

            <LegalSection index="03" title="What we never receive">
                <p>
                    There is no account and nothing to sign in to, so no name, email address, or password is
                    ever asked for. In particular, none of this reaches us:
                </p>
                <LegalList
                    items={[
                        "The words and the images you put on a card.",
                        "Your saved projects and brand kits.",
                        "The files you export. Your own browser renders them and saves them straight to your device.",
                    ]}
                />
            </LegalSection>

            <LegalSection index="04" title="What the web host records">
                <p>
                    Like any website, the pages you open are delivered to your browser by a hosting provider.
                    That provider keeps standard server logs, which normally record the address the request
                    came from, the time, the files requested, and the browser&apos;s user agent string.
                </p>
                <p>
                    Those logs are used to keep the site online and to look into attacks or abuse. They are not
                    joined to anything you make in the editor, and they are not used to build a picture of you.
                </p>
                <p>
                    How long they are kept is set by the hosting provider&apos;s own retention policy, not by
                    this site.
                </p>
            </LegalSection>

            <LegalSection index="05" title="Other services">
                <p>
                    No analytics, no advertising, no tracking pixels, and no third party scripts are loaded.
                    The fonts, icons, and images this site shows are served from its own domain, so simply using
                    the editor does not contact anyone else.
                </p>
                <p>
                    The one outside service you can reach is GitHub, if you follow the source link or the issue
                    link. That visit is between you and GitHub, and their privacy policy covers it.
                </p>
            </LegalSection>

            <LegalSection index="06" title="Cookies">
                <p>
                    This site sets no cookies at all, so there is nothing to accept or refuse. What it keeps on
                    your device instead is listed in the <LegalLink href="/cookies">Cookie Policy</LegalLink>.
                </p>
            </LegalSection>

            <LegalSection index="07" title="How long your work is kept">
                <p>
                    Nothing is kept on our side, so there is no retention period for your work to describe. On
                    your device, projects and brand kits stay until you delete them or clear this site&apos;s
                    data.
                </p>
            </LegalSection>

            <LegalSection index="08" title="Removing what is stored">
                <p>
                    Clearing site data for ogimg.in in your browser settings removes everything at once.
                    Deleting a single project or brand kit in the editor removes only that one. Because no copy
                    is held anywhere else, both are final.
                </p>
            </LegalSection>

            <LegalSection index="09" title="Your rights over your data">
                <p>
                    In some places the law gives people the right to see, correct, or delete the personal data
                    an organisation holds about them. This site holds no personal data about you, so there is
                    nothing on our side to show, correct, or erase. The data you do have lives in your browser,
                    where you can manage it yourself.
                </p>
                <p>
                    If you believe something about you is held anyway, open an{" "}
                    <LegalLink href={ISSUES_URL}>issue on GitHub</LegalLink> and it will be looked into.
                </p>
            </LegalSection>

            <LegalSection index="10" title="Children">
                <p>
                    This site is not aimed at children, and nothing is knowingly collected from them. Since
                    nothing is collected from anyone, there is nothing for a parent or guardian to ask us to
                    remove.
                </p>
            </LegalSection>

            <LegalSection index="11" title="Changes to this policy">
                <p>
                    If what the site does changes, this page changes with it and the date at the top moves. The
                    edit itself is visible in the <LegalLink href={REPO_URL}>public repository</LegalLink>.
                </p>
            </LegalSection>

            <LegalSection index="12" title="Who runs this site">
                <p>
                    ogimg.in is built and run by {OPERATOR} as an individual. The contact route is on the{" "}
                    <LegalLink href="/contact">Contact and Grievance</LegalLink> page.
                </p>
            </LegalSection>
        </LegalDocument>
    );
}