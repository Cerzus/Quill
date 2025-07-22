class QuillInput extends QuillLeafElement {
    #input_element;
    #sanitize_value;

    constructor(html, event_type, sanitize_value, allowed_children, ...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(
            ...args
        );
        const wrapper_element = label || label === 0 ? "label" : "div";
        super(
            `<${wrapper_element} class="quill-label">${html}${label ?? ""}</${wrapper_element}>`,
            allowed_children,
            config,
            callback,
            children,
            ...args.slice(count)
        );
        this.#sanitize_value = sanitize_value ?? ((value) => value);
        this.#input_element = this.get_element().querySelector(`input, select, fieldset`);
        if (event_type !== null) {
            this.get_element().addEventListener(event_type, (e) => {
                this.set_value(this.get_value());
                this._get_arg_callback()(this.get_value(), this, e);
            });
        }
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    get_value() {
        if (["number", "range"].includes(this.#input_element.type)) return +this.#input_element.value;
        else return this.#input_element.value;
    }
    set_value(value) {
        this.#input_element.value = this.#sanitize_value(value);
        return this;
    }
    set_disabled(disabled) {
        if (disabled) this.get_input_element().setAttribute("disabled", "");
        else this.get_input_element().removeAttribute("disabled");
        return this;
    }
    get_input_element = () => this.#input_element; // TODO: Keep public? No
}

class QuillInputMultiComponent extends QuillLeafElement {
    #inputs = [];

    constructor(which, n, ...args) {
        const { label, config, callback, count } = Util.label_config_callback_and_children_from_arguments(...args);
        const wrapper_element = label || label === 0 || label === "" ? "label" : "div";
        const html = `<${wrapper_element} class="quill-label"><div class="quill-multi-component-input"></div></${wrapper_element}>`;
        super(html, [], config, callback, ...args.slice(count));
        for (let i = 0; i < n; i++) {
            const input = new which(config, (...args) => callback(this.get_value(), this, ...args.slice(2)));
            this.get_element().querySelector(".quill-multi-component-input").append(input.get_element());
            this.#inputs.push(input);
        }
        this.get_element().append(label ?? "");
        this.set_value(config.value);
    }

    // Public methods

    get_value = () => this.#inputs.map((x) => x.get_value());
    set_value(value) {
        for (let i = 0; i < Math.min(this.#inputs.length, value.length); i++) {
            this.#inputs[i].set_value(value[i]);
        }
        return this;
    }
    set_disabled(disabled) {
        for (let i = 0; i < this.#inputs.length; i++) {
            this.#inputs[i].set_disabled(disabled);
        }
        return this;
    }
}
