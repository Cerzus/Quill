"use strict";

class QuillRadioButtons extends QuillInput {
    #name;

    constructor(...args) {
        const html = `<fieldset class="quill-radio-buttons"></fieldset>`;
        super(html, "change", null, [QuillWrapper, QuillRadioButton], ...args);
        this.#name = Math.random();
        this.add_children(this._get_arg_children());
        this.get_element().querySelector(`input`).checked = true;
        const config = this._get_arg_config();
        if (Object.hasOwn(config, "value")) this.set_value(config.value);
    }

    // Public methods

    get_value = () => this.get_element().querySelector(":checked").value;
    set_value(value) {
        this.get_element().querySelector(`[value="${value}"]`).checked = true;
        return this;
    }

    // Private methods

    _add_child(child) {
        child.get_element().querySelector("input").name = this.#name;
        this.get_element().querySelector(".quill-radio-buttons").append(child.get_element());
    }
}

class QuillRadioButton extends QuillWrappableElement {
    constructor(label, value, ...args) {
        super(
            `<label class="quill-label">
                <input class="quill-input" type="radio" value="${value}" />${label ?? ""}
            </label>`,
            [],
            ...args
        );
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        if (disabled) this.get_element().querySelector(`input`).setAttribute("disabled", "");
        else this.get_element().querySelector(`input`).removeAttribute("disabled");
        return this;
    }
}
