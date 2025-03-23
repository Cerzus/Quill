"use strict";

class QuillInfoTooltip extends QuillElement {
    constructor(text, ...args) {
        super(`<span title="${text}" class="quill-info-tooltip"></span>`, ...args);
    }
}
