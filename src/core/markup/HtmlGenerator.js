function HtmlGenerator() {
    this.getNode = (cl) => {
        return document.querySelector(cl);
    }

    this.create = (element, options) => {
        const el = document.createElement(element);

        if (options.classes) el.classList.add(...options.classes);
        if (options.attributes) this.setAttrs(el, options.attributes);

        return el;
    }

    this.setAttrs = (node, attrs) => {
        Object.entries(attrs).forEach(([key, value]) => {
            node.setAttribute(key, value);
        });
    }

    this.appendToBegin = (node, markup) => {
        node.insertAdjacentHTML('afterbegin', markup);
    }

    this.uniqueAdd = (nodeTo, markup, attribute) => {
        const children = Array.from(nodeTo.children);

        let unique = false;
        for ( const el of children ) {
            if ( unique ) break;

            if ( el.dataset[attribute.attr] === attribute.value?.toString() ) {
                nodeTo.removeChild(el);
                this.appendToBegin(nodeTo, markup);
                unique = true;
            }
        }

        if ( !unique ) {
            this.appendToBegin(nodeTo, markup);
        }
    }

    this.remove = (fromNode, attribute) => {
        const children = Array.from(fromNode.children);

        let unique = false;
        for ( const el of children ) {
            if ( unique ) break;

            if ( el.dataset[attribute.attr] === attribute.value?.toString() ) {
                fromNode.removeChild(el);
                unique = true;
            }
        }
    }

    this.removeByElement = (fromNode, node) => {
        fromNode.removeChild(node);
    }
}


export default HtmlGenerator;