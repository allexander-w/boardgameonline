import FieldCard from "../../entities/FieldCard";
import DuosideCard from "../../entities/duoside/DuosideCard";
import DiceCard from "../../entities/dice/DiceCard";
import StateCard from "../../games/thiswarofmine/entities/state/StateCard";

class GameBuilder {
    constructor(cardsManager) {
        this.cardsManager = cardsManager;
    }

    build(manifest) {
        if ( manifest.field ) this.buildField(manifest.field);

        for ( const group of manifest.groups || [] ) {
            this.buildGroup(group);
        }

        for ( const dice of manifest.dice || [] ) {
            this.buildDice(dice);
        }

        for ( const state of manifest.states || [] ) {
            this.buildState(state);
        }
    }

    resolveTemplate(template, index) {
        return template.replace("{n}", index + 1);
    }

    resolveBack(back, front, index) {
        if ( !back || back === "same" ) return this.resolveTemplate(front, index);
        return this.resolveTemplate(back, index);
    }

    buildField(field) {
        const table = new FieldCard({ front: field.front, bg: field.bg || null }, {
            draggable: false,
            x: field.x || 0,
            y: field.y || 0,
            width: field.width,
            height: field.height,
            opacity: 1,
            id: field.id || "field",
        });

        this.cardsManager.createCard(table, "fixed");
    }

    buildGroup(group) {
        const count = group.count || 1;

        for ( let index = 0; index < count; index++ ) {
            const front = this.resolveTemplate(group.front, index);
            const back = this.resolveBack(group.back, group.front, index);

            const options = {
                draggable: true,
                x: group.position?.x || 0,
                y: group.position?.y || 0,
                width: group.size?.w,
                height: group.size?.h,
                opacity: 1,
                id: `${group.id}_${index + 1}`,
                ...group.options,
            };

            const card = new DuosideCard({ front, bg: back }, options);
            this.cardsManager.createCard(card);
        }
    }

    buildDice(dice) {
        const card = new DiceCard({ front: dice.front }, {
            x: dice.x || 0,
            y: dice.y || 0,
            id: dice.id,
            sides: dice.sides,
        });

        this.cardsManager.createCard(card);
    }

    buildState(state) {
        const card = new StateCard(state.sources, {
            draggable: true,
            x: state.x || 0,
            y: state.y || 0,
            width: state.width,
            height: state.height,
            opacity: 1,
            id: state.id,
        });

        this.cardsManager.createCard(card);
    }
}

export default GameBuilder;