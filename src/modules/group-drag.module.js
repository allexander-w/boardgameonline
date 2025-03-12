import ws from "../core/websocket";

export default {

    group: [],

    findElementsAbove(target) {
        const targetBox = target.getClientRect();
        return this.board.stage.find('Rect').filter((other) => {
            if (other === target) return false; // Пропускаем сам элемент
            if (!other.attrs.custom) return false;
            if (other.zIndex() < target.zIndex()) return false;

            const otherBox = other.getClientRect();
            console.log(targetBox.x);

            return !(
                targetBox.x + targetBox.width < otherBox.x + (otherBox.width / 2) ||
                targetBox.x + (otherBox.width / 2) > otherBox.x + otherBox.width ||
                targetBox.y + targetBox.height < otherBox.y + (otherBox.height / 2) ||
                targetBox.y + (otherBox.height / 2) > otherBox.y + otherBox.height
            );
        });
    },

    groupElements(target) {
        const elementsAbove = this.findElementsAbove(target);
        if (elementsAbove.length === 0) {
            target.moveToTop();
            return;
        }

        this.group = elementsAbove.map(el => ({ offset: { x: target.x() - el.x(), y: target.y() - el.y() }, element: el }));
    },


    ungroupElements(target) {
        if (!this.group.length) return;
        this.group = [];
    },

    dragElements(target) {
        if (!this.group.length) return;
        ws.receiver.send('groupmove', { elements: this.group.map(el => ({ id: el.element._id, offset: el.offset })), target: { x: target.x(), y: target.y() } });

        this.group.forEach(el => {
            el.element.x(target.x() - el.offset.x);
            el.element.y(target.y() - el.offset.y);
            el.element.moveToTop();
        })
    },

    initialization() {
        ws.emitter.on("groupmove", (data) => {
            data.elements.forEach(element => {
                const el = this.game.children.find(el => el._id === element.id);

                el.x(data.target.x - element.offset.x);
                el.y(data.target.y - element.offset.y);
                el.moveToTop();
            })
        })

        ws.emitter.on("DRAGMOVE", (e) => {
            if ( e.target.attrs.parentID ) {
                this.dragElements(e.target);
            }
        });

        ws.emitter.on("DRAGSTART", (e) => {
            if ( e.target.attrs.parentID ) {
                this.groupElements(e.target);
            }
        });

        ws.emitter.on("DRAGEND", (e) => {
            if ( e.target.attrs.parentID ) {
                this.ungroupElements(e.target);
            }
        });
    }

}