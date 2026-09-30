import MainScene from "../../scenes/MainScene";
import GameBuilder from "../../core/builders/GameBuilder";
import {cardsManager, emitter, layersManager, moduleManager} from "../../core";
import resourcesModule from "../../modules/resources";
import manifest from "./manifest.json";
// import config from "../puertorico/config/resources.config";

class GrailScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager);
        this.moduleManager = moduleManager;

        this.initialization();
        emitter.on("screen.preloader.finish", this.initialized.bind(this, "Оскверненный грааль успешно загружен"));
    }

    initialization() {
        const builder = new GameBuilder(cardsManager);
        builder.build(manifest);

        this.moduleManager.registerModule("resources", resourcesModule, manifest.resources);
    }
}

export default GrailScene;