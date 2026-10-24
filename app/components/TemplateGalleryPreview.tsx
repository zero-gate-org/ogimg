"use client";

import { getTemplateById } from "./templates/templateRegistry";
import { renderTemplateComponent } from "./templates/templateRenderers";
import type { TemplateProps } from "./templates/templateShared";
import { getTemplateDefaultFontId, getTemplateFontFamily } from "./templates/fontCatalog";
import ScaledCanvas from "./editor/ScaledCanvas";

export default function TemplateGalleryPreview({
    templateId,
    maxWidth = 1200,
}: {
    templateId: Parameters<typeof getTemplateById>[0];
    /** Allows large preview surfaces to scale the artboard past its native width. */
    maxWidth?: number;
}) {
    const template = getTemplateById(templateId);
    const defaults = template.defaults;

    const templateProps: TemplateProps = {
        title: defaults.title,
        textColor: defaults.textColor,
        logoImage: "/icon.png",
        image:
            templateId === "og-image-studio"
                ? "/hero-editor-aurora.png"
                : template.supportsImage
                  ? defaults.image || undefined
                  : undefined,
        tag: defaults.tag,
        logo: defaults.logo,
        detailOne: defaults.detailOne,
        detailTwo: defaults.detailTwo,
        detailThree: defaults.detailThree,
        fontStyle: "normal",
        fontWeight: "bold",
        textDecoration: "none",
        fontFamily: getTemplateFontFamily(getTemplateDefaultFontId(templateId)),
        backgroundMode: defaults.backgroundMode,
        gradientStart: defaults.gradientStart,
        gradientEnd: defaults.gradientEnd,
        gradientAngle: defaults.gradientAngle,
        backgroundPresetId: defaults.backgroundPresetId,
        gridOverlay: defaults.gridOverlay,
        gridColor: defaults.gridColor,
        gridOpacity: defaults.gridOpacity,
        gridBlur: defaults.gridBlur,
        titleSize: null,
        titleTracking: undefined,
        imageFit: template.defaultImageFit,
        imageRadius: 0,
    };

    return (
        <ScaledCanvas width={1200} height={630} maxWidth={maxWidth}>
            {renderTemplateComponent(templateId, templateProps)}
        </ScaledCanvas>
    );
}
