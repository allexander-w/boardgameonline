import Cursor from "../ui/cursors/Cursor";
import Konva from "konva";

class CursorsManager {
    constructor(usersManager, layersManager, senderManager) {
        this.usersManager = usersManager;
        this.layersManager = layersManager;
        this.senderManager = senderManager;

        this.boardLayer = this.layersManager.getLayer("board");
        this.boardLayer.on("mousemove", this.move.bind(this));
    }

    create({ id, user }) {
        const cursor = new Cursor(Konva, this.layersManager, { id, user });
        this.usersManager.setUser(id, cursor);
    }

    remove(id) {
        const cursor = this.usersManager.getUser(id);
        cursor.destroy();
    }

    move() {
        const pointerPos = this.boardLayer.getRelativePointerPosition();
        this.senderManager.send("api.cursors.move", { x: pointerPos.x, y: pointerPos.y });
    }

    remoteMove(data) {
        if ( !data ) return false;

        const cursor = this.usersManager.getUser(data.user);
        cursor.setPosition(data.x, data.y);
    }
}

export default CursorsManager;