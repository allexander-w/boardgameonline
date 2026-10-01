import MainScene from "../../scenes/MainScene";
import GameBuilder from "../../core/builders/GameBuilder";
import {cardsManager, emitter, layersManager, moduleManager} from "../../core";
import resourcesModule from "../../modules/resources";
import manifest from "./manifest.json";
class MarsScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager, cardsManager);
        this.moduleManager = moduleManager;
        this.boardLayer = layersManager.getLayer("board");

        this.initialization();
        emitter.on("screen.preloader.finish", this.initialized.bind(this, "Покорение Марса успешно загружено"));
    }

    initialization() {
        const builder = new GameBuilder(cardsManager);
        builder.build(manifest);

        this.moduleManager.registerModule("resources", resourcesModule, manifest.resources);
    }
}

export default MarsScene;