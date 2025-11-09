"use strict";

class QuillSpacing extends QuillLeafElement {
    constructor(...args) {
        // TODO: validate args
        super(`<div class="quill-spacing"></div>`, [], ...args);
    }
}
