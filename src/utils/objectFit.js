export const objectFit = (shape, image, isSprite) => {
    const shapeWidth = shape.width();
    const shapeHeight = shape.height();
    const imgWidth = isSprite ? image.width / 2 : image.width;
    const imgHeight = image.height;

    const scale = Math.min(shapeWidth / imgWidth, shapeHeight / imgHeight);
    const offset = {
        x: (imgWidth * scale - shapeWidth) / 2,
        y: (imgHeight * scale - shapeHeight) / 2
    }

    return { scale, offset };
}