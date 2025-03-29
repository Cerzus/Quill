"use strict";

class QuillInputNumber extends QuillElement {
    #input_element;
    #min = null;
    #max = null;
    #step = null;
    #on_change;

    constructor(on_change, label, ...args) {
        const html = `<input class="quill-input" type="number" />`;
        super(label ? `<label class="quill-label">${html}${label}</label>` : html, [], ...args);
        const element = label ? this.get_element().querySelector(`input`) : this.get_element();
        this.#input_element = element;
        this.#on_change = on_change;
        element.addEventListener("change", (e) => {
            this.set_value(this.get_value());
            this._get_arg_callback()(this.get_value(), this, e);
        });
        const config = this._get_arg_config();
        element.value = 0;
        if (Object.hasOwn(config, "min")) this.#set_min(config.min);
        if (Object.hasOwn(config, "max")) this.#set_max(config.max);
        if (Object.hasOwn(config, "step")) this.#set_step(config.step);
        if (Object.hasOwn(config, "value")) this.#set_value(config.value);
    }

    // Public methods

    get_value = () => this.#input_element.value;
    set_value(value) {
        this.#set_value(value);
        return this;
    }

    // Private methods

    #set_value(value) {
        this.#input_element.value = this.#on_change(this.#apply_min(this.#apply_max(this.#apply_step(value))));
    }
    #set_min = (min) => (this.#input_element.min = this.#min = this.#on_change(min));
    #set_max = (max) => (this.#input_element.max = this.#max = this.#on_change(max));
    #set_step = (step) => (this.#input_element.step = this.#step = this.#on_change(step));

    #apply_min = (value) => (this.#min === null ? value : Math.max(value, this.#min));
    #apply_max = (value) => (this.#max === null ? value : Math.min(value, this.#max));
    #apply_step(value) {
        if (this.#step === null || this.#min === null) return value;
        else return this.#min + this.#on_change((value - this.#min) / this.#step) * this.#step;
    }
}

class QuillInputInteger extends QuillInputNumber {
    constructor(...args) {
        super((value) => ~~value, ...args);
    }
}
