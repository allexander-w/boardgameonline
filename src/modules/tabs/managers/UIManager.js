import {TabItemTemplate} from "../templates/tabs.templates";

class UIManager {
    constructor(generator) {
        this.generator = generator;
    }

    setActiveChild(id, className = 'active') {
        const node = this.generator.getNode(".tabs-list");
        const children = Array.from(node.children);

        children.forEach((child, index) => {
            child.classList.remove(className);
            if (child.dataset.id === id) {
                child.classList.add(className);
            }
        });
    }

    getTabsWindow() {
        return this.generator.getNode(".tabs-list");
    }

    addTab(id, name) {
        const node = this.generator.getNode(".tabs-list");
        this.generator.appendToBegin(node, TabItemTemplate(id, name));
    }

    renderContent(content) {
        const node = this.generator.getNode(".tabs-content");
        this.generator.removeFirstChild(node);

        this.generator.appendToBegin(node, content);
    }
}

export default UIManager;