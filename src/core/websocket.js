import mitt from "mitt";
import {serialize, unserialize} from "../../shared/utils/serialize.util.mjs";
import actions from "../../shared/actions/action.types.mjs";
import config from "../config";

function WebsocketConnector() {
    this.socket = new WebSocket(config.ws);
    this.connections = new Map();
    this.currentConnection = null;
    this.currentSynced = false;

    this.emitter = mitt();

    this.ready = () => this.socket.readyState === 1;

    this.receiver = {
        send: (action, options) => {
            if ( !this.ready() ) return false;

            const payload = { action, payload: { user: this.currentConnection, ...options } };
            this.socket.send( serialize(payload) );
        }
    }


    this.emitter.on("USER_INFO", (user) => {
        console.log("connected", user);
        this.receiver.send(actions.connected, user);
    })

    this.socket.onopen = () => {
        console.log("successfully connected!");
        this.emitter.emit("REQUEST_USER_INFO");
    }

    this.socket.onclose = (e) => {
        console.log(e)
        this.emitter.emit("CLOSE_CONNECTION");
    }

    this.socket.onmessage = (event) => {
        const data = unserialize(event.data);
        if ( data.action === actions.connected ) {
            this.currentConnection = data.payload.user?.id;
            console.log('your connected id: ', this.currentConnection);
            return false;
        }

        if ( data.action === actions.join ) {
            console.log('action join');

            for (const user of data.payload.users) {
                if ( this.connections.has(user.id) || this.currentConnection === user.id ) continue;
                this.connections.set(user.id, {});
            }

            for (const [id, cursor] of this.connections) {
                if ( cursor?.attrs ) continue;
                this.emitter.emit("CREATE_CURSOR", { id, user: data.payload.users.find(u => u.id === id) } );
            }

            this.emitter.emit("SYNC", { user: data.payload.syncUser, users: data.payload.users, joined: data.payload.user });

            return false;
        }

        if ( data.action === actions.disconnect ) {
            console.log("disconnected: ", data.payload.id);
            this.emitter.emit("REMOVE_CURSOR", data.payload);

            this.connections.delete(data.id);
            return false;
        }

        if ( data.action === actions.mousemove ) {
            const cursor = this.connections.get(data.payload.user);
            if ( !data.payload ) return false;

            cursor.x(data.payload.x);
            cursor.y(data.payload.y);
        }

        this.emitter.emit(data.action, data.payload);
    }
}


export default new WebsocketConnector();