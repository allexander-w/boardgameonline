export default {
    selected: null,

    selectingCard(e) {
        if ( !e.target.attrs.parentID ) {
            this.selected = null;
            return false;
        }

        const heap = this.heaps.get(e.target.attrs.parentID);
        const element = heap.get_element(e.target.attrs.id);

        this.selected = element;
    },

    initialization() {}
}