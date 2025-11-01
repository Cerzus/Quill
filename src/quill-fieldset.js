"use strict";

class QuillFieldset extends QuillBranchElement {
    constructor(legend, ...args) {
        super(
            `<fieldset class="quill-fieldset"><legend>${legend}</legend></fieldset>`,
            [QuillWrapper, QuillNodeElement],
            ...args
        );
        this.add_children(this._get_arg_children());
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        if (disabled) this.get_element().setAttribute("disabled", "");
        else this.get_element().removeAttribute("disabled");
        return this;
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
