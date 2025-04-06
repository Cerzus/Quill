"use strict";

class QuillCheckbox extends QuillInput {
    constructor(...args) {
        const html = `<input class="quill-input" type="checkbox" />`;
        super(html, "change", null, [], ...args);
        this.set_checked(!!this._get_arg_config().checked);
    }

    // Public methods

    get_value = () => this.get_input_element().checked;
    set_value(value) {
        this.get_input_element().checked = !!value;
        return this;
    }
    is_checked = this.get_value;
    set_checked = this.set_value;
}
