"use strict";

class QuillElement {
    #element;
    #parent = null;
    #children = [];
    #arg_config = Object.freeze({});
    #arg_children = [];
    #arg_callback = () => {};

    constructor(html, ...args) {
        this.#element = Util.element_from_html(html);

        for (let i = 0; i < Math.min(args.length, 3); i++) {
            const arg = args[i];
            if (arg instanceof QuillElement || arg instanceof Array) {
                this.#arg_children = arg;
            } else if (arg instanceof Function) {
                this.#arg_callback = arg;
            } else if (arg instanceof Object) {
                this.#arg_config = Object.freeze(arg);
            }
        }
    }

    // Public methods

    get_element = () => this.#element;
    get_parent = () => this.#parent;
    get_children = () => this.#children;

    get_arg_config = () => this.#arg_config;
    get_arg_children = () => this.#arg_children;
    get_arg_callback = () => this.#arg_callback;

    add(children) {
        if (!children) return;
        if (!Array.isArray(children)) return this.add([children]);
        for (const child of children) {
            if (child instanceof QuillElement) {
                this.#children.push(child);
                child.#parent = this;
                this._add_child(child);
            }
        }
    }
}
