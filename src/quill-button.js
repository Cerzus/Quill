"use strict";

class QuillButton extends QuillLeafElement {
    constructor(text, ...args) {
        // TODO: validate text
        // TODO: validate args
        super(`<button class="quill-button">${text}</button>`, [], ...args);
        // TODO: validate callback
        Util.add_click_event_listener(this.get_element(), (e) => this._get_arg_callback()(this, e));
        // TODO: validate disabled
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        // TODO: validate disabled
        Util.disable_html_element(this.get_element(), disabled);
        return this;
    }
}
