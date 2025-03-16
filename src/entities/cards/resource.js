import DuosideElement from "./duoside";

function ResourceElement(x, y, bank) {
    DuosideElement.apply(this, arguments);

    this.toHand = (e) => {
        if ( e.evt.ctrlKey || e.evt.metaKey && e.target?.attrs?.resource_id ) {
            console.log(e.target?.attrs?.resource_id);
            console.log(bank);
        }
    }

    this.element.on("click", this.toHand);
}

export default ResourceElement;