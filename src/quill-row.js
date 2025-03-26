"use strict";

class QuillRow extends QuillElement {
    constructor(...args) {
        super(
            `<div class="quill-row"></div>`,
            [QuillButton, QuillFieldset, QuillText, QuillInfoTooltip, QuillDropdown],
            ...args
        );
        this.add_children(this.get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
