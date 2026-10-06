import ResourceCard from "../../entities/resource/ResourceCard";
import { cardsManager, zoneManager, layersManager } from "../index";

/**
 * Единая точка загрузки сохранения (серверный sync и локальное «Загрузить»).
 * Порядок важен: сначала все карты и их координаты, и только потом привязки зон.
 */
export function applySave(save, { hands = [] } = {}) {
    const elements = save.elements || [];
    const resources = [...(save.resources || [])]
        .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

    layersManager.clearCacheAllGroups();

    // 1. Обычные элементы (их forLoad больше НЕ трогает ZoneManager)
    const missing = [];
    for (const el of elements) {
        const card = cardsManager.getCard(el.id);
        if (card) card.forLoad(el);
        else missing.push(el.id);
    }

    /* Карточки, которых нет на доске, молча терялись, а затем пропадали
       из следующего автосейва — теперь хотя бы видно в консоли. */
    if (missing.length) {
        console.warn(`[save] ${missing.length} элемент(ов) из сохранения не найдено на доске:`, missing.slice(0, 10));
    }

    // 2. Ресурсы: существующие обновляем, а не пропускаем
    for (const el of resources) {
        const existing = cardsManager.getCard(el.id);
        if (existing) {
            existing.forLoad(el);
            continue;
        }

        const options = {
            draggable: true,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            rotation: el.rotation || 0,
            opacity: 1,
            id: el.id,
            kind: el.kind || "resource",
        };
        cardsManager.createCard(new ResourceCard({ front: el.src }, options));
    }

    // 3. Привязки зон — для элементов и ресурсов сразу
    zoneManager.restoreAll([...elements, ...resources]);

    // 4. Карты в руках скрываем после привязок
    for (const id of hands) {
        cardsManager.getCard(id)?.element.hide();
    }

    layersManager.cacheAllGroups();
}