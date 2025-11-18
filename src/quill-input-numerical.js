"use strict";

class QuillInputNumerical extends QuillInput {
    #min = null;
    #max = null;
    #step = null;
    #sanitize_value;

    constructor(html, event_type, sanitize_value, ...args) {
        // TODO: validate html
        // TODO: validate event_type
        // TODO: validate sanitize_value
        super(html, event_type, sanitize_value, [], null, ...args);
        this.#sanitize_value = sanitize_value ?? ((value) => value);
        const config = this._get_arg_config();
        // TODO: validate min
        if (Object.hasOwn(config, "min")) this.#set_min(config.min);
        // TODO: validate max
        if (Object.hasOwn(config, "max")) this.#set_max(config.max);
        // TODO: validate step
        if (Object.hasOwn(config, "step")) this.#set_step(config.step);
        // TODO: validate value
        if (Object.hasOwn(config, "value")) this.set_value(config.value);
    }

    // Public methods

    set_value(value) {
        // TODO: validate value
        return super.set_value(this.#apply_min(this.#apply_max(this.#apply_step(value))));
    }

    // Private methods

    // TODO: validate min
    #set_min = (min) => (this._get_input_element().min = this.#min = this.#sanitize_value(min));
    // TODO: validate max
    #set_max = (max) => (this._get_input_element().max = this.#max = this.#sanitize_value(max));
    // TODO: validate step
    #set_step = (step) => (this._get_input_element().step = this.#step = this.#sanitize_value(step));

    // TODO: validate min
    #apply_min = (value) => (this.#min === null ? value : Math.max(value, this.#min));
    // TODO: validate max
    #apply_max = (value) => (this.#max === null ? value : Math.min(value, this.#max));
    // TODO: validate step
    #apply_step(value) {
        if (this.#step === null) return value;
        const n_steps_above_min = Math.round((value - this.#min) / this.#step);
        return Math.round(((this.#min ?? 0) + this.#sanitize_value(n_steps_above_min * this.#step)) * 1e10) / 1e10;
    }
}

class QuillInputNumber extends QuillInputNumerical {
    constructor(...args) {
        super(`<input class="quill-input" type="number" />`, "change", ...args);
    }
}

class QuillInputFloat extends QuillInputNumber {
    constructor(...args) {
        super(null, ...args);
    }
}

class QuillInputInteger extends QuillInputNumber {
    constructor(...args) {
        super((value) => ~~value, ...args);
    }
}

class QuillInputI extends QuillInputInteger {
    constructor(min, max, ...args) {
        // TODO: validate min
        // TODO: validate max
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(...args);
        // TODO: validate min
        config.min = min;
        // TODO: validate max
        config.max = max;
        super(label, config, callback, children, ...args.slice(count));
    }
}

class QuillSlider extends QuillInputNumerical {
    constructor(...args) {
        super(
            `<div class="quill-slider">
                <input class="quill-input" type="range">
                <output></output>
            </div>`,
            "input",
            ...args
        );
        if (!!this._get_arg_config().reverse) this._get_input_element().style.direction = "rtl";
    }

    // Public methods

    set_value(value) {
        // TODO: validate value
        const config = this._get_arg_config();
        super.set_value(value);
        const prefix = Util.html_string_from_object(Object.hasOwn(config, "prefix") ? config.prefix : "");
        const suffix = Util.html_string_from_object(Object.hasOwn(config, "suffix") ? config.suffix : "");
        const output = prefix + this.get_value() + suffix;
        this.get_element().querySelector("output").value = output;
        return this;
    }
}

class QuillSliderFloat extends QuillSlider {
    constructor(...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(...args);
        // TODO: validate min
        if (!Object.hasOwn(config, "min")) config.min = 0;
        // TODO: validate max
        if (!Object.hasOwn(config, "max")) config.max = 1;
        // TODO: validate step
        if (!Object.hasOwn(config, "step")) config.step = 0.01;
        super(null, label, config, callback, children, ...args.slice(count));
    }
}

class QuillSliderInteger extends QuillSlider {
    constructor(...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(...args);
        // TODO: validate min
        if (!Object.hasOwn(config, "min")) config.min = 0;
        // TODO: validate max
        if (!Object.hasOwn(config, "max")) config.max = 100;
        // TODO: validate step
        if (!Object.hasOwn(config, "step")) config.step = 1;
        super((value) => ~~value, label, config, callback, children, ...args.slice(count));
    }
}

class QuillSliderI extends QuillSliderInteger {
    constructor(min, max, ...args) {
        // TODO: validate min
        // TODO: validate max
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(...args);
        // TODO: validate min
        config.min = min;
        // TODO: validate max
        config.max = max;
        super(label, config, callback, children, ...args.slice(count));
    }
}

class QuillDrag extends QuillInputNumerical {
    static #initialized = false;
    static #drag_element = null;
    static #x;
    static #value;

    static #init() {
        if (QuillDrag.#initialized) return;
        QuillDrag.#initialized = true;
        window.addEventListener("mousemove", (e) => {
            const element = QuillDrag.#drag_element;
            if (element === null) return;
            const previous_value = element.get_value();
            // TODO: validate step
            const value = QuillDrag.#value + (e.screenX - QuillDrag.#x) * element._get_arg_config().step;
            element.set_value(value);
            const sanitized_value = element.get_value();
            // TODO: validate callback
            if (sanitized_value !== previous_value) element._get_arg_callback()(sanitized_value, element, e);
        });
        window.addEventListener("mouseup", () => (QuillDrag.#drag_element = null));
    }

    constructor(...args) {
        QuillDrag.#init();
        super(
            `<div class="quill-drag">
                <input class="quill-input" type="number">
                <output></output>
            </div>`,
            null,
            ...args
        );

        Util.add_mouse_down_event_listener(this.get_element().querySelector("output"), (e) => {
            if (this._get_input_element().closest("[disabled]") === null) QuillDrag.#start_dragging(this, e);
        });
    }

    // Public methods

    set_value(value) {
        // TODO: validate value
        super.set_value(value);
        const config = this._get_arg_config();
        const prefix = Util.html_string_from_object(Object.hasOwn(config, "prefix") ? config.prefix : "");
        const suffix = Util.html_string_from_object(Object.hasOwn(config, "suffix") ? config.suffix : "");
        const output = prefix + this.get_value() + suffix;
        this.get_element().querySelector("output").value = output;
        return this;
    }

    // Private methods

    static #start_dragging(drag_element, e) {
        // TODO: validate drag_element
        // TODO: validate e
        QuillDrag.#drag_element = drag_element;
        QuillDrag.#x = e.screenX;
        QuillDrag.#value = +drag_element.get_value();
    }
}

class QuillDragFloat extends QuillDrag {
    constructor(...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(...args);
        // TODO: validate step
        if (!Object.hasOwn(config, "step")) config.step = 0.01;
        super(null, label, config, callback, children, ...args.slice(count));
    }
}

class QuillDragInteger extends QuillDrag {
    constructor(...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(...args);
        // TODO: validate step
        if (!Object.hasOwn(config, "step")) config.step = 1;
        super((value) => ~~value, label, config, callback, children, ...args.slice(count));
    }
}

class QuillDragI extends QuillDragInteger {
    constructor(min, max, ...args) {
        // TODO: validate min
        // TODO: validate max
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(...args);
        // TODO: validate min
        config.min = min;
        // TODO: validate max
        config.max = max;
        super(label, config, callback, children, ...args.slice(count));
    }
}
