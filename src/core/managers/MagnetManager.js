import Konva from "konva";

class MagnetManager {
    constructor(layersManager, cardsManager) {
        this.layersManager = layersManager;
        this.cardsManager = cardsManager;

        this.boardLayer = layersManager.getLayer("board");
        this.active = null;
    }

    start(card) {
        const magnet = card.element.getAttr("magnet");

        if (!magnet) {
            this.active = null;
            return;
        }

        this.active = {
            card,
            target: null,
            side: null,
        };
    }

    move() {
        if (!this.active) return;

        const { card } = this.active;
        const magnet = card.element.getAttr("magnet");

        const target = this.findTarget(card, magnet);

        if (!target) {
            this.clearHighlight();
            this.active.target = null;
            this.active.side = null;
            return;
        }

        this.active.target = target.card;
        this.active.side = target.side;

        this.highlight(target.card.element, target.side);
    }

    suspend() {
        if (!this.active) return;

        this.clearHighlight();
        this.active.target = null;
        this.active.side = null;
    }

    end() {
        if (!this.active) return false;

        const { card, target, side } = this.active;
        this.clearHighlight();

        let snapped = false;

        if (target && side) {
            this.snap(card.element, target.element, side);
            snapped = true;
        }

        this.active = null;
        return snapped;
    }


    findTarget(card, magnet) {
        const source = card.element;
        const sourceBox = source.getClientRect({
            relativeTo: this.boardLayer
        });

        let result = null;
        let minDistance = Infinity;

        for (const target of this.boardLayer.getChildren()) {
            if (target === source) continue;

            const targetCard = this.cardsManager.getCard(target.id());
            if (!targetCard) continue;

            const targetMagnet = target.getAttr("magnet");

            if (!targetMagnet) continue;
            if (targetMagnet.group !== magnet.group) continue;

            const targetBox = target.getClientRect({
                relativeTo: this.boardLayer
            });

            const candidates = [
                {
                    side: "right",
                    distance: Math.abs(
                        sourceBox.x -
                        (targetBox.x + targetBox.width)
                    ),
                    offset: Math.abs(
                        sourceBox.y + sourceBox.height / 2 -
                        (targetBox.y + targetBox.height / 2)
                    ),
                },
                {
                    side: "left",
                    distance: Math.abs(
                        sourceBox.x + sourceBox.width -
                        targetBox.x
                    ),
                    offset: Math.abs(
                        sourceBox.y + sourceBox.height / 2 -
                        (targetBox.y + targetBox.height / 2)
                    ),
                },
                {
                    side: "bottom",
                    distance: Math.abs(
                        sourceBox.y -
                        (targetBox.y + targetBox.height)
                    ),
                    offset: Math.abs(
                        sourceBox.x + sourceBox.width / 2 -
                        (targetBox.x + targetBox.width / 2)
                    ),
                },
                {
                    side: "top",
                    distance: Math.abs(
                        sourceBox.y + sourceBox.height -
                        targetBox.y
                    ),
                    offset: Math.abs(
                        sourceBox.x + sourceBox.width / 2 -
                        (targetBox.x + targetBox.width / 2)
                    ),
                },
            ];

            for (const candidate of candidates) {
                if (
                    candidate.distance > magnet.distance ||
                    candidate.offset > magnet.distance
                ) {
                    continue;
                }

                const score = candidate.distance + candidate.offset;

                if (score < minDistance) {
                    minDistance = score;

                    result = {
                        card: targetCard,
                        side: candidate.side,
                    };
                }
            }
        }

        return result;
    }

    snap(source, target, side) {
        const sourceBox = source.getClientRect({ relativeTo: this.boardLayer });
        const targetBox = target.getClientRect({ relativeTo: this.boardLayer });

        let targetX = sourceBox.x;
        let targetY = sourceBox.y;

        switch (side) {
            case "left":
                targetX = targetBox.x - sourceBox.width;
                targetY = targetBox.y + (targetBox.height - sourceBox.height) / 2;
                break;

            case "right":
                targetX = targetBox.x + targetBox.width;
                targetY = targetBox.y + (targetBox.height - sourceBox.height) / 2;
                break;

            case "top":
                targetX = targetBox.x + (targetBox.width - sourceBox.width) / 2;
                targetY = targetBox.y - sourceBox.height;
                break;

            case "bottom":
                targetX = targetBox.x + (targetBox.width - sourceBox.width) / 2;
                targetY = targetBox.y + targetBox.height;
                break;
        }

        const dx = targetX - sourceBox.x;
        const dy = targetY - sourceBox.y;

        const currentPos = source.position();
        source.position({
            x: currentPos.x + dx,
            y: currentPos.y + dy,
        });
    }

    highlight(element, side) {
        this.clearHighlight();

        const box = element.getClientRect({
            relativeTo: this.boardLayer
        });

        const thickness = 20;
        const shadowBlur = 16;

        const rect = new Konva.Rect({
            name: "magnet-highlight",
            listening: false,
            // Мягкое свечение вокруг полоски
            shadowColor: "#a5f3fc", // Светло-голубой неон
            shadowBlur: shadowBlur,
            shadowOpacity: 0.8,
            cornerRadius: 3,
        });

        // Цвета градиента: прозрачный по краям -> светлый в центре -> прозрачный по краям
        const colorStops = [
            0, "rgba(255, 255, 255, 0)",       // Край: полностью прозрачный
            0.2, "rgba(224, 242, 254, 0.5)",   // Очень светлый голубой (полупрозрачный)
            0.5, "rgba(255, 255, 255, 0.95)",  // Центр: яркий почти чистый белый
            0.8, "rgba(224, 242, 254, 0.5)",   // Очень светлый голубой
            1, "rgba(255, 255, 255, 0)"        // Край: полностью прозрачный
        ];

        switch (side) {
            case "left":
                rect.setAttrs({
                    x: box.x - thickness / 2,
                    y: box.y,
                    width: thickness,
                    height: box.height,
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: 0, y: box.height },
                    fillLinearGradientColorStops: colorStops,
                });
                break;

            case "right":
                rect.setAttrs({
                    x: box.x + box.width - thickness / 2,
                    y: box.y,
                    width: thickness,
                    height: box.height,
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: 0, y: box.height },
                    fillLinearGradientColorStops: colorStops,
                });
                break;

            case "top":
                rect.setAttrs({
                    x: box.x,
                    y: box.y - thickness / 2,
                    width: box.width,
                    height: thickness,
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: box.width, y: 0 },
                    fillLinearGradientColorStops: colorStops,
                });
                break;

            case "bottom":
                rect.setAttrs({
                    x: box.x,
                    y: box.y + box.height - thickness / 2,
                    width: box.width,
                    height: thickness,
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: box.width, y: 0 },
                    fillLinearGradientColorStops: colorStops,
                });
                break;
        }

        this.boardLayer.add(rect);
        this.highlightElement = rect;
        rect.moveToTop();
    }

    clearHighlight() {
        if (this.highlightElement) {
            this.highlightElement.destroy();
            this.highlightElement = null;
        }
    }
}

export default MagnetManager;