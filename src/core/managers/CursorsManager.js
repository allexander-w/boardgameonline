import Cursor from "../ui/cursors/Cursor";
import Konva from "konva";

class CursorsManager {
    constructor(usersManager, layersManager, senderManager) {
        this.usersManager = usersManager;
        this.layersManager = layersManager;
        this.senderManager = senderManager;

        this.boardStage = this.layersManager.stage;
        this.boardStage.on("mousemove", this.move.bind(this));
    }

    create({ id, user }) {
        const cursor = new Cursor(Konva, this.layersManager, { id, ...user });
        this.usersManager.setUser(id, { ...user, cursor });
    }

    remove(id) {
        const user = this.usersManager.getUser(id);
        user.cursor.destroy();
    }

    move() {
        const pointerPos = this.boardStage.getRelativePointerPosition();
        this.senderManager.send("api.cursors.move", { x: pointerPos.x, y: pointerPos.y });
    }

    remoteMove(data) {
        if ( !data ) return false;

        const user = this.usersManager.getUser(data.user);
        if ( user ) user.cursor.setPosition(data.x, data.y);
    }
}

export default CursorsManager;