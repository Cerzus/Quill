"use strict";

class QuillInputNumerical extends QuillElement {
    #input_element;
    #min = null;
    #max = null;
    #step = null;
    #event_type;
    #on_event;

    constructor(html, event_type, on_event, label, ...args) {
        super(label ? `<label class="quill-label">${html}${label}</label>` : html, [], ...args);
        const element = label ? this.get_element().querySelector(`input`) : this.get_element();
        // super(`<label class="quill-label">${html}${label ?? ""}</label>`, [], ...args);
        // const element = this.get_element().querySelector(`input`);
        this.#input_element = element;
        this.#on_event = on_event;
        element.addEventListener(event_type, (e) => {
            this.set_value(this.get_value());
            this._get_arg_callback()(this.get_value(), this, e);
        });
        const config = this._get_arg_config();
        if (Object.hasOwn(config, "min")) this.#set_min(config.min);
        if (Object.hasOwn(config, "max")) this.#set_max(config.max);
        if (Object.hasOwn(config, "step")) this.#set_step(config.step);
        if (Object.hasOwn(config, "value")) this.#set_value(config.value);
        this.set_value(0);
    }

    // Public methods

    get_value = () => this.#input_element.value;
    set_value(value) {
        this.#set_value(value);
        return this;
    }

    // Private methods

    #set_value(value) {
        this.#input_element.value = this.#on_event(this.#apply_min(this.#apply_max(this.#apply_step(value))));
    }
    #set_min = (min) => (this.#input_element.min = this.#min = this.#on_event(min));
    #set_max = (max) => (this.#input_element.max = this.#max = this.#on_event(max));
    #set_step = (step) => (this.#input_element.step = this.#step = this.#on_event(step));

    #apply_min = (value) => (this.#min === null ? value : Math.max(value, this.#min));
    #apply_max = (value) => (this.#max === null ? value : Math.min(value, this.#max));
    #apply_step(value) {
        if (this.#step === null || this.#min === null) return value;
        else return this.#min + this.#on_event((value - this.#min) / this.#step) * this.#step;
    }
}

class QuillInputNumber extends QuillInputNumerical {
    constructor(...args) {
        super(`<input class="quill-input" type="number" />`, "change", ...args);
    }
}

class QuillInputFloat extends QuillInputNumber {
    constructor(...args) {
        super((value) => value, ...args);
    }
}

class QuillInputInteger extends QuillInputNumber {
    constructor(...args) {
        super((value) => ~~value, ...args);
    }
}

class QuillInputU8 extends QuillInputInteger {
    constructor(label, ...args) {
        const { config, callback, children, count } = Util.config_callback_and_children_from_arguments(...args);
        config.min = 0;
        config.max = (1 << 8) - 1;
        super(label, config, callback, children, ...args.slice(count));
    }
}

class QuillInputU16 extends QuillInputInteger {
    constructor(label, ...args) {
        const { config, callback, children, count } = Util.config_callback_and_children_from_arguments(...args);
        config.min = 0;
        config.max = (1 << 16) - 1;
        super(label, config, callback, children, ...args.slice(count));
    }
}

class QuillInputRange extends QuillInputNumerical {
    constructor(...args) {
        super(
            `<div style="position: relative; flex-grow: 1;">
                <input class="quill-input" type="range">
                <output></output>
            </div>`,
            "input",
            ...args
        );

        this.get_element()
            .querySelector("input")
            .addEventListener("input", () => this.#update_output());

        this.#update_output();
    }

    // Public methods

    set_value(value) {
        super.set_value(value);
        this.get_element().querySelector("output").value = this.get_value();
        return this;
    }

    // Private methods

    #update_output() {
        this.get_element().querySelector("output").value = this.get_value();
    }
}

class QuillSliderFloat extends QuillInputRange {
    constructor(label, ...args) {
        const { config, callback, children, count } = Util.config_callback_and_children_from_arguments(...args);
        config.min = 0;
        config.max = 1;
        config.step = 0.01;
        super((value) => value, label, config, callback, children, ...args.slice(count));
    }
}

class QuillSliderInteger extends QuillInputRange {
    constructor(...args) {
        super((value) => ~~value, ...args);
    }
}
