class CameraPresetsUI {
    constructor(onSelect) {
        this.node = document.createElement("div");
        this.node.className = "camera-views";
        this.node.hidden = true;

        this.node.addEventListener("click", e => {
            const btn = e.target.closest(".camera-view-btn");
            if ( !btn ) return;

            btn.blur();
            onSelect(Number(btn.dataset.index));
        });

        document.body.appendChild(this.node);
    }

    render(items, active) {
        /* Только общий вид - переключать нечего */
        this.node.hidden = items.length < 2;

        this.node.innerHTML = items.map((item, i) => `
            <button class="camera-view-btn${ i === active ? " active" : "" }" data-index="${ i }">
                <span class="camera-view-key">${ i + 1 }</span>${ item.name }
            </button>
        `).join("");
    }
}

export default CameraPresetsUI;