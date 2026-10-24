"use client";

import MinimalistTech from "./MinimalistTech";
import AppShowcase from "./AppShowcase";
import CenteredContainer from "./CenteredContainer";
import BrandPitch from "./BrandPitch";
import EditorialPixel from "./EditorialPixel";
import SaasLaunch from "./SaasLaunch";
import BlogPost from "./BlogPost";
import PodcastCover from "./PodcastCover";
import Changelog from "./Changelog";
import NeonGrid from "./NeonGrid";
import Spotlight from "./Spotlight";
import GridGlow from "./GridGlow";
import AuroraArc from "./AuroraArc";
import TealGrid from "./TealGrid";
import ColorMesh from "./ColorMesh";
import Dusk from "./Dusk";
import Spectrum from "./Spectrum";
import NotchCard from "./NotchCard";
import StackedDeck from "./StackedDeck";
import StatBento from "./StatBento";
import GridBloom from "./GridBloom";
import HorizonBloom from "./HorizonBloom";
import CornerFlare from "./CornerFlare";
import SolarMesh from "./SolarMesh";
import VioletRail from "./VioletRail";
import TiltPlate from "./TiltPlate";
import StatRail from "./StatRail";
import PrismFrame from "./PrismFrame";
import ArchGlow from "./ArchGlow";
import FacetField from "./FacetField";
import CyanRim from "./CyanRim";
import LightColumn from "./LightColumn";
import SoftMesh from "./SoftMesh";
import AgileStartup from "./AgileStartup";
import OgImageStudio from "./OgImageStudio";
import type { TemplateProps } from "./templateShared";
import type { TemplateId } from "./templateRegistry";

/**
 * The single place a template id turns into the component that draws it.
 *
 * The editor, the gallery, and the landing showcase all render through here so
 * adding a template is one case, not one case per surface.
 */
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
        case "neon-grid":
            return <NeonGrid {...props} />;
        case "spotlight":
            return <Spotlight {...props} />;
        case "grid-glow":
            return <GridGlow {...props} />;
        case "arc":
            return <AuroraArc {...props} />;
        case "teal-grid":
            return <TealGrid {...props} />;
        case "mesh":
            return <ColorMesh {...props} />;
        case "dusk":
            return <Dusk {...props} />;
        case "spectrum":
            return <Spectrum {...props} />;
        case "ticket":
            return <NotchCard {...props} />;
        case "deck":
            return <StackedDeck {...props} />;
        case "bento":
            return <StatBento {...props} />;
        case "crossglow":
            return <GridBloom {...props} />;
        case "horizon-bloom":
            return <HorizonBloom {...props} />;
        case "corner-flare":
            return <CornerFlare {...props} />;
        case "solar-mesh":
            return <SolarMesh {...props} />;
        case "violet-rail":
            return <VioletRail {...props} />;
        case "tilt-plate":
            return <TiltPlate {...props} />;
        case "stat-rail":
            return <StatRail {...props} />;
        case "prism-frame":
            return <PrismFrame {...props} />;
        case "arch-glow":
            return <ArchGlow {...props} />;
        case "facet-field":
            return <FacetField {...props} />;
        case "cyan-rim":
            return <CyanRim {...props} />;
        case "light-column":
            return <LightColumn {...props} />;
        case "soft-mesh":
            return <SoftMesh {...props} />;
        case "agile-startup":
            return <AgileStartup {...props} />;
        case "og-image-studio":
            return <OgImageStudio {...props} />;
        case "minimalist-tech":
        default:
            return <MinimalistTech {...props} />;
    }
};
