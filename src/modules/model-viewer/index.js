import ModelViewerModule from "./ModelViewerModule";
import {layersManager, emitter} from "../../core";

export default {
    module: null,
    init() {
        this.module = new ModelViewerModule(layersManager.getLayer("board"), emitter);
        console.log("model-viewer module initialized");
    }
};