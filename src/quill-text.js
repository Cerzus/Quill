"use strict";

class QuillText extends QuillElement {
    constructor(text, ...args) {
        super(`<div class="quill-text">${text}</div>`, [], ...args);
    }
}
