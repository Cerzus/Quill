"use strict";

class QuillTable extends QuillElement {
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
        this.add_children(this.get_arg_children());
    }

    // Private methods

    _add_child(child) {
        if (child instanceof QuillTableRow) this.get_element().querySelector("tbody").append(child.get_element());
    }
}
