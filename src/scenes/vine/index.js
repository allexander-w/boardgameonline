import GeneralScene from "../general";
import {gameField} from "../../factory/vine/field.factory";
import Camera from "../../core/camera";
import Konva from "konva";

import ws from "../../core/websocket";
import actions from "../../../shared/actions/action.types.mjs";


function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
const colors = ["orange", "red", "coral", "gold", "white"];

function VineScene() {
    GeneralScene.apply(this);

    /* Загрузка игрового поля */
    gameField.then(field => setTimeout(() => {
        this.game_layer.add(field);
        field.moveToBottom();

        /* Иинициализация камеры */
        new Camera(this.board.stage, this.game_layer);
    }, 0));


    /* Создание нового курсора */
    ws.emitter.on("CREATE_CURSOR", (user) => {
        const cursor = new Konva.Line({
            points: [0, 0, 60, 35, 20, 65], // Вершины треугольника
            fill: colors[randomInteger(0, 4)],
            stroke: 'white',
            strokeWidth: 4,
            closed: true, // Замкнутый контур
        });

        const nickname = new Konva.Text({
            text: user,
            fontSize: 28,
            fontFamily: 'Arial Black',
            fill: 'white',
            align: 'center',
            width: 200,
            height: 24,
            stroke: "black",
            strokeWidth: 1,
            verticalAlign: 'middle',
        });

        const group = new Konva.Group({
            x: 0,
            y: 0,
        });

        nickname.y(cursor.height() + 5);
        group.add(cursor);
        group.add(nickname);

        ws.connections.set(user, group);

        this.cursors_layer.add(group);
        group.moveToTop();
    })


    /* Удаление существующего курсора */
    ws.emitter.on("REMOVE_CURSOR", (id) => {
        const cursor = ws.connections.get(id);
        cursor.destroy();
    })


    /* Передвижения курсоров игроков */
    this.board.stage.on("mousemove", (e) => {
        const pointerPos = this.game_layer.getRelativePointerPosition();
        ws.receiver.send(actions.mousemove, { user: ws.currentConnection, x: pointerPos.x, y: pointerPos.y });
    })
}

export default VineScene;
