"use strict";

class QuillColorPicker extends QuillElement {
    #input_element;

    constructor(label, ...args) {
        const html = `<input class="quill-input" type="color" />`;
        super(label ? `<label class="quill-label">${html}${label}</label>` : html, [], ...args);
        const element = label ? this.get_element().querySelector(`input`) : this.get_element();
        this.#input_element = element;
        element.addEventListener("input", (e) => this._get_arg_callback()(this.get_value(), this, e));
    }

    // Public methods

    get_value = () => this.#input_element.value;
    set_value(value) {
        this.#input_element.value = value;
        return this;
    }
}
