import config from "../../config";

const STORAGE_KEY = "bgo.modelViewer.collapsed";

// Насколько «отъехать» от модели: 1 — впритык, больше — дальше. Было 1.6, приблизили вдвое.
const CAMERA_FIT = 0.8;

/**
 * Мини-окно с 3D-превью (three.js + 3MFLoader) в левом верхнем углу.
 *
 * - клик по карточке, у которой в manifest задан `model` -> грузим модель;
 * - крестик сворачивает окно в иконку слева;
 * - состояние «свернуто/развернуто» общее для всех карточек и хранится в localStorage:
 *   закрыли одну -> у остальных окно сразу свернуто, открыли иконкой -> открывается у всех.
 */
class ModelViewerModule {
    constructor(boardLayer, emitter) {
        this.boardLayer = boardLayer;
        this.emitter = emitter;

        this.collapsed = this.readCollapsed();
        this.currentUrl = null;
        this.currentRotation = null;
        this.currentTitle = "";
        this.loadToken = 0;

        this.three = null;      // { THREE, ThreeMFLoader, OrbitControls } — ленивая подгрузка
        this.threePromise = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.modelRoot = null;
        this.cache = new Map(); // url -> Promise<Object3D> (уже распарсенная модель)
        this.parseQueue = Promise.resolve();
        this.rafId = null;

        this.buildDom();
        this.bindBoard();
        this.applyState();

        // GameBuilder шлёт это событие для каждой карточки с моделью — качаем заранее, на экране загрузки
        this.emitter.on("model-viewer.preload", (path) => this.preload(path));
    }

    /* ---------- загрузка моделей ---------- */

    resolveUrl(path) {
        return /^https?:\/\//.test(path) ? path : config.s3BaseUrl(path);
        // return path;
    }

    /** Предзагрузка: учитывается в счётчике экрана загрузки (тот же протокол, что у картинок). */
    preload(path) {
        const url = this.resolveUrl(path);
        if ( this.cache.has(url) ) return; // одну и ту же модель считаем один раз

        this.emitter.emit("screen.preloader.loading", url);
        this.getModel(url)
            .catch((err) => console.warn("model-viewer: предзагрузка не удалась", url, err))
            .finally(() => this.emitter.emit("screen.preloader.loaded", url));
    }

    getModel(url) {
        if ( !this.cache.has(url) ) {
            const promise = this.fetchModel(url).catch((err) => {
                this.cache.delete(url); // при ошибке дадим шанс повторить по клику
                throw err;
            });
            this.cache.set(url, promise);
        }
        return this.cache.get(url);
    }

    async fetchModel(url) {
        const [res, three] = await Promise.all([fetch(url), this.ensureThree()]);
        if ( !res.ok ) throw new Error("HTTP " + res.status);
        const buffer = await res.arrayBuffer();

        // Парсим по очереди и с паузой между моделями, чтобы тяжёлые 3MF не вешали экран загрузки
        const job = this.parseQueue.then(async () => {
            await new Promise((resolve) => setTimeout(resolve));
            return new three.ThreeMFLoader().parse(buffer);
        });
        this.parseQueue = job.catch(() => {});
        return job;
    }

    /* ---------- состояние ---------- */

    readCollapsed() {
        try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
    }

    writeCollapsed(value) {
        this.collapsed = value;
        try { localStorage.setItem(STORAGE_KEY, value ? "1" : "0"); } catch { /* ignore */ }
    }

    /* ---------- DOM ---------- */

    buildDom() {
        this.root = document.createElement("div");
        this.root.className = "model-viewer";
        this.root.hidden = true;
        this.root.innerHTML = `
            <div class="model-viewer__window glass-panel">
                <div class="model-viewer__header">
                    <span class="model-viewer__title"></span>
                    <button class="model-viewer__close" title="Свернуть"><i class="ph ph-x"></i></button>
                </div>
                <div class="model-viewer__canvas"></div>
                <div class="model-viewer__status"></div>
            </div>
            <button class="model-viewer__icon glass-panel" title="Открыть 3D-модель">
                <i class="ph ph-cube"></i>
            </button>
        `;
        document.body.appendChild(this.root);

        this.windowEl = this.root.querySelector(".model-viewer__window");
        this.iconEl = this.root.querySelector(".model-viewer__icon");
        this.titleEl = this.root.querySelector(".model-viewer__title");
        this.canvasHost = this.root.querySelector(".model-viewer__canvas");
        this.statusEl = this.root.querySelector(".model-viewer__status");

        this.root.querySelector(".model-viewer__close").addEventListener("click", () => this.collapse());
        this.iconEl.addEventListener("click", () => this.expand());
    }

    applyState() {
        const hasModel = !!this.currentUrl;
        this.root.hidden = !hasModel;
        this.windowEl.hidden = this.collapsed;
        this.iconEl.hidden = !this.collapsed;

        if ( hasModel && !this.collapsed ) this.startRender();
        else this.stopRender();
    }

    collapse() {
        this.writeCollapsed(true);
        this.applyState();
    }

    expand() {
        this.writeCollapsed(false);
        this.applyState();
        if ( this.currentUrl ) this.loadModel(this.currentUrl);
    }

    /* ---------- клик по карточке ---------- */

