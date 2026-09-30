import Konva from "konva";

const DEG = Math.PI / 180;
const normalizeDeg = (deg) => ((deg % 360) + 540) % 360 - 180;

/**
 * Зоны примагничивания, привязанные к карте-владельцу (планшету).
 *
 * Зона описывается в манифесте карты в пикселях ИЗОБРАЖЕНИЯ карты
 * (0,0 — левый верхний угол карты, размеры — размеры карты из `size`):
 *
 *   "zones": [{
 *     "id": "items", "x": 40, "y": 60, "w": 400, "h": 170,
 *     "accepts": { "kinds": ["item"], "ids": ["special_1"] },   // ids ИЛИ kinds; пусто = любая карта
 *     "max": 3,                                                 // вместимость (по умолчанию 1)
 *     "layout": { "cols": 3, "gap": 10 }                        // сетка слотов, без layout — один слот по центру
 *   }]
 *
 * Состояние «карта лежит в зоне» хранится в this.docks: cardId -> { ownerId, zoneId, slot, rot }.
 * Позиция карты в зоне ВСЕГДА вычисляется из позиции владельца, поэтому по сети
 * двигается только владелец, а вложенные карты едут за ним на каждом клиенте сами.
 */

class ZoneManager {
    constructor(layersManager, cardsManager, senderManager) {
        this.layersManager = layersManager;
        this.cardsManager = cardsManager;
        this.senderManager = senderManager;
        this.boardLayer = layersManager.getLayer("board");

        this.owners = new Set();   // id карт, у которых есть зоны
        this.docks = new Map();    // id вложенной карты -> { ownerId, zoneId, slot, rot }
        this.active = null;        // { card, target }
        this.highlightElement = null;
        this._applying = false;    // защита от реакции на собственные изменения x/y/rotation
    }

    /* ---------- регистрация ---------- */

    register(card) {
        const el = card.element;
        if (!el.getAttr("zones")?.length) return;

        this.owners.add(el.id());
        el.on("xChange.ownerZones yChange.ownerZones rotationChange.ownerZones", () => {
            if (!this._applying) this.follow(el.id());
        });
    }

    /* ---------- геометрия ---------- */

    _el(id) {
        return this.cardsManager.getCard(id)?.element;
    }

