import Heaps from "../../../core/heaps";
import ws from "../../../core/websocket";
import SelectCardsModule from "../../../modules/select-card.module";
import PersonalCardsModule from "../../../modules/personal-card.module";
import RotateCardsModule from "../../../modules/rotate-card.module";
import DiceElement from "../../../entities/cards/dice";

function EvolutionHeaps(board, config) {
    Heaps.apply(this, arguments);
    Object.assign(this, SelectCardsModule, PersonalCardsModule, RotateCardsModule);

    this.initialization = () => [SelectCardsModule, PersonalCardsModule, RotateCardsModule]
        .forEach(module => module.initialization?.call(this));

    this.initialization();

    const game = board.get_layer("board");

    const dices = {};
    const dice = new DiceElement('/dice/dice-sprite.png', { custom: true });
    game.add(dice.element);
    dices[dice.element._id] = dice;


    ws.emitter.on("rolled", (data) => {
        const dice = game.children.find(el => el._id === data.id );
        if ( dice ) dice.fillPatternOffset({ x: (dice.width() * data.index) / dice.fillPatternScale().x, y: 0 });
    });

    ws.emitter.on("roll", (data) => {
        const dice = dices[data.id];
        dice.roll({}, true);
    });

    ws.emitter.on("DRAGSTART", (e) => {
        if ( e.target.attrs.parentID || e.target.attrs.custom ) {
            e.target.moveToTop();
        }
    })

    ws.emitter.on("dragstart", ({ id }) => {
        const el = game.children.find(el => el._id === id);
        if ( el ) el.moveToTop();
    })
}

export default EvolutionHeaps;