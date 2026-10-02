"use client";

import { getTemplateById } from "./templates/templateRegistry";
import MinimalistTech from "./templates/MinimalistTech";
import AppShowcase from "./templates/AppShowcase";
import CenteredContainer from "./templates/CenteredContainer";
import BrandPitch from "./templates/BrandPitch";
import EditorialPixel from "./templates/EditorialPixel";
import SaasLaunch from "./templates/SaasLaunch";
import BlogPost from "./templates/BlogPost";
import PodcastCover from "./templates/PodcastCover";
import Changelog from "./templates/Changelog";
import type { TemplateProps } from "./templates/templateShared";
import { getTemplateDefaultFontId, getTemplateFontFamily } from "./templates/fontCatalog";
import ScaledCanvas from "./editor/ScaledCanvas";

export default function TemplateGalleryPreview({
    templateId,
}: {
    templateId: Parameters<typeof getTemplateById>[0];
}) {
    const template = getTemplateById(templateId);
    const defaults = template.defaults;

    const templateProps: TemplateProps = {
        title: defaults.title,
        textColor: defaults.textColor,
        logoImage: "/icon.png",
        image: template.supportsImage ? defaults.image || undefined : undefined,
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

    const renderTemplate = () => {
        switch (templateId) {
            case "app-showcase":
                return <AppShowcase {...templateProps} />;
            case "centered-container":
                return <CenteredContainer {...templateProps} />;
            case "brand-pitch":
                return <BrandPitch {...templateProps} />;
            case "editorial-pixel":
                return <EditorialPixel {...templateProps} />;
            case "saas-launch":
                return <SaasLaunch {...templateProps} />;
            case "blog-post":
                return <BlogPost {...templateProps} />;
            case "podcast-cover":
                return <PodcastCover {...templateProps} />;
            case "changelog":
                return <Changelog {...templateProps} />;
            case "minimalist-tech":
            default:
                return <MinimalistTech {...templateProps} />;
        }
    };

    return (
        <ScaledCanvas width={1200} height={630} maxWidth={1200}>
            {renderTemplate()}
        </ScaledCanvas>
    );
}