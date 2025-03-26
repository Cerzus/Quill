"use strict";

class QuillTableRow extends QuillElement {
    constructor(...args) {
        super(`<tr class="quill-table-row"></tr>`, [QuillTableColumn], ...args);
        this.add_children(this.get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
