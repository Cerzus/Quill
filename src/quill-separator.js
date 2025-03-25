"use strict";

class QuillSeparator extends QuillElement {
    constructor(...args) {
        super(`<div class="quill-separator"></div>`, [], ...args);
    }
}
