import MinimapModule from "./MinimapModule";
import { moduleManager } from "../../core";

export default {
    module: null,
    init() {
        const camera = moduleManager.getModule("camera");
        const tabs = moduleManager.getModule("tabs");
        if ( !camera || !tabs ) return;

        const module = new MinimapModule(camera);
        tabs.registerTab("minimapTab", "ph-map-trifold", module.render.bind(module));

        this.module = module;
    }
};