import MainScene from "../../scenes/MainScene";
import GameBuilder from "../../core/builders/GameBuilder";
import {cardsManager, emitter, layersManager, moduleManager} from "../../core";
import manifest from "./manifest.json";

class PaleoScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager, cardsManager);
        this.moduleManager = moduleManager;

        this.initialization();
        emitter.on("screen.preloader.finish", this.initialized.bind(this, "Paleo успешно загружено"));
    }

    initialization() {
        const builder = new GameBuilder(cardsManager);
        builder.build(manifest);
    }
}

export default PaleoScene;