import config from "../config";
import { unserialize } from "../../shared/utils/serialize.util.mjs";

class Websockets {
    constructor(emitter) {
        this.socket = null;
        this.emitter = emitter;

        this.handleUnload = this.handleUnload.bind(this);
    }

    get ready() {
        return this.socket?.readyState === WebSocket.OPEN;
    }

    connect() {
        this.socket = new WebSocket(config.ws);

        this.socket.onopen = () => {
            this.emitter.emit('system.websockets.onopen');
        };

        this.socket.onclose = (e) => {
            this.removeUnloadListeners();
            this.emitter.emit('system.websockets.onclose', e);
        };

        this.socket.onmessage = (event) => {
            const data = unserialize(event.data);
            this.emitter.emit(data.action, data.payload);
        };

        this.addUnloadListeners();
    }

    disconnect(code = 1000, reason = "Client disconnected") {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close(code, reason);
        }
    }

    handleUnload() {
        this.disconnect(1000, "Page unloaded");
    }

    addUnloadListeners() {
        window.addEventListener("beforeunload", this.handleUnload);
        window.addEventListener("pagehide", this.handleUnload);
    }

    removeUnloadListeners() {
        window.removeEventListener("beforeunload", this.handleUnload);
        window.removeEventListener("pagehide", this.handleUnload);
    }
}

export default Websockets;