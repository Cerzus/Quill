"use strict";

class QuillInfoTooltip extends QuillLeafElement {
    constructor(text, ...args) {
        super(`<div title="${Util.html_string_from_object(text)}" class="quill-info-tooltip"></div>`, [], null, ...args);
    }
}
