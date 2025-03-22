import PreloadScreen from "./PreloadScreen";
import PreloadManager from "./managers/PreloadManager";
import HtmlGenerator from "../../core/markup/HtmlGenerator";
import { ws, emitter } from "../../core";
import PreloadHandler from "./handlers/PreloadHandler";

function init() {
    const preloadScreen = new PreloadScreen(new HtmlGenerator());
    const preloadManager = new PreloadManager(emitter, ws, preloadScreen);
    const preloadHandler = new PreloadHandler(emitter, preloadManager);
}

export default {
    init
}