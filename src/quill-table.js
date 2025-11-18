"use strict";

class QuillTable extends QuillNodeElement {
    constructor(...args) {
        super(
            `<table class="quill-table">
                <thead></thead>
                <tbody></tbody>
            </table>`,
            [QuillWrapper, QuillTableHeaderRow, QuillTableRow],
            (child) => this.#add_child(child),
            ...args
        );
        this.add_children(this._get_arg_children());
    }

    // Private methods

    #add_child(child) {
        this.get_element().querySelector("tbody").append(child.get_element());
    }
}

class QuillTableRow extends QuillWrappableElement {
    constructor(...args) {
        super(`<tr class="quill-table-row"></tr>`, [QuillWrapper, QuillTableCell], null, ...args);
        this.add_children(this._get_arg_children());
    }
}

class QuillTableHeaderRow extends QuillWrappableElement {
    constructor(...args) {
        super(`<tr class="quill-table-header-row"></tr>`, [QuillWrapper, QuillTableHeaderCell], null, ...args);
        this.add_children(this._get_arg_children());
    }
}

class QuillTableCell extends QuillWrappableElement {
    constructor(child, ...args) {
        // TODO: validate child
        super(
            `<td class="quill-table-cell"></td>`,
            [QuillLeafElement, String, Number],
            (child) => this.#add_child(child),
            ...args
        );
        if (typeof child !== "undefined") this.add_children(child);
    }

    // Private methods

    #add_child(child) {
        this.get_element().append(child instanceof QuillElement ? child.get_element() : child);
    }
}

class QuillTableHeaderCell extends QuillWrappableElement {
    constructor(child, ...args) {
        // TODO: validate child
        super(
            `<td class="quill-table-header-cell"></td>`,
            [QuillLeafElement, String, Number],
            (child) => this.#add_child(child),
            ...args
        );
        if (typeof child !== "undefined") this.add_children(child);
    }

    // Private methods

    #add_child(child) {
        this.get_element().append(child instanceof QuillElement ? child.get_element() : child);
    }
}
