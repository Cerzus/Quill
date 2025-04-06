"use strict";

class QuillSeparator extends QuillLeafElement {
    constructor(...args) {
        super(`<div class="quill-separator"></div>`, [], ...args);
    }
}
