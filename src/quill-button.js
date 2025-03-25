"use strict";

class QuillButton extends QuillElement {
    constructor(text, ...args) {
        super(`<div class="quill-button">${text}</div>`, [], ...args);
        Util.add_click_event_listener(this.get_element(), (e) => this.get_arg_callback()(this, e));
    }
}
