import {emitter} from "../index";

const GENERIC_ACTION_METHODS = new Set(["flip", "rotateLeft", "rotateRight", "toBottom", "toTop", "putAway"]);

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
        this.draggedLimited = false;

        /* Выбранная стопка и сколько карт сверху с ней работаем (null = все) */
        this.stackSelection = [];
        this.stackLimit = null;
    }

    /* ---------- выбранная стопка: лимит n и групповые действия ---------- */

    _sortByZ(elements) {
        return [...elements].sort((a, b) => a.zIndex() - b.zIndex());
    }

    _notifyStackSelection() {
        emitter.emit("stack.selection.changed", {
            total: this.stackSelection.length,
            limit: this.getStackLimit(),
        });
    }

    setStackSelection(elements) {
        this.stackSelection = this._sortByZ(elements);
        this.stackLimit = null;
        this._notifyStackSelection();
    }

    clearStackSelection({ silent = false } = {}) {
        if (!this.stackSelection.length && this.stackLimit === null) return;

        this.stackSelection = [];
        this.stackLimit = null;
        if (!silent) this._notifyStackSelection();
    }

    /* Сколько карт берем сейчас (по умолчанию - вся стопка) */
    getStackLimit() {
        const total = this.stackSelection.length;
        if (!total) return 0;
        return this.stackLimit === null ? total : Math.min(this.stackLimit, total);
    }

    setStackLimit(n) {
        const total = this.stackSelection.length;
        if (total < 2) return;

        const value = Math.max(1, Math.min(total, Math.round(n)));
        this.stackLimit = value === total ? null : value;
        this._notifyStackSelection();
    }

    adjustStackLimit(delta) {
        this.setStackLimit(this.getStackLimit() + delta);
    }

    /* Верхние n карт выбранной стопки (только те, что еще на столе) */
    getSelectedTop() {
        const alive = this._sortByZ(this.stackSelection.filter(el => el.isVisible() && el.getStage()));
        const limit = this.getStackLimit();
        return limit ? alive.slice(-limit) : alive;
    }

    _isInSelection(target) {
        return this.stackSelection.length > 1 && this.stackSelection.includes(target);
    }

    onWheel(e) {
        if (!this._isInSelection(e.target)) return;

        e.evt.preventDefault();
        /* Сообщаем камере, что зум не нужен */
        e.evt.stackWheelHandled = true;

        this.adjustStackLimit(e.evt.deltaY < 0 ? 1 : -1);
    }

    /* Групповое действие над верхними n картами: flip / rotateLeft / rotateRight */
    dispatchStackAction(method) {
        const elements = this.getSelectedTop();
        if (!elements.length) return false;

        elements.forEach(el => {
            const card = this.getCard(el.id());
            if (card) this.dispatchAction(card.cardManager, method);
        });

        return true;
    }

    _findElementsAbove(target) {
        const targetBox = target.getClientRect();
        return this.boardLayer.find('Rect').filter((other) => {
            if (!other.isVisible()) return false;

            // ⛔ Исключаем из стопки любые карты, пристыкованные к зонам
            if (this.zoneManager?.getDock(other.id())) return false;

            const otherBox = other.getClientRect();

            return !(
                targetBox.x + targetBox.width < otherBox.x + (otherBox.width / 2) ||
                targetBox.x + (otherBox.width / 2) > otherBox.x + otherBox.width ||
                targetBox.y + targetBox.height < otherBox.y + (otherBox.height / 2) ||
                targetBox.y + (otherBox.height / 2) > otherBox.y + otherBox.height
            );
        });
    }

    setMagnetManager(magnetManager) {
        this.magnetManager = magnetManager;
    }

    setZoneManager(zoneManager) {
        this.zoneManager = zoneManager;
    }

    onPointerDown(e) {
        const target = e.target;
        const card = this.getCard(target.id());
        if (!card) return;

        // ⛔ Если эта карта сама лежит в зоне (docked) — запуск stackDrag ЗАПРЕЩЕН
        if (this.zoneManager?.getDock(target.id())) return;

        this._clearLongPressTimer();

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

        // Уменьшен порог сдвига до 3px для большей отзывчивости
        if (dist > 3) {
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
        this.startPointerPos = null;
    }

    _startStackDrag(target) {
        this._clearLongPressTimer();

        if (this.activeGroup) {
            this._endStackDrag();
        }

        let stackElements = this._sortByZ(this._findElementsAbove(target));

        /* Если стопка выбрана и задано n - берем только n верхних карт */
        const limited = this._isInSelection(target) && this.stackLimit !== null;
        if (limited) stackElements = stackElements.slice(-this.getStackLimit());

        if (stackElements.length <= 1 && !limited) return;
        if (!stackElements.length) return;

        this.draggedStack = stackElements;
        this.draggedLimited = limited;
        this.layersManager.clearCacheAllGroups();

        const cursor = document.querySelector(".custom-cursor");
        if (cursor) {
            cursor.innerHTML = "";
            cursor.insertAdjacentHTML("afterbegin", `
                <img src="/cursors/takeAll.svg" />
            `);
        }

        this.activeGroup = new Konva.Group({
            draggable: true,
            id: 'temp_stack_group'
        });

        this.boardLayer.add(this.activeGroup);

        stackElements.forEach((el) => {
            // Если карта случайно попала в группу, гарантируем её undock
            if (this.zoneManager?.getDock(el.id())) {
                this.zoneManager.undock(el.id());
            }

            const absPos = el.getAbsolutePosition();
            el.moveTo(this.activeGroup);
            el.setAbsolutePosition(absPos);
        });

        this.activeGroup.moveToTop();

        this.activeGroup.startDrag();

        this.activeGroup.on('dragmove', () => {
            const pointerPos = this.boardLayer.getRelativePointerPosition();
            const config = this.draggedStack.map(el => {
                const pos = el.getAbsolutePosition(this.boardLayer);
                return {
                    id: el.id(),
                    x: pos.x,
                    y: pos.y
                };
            });

            this.senderManager.send("api.drag.stackMove", { cards: config });
            this.senderManager.send("api.cursors.move", { x: pointerPos.x, y: pointerPos.y });
        });

        this.activeGroup.on('dragend', () => {
            this._endStackDrag();
        });

        emitter.emit("notification", { message: limited ? `Перемещение карт: ${stackElements.length}` : "Перемещение всей стопки", color: "blue" });
    }

    _resetCustomCursor() {
        const cursor = document.querySelector(".custom-cursor");
        if (cursor) {
            cursor.innerHTML = "";
        }
    }

    _endStackDrag() {
        if (!this.activeGroup) return;

        const config = [];

        this.draggedStack.forEach((el) => {
            const absPos = el.getAbsolutePosition();
            el.moveTo(this.boardLayer);
            el.setAbsolutePosition(absPos);

            const card = this.getCard(el.id());
            if (card && card.dragend) card.dragend();

            // Синхронизируем положение вложенных карт, если среди них были владельцы зон
            this.zoneManager?.follow(el.id());

            config.push({ id: el.id(), x: el.x(), y: el.y() });
        });

        this.activeGroup.destroy();
        this.activeGroup = null;
        this.draggedStack = [];
        this._resetCustomCursor();

        /* Часть карт ушла из стопки - прежнее выделение больше не актуально */
        if (this.draggedLimited) {
            this.draggedLimited = false;
            this.clearStackSelection();
        }

        this.layersManager.cacheAllGroups(100);

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
        this.zoneManager?.register(card);
    }

    registerCard(card) {
        this.cards.set(card.element.id(), card);
        this.zoneManager?.register(card);
    }

    removeCard(id) {
        this.cards.delete(id);
    }

    dragmove(element) {
        this.zoneManager?.follow(element.target.id());

        if (this.zoneManager?.move()) this.magnetManager?.suspend();
        else this.magnetManager?.move();

        const pointerPos = this.boardLayer.getRelativePointerPosition();

        this.senderManager.send("api.drag.move", { x: element.target.x(), y: element.target.y(), id: element.target.id() });
        this.senderManager.send("api.cursors.move", { x: pointerPos.x, y: pointerPos.y });
    }

    remoteDragmove(data) {
        const card = this.getCard(data.id);
        if ( card ) {
            card.element.x(data.x);
            card.element.y(data.y);
            this.zoneManager?.follow(data.id);
        }
    }

    dragstart(e) {
        // 🔥 ВАЖНО: Сбрасываем таймер долгий нажатий сразу при старте одиночного drag
        this._clearLongPressTimer();

        const card = this.getCard(e.target.id());
        if ( !card ) return false;

        card.dragstart();
        this.zoneManager?.start(card);
        this.magnetManager?.start(card);
        this.senderManager.send("api.drag.start", { id: e.target.id() });

        this.layersManager.clearCacheAllGroups();
    }

    remoteDragstart(data) {
        const card = this.getCard(data.id);
        if ( !card ) return false;

        card.dragstart();
        this.zoneManager?.restack(data.id);
        this.layersManager.clearCacheAllGroups();
    }

    dragend(e) {
        // Дополнительный сброс на случай быстрого клика
        this._clearLongPressTimer();

        const card = this.getCard(e.target.id());
        if (!card) return false;

        const zoneSnapped = this.zoneManager?.end();
        if (zoneSnapped) this.magnetManager?.suspend();
        const snapped = this.magnetManager?.end() || zoneSnapped;

        if (snapped) {
            this.senderManager.send("api.drag.move", {
                x: e.target.x(),
                y: e.target.y(),
                id: e.target.id(),
            });
        }

        card.dragend();

        const stage = this.boardStage;
        const stageHeight = stage.height();

        const absPos = e.target.getAbsolutePosition();

        if (absPos.y >= stageHeight) {
            emitter.emit("intersection.bottom", e.target);
        }

        this.senderManager.send("api.drag.end", {
            id: e.target.id(),
            x: e.target.x(),
            y: e.target.y()
        });

        this.layersManager.cacheAllGroups(100);
    }

    remoteDragend(data) {
        const card = this.getCard(data.id);
        if ( !card ) return false;
        card.dragend();

        this.layersManager.cacheAllGroups(100);
    }

    dispatchAction(cardManager, method) {
        if ( !cardManager || !cardManager[method] ) return false;
        cardManager[method]();
        this.zoneManager?.afterAction(cardManager.element.id(), method);

        if ( !GENERIC_ACTION_METHODS.has(method) ) return;
        this.senderManager.send("api.cards.action", { method, id: cardManager.element.id() });
    }

    remoteAction(data) {
        const card = this.getCard(data.id);
        if ( !card ) return false;

        this.layersManager.clearCacheAllGroups();

        if ( card.cardManager && card.cardManager[data.method] ) {
            card.cardManager[data.method](data.payload);
            this.zoneManager?.afterAction(data.id, data.method);
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
                    this.zoneManager?.follow(item.id);
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