    bindBoard() {
        this.boardLayer.on("click tap", (e) => {
            if ( e.evt && e.evt.button !== undefined && e.evt.button !== 0 ) return; // только левая кнопка

            // У counter клик приходит на дочерний элемент (фон/текст), а `model` лежит на группе,
            // поэтому поднимаемся по родителям до первого узла с атрибутом model.
            // Кнопки +/- гасят всплытие (cancelBubble), так что сюда не доходят.
            let node = e.target;
            while ( node && node !== this.boardLayer && !node.getAttr?.("model") ) {
                node = node.getParent?.();
            }
            if ( !node || node === this.boardLayer ) return;

            this.show(node.getAttr("model"), node.getAttr("modelTitle") || node.id(), node.getAttr("modelRotation"));
        });
    }

    show(path, title, rotation) {
        const url = this.resolveUrl(path);
        const changed = url !== this.currentUrl
            || JSON.stringify(rotation) !== JSON.stringify(this.currentRotation);

        this.currentUrl = url;
        this.currentRotation = rotation || null; // [x, y, z] в градусах
        this.currentTitle = title;
        this.titleEl.textContent = title;
        this.applyState();

        // Свернуто -> модель не грузим, только запоминаем; загрузится по клику на иконку.
        if ( this.collapsed ) return;
        if ( changed || !this.modelRoot ) this.loadModel(url);
    }

    /* ---------- three.js ---------- */

    async ensureThree() {
        if ( this.three ) return this.three;

        this.threePromise ??= Promise.all([
            import("three"),
            import("three/addons/loaders/3MFLoader.js"),
            import("three/addons/controls/OrbitControls.js"),
        ]).then(([THREE, mf, oc]) => {
            this.three = { THREE, ThreeMFLoader: mf.ThreeMFLoader, OrbitControls: oc.OrbitControls };
            this.initScene();
            return this.three;
        });

        return this.threePromise;
    }

    initScene() {
        const { THREE, OrbitControls } = this.three;
        const w = this.canvasHost.clientWidth || 320;
        const h = this.canvasHost.clientHeight || 240;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(w, h);
        this.canvasHost.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 5000);

        this.scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.4));
        const key = new THREE.DirectionalLight(0xffffff, 2.2);
        key.position.set(1, 2, 3);
        this.scene.add(key);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.enablePan = false;

        new ResizeObserver(() => this.resize()).observe(this.canvasHost);
    }

    resize() {
        if ( !this.renderer ) return;
        const w = this.canvasHost.clientWidth;
        const h = this.canvasHost.clientHeight;
        if ( !w || !h ) return;

        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }

    async loadModel(url) {
        const token = ++this.loadToken;
        this.setStatus("Загрузка модели…");

        try {
            const { THREE } = await this.ensureThree();
            const source = await this.getModel(url); // из кеша — мгновенно, если модель предзагружена
            if ( token !== this.loadToken ) return; // пока грузили, кликнули по другой карточке

            if ( this.modelRoot ) this.scene.remove(this.modelRoot);

            // Клон, чтобы переиспользовать закешированную модель (геометрия/материалы общие)
            const model = source.clone(true);
            model.rotation.x = -Math.PI / 2; // 3MF: Z вверх, three.js: Y вверх

            // Ручная поправка из manifest (modelRotation, градусы) — в осях окна просмотра:
            // X — кувырок вперёд/назад, Y — поворот вокруг вертикали, Z — вбок.
            const pivot = new THREE.Group();
            const [rx = 0, ry = 0, rz = 0] = this.currentRotation || [];
            pivot.rotation.set(
                THREE.MathUtils.degToRad(rx),
                THREE.MathUtils.degToRad(ry),
                THREE.MathUtils.degToRad(rz)
            );
            pivot.add(model);

            const wrapper = new THREE.Group();
            wrapper.add(pivot);

            const box = new THREE.Box3().setFromObject(wrapper);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            wrapper.position.copy(center).negate(); // центрируем уже с учётом поворота

            const radius = Math.max(size.x, size.y, size.z) || 1;
            const dist = radius / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))) * CAMERA_FIT;
            this.camera.position.set(dist * 0.7, dist * 0.5, dist);
            this.camera.near = radius / 100;
            this.camera.far = radius * 100;
            this.camera.updateProjectionMatrix();
            this.controls.target.set(0, 0, 0);
            this.controls.update();

            this.modelRoot = wrapper;
            this.scene.add(wrapper);
            this.setStatus("");
        } catch (err) {
            console.error("model-viewer: не удалось загрузить", url, err);
            if ( token === this.loadToken ) this.setStatus("Не удалось загрузить модель");
        }
    }

    setStatus(text) {
        this.statusEl.textContent = text;
        this.statusEl.hidden = !text;
    }

    /* Рендерим только пока окно открыто */
    startRender() {
        if ( this.rafId ) return;
        this.rafId = requestAnimationFrame(() => this.tick());
    }

    stopRender() {
        if ( this.rafId ) cancelAnimationFrame(this.rafId);
        this.rafId = null;
    }

    tick() {
        this.rafId = null;
        if ( this.collapsed || !this.currentUrl ) return;

        if ( this.renderer ) {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        }
        this.rafId = requestAnimationFrame(() => this.tick());
    }
}

export default ModelViewerModule;