    // Возвращает плоский список зон (автоматически разворачивает зоны с layout: { cols, rows })
    _getZones(owner) {
        const rawZones = owner?.getAttr("zones") || [];
        const expanded = [];

        for (const zone of rawZones) {
            if (!zone.layout?.rows) {
                expanded.push(zone);
                continue;
            }

            const { cols = 1, rows = 1, gap = 0 } = zone.layout;

            // Парсим gap: если передали число — дублируем в X и Y, если объект — берем x и y отдельно
            const gapX = typeof gap === "object" ? (gap.x ?? 0) : gap;
            const gapY = typeof gap === "object" ? (gap.y ?? 0) : gap;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const index = r * cols + c + 1;
                    expanded.push({
                        id: `${zone.id}_${index}`,
                        x: zone.x + c * (zone.w + gapX),
                        y: zone.y + r * (zone.h + gapY),
                        w: zone.w,
                        h: zone.h,
                        accepts: zone.accepts,
                        max: 1
                    });
                }
            }
        }

        return expanded;
    }

    _zone(owner, zoneId) {
        return this._getZones(owner).find(z => z.id === zoneId);
    }

    // точка слоя -> система владельца (начало в центре карты, без поворота)
    _toLocal(owner, p) {
        const r = -owner.rotation() * DEG;
        const dx = p.x - owner.x();
        const dy = p.y - owner.y();
        return { x: dx * Math.cos(r) - dy * Math.sin(r), y: dx * Math.sin(r) + dy * Math.cos(r) };
    }

    _toWorld(owner, l) {
        const r = owner.rotation() * DEG;
        return {
            x: owner.x() + l.x * Math.cos(r) - l.y * Math.sin(r),
            y: owner.y() + l.x * Math.sin(r) + l.y * Math.cos(r),
        };
    }

    _zoneCenterLocal(owner, zone) {
        return { x: zone.x + zone.w / 2 - owner.width() / 2, y: zone.y + zone.h / 2 - owner.height() / 2 };
    }

    _slotLocal(owner, zone, index, cw, ch) {
        // x и y уже учитывают сдвиг сетки
        const x = zone.x + zone.w / 2;
        const y = zone.y + zone.h / 2;
        return { x: x - owner.width() / 2, y: y - owner.height() / 2 };
    }

    _capacity(zone) {
        return zone.layout ? (zone.max ?? 1) : 1;
    }

    /* ---------- правила ---------- */

    _accepts(zone, el) {
        const a = zone.accepts;
        if (!a || (!a.ids && !a.kinds)) return true;
        return !!(a.ids?.includes(el.id()) || a.kinds?.includes(el.getAttr("kind")));
    }

    _occupiedSlots(ownerId, zoneId, exceptId) {
        const slots = new Set();
        for (const [id, d] of this.docks) {
            if (id !== exceptId && d.ownerId === ownerId && d.zoneId === zoneId) slots.add(d.slot);
        }
        return slots;
    }

    // нельзя положить карту в зону её же потомка (цикл)
    _isDescendant(ownerId, cardId) {
        let cur = ownerId;
        const seen = new Set();
        while (cur && !seen.has(cur)) {
            if (cur === cardId) return true;
            seen.add(cur);
            cur = this.docks.get(cur)?.ownerId;
        }
        return false;
    }

    isDocked(cardId) {
        return this.docks.has(cardId);
    }

    findTarget(card) {
        const el = card.element;
        const p = el.position();
        let best = null;

        for (const ownerId of this.owners) {
            if (ownerId === el.id()) continue;

            const owner = this._el(ownerId);
            if (!owner || !owner.visible()) continue;
            if (this._isDescendant(ownerId, el.id())) continue;

            const local = this._toLocal(owner, p);

            // ИСПОЛЬЗУЕМ СГЕНЕРИРОВАННЫЕ ЗОНЫ
            for (const zone of this._getZones(owner)) {
                if (!this._accepts(zone, el)) continue;

                const taken = this._occupiedSlots(ownerId, zone.id, el.id());
                const capacity = this._capacity(zone);
                if (taken.size >= capacity) continue;

                const c = this._zoneCenterLocal(owner, zone);
                if (Math.abs(local.x - c.x) > zone.w / 2 || Math.abs(local.y - c.y) > zone.h / 2) continue;

                // Ближайший свободный слот (для развернутых зон capacity всегда = 1)
                let slot = -1;
                let slotDist = Infinity;
                for (let i = 0; i < capacity; i++) {
                    if (taken.has(i)) continue;
                    const s = this._slotLocal(owner, zone, i, el.width(), el.height());
                    const d = Math.hypot(local.x - s.x, local.y - s.y);
                    if (d < slotDist) { slotDist = d; slot = i; }
                }
                if (slot < 0) continue;

                const z = owner.zIndex();
                const dist = Math.hypot(local.x - c.x, local.y - c.y);
                if (!best || z > best.z || (z === best.z && dist < best.dist)) {
                    best = { ownerId, zone, slot, z, dist };
                }
            }
        }

        return best;
    }

    /* ---------- drag-жизненный цикл (вызывается из CardsManager) ---------- */

    start(card) {
        this.active = { card, target: null };

        // потянули карту из зоны — она больше не «прикреплена»
        if (this.docks.has(card.element.id())) this.undock(card.element.id());

        this.restack(card.element.id());
    }

    move() {
        if (!this.active) return false;

        const target = this.findTarget(this.active.card);
        this.active.target = target;

        if (!target) {
            this.clearHighlight();
            return false;
        }

        this.highlight(target);
        return true;
    }

    end() {
        if (!this.active) return false;

        const { card, target } = this.active;
        this.active = null;
        this.clearHighlight();

        if (!target) return false;

        this.dock(card.element.id(), target.ownerId, target.zone.id, target.slot);
        return true;
    }

    /* ---------- dock / undock ---------- */

    dock(cardId, ownerId, zoneId, slot, { rot, silent = false, place = true } = {}) {
        const el = this._el(cardId);
        const owner = this._el(ownerId);
        if (!el || !owner) return false;

        // если карта уже была где-то вложена — сначала освобождаем
        if (this.docks.has(cardId)) this._release(cardId);

        const dock = {
            ownerId,
            zoneId,
            slot,
            rot: rot ?? normalizeDeg(el.rotation() - owner.rotation()),
        };
        this.docks.set(cardId, dock);

        // карту забрали в руку (спрятали) — вкладывать её больше некуда
        el.on("visibleChange.dockedZones", () => {
            if (!el.visible()) this.undock(cardId, { silent: true });
        });

        // повернули вложенную карту вручную — запоминаем новый относительный угол
        el.on("rotationChange.dockedZones", () => {
            if (this._applying) return;
            const d = this.docks.get(cardId);
            const o = d && this._el(d.ownerId);
            if (d && o) d.rot = normalizeDeg(el.rotation() - o.rotation());
        });

        if (place) {
            this._place(cardId);
            this.restack(ownerId);
        }

        if (!silent) {
            this.senderManager.send("api.zones.dock", { id: cardId, ownerId, zoneId, slot, rot: dock.rot });
        }

        return true;
    }

    undock(cardId, { silent = false } = {}) {
        if (!this.docks.has(cardId)) return false;

        this._release(cardId);
        if (!silent) this.senderManager.send("api.zones.undock", { id: cardId });
        return true;
    }

    _release(cardId) {
        this.docks.delete(cardId);
        this._el(cardId)?.off(".dockedZones");
    }

    /* ---------- следование за владельцем ---------- */

    _place(cardId) {
        const d = this.docks.get(cardId);
        const el = this._el(cardId);
        const owner = d && this._el(d.ownerId);
        const zone = owner && this._zone(owner, d.zoneId);
        if (!el || !owner || !zone) return;

        const world = this._toWorld(owner, this._slotLocal(owner, zone, d.slot, el.width(), el.height()));

        this._applying = true;
        el.position(world);
        el.rotation(owner.rotation() + d.rot);
        this._applying = false;
    }

    follow(ownerId, depth = 0) {
        if (depth > 8) return; // страховка от циклов

        for (const [id, d] of this.docks) {
            if (d.ownerId !== ownerId) continue;

            this._place(id);
            if (this.owners.has(id)) this.follow(id, depth + 1);
        }
    }

    followAll() {
        for (const ownerId of this.owners) {
            if (!this.docks.has(ownerId)) this.follow(ownerId);
        }
    }

    // вложенные карты всегда прямо над своим владельцем
    restack(ownerId) {
        const owner = this._el(ownerId);
        if (!owner) return;

        let placed = 0;
        for (const [id, d] of this.docks) {
            if (d.ownerId !== ownerId) continue;

            const el = this._el(id);
            if (!el || !el.getParent()) continue;

            const max = el.getParent().children.length - 1;
            el.zIndex(Math.min(max, owner.zIndex() + 1 + placed));
            placed++;

            if (this.owners.has(id)) this.restack(id);
        }
    }

    afterAction(cardId, method) {
        if (method !== "toTop" && method !== "toBottom") return;

        if (this.owners.has(cardId)) this.restack(cardId);

        const d = this.docks.get(cardId);
        if (d) this.restack(d.ownerId);
    }

    /* ---------- сохранение / сеть ---------- */

    getDock(cardId) {
        const d = this.docks.get(cardId);
        return d ? { ...d } : null;
    }

    restore(cardId, dock) {
        if (!dock) return;
        this.dock(cardId, dock.ownerId, dock.zoneId, dock.slot, { rot: dock.rot, silent: true, place: false });
    }

    remoteDock(data) {
        this.dock(data.id, data.ownerId, data.zoneId, data.slot, { rot: data.rot, silent: true });
    }

    remoteUndock(data) {
        this.undock(data.id, { silent: true });
    }

    /* ---------- подсветка ---------- */

    highlight({ ownerId, zone }) {
        this.clearHighlight();

        const owner = this._el(ownerId);
        if (!owner) return;

        const c = this._toWorld(owner, this._zoneCenterLocal(owner, zone));

        const rect = new Konva.Rect({
            name: "zone-highlight",
            listening: false,
            x: c.x,
            y: c.y,
            width: zone.w,
            height: zone.h,
            offsetX: zone.w / 2,
            offsetY: zone.h / 2,
            rotation: owner.rotation(),
            cornerRadius: 8,
            stroke: "#a5f3fc",
            strokeWidth: 4,
            dash: [14, 8],
            fill: "rgba(165, 243, 252, 0.15)",
            shadowColor: "#a5f3fc",
            shadowBlur: 16,
            shadowOpacity: 0.8,
        });

        this.boardLayer.add(rect);
        rect.moveToTop();
        this.highlightElement = rect;
    }

    clearHighlight() {
        if (this.highlightElement) {
            this.highlightElement.destroy();
            this.highlightElement = null;
        }
    }
}

export default ZoneManager;