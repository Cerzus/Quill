"use strict";

class QuillButton extends QuillElement {
    constructor(text, ...args) {
        super(`<div class="quill-button">${text}</div>`, [], ...args);
        this.get_element().addEventListener("click", (e) => {
            if (e.button === 0) this.get_arg_callback()(this, e);
        });
    }
}
