// import {ResourcesFlexWrapperTemplate} from "../resources-module/templates/resources.template";
// import ws from "../../core/websocket";
// import gameInterface from "../interface-module";
//
//
//
// function HandModule(board) {
//     this.hands = []; // Хранение
//
//     const layer = board.get_layer("board"); // Инициализация
//     const game = board.get_layer("board");// Инициализация
//
//     const notificationsModule = gameInterface.getModule("notifications");
//
//
//     // Поиск (внутренняя логика)
//     this.findElementsAbove = (target) => {
//         const targetBox = target.getClientRect();
//         return board.stage.find('Rect').filter((other) => {
//             if (!other.attrs.parentID) return false;
//
//             const otherBox = other.getClientRect();
//
//             return !(
//                 targetBox.x + targetBox.width < otherBox.x + (otherBox.width / 2) ||
//                 targetBox.x + (otherBox.width / 2) > otherBox.x + otherBox.width ||
//                 targetBox.y + targetBox.height < otherBox.y + (otherBox.height / 2) ||
//                 targetBox.y + (otherBox.height / 2) > otherBox.y + otherBox.height
//             );
//         });
//     }
//
//
//     // Апи
//     this.take = (el, fromWs) => {
//         if ( fromWs ) {
//             const element = board.stage.findOne('#' + fromWs.id);
//             element.hide();
//
//             return false;
//         }
//
//         this.hands.push(el.element);
//         el.element.hide();
//
//         notificationsModule.notify("Вы взяли в руки 1 карту");
//         ws.receiver.send("api.hand.take", { id: el.element.id() });
//     }
//
//     // Апи
//
//     this.takeAll = (el, fromWs) => {
//         if ( fromWs ) {
//             fromWs.elements.forEach(element => {
//                 const findedElement = board.stage.findOne('#' + element);
//                 findedElement.hide();
//             })
//
//             return false;
//         }
//
//
//         const elementsAbove = this.findElementsAbove(el.element);
//         if ( elementsAbove.length ) {
//             this.hands = [...this.hands, ...elementsAbove];
//             elementsAbove.forEach(el => el.hide());
//
//             notificationsModule.notify("Вы взяли в руки " + elementsAbove.length + " карт");
//             ws.receiver.send("api.hand.takeAll", { elements: elementsAbove.map(el => el.id()) });
//         }
//     }
//
//     // Апи
//
//     this.takeHalf = (el, fromWs) => {
//         if ( fromWs ) {
//             fromWs.elements.forEach(element => {
//                 const findedElement = board.stage.findOne('#' + element);
//                 findedElement.hide();
//             })
//
//             return false;
//         }
//
//         const elementsAbove = this.findElementsAbove(el.element);
//         if ( elementsAbove.length ) {
//             const half = elementsAbove.slice(Math.ceil(elementsAbove.length / 2));
//             this.hands = [...this.hands, ...half];
//
//             half.forEach(el => el.hide());
//
//             notificationsModule.notify("Вы взяли в руки " + half.length + " карт");
//             ws.receiver.send("api.hand.takeAll", { elements: half.map(el => el.id()) });
//         }
//     }
//
//     // Апи
//
//     this.shuffle = () => {
//         notificationsModule.notify("Карты в руках перемешаны");
//         this.hands = new Map([...this.hands.entries()].sort(() => Math.random() - 0.5));
//     }
//
//     // Апи
//
//     this.put = (e, fromWs) => {
//         if ( fromWs ) {
//             fromWs.elements?.forEach(element => {
//                 const el = board.stage.findOne('#' + element.id);
//                 if ( !el ) return false;
//
//                 el.x(element.pos.x);
//                 el.y(element.pos.y);
//
//                 el.attrs.link?.flipToTop();
//                 el.zIndex(element.zIndex);
//                 el.show();
//             })
//
//             return false;
//         }
//
//         if ( e.evt.altKey ) {
//             const pos = layer.getRelativePointerPosition();
//             const config = [];
//
//             this.hands.forEach(el => {
//                 el.x(pos.x);
//                 el.y(pos.y);
//
//                 el.attrs.link?.flipToTop();
//                 el.moveToTop();
//                 el.show();
//
//                 config.push({ id: el.id(), zIndex: el.zIndex(), pos });
//             })
//
//             notificationsModule.notify("Вы положили на стол " + this.hands.length + " карт");
//
//             this.hands = [];
//             ws.receiver.send("api.hand.put", { elements: config });
//         }
//     }
//
//
//     // Хендлеры
//
//     this.init = () => {
//         console.log("Hand module initialized");
//
//         ws.emitter.on("module.hand.take", this.take);
//         ws.emitter.on("module.hand.takeAll", this.takeAll);
//         ws.emitter.on("module.hand.takeHalf", this.takeHalf);
//
//
//         ws.emitter.on("api.hand.take", (data) => {
//             this.take(null, data);
//         });
//
//         ws.emitter.on("api.hand.takeAll", (data) => {
//             this.takeAll(null, data);
//         });
//
//         ws.emitter.on("api.hand.takeHalf", (data) => {
//             this.takeHalf(null, data);
//         });
//
//         ws.emitter.on("api.hand.put", (data) => {
//             this.put(null, data);
//         });
//
//
//         ws.emitter.on("keydown", (e) => {
//             if ( e.code === 'KeyM' ) this.shuffle();
//         })
//
//         board.stage.on("click", this.put.bind(this));
//     }
// }
//
// export default HandModule;


import HandManager from "./managers/HandManager";
import HandHandler from "./handlers/HandHandler";
import {cardsManager, layersManager, moduleManager} from "../../core";

export default {
    module: null,
    init() {
        const notificationsManager = moduleManager.getModule("notifications");
        notificationsManager.notify("Модуль хранения инициализирован!");
        console.log("hands module initialized");

        const manager = new HandManager(layersManager, cardsManager, moduleManager);
        new HandHandler(manager, layersManager);

        this.module = manager;
    }
};