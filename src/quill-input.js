class QuillInput extends QuillLeafElement {
    #input_element;
    #sanitize_value;

    constructor(html, event_type, sanitize_value, allowed_children, label, ...args) {
        super(label ? `<label class="quill-label">${html}${label}</label>` : html, allowed_children, ...args);
        const element = label ? this.get_element().querySelector(`input, select`) : this.get_element();
        // super(`<label class="quill-label">${html}${label ?? ""}</label>`, allowed_children, ...args);
        // const element = this.get_element().querySelector(`input, select`);
        this.#input_element = element;
        this.#sanitize_value = sanitize_value || ((value) => value);
        element.addEventListener(event_type, (e) => {
            this.set_value(this.get_value());
            this._get_arg_callback()(this.get_value(), this, e);
        });
    }

    // Public methods

    get_value = () => this.#input_element.value;
    set_value(value) {
        this.#input_element.value = this.#sanitize_value(value);
        return this;
    }
    get_input_element = () => this.#input_element; // Keep public?
}
