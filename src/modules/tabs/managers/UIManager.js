import {TabItemTemplate} from "../templates/tabs.templates";

class UIManager {
    constructor(generator) {
        this.generator = generator;
    }

    setActiveChild(id, className = 'active') {
        const node = this.generator.getNode(".tab-header");
        const children = Array.from(node.children);

        children.forEach((child, index) => {
            child.classList.remove(className);
            if (child.dataset.id === id) {
                child.classList.add(className);
            }
        });
    }

    getTabsWindow() {
        return this.generator.getNode(".tab-header");
    }

    addTab(id, name) {
        const node = this.generator.getNode(".tab-header");
        this.generator.appendToBegin(node, TabItemTemplate(id, name));
    }

    renderContent(content) {
        const node = this.generator.getNode(".tab-content");
        this.generator.removeFirstChild(node);

        this.generator.appendToBegin(node, content);
    }
}

export default UIManager;