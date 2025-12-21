import {cardsManager, senderManager} from "../../../core";
import config from "../../../config";
import ResourceCard from "../../../entities/resource/ResourceCard";




class ResourcesManger {
    constructor(config, uiManager) {
        this.resources = config;
        this.uiManager = uiManager;

        this.searchValue = "";

        this.generatedIds = new Set();
    }

    _generateUniqueId(length = 8) {
        let id;
        do {
            id = Math.random().toString(36).substr(2, length);
        } while (this.generatedIds.has(id));

        this.generatedIds.add(id);
        return id;
    }

    isResourcesSelected() {
        return this.resources.some(el => el.selected?.length);
    }

    search(value) {
        if ( !value ) {
            this.uiManager.updateList(this.resources);
            this.searchValue = "";
            return false;
        }
        this.uiManager.updateList(this.resources.filter(el => el.name.includes(value)));
        this.searchValue = value;
    }

    select(id) {
        this.resources = this.resources.map(el => {
            if ( el.name === id ) return { ...el, selected: el.selected ? el.selected + 1 : 1 };
            return el;
        })

        this.uiManager.updateList(this.searchValue ? this.resources.filter(el => el.name.includes(this.searchValue)) : this.resources);
    }

    put(pos) {
        const configuration = [];

        for ( const card of this.resources ) {
            if ( !card.selected ) continue;

            for ( const element of new Array(card.selected) ) {
                const src = `/${ config.scene }/resources/${ card.name }.png`;
                const id = "resource_" + this._generateUniqueId();
                const options =  { draggable: true, x: pos.x, y: pos.y, width: parseInt(card.width), height: parseInt(card.height), opacity: 1, id };

                const resourceCard = new ResourceCard({ front: src }, options);
                cardsManager.createCard(resourceCard);

                configuration.push({ src, pos, width: card.width, height: card.height, id, name: card.name });
            }

            card.selected = undefined;
        }

        senderManager.send("modules.resources.put", { cards: configuration });
        this.uiManager.updateList(this.searchValue ? this.resources.filter(el => el.name.includes(this.searchValue)) : this.resources);
    }

    remotePut(data) {
        for ( const element of data.cards ) {
            const src = element.src;
            const id = element.id;
            const options = { draggable: true, x: element.pos.x, y: element.pos.y, width: parseInt(element.width), height: parseInt(element.height), opacity: 1, id };

            const resourceCard = new ResourceCard({ front: src }, options);
            cardsManager.createCard(resourceCard);
        }
    }

    render() {
        return this.uiManager.getResourcesUI(this.resources);
    }
}

export default ResourcesManger;