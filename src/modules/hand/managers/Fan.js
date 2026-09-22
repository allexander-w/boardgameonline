export class FanController {
    constructor(containerEl) {
        this.container = containerEl;
        this.viewport = containerEl.querySelector('.fan-viewport');
        this.track = containerEl.querySelector('.fan-track');

        this.cards = [];
        this.currentRotation = 0;
        this.targetRotation = 0;
        this.animFrameId = null;

        this.mouseX = -1;
        this.mouseY = -1;

        this.init();
    }

    init() {
        this.cards = Array.from(this.track.querySelectorAll('.fan-card'));
        if (this.cards.length === 0) return;

        this.isCarouselActive = this.cards.length >= 4;

        if (this.isCarouselActive) {
            this.angleStep = Math.min(10, Math.max(3.5, 110 / this.cards.length));
            this.bindEvents();
            this.startLoop();
        } else {
            this.renderStaticLayout();
        }
    }

    bindEvents() {
        this.onWheel = (e) => {
            if (!this.isCarouselActive) return;
            e.preventDefault();
            const delta = e.deltaY || e.deltaX;
            this.targetRotation += delta * 0.025;
        };

        this.onMouseMove = (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        };

        this.onMouseLeave = () => {
            this.mouseX = -1;
            this.mouseY = -1;
        };

        const vp = this.viewport;
        if (vp) {
            vp.addEventListener('wheel', this.onWheel, { passive: false });
            vp.addEventListener('mousemove', this.onMouseMove);
            vp.addEventListener('mouseleave', this.onMouseLeave);
        }
    }

    startLoop() {
        const update = () => {
            this.currentRotation += (this.targetRotation - this.currentRotation) * 0.04;
            this.renderLayout();
            this.animFrameId = requestAnimationFrame(update);
        };
        update();
    }

    renderLayout() {
        const count = this.cards.length;
        if (count === 0) return;

        // Ищем карту ровно под курсором
        let hoveredCard = null;
        if (this.mouseX >= 0 && this.mouseY >= 0) {
            const el = document.elementFromPoint(this.mouseX, this.mouseY);
            if (el) {
                hoveredCard = el.closest('.fan-card');
            }
        }

        const totalSpan = count * this.angleStep;

        this.cards.forEach((card, index) => {
            let baseAngle = (index * this.angleStep) + this.currentRotation;
            let normalizedAngle = ((baseAngle % totalSpan) + totalSpan) % totalSpan;
            let finalAngle = normalizedAngle - (totalSpan / 2);

            const distFromCenter = Math.abs(finalAngle);
            const baseZIndex = Math.round(1000 - distFromCenter * 20);

            // Меняем CSS переменную угла для трансформы
            card.style.setProperty('--angle', `${finalAngle}deg`);

            if (card === hoveredCard) {
                card.classList.add('is-hovered');
                card.style.zIndex = '9999';
            } else {
                card.classList.remove('is-hovered');
                card.style.zIndex = baseZIndex;
            }
        });
    }

    renderStaticLayout() {
        const count = this.cards.length;
        if (count === 0) return;

        const staticAngleStep = 7;
        const startAngle = -((count - 1) * staticAngleStep) / 2;

        this.cards.forEach((card, index) => {
            const finalAngle = startAngle + (index * staticAngleStep);
            card.style.setProperty('--angle', `${finalAngle}deg`);
            card.style.zIndex = index + 1;

            card.addEventListener('mouseenter', () => card.classList.add('is-hovered'));
            card.addEventListener('mouseleave', () => card.classList.remove('is-hovered'));
        });
    }

    destroy() {
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        const vp = this.viewport;
        if (vp) {
            vp.removeEventListener('wheel', this.onWheel);
            vp.removeEventListener('mousemove', this.onMouseMove);
            vp.removeEventListener('mouseleave', this.onMouseLeave);
        }
    }
}