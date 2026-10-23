import type { CSSProperties } from "react";
import BentoLive from "./BentoLive";
import { SCENES, type SceneId } from "./generated/scenes.generated";

export default function FeatureScene({
    id,
    className = "",
}: {
    id: SceneId;
    className?: string;
}) {
    const scene = SCENES[id];

    return (
        <div
            className={`feature-iso iso bento-iso ${className}`}
            style={{ "--scene-aspect": `${scene.width} / ${scene.height}` } as CSSProperties}
        >
            <BentoLive className="bento-live">
                <div className="bento-frame" dangerouslySetInnerHTML={{ __html: scene.svg }} />
            </BentoLive>
        </div>
    );
}
