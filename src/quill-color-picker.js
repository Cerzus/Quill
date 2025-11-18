"use strict";

class QuillColorPicker extends QuillInput {
    constructor(...args) {
        super(`<input class="quill-input" type="color" />`, "input", null, [], null, ...args);
        const config = this._get_arg_config();
        // TODO: validate value
        if (Object.hasOwn(config, "value")) this.set_value(config.value);
    }
}
