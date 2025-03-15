import HtmlGenerator from "../../core/markup/HtmlGenerator";
import {ResourcesFlexWrapperTemplate, ResourceItemTemplate, ResourceItemTemplateUpdate} from "./templates/resources.template";
import DuosideElement from "../../entities/cards/duoside";

function ResourcesBankModule(board) {
    const generator = new HtmlGenerator();
    const layer = board.get_layer("board");

    const minus = (count, hand) => {
        const output = {};
        output.count = count > 0 ? count - 1 : 0;
        output.hand = count > 0 ? hand + 1 : hand;

        return output;
    }

    const plus = (count, hand) => {
        const output = {};
        output.count = hand > 0 ? count + 1 : count;
        output.hand = hand > 0 ? hand - 1 : 0;

        return output;
    }

    this.bank = new Map();

    this.addResource = (id, options) => {
        this.bank.set(id, { ...options, hand: 0 });
        const wrapper = generator.getNode(".resources");
        generator.appendToBegin(wrapper, ResourceItemTemplate(id, options));
    }

    this.selectResourceFromBank = (e) => {
        e.preventDefault();

        const isMetaKeyPressed = e.ctrlKey || e.metaKey;

        const item = e.target.closest(".resource-item");
        if ( !item ) return false;

        const options = this.bank.get(item.dataset['id']);
        const calculation = isMetaKeyPressed ? plus(options.count, options.hand) : minus(options.count, options.hand);

        const updatedOptions = {
            ...options,
            ...calculation
        }

        this.bank.set(item.dataset['id'], updatedOptions);
        ResourceItemTemplateUpdate(item.dataset['id'], updatedOptions);
    }



    this.putResourcesTable = (e) => {
        if ( e.evt.ctrlKey || e.evt.metaKey ) {
            const pos = layer.getRelativePointerPosition();

            let index = 0;
            let prevHand = 0;

            for ( const [key,v] of this.bank.entries() ) {

                if ( !v.hand ) continue;

                for (let j = 0; j < v.hand; j++) {
                    const options = { ...v, x: pos.x + (j * 10) + (index * v.width + prevHand * 10), y: pos.y };
                    const card = new DuosideElement(options.src, options);
                    layer.add(card.element);
                }

                prevHand = v.hand - 1;

                this.bank.set(key, { ...v, hand: 0 });
                ResourceItemTemplateUpdate(key, { ...v, hand: 0 });

                index ++;
            }
        }
    }

    this.init = () => {
        console.log("Resources bank module initialized");
        const wrapper = generator.getNode("#bottom");
        generator.appendToBegin(wrapper, ResourcesFlexWrapperTemplate);

        wrapper.addEventListener("click", this.selectResourceFromBank);
        board.stage.on("click", this.putResourcesTable.bind(this));
    }

}

export default ResourcesBankModule;