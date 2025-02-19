import HtmlGenerator from "../../core/markup/HtmlGenerator";
import {beginScreen} from "../../factory/markup/begin.template";
import mitt from "mitt";
import config from "../../config";

function BeginScreen() {
    const generator = new HtmlGenerator();
    const body = generator.getNode("body");
    generator.appendToBegin(body, beginScreen('/' + config.scene + "/bg.png"));
    this.emitter = mitt();

    this.name = "";

    const input = generator.getNode("#fname");
    const button = generator.getNode(".sign");

    this.sign = async (e) => {
        e.preventDefault();
        if ( !input.value?.length ) return false;
        this.name = input.value;
        this.emitter.emit("sign", this.name);
    }

    this.on = () => {
        button.addEventListener("click", this.sign);
    }

    this.off = () => {
        const beginScreenNode = generator.getNode(".begin-screen");
        generator.removeByElement(body, beginScreenNode);
        this.emitter = null;
        button.removeEventListener("click", this.sign);
    }

    this.on();
}

export default BeginScreen;