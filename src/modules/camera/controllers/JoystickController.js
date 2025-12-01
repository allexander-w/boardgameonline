class JoystickController {
    constructor(camera) {
        this.camera = camera;

        this.base = document.getElementById("joystick");
        this.stick = document.getElementById("stick");

        this.baseRect = null;
        this.active = false;

        this.maxDistance = 40;          // размер джойстика
        this.maxSpeed = 8;              // максимальная скорость камеры
        this.interval = null;

        this.initEvents();
    }

    initEvents() {
        this.base.addEventListener("touchstart", (e) => this.start(e));
        this.base.addEventListener("touchmove", (e) => this.move(e));
        this.base.addEventListener("touchend", () => this.end());
        this.base.addEventListener("touchcancel", () => this.end());
    }

    start(e) {
        this.active = true;
        this.baseRect = this.base.getBoundingClientRect();
        this.startMoving();
        this.move(e);
    }

    move(e) {
        if (!this.active) return;

        const touch = e.touches[0];

        const cx = this.baseRect.left + this.baseRect.width / 2;
        const cy = this.baseRect.top + this.baseRect.height / 2;

        let dx = touch.clientX - cx;
        let dy = touch.clientY - cy;

        const dist = Math.hypot(dx, dy);
        const limited = Math.min(dist, this.maxDistance);

        const angle = Math.atan2(dy, dx);

        const stickX = Math.cos(angle) * limited;
        const stickY = Math.sin(angle) * limited;

        // Двигаем визуально стик
        this.stick.style.transform = `translate(${stickX}px, ${stickY}px)`;

        // Нормализуем [-1..1]
        this.inputX = stickX / this.maxDistance;
        this.inputY = stickY / this.maxDistance;
    }

    startMoving() {
        if (this.interval) return;

        this.interval = setInterval(() => {
            if (!this.active) return;

            const dx = - this.inputX * this.maxSpeed;
            const dy = - this.inputY * this.maxSpeed;

            this.camera.move(dx, dy);
        }, 16); // ~60fps
    }

    end() {
        this.active = false;
        this.inputX = 0;
        this.inputY = 0;

        this.stick.style.transform = "translate(0,0)";

        clearInterval(this.interval);
        this.interval = null;
    }
}

export default JoystickController;