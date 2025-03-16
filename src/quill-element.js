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
    get_children = () => this.#children;

    get_arg_config = () => this.#arg_config;
    get_arg_callback = () => this.#arg_callback;
    get_arg_children = () => this.#arg_children;

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
