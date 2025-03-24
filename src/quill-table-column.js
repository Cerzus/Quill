"use strict";

class QuillTableColumn extends QuillElement {
    constructor(child, ...args) {
        super(`<td class="quill-table-column"></td>`, [QuillButton, String, Number], ...args);
        if (typeof child !== "undefined") this.add_children(child);
    }

    _add_child(child) {
        this.get_element().append(child instanceof QuillElement ? child.get_element() : child);
    }
}
