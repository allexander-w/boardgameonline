import HtmlGenerator from "../../core/markup/HtmlGenerator";
import {ResourcesFlexWrapperTemplate, ResourceItemTemplate, ResourceItemTemplateUpdate} from "./templates/resources.template";
import ResourceElement from "../../entities/cards/resource";
import ws from "../../core/websocket";

const generatedIds = new Set();

function generateUniqueId(length = 8) {
    let id;
    do {
        id = Math.random().toString(36).substr(2, length);
    } while (generatedIds.has(id));

    generatedIds.add(id);
    return id;
}

// console.log(generateUniqueId());


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

    this.updateBankCount = (bank) => {
        for ( const [key,v] of this.bank.entries() ) {
            this.bank.set(key, { ...v, count: bank[key] });
            ResourceItemTemplateUpdate(key, { ...v, count: bank[key] });
        }
    }

    this.selectResourceFromBank = (e) => {
        e.preventDefault();

        const isMetaKeyPressed = e.ctrlKey || e.metaKey;

        /* Определение ресурса */
        const item = e.target.closest(".resource-item");
        if ( !item ) return false;

        /* Получение свойств ресурса */
        const options = this.bank.get(item.dataset['id']);

        /* Вебсокеты ивенты */
        if ( isMetaKeyPressed && options.hand > 0 ) {
            ws.receiver.send("api.bank.put", { id: item.dataset['id'] });
        }

        if ( !isMetaKeyPressed ) {
            ws.receiver.send("api.bank.take", { id: item.dataset['id'] });
        }

        /* Калькуляция количества в руку */
        const calculation = isMetaKeyPressed ? plus(options.count, options.hand) : minus(options.count, options.hand);

        const updatedOptions = {
            ...options,
            ...calculation
        }

        /* Обновление */
        this.bank.set(item.dataset['id'], updatedOptions);
        ResourceItemTemplateUpdate(item.dataset['id'], updatedOptions);
    }

    this.selectResourceToBank = (id) => {
        const options = this.bank.get(id);
        const updatedOptions = {
            ...options,
            hand: options.hand + 1,
        }

        this.bank.set(id, updatedOptions);
        ResourceItemTemplateUpdate(id, updatedOptions);
    }

    const _putResources = (pos, entries) => {
        let index = 0;
        let prevHand = 0;
        const output = [];

        for ( const [key,v] of entries ) {
            if ( !v.hand ) continue;

            for (let j = 0; j < v.hand; j++) {
                const generatedId = key + '_' + generateUniqueId();

                const options = { ...v, resource_id: key, id: generatedId, custom: true, x: pos.x + (j * 10) + (index * v.width + prevHand * 10), y: pos.y };
                const card = new ResourceElement(options.src, options, this);
                layer.add(card.element);
                output.push([key, options]);
            }

            prevHand = v.hand - 1;

            this.bank.set(key, { ...v, hand: 0 });
            ResourceItemTemplateUpdate(key, { ...v, hand: 0 });

            index ++;
        }

        return output;
    }

    this.putResourcesTable = (e, fromWs) => {
        if ( fromWs ) {
            // _putResources(fromWs.pos, fromWs.entries);
            // console.log(fromWs.entries);

            for ( const [key,v] of fromWs.entries ) {
                const card = new ResourceElement(v.src, v, this);
                layer.add(card.element);
            }

            return false;
        }

        if ( e.evt.altKey ) {
            const pos = layer.getRelativePointerPosition();
            const entries = [ ...this.bank.entries() ];

            const output = _putResources(pos, entries);

            ws.receiver.send("api.bank.table", { pos, entries: output });

        }
    }

    this.init = () => {
        console.log("Resources bank module initialized");
        const wrapper = generator.getNode("#bottom");
        generator.appendToBegin(wrapper, ResourcesFlexWrapperTemplate);

        wrapper.addEventListener("click", this.selectResourceFromBank);
        board.stage.on("click", this.putResourcesTable.bind(this));

        ws.emitter.on('api.bank.creation', (data) => {
            this.updateBankCount(data.bank);
        })

        ws.emitter.on('api.bank.take', (data) => {
            this.updateBankCount(data.bank);
        })

        ws.emitter.on('api.bank.put', (data) => {
            this.updateBankCount(data.bank);
        })

        ws.emitter.on('api.bank.table', (data) => {
            this.putResourcesTable(null, data);
        })

        ws.emitter.on('element.destroy', (data) => {
            const el = board.stage.findOne("#" + data.id);

            el.off();
            el.remove();
            el.destroy();
        })
    }

}

export default ResourcesBankModule;