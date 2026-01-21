// @ts-nocheck
"use strict";

class QuillElement {
    static #initialized = false;
    static #tooltip_element;

    #element;
    #allowed_children = [];
    #add_child_callback;
    #parent = null;
    #children = [];
    #arg_config;
    #arg_callback;
    #arg_children;
    #tooltip;

    static #init() {
        if (QuillElement.#initialized) return;
        QuillElement.#initialized = true;

        QuillElement.#tooltip_element = Util.element_from_html(`<div class="quill-tooltip"></div>`);
        document.querySelector(".quill-content").append(QuillElement.#tooltip_element);

        window.addEventListener("mousemove", (e) => {
            QuillElement.#tooltip_element.style.left = `${e.clientX + 20}px`;
            QuillElement.#tooltip_element.style.top = `${e.clientY - 10}px`;
        });
    }

    constructor(html, allowed_children, add_child_callback, ...args) {
        QuillElement.#init();
        // TODO: validate html
        this.#element = Util.element_from_html(html);

        // TODO: validate allowed_children
        if (allowed_children instanceof Array) this.#allowed_children = allowed_children;

        // TODO: validate add_child_callback
        this.#add_child_callback = add_child_callback ?? ((child) => this.#element.append(child.get_element()));

        const named_args = Util.config_callback_and_children_from_arguments(...args);
        this.#arg_config = Object.freeze(named_args.config);
        this.#arg_callback = Object.freeze(named_args.callback);
        this.#arg_children = Object.freeze(named_args.children);

        if (!!this.#arg_config.hidden) this.hide();

        // TODO: validate class
        if (this.#arg_config.class) this.#element.classList.add(this.#arg_config.class);
        // TODO: validate css
        if (this.#arg_config.css) {
            for (const entry of Object.entries(this.#arg_config.css)) {
                this.#element.style[entry[0]] = entry[1];
            }
        }

        // TODO: validate
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
        // TODO: validate children
        if (children[0] instanceof Array) return this.add_children(...children[0]);
        const msg = `No children allowed for ${this.constructor.name}. Found:`;
        if (!Util.warning(this.#allowed_children.length > 0, msg, children[0])) return this;
        for (const child of children) {
            if (!this.#is_child_allowed(child)) return this;
            this.#add_child_callback(child);
            if (child instanceof QuillElement) {
                this.#children.push(child);
                child.#parent = this;
            }
        }
        return this;
    }

    get_page_x = () => window.pageXOffset + this.#element.getBoundingClientRect().left;

    get_page_y = () => window.pageYOffset + this.#element.getBoundingClientRect().top;

    get_page_x_right = () => this.get_page_x() + this.#element.offsetWidth;

    get_page_y_bottom = () => this.get_page_y() + this.#element.offsetHeight;

    on_event(type, callback) {
        // TODO: validate type
        // TODO: validate callback
        this.#element.addEventListener(type, (e) => callback(e, this));
    }

    remove() {
        this.#element.remove();
        for (const child of this.#children.slice()) child.remove();
        if (this.#parent) this.#parent.#children.splice(this.#parent.#children.indexOf(this), 1);
        return this;
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
        // TODO: validate property
        // TODO: validate font
        const msg = `Unknown style font "${property}"`;
        if (!Util.warning(Object.hasOwn(QuillConfig.fonts, property), msg)) return;
        Util.add_style_variable_to_element(this.#element, property, "-font", font);
        return this;
    }

    set_style_color(property, color) {
        // TODO: validate property
        // TODO: validate font
        const msg = `Unknown style color "${property}"`;
        if (!Util.warning(Object.hasOwn(QuillConfig.colors, property), msg)) return;
        Util.add_style_variable_to_element(this.#element, property, "-color", color.to_css());
        return this;
    }

    set_style_size(property, size) {
        // TODO: validate property
        // TODO: validate size
        const msg = `Unknown style size "${property}"`;
        if (!Util.warning(Object.hasOwn(QuillConfig.sizes, property), msg)) return;
        Util.add_style_variable_to_element(this.#element, property, "-size", `${size}px`);
        return this;
    }

    set_style_flag(property, value) {
        // TODO: validate property
        // TODO: validate value
        const msg = `Unknown style flag "${property}"`;
        if (!Util.warning(Object.hasOwn(QuillConfig.flags, property), msg)) return;
        Util.add_style_variable_to_element(this.#element, property, "", QuillConfig.flags[property].get_value(value));
        return this;
    }

    set_tooltip(tooltip) {
        if (typeof this.#tooltip === "undefined") {
            this.#element.addEventListener("mouseenter", (e) => {
                QuillElement.#tooltip_element.innerHTML = this.#tooltip;
                QuillElement.#tooltip_element.style.display = "initial";
            });
            this.#element.addEventListener("mousemove", (e) => (QuillElement.#tooltip_element.innerHTML = this.#tooltip));
            this.#element.addEventListener("mouseleave", (e) => (QuillElement.#tooltip_element.style.display = "none"));
        }
        this.#tooltip = Util.html_string_from_object(tooltip);
        return this;
    }

    // Protected methods

    _get_arg_config = () => this.#arg_config;

    _get_arg_callback = () => this.#arg_callback;

    _get_arg_children = () => this.#arg_children;

    _remove() {} // Implement in extending classes that create extra DOM elements outside #element.

    // Private methods

    #is_child_allowed(child) {
        // TODO: validate child
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
