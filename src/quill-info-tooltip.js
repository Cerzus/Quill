"use strict";

class QuillInfoTooltip extends QuillLeafElement {
    constructor(text, ...args) {
        super(`<div class="quill-info-tooltip"></div>`, [], null, ...args);
        this.set_tooltip(text);
    }
}
