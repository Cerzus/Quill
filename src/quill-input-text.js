"use strict";

class QuillInputText extends QuillInput {
    constructor(...args) {
        const html = `<input class="quill-input" type="text" />`;
        super(html, "change", null, [], ...args);
        const config = this._get_arg_config();
        if (Object.hasOwn(config, "value")) this.set_value(config.value);
        if (Object.hasOwn(config, "placeholder")) this.get_input_element().placeholder = config.placeholder;
    }
}
