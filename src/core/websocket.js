import mitt from "mitt";
import {serialize, unserialize} from "../../shared/utils/serialize.util.mjs";
import actions from "../../shared/actions/action.types.mjs";
import gameInterface from "../modules/interface-module/index";
import config from "../config";

function WebsocketConnector() {
    this.socket = null;
    this.connections = new Map();
    this.currentConnection = null;
    this.currentSynced = false;

    this.emitter = mitt();

    this.stack = [];
    this.ready = () => this.socket?.readyState === 1;

    let notificationsModule = {};



    this.receiver = {
        send: (action, options) => {
            if ( !this.ready() ) {
                this.stack.push({ action, options });
                return false;
            }

            const payload = { action, payload: { user: this.currentConnection, ...options } };
            this.socket.send( serialize(payload) );
        }
    }

    this.initializationWebsockets = () => {
        this.socket = new WebSocket(config.ws);

        this.emitter.on("USER_INFO", (user) => {
            console.log("connected", user);
            this.receiver.send(actions.connected, user);
        })

        this.socket.onopen = () => {
            if ( !notificationsModule.notifications ) notificationsModule = gameInterface.getModule("notifications");
            notificationsModule.notify("Вы успешно подключились к игре!");

            this.emitter.emit("REQUEST_USER_INFO");
        }

        this.socket.onclose = (e) => {
            if ( !notificationsModule.notifications ) notificationsModule = gameInterface.getModule("notifications");
            notificationsModule.notify("Соединение потеряно...");

            console.log(e)
            this.emitter.emit("CLOSE_CONNECTION");
        }

        this.socket.onmessage = (event) => {
            const data = unserialize(event.data);
            if ( data.action === actions.connected ) {
                this.currentConnection = data.payload.user?.id;
                console.log('your connected id: ', this.currentConnection);

                if ( !notificationsModule.notifications ) notificationsModule = gameInterface.getModule("notifications");
                notificationsModule.notify("Вебсокеты завелись, твой айди: " + this.currentConnection);

                this.stack.forEach(msg => this.receiver.send(msg.action, msg.options));

                return false;
            }

            if ( data.action === actions.join ) {
                console.log('action join', data.payload);

                if ( this.currentConnection !== data.payload.user.id ) {
                    if ( !notificationsModule.notifications ) notificationsModule = gameInterface.getModule("notifications");
                    notificationsModule.notify("Опа, " + data.payload.user.name + " подключился!");
                }

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
                console.log("disconnected: ", data.payload.id, data.payload);
                this.emitter.emit("REMOVE_CURSOR", data.payload);

                this.connections.delete(data.id);

                if ( !notificationsModule.notifications ) notificationsModule = gameInterface.getModule("notifications");
                notificationsModule.notify("Опа, " + data.payload.name + " отсоединился...");

                return false;
            }

            if ( data.action === actions.mousemove ) {
                const cursor = this.connections.get(data.payload.user);
                if ( !data.payload ) return false;

                cursor.x(data.payload.x);
                cursor.y(data.payload.y);
            }

            if ( data.action === 'api.bank.creation' ) {
                if ( !notificationsModule.notifications ) notificationsModule = gameInterface.getModule("notifications");
                notificationsModule.notify(data.payload.message);
            }

            this.emitter.emit(data.action, data.payload);
        }
    }

}


export default new WebsocketConnector();