import mitt from "mitt";
import { beginScreenTemplate } from "./templates/begin.template";
import config from "../../config";

class BeginScreen {
    constructor(generator) {
        this.generator = generator;

        this.body = generator.getNode("body");
        generator.appendToBegin(this.body, beginScreenTemplate('/' + config.scene + "/bg.png"));

        this.input = generator.getNode("#fname");
        this.button = generator.getNode(".sign");
        this.form = generator.getNode("form.field-wrapper");

        this.emitter = mitt();
        this.bindedSignFunction = this.sign.bind(this);

        this.button.addEventListener("click", this.bindedSignFunction);
        this.form.addEventListener("submit", this.bindedSignFunction);
    }

    sign(e) {
        e.preventDefault();
        if ( !this.input.value?.length ) return false;
        this.name = this.input.value;
        this.emitter.emit("sign", this.name);
    }

    off() {
        const beginScreenNode = this.generator.getNode(".begin-screen");
        this.generator.removeByElement(this.body, beginScreenNode);
        this.emitter = null;
        this.button.removeEventListener("click", this.bindedSignFunction);
        this.form.removeEventListener("submit", this.bindedSignFunction);
    }
}

export default BeginScreen;