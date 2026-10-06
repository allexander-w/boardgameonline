import { cardsManager, moduleManager, syncHandler, emitter, gameManager } from "../../../core";
import { applySave } from "../../../core/initialize/applySave";

class SaverManager {
    constructor(uiManager, layersManager) {
        this.uiManager = uiManager;
        this.layersManager = layersManager;

        this.pendingSave = false;
        this.pendingSaveTimer = null;

        emitter.on("api.room.checkpoint.saved", this.onCheckpointSaved.bind(this));
        emitter.on("api.room.checkpoint.rejected", this.onCheckpointRejected.bind(this));
    }

    _notify(text, color) {
        const notificationsModule = moduleManager.getModule("notifications");
        notificationsModule?.notify(text, { color });
    }

    _finishPendingSave() {
        this.pendingSave = false;
        clearTimeout(this.pendingSaveTimer);
        this.pendingSaveTimer = null;
    }

    onCheckpointSaved() {
        if ( !this.pendingSave ) return;

        this._finishPendingSave();
        this._notify("Игра сохранена на сервере!", "green");
    }

    onCheckpointRejected(data) {
        if ( !this.pendingSave ) return;

        this._finishPendingSave();
        this._notify(
            data?.reason === "not-sync-user"
                ? "Сохранить игру может только хост комнаты"
                : "Сервер отклонил сохранение: снимок доски пустой или повреждён",
            "red"
        );
    }

    save() {
        if ( this.pendingSave ) return false;

        if ( !syncHandler.canSync() ) {
            this._notify("Не удалось сохранить: нет соединения, вы не хост или доска ещё не готова", "red");
            return false;
        }

        this.pendingSave = true;

        if ( !syncHandler.checkpoint() ) {
            this._finishPendingSave();
            this._notify("Не удалось сохранить: снимок доски пустой", "red");
            return false;
        }

        this._notify("Сохранение...", "blue");

        /* Страховка: если ответ сервера потеряется, не оставляем кнопку «залипшей». */
        this.pendingSaveTimer = setTimeout(() => {
            if ( !this.pendingSave ) return;

            this._finishPendingSave();
            this._notify("Сервер не подтвердил сохранение", "red");
        }, 5000);

        return true;
    }

    load() {
        const savedGame = localStorage.getItem("save");
        if ( !savedGame ) {
            this._notify("Не удалось загрузить сохранение!", "red");
            return false;
        }

        let save;

        try {
            save = JSON.parse(savedGame);
        } catch (e) {
            console.error("[saver] повреждённое локальное сохранение", e);
            this._notify("Не удалось загрузить сохранение!", "red");
            return false;
        }

        if ( save.project !== gameManager.getId() ) {
            this._notify("Не удалось загрузить сохранение!", "red");
            return false;
        }

        applySave(save);

        this._notify("Сохранение успешно загружено!", "green");
        return true;
    }

    render() {
        return this.uiManager.getSaveMenu();
    }
}

export default SaverManager;
