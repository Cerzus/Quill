"use strict";

class QuillButton extends QuillLeafElement {
    constructor(text, ...args) {
        super(`<button class="quill-button">${Util.html_string_from_object(text)}</button>`, [], null, ...args);
        Util.add_click_event_listener(this.get_element(), (e) => this._get_arg_callback()(this, e));
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        Util.disable_html_element(this.get_element(), !!disabled);
        return this;
    }

    set_text(text) {
        // TODO: validate text
        this.get_element().innerHTML = Util.html_string_from_object(text);
        return this;
    }
}
