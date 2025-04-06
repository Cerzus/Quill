"use strict";

class QuillWrapper extends QuillWrappableElement {
    constructor(...args) {
        super(`<div class="quill-wrapper"></div>`, [QuillWrappableElement], ...args);
        this.add_children(this._get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
