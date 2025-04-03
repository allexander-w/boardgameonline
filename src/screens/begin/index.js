import HtmlGenerator from "../../core/markup/HtmlGenerator";
import BeginScreen from "./BeginScreen";

function init() {
    return new BeginScreen(new HtmlGenerator());
}

export default {
    init
}