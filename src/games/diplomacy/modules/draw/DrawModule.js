import {layersManager, usersManager} from "../../../../core";
import Konva from "konva";

export class DrawModule {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.stage = layersManager.stage;
        this.boardLayer = layersManager.getLayer("board");

        this.isDrawing = false;
        this.currentArrow = null;
        this.startPoint = null;

        this.stage.on("click", this.startDraw.bind(this));
        this.stage.on("mousemove", this.onDrawing.bind(this));
        this.boardLayer.on("contextmenu", this.remove.bind(this));
    }
    
    startDraw(e) {
        if (e.evt.button !== 0) return;

        if ( this.isDrawing ) {
            this.finishDraw();
            return;
        }

        if ( !(e.evt.altKey || e.evt.shiftKey) ) return;

        const currentUserCursorColor = usersManager.getUser(usersManager.user.id);
        console.log(currentUserCursorColor);

        let color = 'blue';
        if (e.evt.shiftKey) color = 'yellow';
        if (e.evt.altKey) color = 'red';

        const pos = this.stage.getRelativePointerPosition();
        this.startPoint = [pos.x, pos.y];
        this.isDrawing = true;

        this.currentArrow = new Konva.Arrow({
            points: [pos.x, pos.y, pos.x, pos.y],
            pointerLength: 10,
            pointerWidth: 10,
            fill: currentUserCursorColor.cursorColor,
            stroke: color,
            strokeWidth: 3,
        });

        this.boardLayer.add(this.currentArrow);
    }

    finishDraw() {
        if (!this.isDrawing) return;

        this.onDrawing();
        this.isDrawing = false;
        this.currentArrow = null;
    }

    onDrawing() {
        if (!this.isDrawing || !this.currentArrow) return;

        const pos = this.stage.getRelativePointerPosition();
        this.currentArrow.points([...this.startPoint, pos.x, pos.y]);
        this.boardLayer.batchDraw();
    }

    remove(e) {
        const target = e.target;

        if (target instanceof Konva.Arrow) {
            e.evt.preventDefault();

            target.destroy();
            this.boardLayer.draw();
        }
    }
}