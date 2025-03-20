import {diceElement, loadImageDuosideElement} from "../../factory/cards.factory";
import Konva from "konva";
import {randomInteger} from "../../utils/utils";
import ws from "../../core/websocket";

function DiceElement(src, options = {}) {
    this.element = diceElement({ ...options, link: this });
    loadImageDuosideElement(this.element, src, 6);

    this.index = 0;

    this.rollIntervalFunc = () => {
        this.index = randomInteger(0,5);
        this.element.fillPatternOffset({ x: (this.element.width() * this.index) / this.element.fillPatternScale().x, y: 0 });
    }

    this.roll = (e, fromWS) => {
        if ( !fromWS ) ws.receiver.send("roll", { id: this.element._id });
        let interval = setInterval(this.rollIntervalFunc, 10);

        const tween = new Konva.Tween({
            node: this.element,
            duration: 0.3,
            scaleX: 1.5,
            scaleY: 1.5,
            rotation: 1200,
            shadowColor: "rgba(0, 0, 0, 0.9)",
            shadowBlur: 20,
            shadowOpacity: 1,

            onFinish: () => {
                clearInterval(interval);

                if ( !fromWS ) {
                    setTimeout(() => {
                        ws.receiver.send("rolled", { id: this.element.id(), index: this.index });
                        console.log(this.index);
                    }, 500)
                }

                this.element.fillPatternOffset({ x: (this.element.width() * this.index) / this.element.fillPatternScale().x, y: 0 });


                new Konva.Tween({
                    node: this.element,
                    duration: 0.1,
                    rotation: 0,
                    scaleY: 1,
                    scaleX: 1,
                    shadowColor: "rgba(0, 0, 0, 0)",
                    shadowBlur: 0,
                    shadowOpacity: 0,
                }).play();
            },
        });

        tween.play();

    }

    this.element.on("dblclick", this.roll);
}

export default DiceElement;