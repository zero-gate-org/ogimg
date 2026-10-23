"use client";

import { renderTemplateComponent } from "../templates/templateRenderers";
import { getTemplateFontFamily } from "../templates/fontCatalog";
import FreeCanvasRender from "./FreeCanvasRender";
import { templateLayoutToFreeDocument } from "../../lib/editor/templateLayout";
import type { TemplateProps } from "../templates/templateShared";
import type { TemplateDocument } from "../../lib/editor/types";

export const templateDocumentToProps = (document: TemplateDocument): TemplateProps => {
    const fields = document.fields;

    return {
        title: fields.title,
        textColor: fields.textColor,
        logoImage: document.logoImage || undefined,
        image: document.image || undefined,
        tag: fields.tag,
        logo: fields.logo,
        detailOne: fields.detailOne,
        detailTwo: fields.detailTwo,
        detailThree: fields.detailThree,
        fontStyle: "normal",
        fontWeight: "bold",
        textDecoration: "none",
        fontFamily: getTemplateFontFamily(fields.fontId),
        backgroundMode: fields.backgroundMode,
        gradientStart: fields.gradientStart,
        gradientEnd: fields.gradientEnd,
        gradientAngle: fields.gradientAngle,
        backgroundPresetId: fields.backgroundPresetId,
        gridOverlay: fields.gridOverlay,
        gridColor: fields.gridColor,
        gridOpacity: fields.gridOpacity,
        gridBlur: fields.gridBlur,
        titleSize: fields.titleSize,
        titleTracking: fields.titleTracking ?? undefined,
        imageFit: fields.imageFit,
        imageRadius: fields.imageRadius,
    };
};

/**
 * Shared template surface used by the editor, the gallery preview, and the
 * social preview simulator so all three stay pixel-identical.
 *
 * A template the user has detached into layers renders through the free canvas
 * so the exported pixels and every preview match the placement they chose; a
 * pristine template still renders from its own JSX.
 */
export default function TemplateRender({ document }: { document: TemplateDocument }) {
    if (document.layout) {
        const layout = templateLayoutToFreeDocument(document);
        if (layout) return <FreeCanvasRender document={layout} />;
    }

    return renderTemplateComponent(document.templateId, templateDocumentToProps(document));
}
