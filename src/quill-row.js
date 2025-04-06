"use strict";

class QuillRow extends QuillBranchElement {
    constructor(...args) {
        super(
            `<div class="quill-row"></div>`,
            [QuillButton, QuillFieldset, QuillTable, QuillText, QuillInfoTooltip, QuillDropdown],
            ...args
        );
        this.add_children(this._get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
