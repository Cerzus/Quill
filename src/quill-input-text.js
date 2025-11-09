"use strict";

class QuillInputText extends QuillInput {
    constructor(...args) {
        // TODO: validate args
        const html = `<input class="quill-input" type="text" />`;
        super(html, "change", null, [], ...args);
        const config = this._get_arg_config();
        // TODO: validate value
        if (Object.hasOwn(config, "value")) this.set_value(config.value);
        // TODO: validate placeholder
        if (Object.hasOwn(config, "placeholder")) this.get_input_element().placeholder = config.placeholder;
        // TODO: validate length
        if (Object.hasOwn(config, "length")) {
            this.get_input_element().size = config.length;
            this.get_input_element().maxLength = config.length;
        }
    }
}

class QuillInputBase extends QuillInput {
    #base;

    constructor(base, ...args) {
        // TODO: validate base
        // TODO: validate args
        super(`<input class="quill-input" type="text" />`, "change", sanitize_value, [], ...args);
        this.#base = Math.max(2, ~~base);
        const config = this._get_arg_config();
        const max_length = Math.ceil(Math.log(2147483647) / Math.log(this.#base));
        // TODO: validate length
        const length = Math.min(Math.max(1, ~~config.length ?? max_length), max_length);
        // TODO: validate value
        this.set_value(config.value ?? 0);
        this.get_input_element().size = length;
        this.get_input_element().maxLength = length;
        function sanitize_value(x) {
            const integer = (typeof x === "number" ? x : parseInt(x, this.#base)) >>> 0;
            const str = integer.toString(base);
            return str.substring(str.length - length).padStart(length, 0);
        }
    }

    // Public methods

    get_value() {
        return parseInt(super.get_value(), this.#base);
    }
}
