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
import NeonGrid from "./templates/NeonGrid";
import Spotlight from "./templates/Spotlight";
import GridGlow from "./templates/GridGlow";
import AuroraArc from "./templates/AuroraArc";
import TealGrid from "./templates/TealGrid";
import ColorMesh from "./templates/ColorMesh";
import Dusk from "./templates/Dusk";
import Spectrum from "./templates/Spectrum";
import NotchCard from "./templates/NotchCard";
import StackedDeck from "./templates/StackedDeck";
import StatBento from "./templates/StatBento";
import GridBloom from "./templates/GridBloom";
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
            case "neon-grid":
                return <NeonGrid {...templateProps} />;
            case "spotlight":
                return <Spotlight {...templateProps} />;
            case "grid-glow":
                return <GridGlow {...templateProps} />;
            case "arc":
                return <AuroraArc {...templateProps} />;
            case "teal-grid":
                return <TealGrid {...templateProps} />;
            case "mesh":
                return <ColorMesh {...templateProps} />;
            case "dusk":
                return <Dusk {...templateProps} />;
            case "spectrum":
                return <Spectrum {...templateProps} />;
            case "ticket":
                return <NotchCard {...templateProps} />;
            case "deck":
                return <StackedDeck {...templateProps} />;
            case "bento":
                return <StatBento {...templateProps} />;
            case "crossglow":
                return <GridBloom {...templateProps} />;
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