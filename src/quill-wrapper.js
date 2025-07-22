"use strict";

class QuillWrapper extends QuillWrappableElement {
    constructor(...args) {
        super(`<fieldset class="quill-wrapper"></fieldset>`, [QuillWrappableElement], ...args);
        this.add_children(this._get_arg_children());
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        if (disabled) this.get_element().setAttribute("disabled", "");
        else this.get_element().removeAttribute("disabled");
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
