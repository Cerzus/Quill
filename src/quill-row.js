"use strict";

class QuillRow extends QuillBranchElement {
    constructor(...args) {
        super(`<fieldset class="quill-row"></fieldset>`, [QuillWrapper, QuillNodeElement], ...args);
        this.add_children(this._get_arg_children());
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        Util.disable_html_element(this.get_element(), disabled);
        return this;
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
