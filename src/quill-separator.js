"use strict";

class QuillSeparator extends QuillLeafElement {
    constructor(...args) {
        // TODO: validate args
        super(`<div class="quill-separator"></div>`, [], ...args);
    }
}
