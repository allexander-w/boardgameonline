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
        this.roomsList = generator.getNode(".rooms-list");

        this.emitter = mitt();
        this.bindedSignFunction = this.sign.bind(this);

        this.button.addEventListener("click", this.bindedSignFunction);
        this.form.addEventListener("submit", this.bindedSignFunction);
    }

    renderRooms(rooms, onSelect) {
        if ( !this.roomsList || !rooms.length ) return;

        this.roomsList.classList.add("active");
        this.roomsList.innerHTML = rooms.map(room =>
            `<button type="button" class="room-chip" data-id="${room.id}">${room.name}</button>`
        ).join("") + `<button type="button" class="room-chip room-chip--new" data-id="">Новая комната</button>`;

        this.roomsList.querySelectorAll(".room-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                this.roomsList.querySelectorAll(".room-chip").forEach(el => el.classList.remove("active"));
                chip.classList.add("active");
                onSelect(chip.dataset.id || null);
            });
        });
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