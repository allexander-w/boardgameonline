import {cardsManager} from "../../core";
import {residentFulls} from "../../entities/duoside/managers/TextureStore";

const IDLE_MS = 140;      // пауза после движения камеры
const POLL_MS = 700;      // проверка, когда камера стоит (карты двигают, открывают, кладут из руки)
const MAX_FULL = 80;      // сколько полных текстур держим в памяти (~3 МБ каждая для карты 186x261, около 250 МБ)

/**
 * Решает, в каком виде рисовать каждую карту:
 *  - далеко: маленькое превью;
 *  - близко: полная текстура, но только у карт, которые видны на экране и не закрыты такой же картой сверху.
 * Остальные полные текстуры выгружаются, держим не больше MAX_FULL.
 */
class LodController {
    constructor(layersManager) {
        this.stage = layersManager.stage;
        this.timer = null;
        this.tick = 0;

        /* Пока камера/перенос заняты, опрос пропускается */
        this.isBusy = () => false;

        setInterval(() => {
            if ( document.hidden || this.isBusy() ) return;
            if ( this.update() ) this.stage.batchDraw();
        }, POLL_MS);
    }

    _onScreen(el) {
        const r = el.getClientRect({ skipShadow: true, skipStroke: true });
        return r.x < this.stage.width() && r.y < this.stage.height() && r.x + r.width > 0 && r.y + r.height > 0;
    }

    /* Применить LOD ко всем картам. Возвращает true, если что-то поменялось */
    update() {
        const tick = ++this.tick;
        const tops = new Map();
        let changed = false;

        for ( const card of cardsManager.cards.values() ) {
            const ui = card.uiManager;
            if ( !ui || typeof ui.setLod !== "function" || !ui.ready ) continue;

            const el = card.element;
            const low = ui.wantsLow(el);
            changed = ui.setLod(el, low) || changed;

            if ( low || !el.isVisible() || !this._onScreen(el) ) continue;

            /* В стопке на одном месте нужна полная текстура только у верхней карты */
            const key = `${ Math.round(el.x()) }|${ Math.round(el.y()) }|${ el.rotation() }|${ el.width() }|${ el.height() }`;
            const top = tops.get(key);
            if ( !top || el.zIndex() > top.el.zIndex() ) tops.set(key, { el, ui });
        }

        /* Нужных карт может быть больше лимита (все разложены по столу): берем ближайшие к центру экрана,
           остальные остаются на превью, чтобы память не росла */
        let wanted = [...tops.values()];
        if ( wanted.length > MAX_FULL ) {
            const cx = this.stage.width() / 2;
            const cy = this.stage.height() / 2;
            const dist = ({ el }) => {
                const r = el.getClientRect({ skipShadow: true, skipStroke: true });
                return Math.hypot(r.x + r.width / 2 - cx, r.y + r.height / 2 - cy);
            };

            wanted = wanted
                .map(item => ({ item, d: dist(item) }))
                .sort((x, y) => x.d - y.d)
                .slice(0, MAX_FULL)
                .map(x => x.item);
        }

        for ( const { el, ui } of wanted ) {
            ui.touch(tick);
            if ( !ui.hasFull(el.flipped()) ) ui.requestFull(el.flipped());
        }

        return this._trim(tick) || changed;
    }

    /* Выгрузить самые давно не нужные полные текстуры сверх лимита */
    _trim(tick) {
        let extra = residentFulls.size - MAX_FULL;
        if ( extra <= 0 ) return false;

        const victims = [...residentFulls]
            .filter(ui => ui.lastUsed !== tick)
            .sort((a, b) => a.lastUsed - b.lastUsed);

        for ( const ui of victims ) {
            if ( extra-- <= 0 ) break;
            ui.releaseFull();
        }

        return true;
    }

    /* Отложенное обновление после остановки камеры (когда снимок доски не используется) */
    schedule() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if ( this.update() ) this.stage.batchDraw();
        }, IDLE_MS);
    }
}

export default LodController;
