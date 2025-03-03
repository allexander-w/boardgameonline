export const objectFit = (shape, image, isSprite) => {
    const shapeWidth = shape.width();
    const shapeHeight = shape.height();
    const imgWidth = isSprite ? image.width / isSprite : image.width;
    const imgHeight = image.height;

    const scale = Math.min(shapeWidth / imgWidth, shapeHeight / imgHeight);
    const offset = {
        x: (imgWidth * scale - shapeWidth) / 2,
        y: (imgHeight * scale - shapeHeight) / 2
    }

    return { scale, offset };
}

export const objectFitCenter = (shape, image, div = 1) => {
    const shapeWidth = shape.width();
    const shapeHeight = shape.height();
    const imgWidth = image.width;
    const imgHeight = image.height;

    const scaleX = shapeWidth / imgWidth;
    const scaleY = shapeHeight / imgHeight;
    const scale = Math.max(scaleX, scaleY) / div;

    const offsetX = (shapeWidth - imgWidth * scale) / 2 / scale;
    const offsetY = (shapeHeight - imgHeight * scale) / 2 / scale;

    const offset = { x: -offsetX, y: -offsetY };

    return { scale, offset };
}