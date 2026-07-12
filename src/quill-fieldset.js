"use strict";

class QuillFieldset extends QuillNodeElement {
    constructor(legend, ...args) {
        super(
            `<fieldset class="quill-fieldset"><legend>${Util.html_string_from_object(legend)}</legend></fieldset>`,
            [QuillWrapper, QuillNodeElement],
            null,
            ...args
        );
        this.add_children(this._get_arg_children());
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    disable = () => this.set_disabled(true);
    enable = () => this.set_disabled(false);
    set_disabled(disabled) {
        Util.disable_html_element(this.get_element(), !!disabled);
        return this;
    }
}
