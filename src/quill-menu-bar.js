"use strict";

class QuillMenuBar extends QuillElement {
    constructor(...args) {
        super(`<div class="quill-menu-bar"></div>`, [QuillMenu], ...args);
        this.add_children(this.get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
