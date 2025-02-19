import ws from "../core/websocket";
import Konva from "konva";
import actions from "../../shared/actions/action.types.mjs";

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
const colors = ["orange", "red", "coral", "gold", "white"];


function CursorsManager(board) {
    const cursorsLayer = board.get_layer('cursors');
    const gameLayer = board.get_layer('board');

    /* Создание нового курсора */
    ws.emitter.on("CREATE_CURSOR", ({ id, user }) => {
        const cursor = new Konva.Path({
            data: "M16.5744 19.1999L12.6361 15.2616L11.4334 16.4643C10.2022 17.6955 9.58656 18.3111 8.92489 18.1658C8.26322 18.0204 7.96225 17.2035 7.3603 15.5696L5.3527 10.1205C4.15187 6.86106 3.55146 5.23136 4.39141 4.39141C5.23136 3.55146 6.86106 4.15187 10.1205 5.35271L15.5696 7.3603C17.2035 7.96225 18.0204 8.26322 18.1658 8.92489C18.3111 9.58656 17.6955 10.2022 16.4643 11.4334L15.2616 12.6361L19.1999 16.5744C19.6077 16.9821 19.8116 17.186 19.9058 17.4135C20.0314 17.7168 20.0314 18.0575 19.9058 18.3608C19.8116 18.5882 19.6077 18.7921 19.1999 19.1999C18.7921 19.6077 18.5882 19.8116 18.3608 19.9058C18.0575 20.0314 17.7168 20.0314 17.4135 19.9058C17.186 19.8116 16.9821 19.6077 16.5744 19.1999Z",
            fill: colors[randomInteger(0, 4)],
            scaleY: 5,
            scaleX: 5,
            stroke: 'white',
            strokeWidth: 1,
        });

        const nickname = new Konva.Text({
            text: user.name,
            fontSize: 32,
            fontFamily: 'Arial Black',
            fill: 'white',
            align: 'left',
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

        nickname.y(cursor.height() + 110);
        nickname.x(120);
        group.add(cursor);
        group.add(nickname);

        ws.connections.set(id, group);

        cursorsLayer.add(group);
        group.moveToTop();
    })


    /* Удаление существующего курсора */
    ws.emitter.on("REMOVE_CURSOR", (user) => {
        const cursor = ws.connections.get(user.id);
        cursor.destroy();
    })


    /* Передвижения курсоров игроков */
    board.stage.on("mousemove", (e) => {
        const pointerPos = gameLayer.getRelativePointerPosition();
        ws.receiver.send(actions.mousemove, { user: ws.currentConnection, x: pointerPos.x, y: pointerPos.y });
    })


    board.stage.on('dragstart', (e) => {
        if ( e.target.attrs.parentID || e.target.attrs.custom ) {
            ws.emitter.emit("DRAGSTART", e);
            ws.receiver.send('dragstart', { id: e.target._id });

            e.target.to({
                scaleX: 1.2,
                scaleY: 1.2,
                shadowColor: "rgba(0, 0, 0, 0.9)",
                shadowBlur: 20,
                shadowOpacity: 1,

                duration: 0.2,
                easing: Konva.Easings.EaseOut
            });
        }
    })


    /* [DRAGMOVE]: Отправка данных */
    board.stage.on('dragmove', (e) => {
        if ( e.target.attrs.parentID || e.target.attrs.custom ) {
            ws.emitter.emit("DRAGMOVE", e);

            ws.receiver.send(actions.dragmove, { x: e.target.attrs.x, y: e.target.attrs.y, id: e.target._id });
            ws.receiver.send(actions.mousemove, { x: e.target.attrs.x, y: e.target.attrs.y });
        }
    })

    /* [DRAGMOVE]: Принятие данных */
    ws.emitter.on(actions.dragmove, (data) => {
        const element = gameLayer.children.find(el => el._id === data.id);
        element.x(data.x);
        element.y(data.y);
    });


    /* [DRAGEND]: Отправка данных */
    board.stage.on('dragend', (e) => {
        if ( e.target.attrs.parentID || e.target.attrs.custom ) {
            e.target.to({
                scaleX: 1,
                scaleY: 1,
                shadowColor: "rgba(0, 0, 0, 0)",
                shadowBlur: 0,
                shadowOpacity: 0,

                duration: 0.2, // Длительность анимации
                easing: Konva.Easings.EaseIn
            });

            ws.emitter.emit("DRAGEND", e);
            ws.receiver.send('dragend', { id: e.target._id });
        }
    })
}

export default CursorsManager;