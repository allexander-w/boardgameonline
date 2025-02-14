import Heaps from "../../core/heaps";
import ws from "../../core/websocket";
import actions from "../../../shared/actions/action.types.mjs";
import HtmlGenerator from "../../core/markup/HtmlGenerator";

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

    ws.emitter.on("hide", (data) => {
        console.log(data);

        const wrapper = generator.getNode(".hiddens");
        const userTile = generator.create("div", { classes: ["user"], attributes: { "data-id": data.user } });
        generator.updateText(userTile, data.hiddens.length);
        generator.uniqueAdd(wrapper, userTile, "data-id");

        const cardForHide = game.children.find(el => el._id === data.id);
        cardForHide.hide();
    })

    ws.emitter.on("show", (data) => {
        const cardForHide = game.children.find(el => el._id === data.id);
        cardForHide.show();
    })


    /* При дисконнекте */
    ws.emitter.on("CLOSE_CONNECTION", (data) => {
        // for( const [key, el] of this.hideCards.entries() ) {
        //     ws.receiver.send("show", { id: el.element._id });
        //     el.removeHidden();
        //     this.hideCards.delete(el.opts.id);
        // }
    })
}

export default VineHeaps;