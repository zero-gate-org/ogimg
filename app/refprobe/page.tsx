import TemplateGalleryPreview from "../components/TemplateGalleryPreview";

export default function RefProbePage() {
    return (
        <div style={{ margin: 0, padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/_ref05_probe.svg" alt="" width={1200} height={630} style={{ display: "block" }} />
            <TemplateGalleryPreview templateId="graphite-window" maxWidth={1200} />
        </div>
    );
}
