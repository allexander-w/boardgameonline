import { preloadScreenTemplate, loadingFileTemplate } from "./templates/preloader.template";

class PreloadScreen {
    constructor(generator) {
        this.generator = generator;

        const body = this.generator.getNode("body");
        this.generator.appendToBegin(body, preloadScreenTemplate());
    }

    update(src) {
        const wrapper = this.generator.getNode(".loader-indicator");
        this.generator.remove(wrapper);
        this.generator.appendToBegin(wrapper, loadingFileTemplate(src));
    }

    off() {
        const body = this.generator.getNode("body");
        const beginScreenNode = this.generator.getNode(".preloader");
        this.generator.removeByElement(body, beginScreenNode);
    }
}

export default PreloadScreen;