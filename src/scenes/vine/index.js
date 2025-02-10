import GeneralScene from "../general";
import {gameField} from "../../factory/vine/field.factory";
import Camera from "../../core/camera";
import Konva from "konva";

import ws from "../../core/websocket";
import actions from "../../../shared/actions/action.types.mjs";


function VineScene() {
    GeneralScene.apply(this);

    /* Загрузка игрового поля */
    gameField.then(field => setTimeout(() => {
        this.game_layer.add(field);
        field.moveToBottom();

        /* Иинициализация камеры */
        new Camera(this.board.stage, this.game_layer);
    }, 1000));



    ws.emitter.on("CREATE_CURSOR", (user) => {
        console.log('create cursor', user);

        const cursor = new Konva.Rect({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            fill: "red",

            cornerRadius: 2,
            draggable: false,
        });

        ws.connections.set(user, cursor);

        this.game_layer.add(cursor);
        cursor.moveToTop();
    })


    ws.emitter.on("REMOVE_CURSOR", (id) => {
        console.log('remove cursor', id);
        const cursor = ws.connections.get(id);
        cursor.destroy();
    })

    this.board.stage.on("mousemove", (e) => {
        const pointerPos = this.game_layer.getRelativePointerPosition();
        ws.receiver.send(actions.mousemove, { user: ws.currentConnection, x: pointerPos.x, y: pointerPos.y });
    })
}

export default VineScene;
