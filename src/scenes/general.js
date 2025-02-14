import Konva from "konva";
import Board from "../core/stage.js";
import Dice from "../dice";

import ws from "../core/websocket";
import actions from "../../shared/actions/action.types.mjs";

import config from "../config";

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
const colors = ["orange", "red", "coral", "gold", "white"];

export default function GeneralScene(user) {
    this.board = new Board();
    this.game_layer = new Konva.Layer();
    this.cursors_layer = new Konva.Layer();


    ws.emitter.on("REQUEST_USER_INFO", () => {
        ws.emitter.emit("USER_INFO", user);
    })


    /* Создание нового курсора */
    ws.emitter.on("CREATE_CURSOR", ({ id, user }) => {
        const cursor = new Konva.Line({
            points: [0, 0, 60, 35, 20, 65], // Вершины треугольника
            fill: colors[randomInteger(0, 4)],
            stroke: 'white',
            strokeWidth: 4,
            closed: true, // Замкнутый контур
        });

        console.log("cursor: ", user);

        const nickname = new Konva.Text({
            text: user.name,
            fontSize: 28,
            fontFamily: 'Arial Black',
            fill: 'white',
            align: 'center',
            width: 300,
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

        ws.connections.set(id, group);

        this.cursors_layer.add(group);
        group.moveToTop();
    })


    /* Удаление существующего курсора */
    ws.emitter.on("REMOVE_CURSOR", (user) => {
        const cursor = ws.connections.get(user.id);
        cursor.destroy();
    })


    /* Передвижения курсоров игроков */
    this.board.stage.on("mousemove", (e) => {
        const pointerPos = this.game_layer.getRelativePointerPosition();
        ws.receiver.send(actions.mousemove, { user: ws.currentConnection, x: pointerPos.x, y: pointerPos.y });
    })


    /* Отрисовка сцены */
    this.initialize = () => {
        this.board.add_layer('board', this.game_layer);
        this.board.add_layer('cursors', this.cursors_layer);
        this.game_layer.draw();

        if(config.dice) new Dice();
    }

}