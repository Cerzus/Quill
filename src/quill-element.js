// @ts-nocheck
"use strict";

class QuillElement {
    #element;
    #allowed_children = [];
    #parent = null;
    #children = [];
    #arg_config;
    #arg_callback;
    #arg_children;

    constructor(html, allowed_children, ...args) {
        this.#element = Util.element_from_html(html);

        if (allowed_children instanceof Array) this.#allowed_children = allowed_children;

        const named_args = Util.config_callback_and_children_from_arguments(...args);
        this.#arg_config = Object.freeze(named_args.config);
        this.#arg_callback = Object.freeze(named_args.callback);
        this.#arg_children = Object.freeze(named_args.children);

        if (this.#arg_config.hidden) this.hide();

        if (this.#arg_config.class) this.#element.classList.add(this.#arg_config.class);
        if (this.#arg_config.css) {
            for (const entry of Object.entries(this.#arg_config.css)) {
                this.#element.style[entry[0]] = entry[1];
            }
        }

        for (const style_type of ["font", "color", "size", "flag"]) {
            for (const [property, value] of Object.entries(this.#arg_config[`${style_type}s`] ?? {})) {
                this[`set_style_${style_type}`](property, value);
            }
        }
    }

    // Public methods

    get_element = () => this.#element;
    get_parent = () => this.#parent; // TODO: can we skip over Wrapper elements?
    get_children = () => this.#children.slice(); // TODO: can we add Wrapper children's children to this list?
    get_panel = () => (this instanceof QuillPanel ? this : this.get_parent().get_panel());
    add_children(...children) {
        if (children[0] instanceof Array) return this.add_children(...children[0]);
        const msg = `No children allowed for ${this.constructor.name}. Found:`;
        if (!Util.warning(this.#allowed_children.length > 0, msg, children[0])) return;
        for (const child of children) {
            if (!this.#is_child_allowed(child)) return;
            this._add_child(child);
            if (child instanceof QuillElement) {
                this.#children.push(child);
                child.#parent = this;
            }
        }
        return this;
    }
    get_page_x = () => window.pageXOffset + this.#element.getBoundingClientRect().left;
    get_page_x_right = () => this.get_page_x() + this.#element.offsetWidth;
    get_page_y = () => window.pageYOffset + this.#element.getBoundingClientRect().top;
    get_page_y_bottom = () => this.get_page_y() + this.#element.offsetHeight;
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
    is_hidden = () => this.#element.style.display !== "";
    set_style_font(property, font) {
        const msg = `Unknown style font "${property}"`;
        if (!Util.warning(Object.hasOwn(QuillConfig.fonts, property), msg)) return;
        Util.add_style_variable_to_element(this.#element, property, "-font", font);
        return this;
    }
    set_style_color(property, color) {
        const msg = `Unknown style color "${property}"`;
        if (!Util.warning(Object.hasOwn(QuillConfig.colors, property), msg)) return;
        Util.add_style_variable_to_element(this.#element, property, "-color", color.to_css());
        return this;
    }
    set_style_size(property, size) {
        const msg = `Unknown style size "${property}"`;
        if (!Util.warning(Object.hasOwn(QuillConfig.sizes, property), msg)) return;
        Util.add_style_variable_to_element(this.#element, property, "-size", `${size}px`);
        return this;
    }
    set_style_flag(property, value) {
        const msg = `Unknown style flag "${property}"`;
        if (!Util.warning(Object.hasOwn(QuillConfig.flags, property), msg)) return;
        Util.add_style_variable_to_element(this.#element, property, "", QuillConfig.flags[property].get_value(value));
        return this;
    }

    // Private methods

    _get_arg_config = () => this.#arg_config;
    _get_arg_callback = () => this.#arg_callback;
    _get_arg_children = () => this.#arg_children;
    _add_child() {
        Util.assert(false, `TODO: Implement '_add_child(child)' in ${this.constructor.name}`);
    }
    _remove() {} // Implement in extending classes that create extra DOM elements outside #element.

    #is_child_allowed(child) {
        const actual_child = typeof child === "string" || typeof child === "number" ? new String(child) : child;
        const child_is_allowed = this.#allowed_children.reduce((acc, cur) => acc || actual_child instanceof cur, false);
        if (!child_is_allowed) {
            const allowed_children = this.#allowed_children.map((type) => type.name).join(", ");
            const msg = `Child to add to ${this.constructor.name} must be one of [${allowed_children}]. Found:`;
            Util.warning(false, msg, actual_child);
            return false;
        }
        if (child instanceof QuillWrapper) {
            for (const child_of_wrapper of child.get_children()) {
                if (!this.#is_child_allowed(child_of_wrapper)) return false;
            }
        }
        return true;
    }
}

class QuillWrappableElement extends QuillElement {}
class QuillNodeElement extends QuillWrappableElement {}
class QuillLeafElement extends QuillNodeElement {}
