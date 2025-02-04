import './style.css';
import Konva from "konva";


const stage = new Konva.Stage({
    container: 'app', // ID контейнера
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true, // Позволяем перетаскивать сцену
});

const layer = new Konva.Layer();
stage.add(layer);

layer.draw();

// Обработчик для зума
stage.on('wheel', (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const oldScale = stage.scaleX();

    // Определяем новый масштаб
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale =
        e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    stage.scale({ x: newScale, y: newScale });

    // Обновляем позицию, чтобы зум происходил относительно указателя мыши
    const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
});

// Перемещение камеры с помощью мыши
stage.on('mousedown', () => {
    stage.draggable(true);
});

stage.on('mouseup', () => {
    stage.draggable(false);
});

// Обновление размеров сцены при изменении окна
window.addEventListener('resize', () => {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
});