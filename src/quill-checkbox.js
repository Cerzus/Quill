"use strict";

class QuillCheckbox extends QuillInput {
    constructor(...args) {
        const html = `<input class="quill-input" type="checkbox" />`;
        super(html, "change", null, [], null, ...args);
        const config = this._get_arg_config();
        this.set_value(!!config.value);
        this.set_checked(!!config.checked);
    }

    // Public methods

    get_value = () => this._get_input_element().checked;

    set_value(value) {
        this._get_input_element().indeterminate = false;
        this._get_input_element().checked = !!value;
        return this;
    }

    is_checked = this.get_value;

    set_checked = this.set_value;

    is_indeterminate = () => this._get_input_element().indeterminate;

    set_indeterminate() {
        this._get_input_element().checked = false;
        this._get_input_element().indeterminate = true;
        return this;
    }
}
