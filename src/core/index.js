import mitt from "mitt";
import Konva from "konva";
import Websockets from "./Websockets";

import HandlerManager from "./managers/HandlerManager";
import SenderManager from "./managers/SenderManager";
import ModuleManager from "./managers/ModuleManager";
import LayersManager from "./managers/LayersManager";
import UsersManager from "./managers/UsersManager";
import CursorsManager from "./managers/CursorsManager";
import CardsManager from "./managers/CardsManager";

import SystemHandler from "./handlers/SystemHandler";
import RegisterHandler from "./handlers/RegisterHandler";
import CursorHandler from "./handlers/CursorHandler";


const emitter = mitt();
const ws = new Websockets(emitter);
const usersManager = new UsersManager();
const senderManager = new SenderManager(ws, usersManager);
const moduleManager = new ModuleManager();
const layersManager = new LayersManager(Konva);

/* Добавление default слоев */
layersManager.registerLayer('board');
layersManager.registerLayer('cursors');

const cursorsManager = new CursorsManager(usersManager, layersManager, senderManager);
const handlerManager = new HandlerManager();
const cardsManager = new CardsManager(layersManager);

handlerManager.registerHandle(new SystemHandler(emitter, senderManager, usersManager, cursorsManager));
handlerManager.registerHandle(new RegisterHandler(emitter, senderManager, usersManager, cursorsManager));
handlerManager.registerHandle(new CursorHandler(emitter, usersManager, cursorsManager));


export {
    emitter,
    ws,
    senderManager,
    moduleManager,
    layersManager,
    usersManager,
    handlerManager,
    cursorsManager,
    cardsManager
}