"use strict";

class QuillCheckbox extends QuillInput {
    constructor(...args) {
        // TODO: validate args
        const html = `<div class="quill-checkbox-wrapper"><input class="quill-input" type="checkbox" /></div>`;
        super(html, "change", null, [], ...args);
        const config = this._get_arg_config();
        // TODO: validate value
        this.set_value(!!config.value);
        // TODO: validate checked
        this.set_checked(!!config.checked);
    }

    // Public methods

    get_value = () => this.get_input_element().checked;

    set_value(value) {
        // TODO: validate value
        this.get_input_element().indeterminate = false;
        this.get_input_element().checked = !!value;
        return this;
    }

    is_checked = this.get_value;

    set_checked = this.set_value;

    is_indeterminate = () => this.get_input_element().indeterminate;

    set_indeterminate() {
        this.get_input_element().checked = false;
        this.get_input_element().indeterminate = true;
        return this;
    }
}
