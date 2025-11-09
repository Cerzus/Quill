"use strict";

class QuillIndent extends QuillNodeElement {
    constructor(...args) {
        // TODO: validate args
        super(`<fieldset class="quill-indent"></fieldset>`, [QuillWrapper, QuillNodeElement], ...args);
        this.add_children(this._get_arg_children());
        // TODO: validate disabled
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        // TODO: validate disabled
        Util.disable_html_element(this.get_element(), disabled);
        return this;
    }

    // Protected methods

    _add_child(child) {
        // TODO: validate child
        this.get_element().append(child.get_element());
    }
}
