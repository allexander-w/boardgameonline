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


    this.updateText = (node, text) => {
        node.innerText = text;
    }

    this.setAttrs = (node, attrs) => {
        Object.entries(attrs).forEach(([key, value]) => {
            node.setAttribute(key, value);
        });
    }

    this.uniqueAdd = (nodeTo, nodeChild, attribute) => {
        const children = Array.from(nodeTo.children);

        let unique = false;
        for ( const el of children ) {
            if ( unique ) break;
            if ( el.dataset[attribute] === nodeChild.dataset[attribute] ) {
                el.innerHTML = nodeChild.innerHTML;
                unique = true;
            }
        }


        if ( !unique ) {
            nodeTo.appendChild(nodeChild);
        }
    }
}


export default HtmlGenerator;