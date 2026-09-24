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
        this.gamesList = generator.getNode(".games-list");
        this.screenNode = generator.getNode(".begin-screen");

        this.emitter = mitt();
        this.bindedSignFunction = this.sign.bind(this);

        this.button.addEventListener("click", this.bindedSignFunction);
        this.form.addEventListener("submit", this.bindedSignFunction);
    }

    setBackground(bg) {
        if ( this.screenNode ) this.screenNode.style.backgroundImage = `url('${bg}')`;
    }

    renderGames(games, selectedId, onSelect) {
        if ( !this.gamesList || !games.length ) return;

        this.gamesList.classList.add("active");

        const optionsHtml = games.map(game =>
            `<option value="${game.id}" ${game.id === selectedId ? "selected" : ""}>${game.name}</option>`
        ).join("");

        this.gamesList.innerHTML = `<select class="games-select">${optionsHtml}</select>`;

        const selectEl = this.gamesList.querySelector(".games-select");

        selectEl.addEventListener("change", (e) => {
            onSelect(e.target.value);
        });
    }

    lockGame(name) {
        if ( !this.gamesList ) return;

        this.gamesList.classList.add("active");
        this.gamesList.innerHTML = `<div class="games-locked">Игра в комнате: ${name}</div>`;
    }

    renderRooms(rooms, onSelect) {
        if ( !this.roomsList ) return;

        this.roomsList.classList.add("active");

        const optionsHtml = `
            <option value="">Новая комната</option>
            ${rooms.map(room => `<option value="${room.id}">${room.name}</option>`).join("")}
        `;

        this.roomsList.innerHTML = `<select class="rooms-select">${optionsHtml}</select>`;

        const selectEl = this.roomsList.querySelector(".rooms-select");

        onSelect(null);

        selectEl.addEventListener("change", (e) => {
            const selectedId = e.target.value || null;
            onSelect(selectedId);
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