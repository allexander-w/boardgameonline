import {hiddenItem} from "../factory/markup/hiddens.template";
import HtmlGenerator from "../core/markup/HtmlGenerator";
import ws from "../core/websocket";
const generator = new HtmlGenerator();

export default {
    hideCards: new Map(),

    updateHiddensData(data) {
        const wrapper = generator.getNode(".hiddens");
        generator.uniqueAdd(wrapper, hiddenItem(data.user.name, data.hiddens.length, data.user.id), { attr: "id", value: data.user.id });

        return this.game.children.find(el => el._id === data.id);
    },

    keyHLogic() {
        if ( !this.selected || !this.selected.element ) return false;
        const isCardHidden = this.hideCards.get(this.selected.id);

        if ( isCardHidden ) {
            ws.receiver.send("show", { id: this.selected.element._id });
            this.selected.removeHidden();
            this.hideCards.delete(this.selected.id);
        } else {
            this.hideCards.set(this.selected.id, this.selected);
            this.selected.markHidden();
            ws.receiver.send("hide", { id: this.selected.element._id });
        }
    },

    keyFLogic() {
        if ( !this.selected || !this.selected.element ) return false;
        this.selected.fix();
    },

    initialization() {
        ws.emitter.on("keydown", (e) => {
            if ( e.code === 'KeyH' ) this.keyHLogic();
            if ( e.code === 'KeyF' ) this.keyFLogic();
        })

        ws.emitter.on("hide", (data) => {
            const cardForHide = this.updateHiddensData(data);
            cardForHide.hide();
        })

        ws.emitter.on("show", (data) => {
            const cardForShow = this.updateHiddensData(data);
            cardForShow.show();
        })

        /* При дисконнекте */
        ws.emitter.on("REMOVE_CURSOR", (data) => {
            for ( const id of data.hidden ) {
                const cardForShow = this.game.children.find(el => el._id === id);
                cardForShow.show();
            }

            const wrapper = generator.getNode(".hiddens");
            generator.remove(wrapper, { attr: "id", value: data.id });
        })
    }

}