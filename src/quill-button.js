"use strict";

class QuillButton extends QuillLeafElement {
    constructor(text, ...args) {
        super(`<button class="quill-button">${text}</button>`, [], ...args);
        Util.add_click_event_listener(this.get_element(), (e) => this._get_arg_callback()(this, e));
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        if (disabled) this.get_element().setAttribute("disabled", "");
        else this.get_element().removeAttribute("disabled");
        return this;
    }
}
