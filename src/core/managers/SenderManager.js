import { serialize } from "../../../shared/utils/serialize.util.mjs";

class SenderManager {
    constructor(adapter, usersManager) {
        this.usersManager = usersManager;
        this.adapter = adapter;
        this.stack = [];
    }

    send(action, options) {
        if ( !this.adapter.ready ) {
            this.stackAction({ action, options });
            return false;
        }

        const payload = { action, payload: { user: this.usersManager.user.id, ...options } };
        this.adapter.socket.send( serialize(payload) );

        return true;
    }

    executeStack() {
        for ( const event of this.stack ) {
            this.send(event.action, event.options);
        }

        this.stack = [];
    }

    stackAction(action) {
        this.stack.push(action);
    }
}

export default SenderManager;