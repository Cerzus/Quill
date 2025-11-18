"use strict";

class QuillWrapper extends QuillWrappableElement {
    constructor(...args) {
        super(`<fieldset class="quill-wrapper"></fieldset>`, [QuillWrappableElement], null, ...args);
        this.add_children(this._get_arg_children());
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        Util.disable_html_element(this.get_element(), !!disabled);
        return this;
    }
}
