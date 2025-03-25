"use strict";

class QuillCheckbox extends QuillElement {
    #input_element;

    constructor(label, ...args) {
        const html = `<input class="quill-checkbox" type="checkbox" />`;
        super(label ? `<label class="quill-label">${html}${label}</label>` : html, [], ...args);
        const element = label ? this.get_element().querySelector(`input[type="checkbox"]`) : this.get_element();
        this.#input_element = element;
        element.addEventListener("change", (e) => this.get_arg_callback()(this, e));
    }

    // Public methods

    set_checked = (checked) => (this.#input_element.checked = !!checked);
    is_checked = () => this.#input_element.checked;
}
