"use strict";

class QuillButton extends QuillElement {
    constructor(text, ...args) {
        super(`<div class="quill-button">${text}</div>`, [], ...args);
        this.get_element().addEventListener("click", (e) => {
            if (e.button === 0) this.get_arg_callback()(this, e);
        });
        // This is to prevent moving of panels when over the close button
        this.get_element().addEventListener("mousedown", (e) => {
            if (e.button === 0) e.stopPropagation();
        });
    }
}
