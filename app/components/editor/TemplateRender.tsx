"use client";

import MinimalistTech from "../templates/MinimalistTech";
import AppShowcase from "../templates/AppShowcase";
import CenteredContainer from "../templates/CenteredContainer";
import BrandPitch from "../templates/BrandPitch";
import EditorialPixel from "../templates/EditorialPixel";
import SaasLaunch from "../templates/SaasLaunch";
import BlogPost from "../templates/BlogPost";
import PodcastCover from "../templates/PodcastCover";
import Changelog from "../templates/Changelog";
import { getTemplateFontFamily } from "../templates/fontCatalog";
import type { TemplateProps } from "../templates/templateShared";
import type { TemplateId } from "../templates/templateRegistry";
import type { TemplateDocument } from "../../lib/editor/types";

export const renderTemplateComponent = (templateId: TemplateId, props: TemplateProps) => {
    switch (templateId) {
        case "app-showcase":
            return <AppShowcase {...props} />;
        case "centered-container":
            return <CenteredContainer {...props} />;
        case "brand-pitch":
            return <BrandPitch {...props} />;
        case "editorial-pixel":
            return <EditorialPixel {...props} />;
        case "saas-launch":
            return <SaasLaunch {...props} />;
        case "blog-post":
            return <BlogPost {...props} />;
        case "podcast-cover":
            return <PodcastCover {...props} />;
        case "changelog":
            return <Changelog {...props} />;
        case "minimalist-tech":
        default:
            return <MinimalistTech {...props} />;
    }
};

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
        titleTracking: fields.titleTracking || 0,
        imageFit: fields.imageFit,
        imageRadius: fields.imageRadius,
    };
};

/**
 * Shared template surface used by the editor, the gallery preview, and the
 * social preview simulator so all three stay pixel-identical.
 */
export default function TemplateRender({ document }: { document: TemplateDocument }) {
    return renderTemplateComponent(document.templateId, templateDocumentToProps(document));
}