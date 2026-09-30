import FieldCard from "../../entities/FieldCard";
import DuosideCard from "../../entities/duoside/DuosideCard";
import DiceCard from "../../entities/dice/DiceCard";
import StateCard from "../../games/thiswarofmine/entities/state/StateCard";
import CounterCard from "../../entities/counter/CounterCard";
import { emitter } from "../index";

class GameBuilder {
    constructor(cardsManager) {
        this.cardsManager = cardsManager;
    }

    build(manifest) {
        if ( manifest.field ) this.buildField(manifest.field);

        // Обратный проход по массиву групп
        const groups = manifest.groups || [];
        for ( let i = groups.length - 1; i >= 0; i-- ) {
            this.buildGroup(groups[i]);
        }

        // Обратный проход по массиву костей
        const diceList = manifest.dice || [];
        for ( let i = diceList.length - 1; i >= 0; i-- ) {
            this.buildDice(diceList[i]);
        }

        // Обратный проход по массиву состояний
        const states = manifest.states || [];
        for ( let i = states.length - 1; i >= 0; i-- ) {
            this.buildState(states[i]);
        }

        // Обратный проход по массиву счетчиков
        const counters = manifest.counters || [];
        for ( let i = counters.length - 1; i >= 0; i-- ) {
            this.buildCounter(counters[i]);
        }
    }

    resolveTemplate(template, index) {
        return template.replace("{n}", index + 1);
    }

    /* modelRotation: [x, y, z] для всей группы или { "2": [180, 0, 0] } — только для карточки №2 */
    resolveModelRotation(rotation, index) {
        if ( !rotation ) return undefined;
        return Array.isArray(rotation) ? rotation : rotation[index + 1];
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

        // Генерация карточек внутри группы от конца к началу
        for ( let index = count - 1; index >= 0; index-- ) {
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
                magnet: group.magnet,
                kind: group.kind || group.id,
                zones: group.zones,
                model: group.model ? this.resolveTemplate(group.model, index) : undefined,
                modelTitle: group.modelTitle,
                modelRotation: this.resolveModelRotation(group.modelRotation, index),
                ...group.options,
            };

            const card = new DuosideCard({ front, bg: back }, options);
            this.cardsManager.createCard(card);
            if ( options.model ) emitter.emit("model-viewer.preload", options.model);
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

    buildCounter(counter) {
        const count = counter.count || 1;

        // Генерация счетчиков от конца к началу
        for ( let index = count - 1; index >= 0; index-- ) {
            const options = {
                draggable: counter.draggable ?? true,
                x: counter.position?.x ?? counter.x ?? 0,
                y: counter.position?.y ?? counter.y ?? 0,
                width: counter.size?.w ?? counter.width ?? 160,
                height: counter.size?.h ?? counter.height ?? 160,
                initialValue: counter.value ?? counter.initialValue ?? 0,
                opacity: 1,
                id: `${counter.id}_${index + 1}`,
                magnet: counter.magnet,
                kind: counter.kind || counter.id,
                zones: counter.zones,
                model: counter.model ? this.resolveTemplate(counter.model, index) : undefined,
                modelTitle: counter.modelTitle,
                modelRotation: this.resolveModelRotation(counter.modelRotation, index),
                ...counter.options,
            };

            const card = new CounterCard(counter.bg || counter.front || counter.src, options);
            this.cardsManager.createCard(card);
            if ( options.model ) emitter.emit("model-viewer.preload", options.model);
        }
    }
}

export default GameBuilder;