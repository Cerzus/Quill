"use strict";

class QuillElement {
    #element;
    #parent = null;
    #children = [];
    #arg_config;
    #arg_callback;
    #arg_children;

    constructor(html, ...args) {
        this.#element = Util.element_from_html(html);

        const named_args = Util.config_callback_and_children_from_arguments(...args);
        this.#arg_config = named_args.config;
        this.#arg_callback = named_args.callback;
        this.#arg_children = named_args.children;
    }

    // Public methods

    get_element = () => this.#element;
    get_parent = () => this.#parent;
    get_children = () => this.#children.slice();

    get_arg_config = () => this.#arg_config;
    get_arg_callback = () => this.#arg_callback;
    get_arg_children = () => this.#arg_children;

    add(...children) {
        if (children[0] instanceof Array) return this.add(...children[0]);
        for (const child of children) {
            const msg = `Object to add '${child}' must be of type Quill.${this.constructor.name}`;
            if (!Util.warning(child instanceof QuillElement, msg)) return;
            this.#children.push(child);
            child.#parent = this;
            this._add_child(child);
        }
    }
    remove(...children) {
        if (children[0] instanceof Array) return this.remove(...children[0]);
        for (const child of children) {
            const msg = `Object to remove '${child}' must be of type Quill.${this.constructor.name}`;
            if (!Util.warning(child instanceof QuillElement, msg)) return;
            const index = this.#children.indexOf(child);
            const msg2 = `Object to remove '${child}' is not a child of this Quill.${this.constructor.name}`;
            if (!Util.warning(index >= 0, msg2)) return;
            child.get_element().remove();
            this.#children.splice(index, 1);
        }
    }
}
