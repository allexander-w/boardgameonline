function Camera (stage, layer) {
    this.stage = stage;


    /* Общая камера сцены */
    this.camera = {
        move: (dx, dy) => {
            this.stage.position({
                x: this.stage.x() + dx,
                y: this.stage.y() + dy,
            });
        }
    }


    /* Центрирование сцены */
    const layoutClientRect = layer.getClientRect();
    const coordinates = {
        width: layoutClientRect.x + layoutClientRect.width,
        height: layoutClientRect.y + layoutClientRect.height
    }

    const isWidthMore = ( window.innerWidth / coordinates.width >= window.innerHeight / coordinates.height );
    const scale = isWidthMore ? window.innerHeight / coordinates.height : window.innerWidth / coordinates.width;
    this.stage.scale({ x: scale, y: scale });

    this.camera.move((window.innerWidth - (coordinates.width * scale)) / 2, 0);



    /* Перемещение с помощью кнопок wasd */
    const keyboardKeys = {
        W: false,
        S: false,
        D: false,
        A: false
    }

    let intervalMoving = null;

    const movingIntervalFunction = () => {
        const d = 10;

        const dx = keyboardKeys.A && keyboardKeys.D
            ? 0
            : keyboardKeys.A
                ? d
                : keyboardKeys.D
                    ? -d
                    : 0

        const dy = keyboardKeys.W && keyboardKeys.S
            ? 0
            : keyboardKeys.W
                ? d
                : keyboardKeys.S
                    ? -d
                    : 0

        this.camera.move(dx, dy);
    }

    document.addEventListener('keydown', (event) => {
        for ( const keyboardKey of Object.keys(keyboardKeys) ) {
            if ( (event.code === ('Key' + keyboardKey)) && !keyboardKeys[keyboardKey] ) {
                keyboardKeys[keyboardKey] = true;
                if ( !intervalMoving ) {
                    intervalMoving = setInterval(movingIntervalFunction, 10);
                }
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        for ( const keyboardKey of Object.keys(keyboardKeys) ) {
            if ( event.code === 'Key' + keyboardKey && keyboardKeys[keyboardKey] ) {
                keyboardKeys[keyboardKey] = false;

                if ( intervalMoving && Object.values(keyboardKeys).every(el => !el) ) {
                    clearInterval(intervalMoving);
                    intervalMoving = null;
                }
            }
        }
    });


    /* Изменение масштаба сцены */
    this.stage.on('wheel', (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.05;
        const oldScale = this.stage.scaleX();

        // Определяем новый масштаб
        const pointer = this.stage.getPointerPosition();
        const mousePointTo = {
            x: (pointer.x - this.stage.x()) / oldScale,
            y: (pointer.y - this.stage.y()) / oldScale,
        };

        const newScale =
            e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        this.stage.scale({ x: newScale, y: newScale });

        // Обновляем позицию, чтобы зум происходил относительно указателя мыши
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        this.stage.position(newPos);
        this.stage.batchDraw();
    });


    /* Перемещение сцены мышью */
    this.stage.on('mousedown', () => {
        this.stage.draggable(true);
    });

    this.stage.on('mouseup', () => {
        this.stage.draggable(false);
    });
}

export default Camera;