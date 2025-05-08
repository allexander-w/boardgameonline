import {ResourcesListTemplate, ResourceTemplate} from "../templates/resources.template";

class ResourcesUIManager {
    constructor(generator) {
        this.generator = generator;
    }

    getWrapper() {
        return this.generator.getNode(".resources-list");
    }

    getResourcesUI(resources) {
        return ResourcesListTemplate(resources);
    }

    updateList(list) {
        const wrapper = this.getWrapper();
        if ( !wrapper ) return false;

        wrapper.innerHTML = "";

        for ( const el of list ) {
            this.generator.appendToEnd(wrapper, ResourceTemplate(el));
        }
    }
}

export default ResourcesUIManager;