"use strict";

class QuillInfoTooltip extends QuillElement {
    constructor(text, ...args) {
        super(`<div title="${text}" class="quill-info-tooltip"></div>`, ...args);
    }
}
