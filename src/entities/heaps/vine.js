import Heaps from "../../core/heaps";
import ws from "../../core/websocket";
import actions from "../../../shared/actions/action.types.mjs";
import HtmlGenerator from "../../core/markup/HtmlGenerator";
import { hiddenItem } from "../../factory/markup/hiddens.template";

function VineHeaps(game, board, field) {
    Heaps.apply(this, arguments);
    const stage = board.stage;

    const generator = new HtmlGenerator();

    this.hideCards = new Map();

    /* [DRAGEND]: Получение данных */
    ws.emitter.on(actions.dragend, (data) => {
        const element = game.children.find(el => el._id === data.id);
        element.moveToTop();
    })



    let selected = null;

    const selectingCard = (e) => {
        if ( !e.target.attrs.elementId ) {
            selected = null;
            return false;
        }

        const heap = this.heaps.get(e.target.attrs.elementId);
        const element = heap.get_element(e.target.attrs.numId);

        selected = element;
    }

    stage.on("click", selectingCard);

    ws.emitter.on("DRAGSTART", (e) => {
        e.target.moveToTop();
        selectingCard(e)
    })

    ws.emitter.on("keydown", (e) => {
        if ( e.code === 'KeyH' ) {
            if ( !selected || !selected.element ) return false;
            const isCardHidden = this.hideCards.get(selected.opts.id);

            if ( isCardHidden ) {
                ws.receiver.send("show", { id: selected.element._id });
                selected.removeHidden();
                this.hideCards.delete(selected.opts.id);
            } else {
                this.hideCards.set(selected.opts.id, selected);
                selected.markHidden();
                ws.receiver.send("hide", { id: selected.element._id });
            }
        }
    })


    const updateHiddensData = (data) => {
        const wrapper = generator.getNode(".hiddens");
        generator.uniqueAdd(wrapper, hiddenItem(data.user.name, data.hiddens.length, data.user.id), { attr: "id", value: data.user.id });

        return game.children.find(el => el._id === data.id);
    }

    ws.emitter.on("hide", (data) => {
        const cardForHide = updateHiddensData(data);
        cardForHide.hide();
    })

    ws.emitter.on("show", (data) => {
        const cardForShow = updateHiddensData(data);
        cardForShow.show();
    })


    /* При дисконнекте */
    ws.emitter.on("REMOVE_CURSOR", (data) => {
        for ( const id of data.hidden ) {
            const cardForShow = game.children.find(el => el._id === id);
            cardForShow.show();
        }

        const wrapper = generator.getNode(".hiddens");
        generator.remove(wrapper, { attr: "id", value: data.id });
    })
}

export default VineHeaps;