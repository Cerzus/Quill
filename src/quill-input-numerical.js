"use strict";

class QuillInputNumerical extends QuillInput {
    #min = null;
    #max = null;
    #step = null;
    #sanitize_value;

    constructor(html, event_type, sanitize_value, ...args) {
        super(html, event_type, sanitize_value, [], ...args);
        this.#sanitize_value = sanitize_value ?? ((value) => value);
        const config = this._get_arg_config();
        if (Object.hasOwn(config, "min")) this.#set_min(config.min);
        if (Object.hasOwn(config, "max")) this.#set_max(config.max);
        if (Object.hasOwn(config, "step")) this.#set_step(config.step);
        if (Object.hasOwn(config, "value")) this.set_value(config.value);
    }

    // Public methods

    set_value(value) {
        return super.set_value(this.#apply_min(this.#apply_max(this.#apply_step(value))));
    }

    // Private methods

    #set_min = (min) => (this.get_input_element().min = this.#min = this.#sanitize_value(min));
    #set_max = (max) => (this.get_input_element().max = this.#max = this.#sanitize_value(max));
    #set_step = (step) => (this.get_input_element().step = this.#step = this.#sanitize_value(step));

    #apply_min = (value) => (this.#min === null ? value : Math.max(value, this.#min));
    #apply_max = (value) => (this.#max === null ? value : Math.min(value, this.#max));
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
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(
            ...args
        );
        config.min = min;
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
    }

    // Public methods

    set_value(value) {
        const config = this._get_arg_config();
        super.set_value(value);
        const output = (config.prefix ?? "") + this.get_value() + (config.suffix ?? "");
        this.get_element().querySelector("output").value = output;
        return this;
    }
}

class QuillSliderFloat extends QuillSlider {
    constructor(...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(
            ...args
        );
        if (!Object.hasOwn(config, "min")) config.min = 0;
        if (!Object.hasOwn(config, "max")) config.max = 1;
        if (!Object.hasOwn(config, "step")) config.step = 0.01;
        super(null, label, config, callback, children, ...args.slice(count));
    }
}

class QuillSliderInteger extends QuillSlider {
    constructor(...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(
            ...args
        );
        if (!Object.hasOwn(config, "min")) config.min = 0;
        if (!Object.hasOwn(config, "max")) config.max = 100;
        if (!Object.hasOwn(config, "step")) config.step = 1;
        super((value) => ~~value, label, config, callback, children, ...args.slice(count));
    }
}

class QuillSliderI extends QuillSliderInteger {
    constructor(min, max, ...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(
            ...args
        );
        config.min = min;
        config.max = max;
        super(label, config, callback, children, ...args.slice(count));
    }
}

class QuillDrag extends QuillInputNumerical {
    static #initialized = false;
    static #drag_element = null;
    static #x;
    static #value;

    // TODO: Make private somehow
    static init() {
        if (QuillDrag.#initialized) return;
        QuillDrag.#initialized = true;
        window.addEventListener("mousemove", (e) => {
            const element = QuillDrag.#drag_element;
            if (element === null) return;
            const previous_value = element.get_value();
            const value = QuillDrag.#value + (e.screenX - QuillDrag.#x) * element._get_arg_config().step;
            element.set_value(value);
            const sanitized_value = element.get_value();
            if (sanitized_value !== previous_value) element._get_arg_callback()(sanitized_value, element, e);
        });
        window.addEventListener("mouseup", () => (QuillDrag.#drag_element = null));
    }

    constructor(...args) {
        super(
            `<div class="quill-drag">
                <input class="quill-input" type="number">
                <output></output>
            </div>`,
            null,
            ...args
        );

        Util.add_mouse_down_event_listener(this.get_element().querySelector("output"), (e) => {
            QuillDrag.#start_dragging(this, e);
        });
    }

    // Public methods

    set_value(value) {
        super.set_value(value);
        const output = (this._get_arg_config().prefix ?? "") + this.get_value() + (this._get_arg_config().suffix ?? "");
        this.get_element().querySelector("output").value = output;
        return this;
    }

    // Private methods

    static #start_dragging(drag_element, e) {
        QuillDrag.#drag_element = drag_element;
        QuillDrag.#x = e.screenX;
        QuillDrag.#value = +drag_element.get_value();
    }
}

class QuillDragFloat extends QuillDrag {
    constructor(...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(
            ...args
        );
        if (!Object.hasOwn(config, "step")) config.step = 0.01;
        super(null, label, config, callback, children, ...args.slice(count));
    }
}

class QuillDragInteger extends QuillDrag {
    constructor(...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(
            ...args
        );
        if (!Object.hasOwn(config, "step")) config.step = 1;
        super((value) => ~~value, label, config, callback, children, ...args.slice(count));
    }
}

class QuillDragI extends QuillDragInteger {
    constructor(min, max, ...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(
            ...args
        );
        config.min = min;
        config.max = max;
        super(label, config, callback, children, ...args.slice(count));
    }
}
