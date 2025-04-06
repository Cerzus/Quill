"use strict";

class QuillFieldset extends QuillBranchElement {
    constructor(legend, ...args) {
        super(
            `<fieldset class="quill-fieldset"><legend>${legend}</fieldset></fieldset>`,
            [QuillTable, QuillSeparator, QuillDropdown, QuillInputNumerical, QuillCheckbox],
            ...args
        );
        this.add_children(this._get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
