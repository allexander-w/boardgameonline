import Konva from "konva";
import {objectFit, objectFitCenter} from "../utils/objectFit";
import { emitter } from "../core";


export const counterElement = (options = {}) => {
    const width = options.width || 160;
    const height = options.height || 160;

    // Настройки расположения элементов относительно подложки (в относительных единицах 0..1 или абсолютных пикселях)
    // По умолчанию настроено под вашу картинку:
    const textConfig = {
        x: options.textLayout?.x ?? 0,
        y: options.textLayout?.y ?? height * 0.65,
        width: options.textLayout?.width ?? width,
        fontSize: options.textLayout?.fontSize ?? Math.round(height * 0.16),
        fill: options.textLayout?.fill ?? "#ffea9f",
        align: options.textLayout?.align ?? "center",
    };

    const decBtnConfig = {
        x: options.buttonsLayout?.dec?.x ?? width * 0.08,
        y: options.buttonsLayout?.dec?.y ?? height * 0.66,
        width: options.buttonsLayout?.dec?.w ?? width * 0.25,
        height: options.buttonsLayout?.dec?.h ?? height * 0.22,
    };

    const incBtnConfig = {
        x: options.buttonsLayout?.inc?.x ?? width * 0.67,
        y: options.buttonsLayout?.inc?.y ?? height * 0.66,
        width: options.buttonsLayout?.inc?.w ?? width * 0.25,
        height: options.buttonsLayout?.inc?.h ?? height * 0.22,
    };

    // Группа-контейнер для счетчика
    const group = new Konva.Group({
        x: options.x || 0,
        y: options.y || 0,
        width: width,
        height: height,
        offsetX: width / 2,
        offsetY: height / 2,
        draggable: true,
        count: options.initialValue || 0,
        perfectDrawEnabled: false,
        ...options,
    });

    // 1. Фонавая картинка
    const bg = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        cornerRadius: 10,
        fillPatternRepeat: "no-repeat",
        name: "background",
    });
    group.add(bg);

    // 2. Текст значения
    const text = new Konva.Text({
        x: textConfig.x,
        y: textConfig.y,
        width: textConfig.width,
        text: String(group.attrs.count),
        fontSize: textConfig.fontSize,
        fontStyle: "bold",
        fontFamily: "Arial, sans-serif",
        fill: textConfig.fill,
        align: textConfig.align,
        shadowColor: "black",
        shadowBlur: 4,
        shadowOffset: { x: 1, y: 1 },
        shadowOpacity: 0.8,
        name: "counterText",
    });
    group.add(text);

    // 3. Зона кнопки "-" (уменьшение)
    const btnDecrement = new Konva.Rect({
        x: decBtnConfig.x,
        y: decBtnConfig.y,
        width: decBtnConfig.width,
        height: decBtnConfig.height,
        fill: "transparent",
        name: "btnDecrement",
    });

    // 4. Зона кнопки "+" (увеличение)
    const btnIncrement = new Konva.Rect({
        x: incBtnConfig.x,
        y: incBtnConfig.y,
        width: incBtnConfig.width,
        height: incBtnConfig.height,
        fill: "transparent",
        name: "btnIncrement",
    });

    group.add(btnDecrement);
    group.add(btnIncrement);

    // Вспомогательный метод обновления значения
    group.count = function (val) {
        if (val === undefined) return group.attrs.count;
        group.attrs.count = val;
        text.text(String(val));
    };

    return group;
};

export const loadImageCounterElement = (counterGroup, src) => {
    return new Promise((resolve) => {
        emitter.emit("screen.preloader.loading", src);
        const image = new Image();
        const bgNode = counterGroup.findOne(".background");

        image.onload = () => {
            if (bgNode) {
                const { scale, offset } = objectFit(bgNode, image, false);
                bgNode.fillPatternScale({ x: scale, y: scale });
                bgNode.fillPatternOffset(offset);
                bgNode.fillPatternImage(image);
            }

            emitter.emit("screen.preloader.loaded", src);
            resolve(image);
        };

        image.onerror = () => {
            emitter.emit("screen.preloader.loaded", null);
        };

        image.src = src;
    });
};

export const duosideElement = (options) => {
        const el = new Konva.Rect({
            x: 0,
            y: 0,
            offsetX: (options.width || 120) / 2,
            offsetY: (options.height || 120) / 2,
            width: 120,
            height: 120,
            fillPatternRepeat: "no-repeat",
            cornerRadius: 10,
            draggable: true,
            flipped: false,
            perfectDrawEnabled: false,

            ...options
        });

        el.flipped = (flipped) => {
            if ( flipped === undefined ) return el.attrs.flipped;
            el.attrs.flipped = flipped;
        }

        return el;
}

export const diceElement = (options = {}) => {
    return new Konva.Rect({
        x: -120,
        y: -120,
        offsetX: (options.width || 100) / 2,
        offsetY: (options.height || 100) / 2,
        width: 100,
        height: 100,
        fillPatternRepeat: "no-repeat",
        cornerRadius: 10,
        draggable: true,


        ...options
    });
}

export const loadImageDuosideElement = (duoside, src, isSprite) => (new Promise((resolve) => {
    emitter.emit("screen.preloader.loading", src);
    const image = new Image();

    image.onload = () => {
        const { scale, offset } = objectFit(duoside, image, isSprite);
        duoside.fillPatternScale({ x: scale, y: scale });
        duoside.fillPatternOffset(offset);

        duoside.fillPatternImage(image);

        emitter.emit("screen.preloader.loaded", src);
        resolve(image);
    }

    image.onerror = () => {
        emitter.emit("screen.preloader.loaded", null);
    }

    image.src = src;
}))