import HtmlGenerator from "../../core/markup/HtmlGenerator";
import {preloadScreenTemplate, loadingFileTemplate} from "../../factory/markup/preloader.template";

function PreloaderScreen() {
    const generator = new HtmlGenerator();
    const body = generator.getNode("body");
    generator.appendToBegin(body, preloadScreenTemplate());

    this.update = (src) => {
        const wrapper = generator.getNode(".loader-indicator");
        generator.remove(wrapper);
        generator.appendToBegin(wrapper, loadingFileTemplate(src));
    }

    this.off = () => {
        const beginScreenNode = generator.getNode(".preloader");
        generator.removeByElement(body, beginScreenNode);
    }
}

export default PreloaderScreen;