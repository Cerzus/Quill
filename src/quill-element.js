// @ts-nocheck
"use strict";

class QuillElement {
    #element;
    #children_allowed = [];
    #parent = null;
    #children = [];
    #arg_config;
    #arg_callback;
    #arg_children;

    constructor(html, children_allowed, ...args) {
        this.#element = Util.element_from_html(html);

        if (children_allowed instanceof Array) this.#children_allowed = children_allowed;

        const named_args = Util.config_callback_and_children_from_arguments(...args);
        this.#arg_config = Object.freeze(named_args.config);
        this.#arg_callback = Object.freeze(named_args.callback);
        this.#arg_children = Object.freeze(named_args.children);

        if (this.#arg_config.class) this.#element.classList.add(this.#arg_config.class);
        if (!!this.#arg_config.disabled) this.#element.setAttribute("disabled", "");
    }

    // Public methods

    get_element = () => this.#element;
    get_parent = () => this.#parent;
    get_children = () => this.#children.slice();
    get_panel = () => (this instanceof QuillPanel ? this : this.get_parent().get_panel());
    add_children(...children) {
        if (children[0] instanceof Array) return this.add_children(...children[0]);
        const msg = `No children allowed for ${this.constructor.name}. Found:`;
        if (!Util.warning(this.#children_allowed.length > 0, msg, children[0])) return;
        for (const child of children) {
            const actual_child = typeof child === "string" || typeof child === "number" ? new String(child) : child;
            const child_is_allowed = this.#children_allowed.reduce(
                (acc, cur) => acc || actual_child instanceof cur,
                false
            );
            if (!child_is_allowed) {
                const children_allowed = this.#children_allowed.map((type) => type.name).join(", ");
                Util.warning(
                    false,
                    `Child to add to ${this.constructor.name} must be one of [${children_allowed}]. Found:`,
                    actual_child
                );
                return;
            }
            this._add_child(child);
            if (child instanceof QuillElement) {
                this.#children.push(child);
                child.#parent = this;
            }
        }
        return this;
    }
    remove() {
        this.#element.remove();
        this._remove();
        for (const child of this.#children.slice()) child.remove();
        if (this.#parent) this.#parent.#children.splice(this.#parent.#children.indexOf(this), 1);
    }
    show() {
        this.#element.style.display = "";
        return this;
    }
    hide() {
        this.#element.style.display = "none";
        return this;
    }
    is_visible = () => this.#element.style.display === "";

    // Private methods

    _get_arg_config = () => this.#arg_config;
    _get_arg_callback = () => this.#arg_callback;
    _get_arg_children = () => this.#arg_children;
    _add_child() {
        Util.assert(false, `TODO: Implement '_add_child(child)' in ${this.constructor.name}`);
    }
    _remove() {} // Implement in extending classes that create extra DOM elements outside #element.
}

class QuillNodeElement extends QuillElement {}
class QuillBranchElement extends QuillNodeElement {}
class QuillLeafElement extends QuillNodeElement {}
class QuillInput extends QuillLeafElement {}
