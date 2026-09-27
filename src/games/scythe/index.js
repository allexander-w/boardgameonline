import MainScene from "../../scenes/MainScene";
import {cardsManager, emitter, layersManager, moduleManager} from "../../core";
import GameBuilder from "../../core/builders/GameBuilder";
import resourcesModule from "../../modules/resources";
import manifest from "./manifest.json";

class ScytheScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager);
        this.moduleManager = moduleManager;

        this.initialization();
        emitter.on("screen.preloader.finish", this.initialized.bind(this, "Виноделие успешно загружено"));
    }

    initialization() {
        const builder = new GameBuilder(cardsManager);
        builder.build(manifest);
    }
}

export default ScytheScene;