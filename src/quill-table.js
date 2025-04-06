"use strict";

class QuillTable extends QuillBranchElement {
    constructor(...args) {
        super(
            `<table class="quill-table">
                <thead></thead>
                <tbody></tbody>
                <tfoot></tfoot>
            </table>`,
            [QuillWrapper, QuillTableRow],
            ...args
        );
        this.add_children(this._get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().querySelector("tbody").append(child.get_element());
    }
}

class QuillTableRow extends QuillWrappableElement {
    constructor(...args) {
        super(`<tr class="quill-table-row"></tr>`, [QuillWrapper, QuillTableColumn], ...args);
        this.add_children(this._get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}

class QuillTableColumn extends QuillWrappableElement {
    constructor(child, ...args) {
        super(`<td class="quill-table-column"></td>`, [QuillLeafElement, String, Number], ...args);
        if (typeof child !== "undefined") this.add_children(child);
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child instanceof QuillElement ? child.get_element() : child);
    }
}
