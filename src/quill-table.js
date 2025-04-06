"use strict";

class QuillTable extends QuillBranchElement {
    constructor(...args) {
        super(
            `<table class="quill-table">
                <thead></thead>
                <tbody></tbody>
                <tfoot></tfoot>
            </table>`,
            [QuillTableRow],
            ...args
        );
        this.add_children(this._get_arg_children());
    }

    // Private methods

    _add_child(child) {
        if (child instanceof QuillTableRow) this.get_element().querySelector("tbody").append(child.get_element());
    }
}

class QuillTableRow extends QuillElement {
    constructor(...args) {
        super(`<tr class="quill-table-row"></tr>`, [QuillTableColumn], ...args);
        this.add_children(this._get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}

class QuillTableColumn extends QuillElement {
    constructor(child, ...args) {
        super(`<td class="quill-table-column"></td>`, [QuillLeafElement, String, Number], ...args);
        if (typeof child !== "undefined") this.add_children(child);
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child instanceof QuillElement ? child.get_element() : child);
    }
}
