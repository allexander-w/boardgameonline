import { gameManager, moduleManager } from "../../core";
import CameraPresetsUI from "./CameraPresetsUI";

const GENERAL = 0;

class CameraPresets {
    constructor(camera, defaults = []) {
        this.camera = camera;
        this.storageKey = `camera-presets:${gameManager.getId() || "default"}`;

        /* 0 - общий вид (позицию запоминаем при уходе с него), дальше - виды из манифеста */
        this.items = [
            { id: "general", name: "Общий", view: camera.getView() },
            ...defaults
                .filter(v => Number.isFinite(v.x) && Number.isFinite(v.y))
                .map(v => ({ id: v.id, name: v.name, view: { x: v.x, y: v.y, zoom: v.zoom ?? 1 } })),
        ];
        this.active = GENERAL;

        this.loadSaved();

        this.ui = new CameraPresetsUI(index => this.select(index));
        this.render();

        document.addEventListener("keydown", e => this.onKeyDown(e));
    }

    render() {
        this.ui.render(this.items, this.active);
    }

    select(index) {
        const item = this.items[index];
        if ( !item || index === this.active ) return;

        /* Уходим с общего вида - запоминаем, где стояла камера */
        if ( this.active === GENERAL ) this.items[GENERAL].view = this.camera.getView();

        this.active = index;
        this.camera.setView(item.view);
        this.render();
    }

    next() {
        const count = this.items.length;
        if ( count < 2 ) return;
        this.select((this.active + 1) % count);
    }

    /* Shift+F: текущая позиция и зум становятся пресетом активного вида (кроме общего) */
    saveCurrent() {
        if ( this.active === GENERAL ) return;

        const item = this.items[this.active];
        item.view = this.camera.getView();
        this.persist();

        moduleManager.getModule("notifications")?.notify(`Пресет «${item.name}» сохранён`);
    }

    onKeyDown(e) {
        if ( e.repeat || e.ctrlKey || e.metaKey || e.altKey ) return;
        if ( e.target.closest?.("input, textarea, [contenteditable]") ) return;
        if ( this.items.length < 2 ) return;

        if ( e.code === "Tab" && !e.shiftKey ) {
            e.preventDefault();
            this.next();
            return;
        }

        if ( e.code === "KeyF" && e.shiftKey ) {
            this.saveCurrent();
            return;
        }

        if ( e.shiftKey ) return;

        const match = /^(?:Digit|Numpad)([1-9])$/.exec(e.code);
        if ( match ) this.select(Number(match[1]) - 1);
    }

    /* Пресеты пользователя хранятся локально: у каждого свои */
    loadSaved() {
        try {
            const saved = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
            for ( const item of this.items.slice(1) ) {
                if ( saved[item.id] ) item.view = saved[item.id];
            }
        } catch (e) {}
    }

    persist() {
        const data = {};
        for ( const item of this.items.slice(1) ) data[item.id] = item.view;

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {}
    }
}

export default CameraPresets;