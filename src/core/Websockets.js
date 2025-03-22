import config from "../config";
import { unserialize } from "../../shared/utils/serialize.util.mjs";

class Websockets {
    constructor(emitter) {
        this.socket = null;
        this.emitter = emitter;
    }

    get ready() {
        return this.socket?.readyState === 1;
    }

    connect() {
        this.socket = new WebSocket(config.ws);

        this.socket.onopen = () => {
            this.emitter.emit('system.websockets.onopen');
        };

        this.socket.onclose = (e) => {
            this.emitter.emit('system.websockets.onclose', e);
        };

        this.socket.onmessage = (event) => {
            const data = unserialize(event.data);
            this.emitter.emit(data.action, data.payload);
        };
    }
}

export default Websockets;