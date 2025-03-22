class Cursor {
    constructor(CanvasAdapter, layersManager, user) {
        this.CanvasAdapter = CanvasAdapter;
        this.layersManager = layersManager;
        this.user = user;
        this.cursor = null;

        this.cursorsLayer = this.layersManager.getLayer("cursors");
        this.createCursor();
    }

    static getRandomColor() {
        const colors = ["orange", "red", "coral", "gold", "white"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createCursor() {
        const cursor = new this.CanvasAdapter.Path({
            data: "M16.5744 19.1999L12.6361 15.2616L11.4334 16.4643C10.2022 17.6955 9.58656 18.3111 8.92489 18.1658C8.26322 18.0204 7.96225 17.2035 7.3603 15.5696L5.3527 10.1205C4.15187 6.86106 3.55146 5.23136 4.39141 4.39141C5.23136 3.55146 6.86106 4.15187 10.1205 5.35271L15.5696 7.3603C17.2035 7.96225 18.0204 8.26322 18.1658 8.92489C18.3111 9.58656 17.6955 10.2022 16.4643 11.4334L15.2616 12.6361L19.1999 16.5744C19.6077 16.9821 19.8116 17.186 19.9058 17.4135C20.0314 17.7168 20.0314 18.0575 19.9058 18.3608C19.8116 18.5882 19.6077 18.7921 19.1999 19.1999C18.7921 19.6077 18.5882 19.8116 18.3608 19.9058C18.0575 20.0314 17.7168 20.0314 17.4135 19.9058C17.186 19.8116 16.9821 19.6077 16.5744 19.1999Z",
            fill: Cursor.getRandomColor(),
            scaleY: 5,
            scaleX: 5,
            stroke: 'white',
            strokeWidth: 1,
        });

        const nickname = new this.CanvasAdapter.Text({
            text: this.user.name,
            fontSize: 32,
            fontFamily: 'Arial Black',
            fill: 'white',
            align: 'left',
            width: 300,
            height: 24,
            stroke: "black",
            strokeWidth: 1,
            verticalAlign: 'middle',
        });

        const group = new this.CanvasAdapter.Group({
            x: 0,
            y: 0,
        });

        nickname.y(cursor.height() + 110);
        nickname.x(120);
        group.add(cursor);
        group.add(nickname);

        this.cursorsLayer.add(group);
        group.moveToTop();

        this.cursor = group;
    }

    setPosition(x, y) {
        this.cursor.x(x);
        this.cursor.y(y);
    }

    destroy() {
        this.cursor.destroy();
    }
}

export default Cursor;