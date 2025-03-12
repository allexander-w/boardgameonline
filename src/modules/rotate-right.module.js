import ws from "../core/websocket";

export default {

    rotate() {
        if ( !this.selected || !this.selected.element ) return false;
        ws.receiver.send("rotate", { id: this.selected.element._id });

        const rotationDeg = this.selected.element.rotation() === 90 ? 0 : this.selected.element.rotation() + 90;
        this.selected.element.rotation(rotationDeg);
    },

    initialization() {
        ws.emitter.on("keydown", (e) => {
            if ( e.code === 'KeyR' ) this.rotate();
        })
    }

}