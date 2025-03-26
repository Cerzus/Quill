"use strict";

class QuillDropdownOptions extends QuillElement {
    constructor(...args) {
        const label = typeof args[0] === "string" || typeof args[0] === "number" ? new String(args[0]) : null;
        const options = label instanceof String ? args[1] : args[0];
        super(
            `<optgroup ${label ? `label="${label}"` : ``}></optgroup`,
            [],
            ...args.slice(label instanceof String ? 2 : 1)
        );
        const element = this.get_element();
        if (options instanceof Array) {
            for (const option of options) {
                element.append(Util.element_from_html(`<option>${option}</option>`));
            }
        } else if (options instanceof Object) {
            for (const [value, text] of Object.entries(options)) {
                element.append(Util.element_from_html(`<option value="${value}">${text}</option>`));
            }
        }
    }
}

class QuillDropdown extends QuillElement {
    #input_element;

    constructor(label, ...args) {
        const html = `<select class="quill-select"></select>`;
        super(label ? `<label class="quill-label">${html}${label}</label>` : html, [QuillDropdownOptions], ...args);
        const element = label ? this.get_element().querySelector(`select`) : this.get_element();
        this.#input_element = element;
        element.addEventListener("change", (e) => this._get_arg_callback()(this.get_value(), this, e));
        this.add_children(this._get_arg_children());
        const config = this._get_arg_config();
        if (Object.hasOwn(config, "value")) this.set_value(config.value);
    }

    // Public methods

    get_value = () => this.#input_element.value;
    set_value(value) {
        this.#input_element.value = value;
        return this;
    }

    // Private methods

    _add_child(options) {
        const element = options.get_element();
        if (element.hasAttribute("label")) this.#input_element.append(element);
        else for (const option of element.querySelectorAll("option")) this.#input_element.append(option);
    }
}
