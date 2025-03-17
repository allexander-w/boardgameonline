import DuosideElement from "./duoside";

function ResourceElement(x, y, bank) {
    DuosideElement.apply(this, arguments);

    this.toHand = (e) => {
        if ( e.evt.ctrlKey || e.evt.metaKey && e.target?.attrs?.resource_id ) {
            bank.selectResourceToBank(e.target?.attrs?.resource_id);
            this.destroyElement();
        }
    }

    this.element.on("click", this.toHand);
}

export default ResourceElement;