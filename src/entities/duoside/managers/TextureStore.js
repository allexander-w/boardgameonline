/**
 * Хранилище текстур карт:
 *  - превью (маленькие копии) живут всегда, одна копия на один URL;
 *  - полные картинки грузятся по требованию и выгружаются, когда не нужны.
 * Реальные картинки в 4 раза больше размеров карт в манифесте, держать все сразу нельзя.
 */

/* Ширина превью в device-px: карты, которые на экране не шире, рисуются из превью */
export const THUMB_WIDTH = 96;

/* UIManager карт, у которых сейчас в памяти есть полная текстура */
export const residentFulls = new Set();

const thumbs = new Map();

export const thumbFor = (url, image) => {
    if ( thumbs.has(url) ) return thumbs.get(url);

    const width = Math.min(image.width, THUMB_WIDTH);
    const height = Math.max(1, Math.round(image.height * width / image.width));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, width, height);

    /* Размер оригинала нужен, чтобы пересчитать масштаб, когда самой картинки уже нет в памяти */
    canvas.srcWidth = image.width;
    canvas.srcHeight = image.height;

    /* Шаблон руки берет картинку карты из fillPatternImage.currentSrc */
    canvas.currentSrc = image.currentSrc || image.src;

    thumbs.set(url, canvas);
    return canvas;
};

/* Очередь загрузки полных картинок: не больше MAX_PARALLEL одновременно */
const MAX_PARALLEL = 6;
const queue = [];
let active = 0;

const pump = () => {
    while ( active < MAX_PARALLEL && queue.length ) {
        const job = queue.shift();

        /* Пока ждали очереди, картинка могла стать не нужна */
        if ( job.isStale() ) {
            job.resolve(null);
            continue;
        }

        active++;
        const image = new Image();
        const done = (result) => {
            active--;
            job.resolve(result);
            pump();
        };

        image.onload = () => {
            /* decode() заранее, чтобы первый кадр с картинкой не подвисал */
            const decoded = image.decode ? image.decode().catch(() => {}) : Promise.resolve();
            decoded.then(() => done(image));
        };
        image.onerror = () => done(null);
        image.src = job.url;
    }
};

export const loadFull = (url, isStale) => new Promise((resolve) => {
    queue.push({ url, isStale, resolve });
    pump();
});
