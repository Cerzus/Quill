class QuillInput extends QuillLeafElement {
    #input_element;
    #sanitize_value;

    constructor(html, event_type, sanitize_value, allowed_children, add_child_callback, ...args) {
        // TODO: validate html
        // TODO: validate event_type
        // TODO: validate sanitize_value
        // TODO: validate allowed_children
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(...args);
        const wrapper_element = (label || label === 0) && html.indexOf("quill-radio-buttons") < 0 ? "label" : "div";
        super(
            `<${wrapper_element} class="quill-label"><div>${html}</div><div>${label ?? ""}</div></${wrapper_element}>`,
            allowed_children,
            add_child_callback,
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
                // TODO: validate callback
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
        // TODO: validate value
        this.#input_element.value = this.#sanitize_value(value);
        return this;
    }

    set_disabled(disabled) {
        Util.disable_html_element(this._get_input_element(), !!disabled);
        return this;
    }

    // Protected methods

    _get_input_element = () => this.#input_element;
}

class QuillInputMultiComponent extends QuillLeafElement {
    #inputs = [];

    constructor(which, n, ...args) {
        // TODO: validate which
        // TODO: validate n
        const { label, config, callback, count } = Util.label_config_callback_and_children_from_arguments(...args);
        const html = `<div class="quill-label"><div><div class="quill-multi-component-input"></div></div></div>`;
        super(html, [], null, config, callback, ...args.slice(count));
        for (let i = 0; i < n; i++) {
            const input = new which(config, (...args) => callback(this.get_value(), this, ...args.slice(2)));
            this.get_element().querySelector(".quill-multi-component-input").append(input.get_element());
            this.#inputs.push(input);
        }
        this.get_element().append(Util.element_from_html(`<div>${label ?? ""}</div>`));
        // TODO: validate value
        this.set_value(config.value);
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    get_value = () => this.#inputs.map((x) => x.get_value());

    set_value(value) {
        // TODO: validate value
        for (let i = 0; i < Math.min(this.#inputs.length, value.length); i++) {
            this.#inputs[i].set_value(value[i]);
        }
        return this;
    }

    set_disabled(disabled) {
        for (let i = 0; i < this.#inputs.length; i++) {
            this.#inputs[i].set_disabled(!!disabled);
        }
        return this;
    }
}
