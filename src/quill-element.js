"use strict";

class QuillElement {
    #element;
    #parent;
    #children;

    constructor(html) {
        this.#element = Util.element_from_html(html);
        this.#parent = null;
        this.#children = [];
    }

    get_element = () => this.#element;
    get_parent = () => this.#parent;
    get_children = () => this.#children;

    add(children) {
        if (!children) {
            return;
        }
        if (!Array.isArray(children)) {
            return this.add([children]);
        }
        for (const child of children) {
            this.#children.push(child);
            child.#parent = this;
            this.add_child(child);
        }
    }
}
