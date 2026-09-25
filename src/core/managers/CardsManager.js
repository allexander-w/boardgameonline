import {emitter} from "../index";

class CardsManager {
    constructor(layersManager, senderManager) {
        this.layersManager = layersManager;
        this.senderManager = senderManager;

        this.boardLayer = this.layersManager.getLayer("board");
        this.boardStage = this.layersManager.stage;

        this.cards = new Map();


        this.longPressTimer = null;
        this.longPressDelay = 300;
        this.startPointerPos = null;
        this.activeGroup = null;
        this.draggedStack = [];
    }

    _findElementsAbove(target) {
        const targetBox = target.getClientRect();
        return this.boardLayer.find('Rect').filter((other) => {
            if (!other.isVisible()) return false;
            const otherBox = other.getClientRect();

            return !(
                targetBox.x + targetBox.width < otherBox.x + (otherBox.width / 2) ||
                targetBox.x + (otherBox.width / 2) > otherBox.x + otherBox.width ||
                targetBox.y + targetBox.height < otherBox.y + (otherBox.height / 2) ||
                targetBox.y + (otherBox.height / 2) > otherBox.y + otherBox.height
            );
        });
    }

    onPointerDown(e) {
        const target = e.target;
        const card = this.getCard(target.id());
        if (!card) return;

        this.startPointerPos = this.boardStage.getPointerPosition();

        this.longPressTimer = setTimeout(() => {
            this._startStackDrag(target);
        }, this.longPressDelay);
    }

    onPointerMove() {
        if (!this.longPressTimer) return;

        const currentPos = this.boardStage.getPointerPosition();
        if (!currentPos || !this.startPointerPos) return;

        const dist = Math.hypot(currentPos.x - this.startPointerPos.x, currentPos.y - this.startPointerPos.y);
        if (dist > 5) {
            this._clearLongPressTimer();
        }
    }

    onPointerUp() {
        this._clearLongPressTimer();
    }

    _clearLongPressTimer() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }

    // Старт перетаскивания всей стопки
    _startStackDrag(target) {
        this._clearLongPressTimer();

        const stackElements = this._findElementsAbove(target);
        if (stackElements.length <= 1) return;

        this.draggedStack = stackElements;
        this.layersManager.clearCacheAllGroups();


        const cursor = document.querySelector(".custom-cursor");
        cursor.innerHTML = "";
        cursor.insertAdjacentHTML("afterbegin", `
            <img src="/cursors/takeAll.svg" />
        `)

        this.activeGroup = new Konva.Group({
            draggable: true,
            id: 'temp_stack_group'
        });

        this.boardLayer.add(this.activeGroup);

        stackElements.forEach((el) => {
            const absPos = el.getAbsolutePosition();
            el.moveTo(this.activeGroup);
            el.setAbsolutePosition(absPos);
        });

        this.activeGroup.moveToTop();

        this.activeGroup.startDrag();

        this.activeGroup.on('dragmove', () => {
            const pointerPos = this.boardLayer.getRelativePointerPosition();
            const config = this.draggedStack.map(el => {
                const absPos = el.getAbsolutePosition();
                return {
                    id: el.id(),
                    x: absPos.x,
                    y: absPos.y
                };
            });

            this.senderManager.send("api.drag.stackMove", { cards: config });
            this.senderManager.send("api.cursors.move", { x: pointerPos.x, y: pointerPos.y });
        });

        this.activeGroup.on('dragend', () => {
            this._endStackDrag();
        });

        emitter.emit("notification", { message: "Перемещение всей стопки", color: "blue" });
    }

    _resetCustomCursor() {
        const cursor = document.querySelector(".custom-cursor");
        if (cursor) {
            cursor.innerHTML = "";
        }
    }

    // Завершение перетаскивания всей стопки
    _endStackDrag() {
        if (!this.activeGroup) return;

        const config = [];

        // Переносим карты из временной группы обратно на boardLayer
        this.draggedStack.forEach((el) => {
            const absPos = el.getAbsolutePosition();
            el.moveTo(this.boardLayer);
            el.setAbsolutePosition(absPos);

            config.push({ id: el.id(), x: absPos.x, y: absPos.y });
        });

        // Уничтожаем временную группу
        this.activeGroup.destroy();
        this.activeGroup = null;
        this.draggedStack = [];
        this._resetCustomCursor();

        this.layersManager.cacheAllGroups(100);

        // Отправляем пакет на сервер
        this.senderManager.send("api.drag.stackEnd", { cards: config });
    }

    getCard(id) {
        return this.cards.get(id);
    }

    getElement(id, layer) {
        layer = layer ? this.layersManager.getLayer(layer) : this.boardLayer;
        return layer.findOne("#" + id);
    }

    createCard(card, layer) {
        layer = layer ? this.layersManager.getLayer(layer) : this.boardLayer;

        layer.add(card.element);
        this.cards.set(card.element.id(), card);
    }

    registerCard(card) {
        this.cards.set(card.element.id(), card);
    }

    removeCard(id) {
        this.cards.delete(id);
    }

    dragmove(element) {
        const pointerPos = this.boardLayer.getRelativePointerPosition();

        this.senderManager.send("api.drag.move", { x: element.target.x(), y: element.target.y(), id: element.target.id() });
        this.senderManager.send("api.cursors.move", { x: pointerPos.x, y: pointerPos.y });
    }

    remoteDragmove(data) {
        const card = this.getCard(data.id);
        if ( card ) {
            card.element.x(data.x);
            card.element.y(data.y);
        }
    }

    dragstart(e) {
        const card = this.getCard(e.target.id());
        if ( !card ) return false;

        card.dragstart();
        this.senderManager.send("api.drag.start", { id: e.target.id() });

        this.layersManager.clearCacheAllGroups();
    }

    remoteDragstart(data) {
        const card = this.getCard(data.id);
        if ( !card ) return false;

        card.dragstart();
        this.layersManager.clearCacheAllGroups();
    }

    dragend(e) {
        const card = this.getCard(e.target.id());
        if ( !card ) return false;

        card.dragend();

        const stage = this.boardStage;
        const stageHeight = stage.height();

        const absPos = e.target.getAbsolutePosition();
        const rect = e.target.getClientRect();
        const cardBottomYInContainer = absPos.y + rect.height;

        if (absPos.y >= stageHeight) {
            emitter.emit("intersection.bottom", e.target);
        }

        this.senderManager.send("api.drag.end", { id: e.target.id() });
        this.layersManager.cacheAllGroups(100);
    }

    remoteDragend(data) {
        const card = this.getCard(data.id);
        if ( !card ) return false;
        card.dragend();

        this.layersManager.cacheAllGroups(100);
    }

    remoteAction(data) {
        const card = this.getCard(data.id);
        if ( !card ) return false;

        this.layersManager.clearCacheAllGroups();

        if ( card.cardManager && card.cardManager[data.method] ) {
            card.cardManager[data.method]({ server: true }, data.payload);
            this.layersManager.cacheAllGroups(450);
        }
    }

    remoteStackMove(data) {
        if (data && data.cards) {
            data.cards.forEach(item => {
                const card = this.getCard(item.id);
                if (card && card.element) {
                    card.element.x(item.x);
                    card.element.y(item.y);
                }
            });
        }
    }

    remoteStackEnd(data) {
        this.remoteStackMove(data);
        this.layersManager.cacheAllGroups(100);
    }
}

export default CardsManager;