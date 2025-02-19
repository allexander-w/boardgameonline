import Board from "../core/stage.js";
import Dice from "../dice";

import CursorsManager from "../managers/cursors.manager";
import PreloadEvents from "../entities/events/loader.events";

import ws from "../core/websocket";
import { gameField } from "../factory/field.factory";


function GeneralScene(user, preload, options = {}) {
    this.board = new Board();

    /* Добавление кастомных слоев */
    if ( options.layers?.length ) {
        for ( const l of options.layers ) {
            this.board.add_layer(l);
        }
    }

    /* Добавление default слоев */
    this.board.add_layer('board');
    this.board.add_layer('cursors');


    /* Получение слоя */
    const boardLayer = this.board.get_layer('board');


    /* Запрос информации о юзере от сервера вебсокетов */
    ws.emitter.on("REQUEST_USER_INFO", () => {
        ws.emitter.emit("USER_INFO", user);
    })

    /* Информация по прелоадеру контента */
    new PreloadEvents(preload);

    /* Все что связано с курсорами игроков */
    new CursorsManager(this.board);

    /* Загрузка основого поля игры (если есть) */
    this.loadGameField = (src, options) => new Promise((resolve) => {
        gameField(src, options).then(field => setTimeout(() => {
            boardLayer.add(field);
            field.moveToBottom();

            resolve();
        }, 0));
    })

    /* Отрисовка сцены */
    this.initialize = () => {
        if(options.dice) new Dice();
    }
}

export default GeneralScene;