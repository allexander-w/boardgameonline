import {ResourcesFlexWrapperTemplate} from "../resources-module/templates/resources.template";
import ws from "../../core/websocket";



function HandModule(board) {
    this.hands = [];

    const layer = board.get_layer("board");
    const game = board.get_layer("board");


    this.findElementsAbove = (target) => {
        const targetBox = target.getClientRect();
        return board.stage.find('Rect').filter((other) => {
            if (!other.attrs.parentID) return false;

            const otherBox = other.getClientRect();

            return !(
                targetBox.x + targetBox.width < otherBox.x + (otherBox.width / 2) ||
                targetBox.x + (otherBox.width / 2) > otherBox.x + otherBox.width ||
                targetBox.y + targetBox.height < otherBox.y + (otherBox.height / 2) ||
                targetBox.y + (otherBox.height / 2) > otherBox.y + otherBox.height
            );
        });
    }

    this.take = (el) => {
        this.hands.push(el.element);
        el.element.hide();
    }

    this.takeAll = (el) => {
        const elementsAbove = this.findElementsAbove(el.element);
        if ( elementsAbove.length ) {
            this.hands = [...this.hands, ...elementsAbove];
            elementsAbove.forEach(el => el.hide());
        }
    }

    this.shuffle = () => {
        this.hands = new Map([...this.hands.entries()].sort(() => Math.random() - 0.5));
    }

    this.put = (e) => {
        if ( e.evt.altKey ) {
            const pos = layer.getRelativePointerPosition();
            this.shuffle();

            this.hands.forEach(el => {
                el.x(pos.x);
                el.y(pos.y);

                el.attrs.link?.flipToTop();
                el.moveToTop();
                el.show();
            })

            this.hands = [];
        }
    }

    this.init = () => {
        console.log("Hand module initialized");

        ws.emitter.on("module.hand.take", this.take);
        ws.emitter.on("module.hand.takeAll", this.takeAll);

        // const wrapper = generator.getNode("#bottom");
        // generator.appendToBegin(wrapper, ResourcesFlexWrapperTemplate);
        //
        // wrapper.addEventListener("click", this.selectResourceFromBank);
        board.stage.on("click", this.put.bind(this));
    }
}

export default HandModule;