"use strict";

class QuillTable extends QuillNodeElement {
    constructor(...args) {
        // TODO: validate args
        super(
            `<table class="quill-table">
                <thead></thead>
                <tbody></tbody>
            </table>`,
            [QuillWrapper, QuillTableHeaderRow, QuillTableRow],
            ...args
        );
        this.add_children(this._get_arg_children());
    }

    // Protected methods

    _add_child(child) {
        // TODO: validate child
        this.get_element().querySelector("tbody").append(child.get_element());
    }
}

class QuillTableRow extends QuillWrappableElement {
    constructor(...args) {
        // TODO: validate args
        super(`<tr class="quill-table-row"></tr>`, [QuillWrapper, QuillTableCell], ...args);
        this.add_children(this._get_arg_children());
    }

    // Protected methods

    _add_child(child) {
        // TODO: validate child
        this.get_element().append(child.get_element());
    }
}

class QuillTableHeaderRow extends QuillWrappableElement {
    constructor(...args) {
        // TODO: validate args
        super(`<tr class="quill-table-header-row"></tr>`, [QuillWrapper, QuillTableHeaderCell], ...args);
        this.add_children(this._get_arg_children());
    }

    // Protected methods

    _add_child(child) {
        // TODO: validate child
        this.get_element().append(child.get_element());
    }
}

class QuillTableCell extends QuillWrappableElement {
    constructor(child, ...args) {
        // TODO: validate child
        // TODO: validate args
        super(`<td class="quill-table-cell"></td>`, [QuillLeafElement, String, Number], ...args);
        if (typeof child !== "undefined") this.add_children(child);
    }

    // Protected methods

    _add_child(child) {
        // TODO: validate child
        this.get_element().append(child instanceof QuillElement ? child.get_element() : child);
    }
}

class QuillTableHeaderCell extends QuillWrappableElement {
    constructor(child, ...args) {
        // TODO: validate child
        // TODO: validate args
        super(`<td class="quill-table-header-cell"></td>`, [QuillLeafElement, String, Number], ...args);
        if (typeof child !== "undefined") this.add_children(child);
    }

    // Protected methods

    _add_child(child) {
        // TODO: validate child
        this.get_element().append(child instanceof QuillElement ? child.get_element() : child);
    }
}
