"use strict";

class QuillInfoTooltip extends QuillLeafElement {
    constructor(text, ...args) {
        super(`<div title="${text.replaceAll(`"`, `&quot;`)}" class="quill-info-tooltip"></div>`, [], ...args);
    }
}
