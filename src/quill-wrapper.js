"use strict";

class QuillWrapper extends QuillWrappableElement {
    constructor(...args) {
        // TODO: validate args
        super(`<fieldset class="quill-wrapper"></fieldset>`, [QuillWrappableElement], ...args);
        this.add_children(this._get_arg_children());
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        Util.disable_html_element(this.get_element(), !!disabled);
        return this;
    }

    // Protected methods

    _add_child(child) {
        // TODO: validate child
        this.get_element().append(child.get_element());
    }
}
