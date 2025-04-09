"use strict";

class QuillIndent extends QuillBranchElement {
    constructor(...args) {
        super(`<div class="quill-indent"></div>`, [QuillWrapper, QuillNodeElement], ...args);
        this.add_children(this._get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
