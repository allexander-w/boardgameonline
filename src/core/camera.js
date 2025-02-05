function Camera (layer) {
    this.layer = layer;

    this.move = (dx, dy) => {
        this.layer.x(this.layer.x() + dx);
        this.layer.y(this.layer.y() + dy);
    }
}

export default Camera;