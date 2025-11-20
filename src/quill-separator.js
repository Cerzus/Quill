"use strict";

class QuillSeparator extends QuillLeafElement {
    constructor(...args) {
        super(`<div class="quill-separator"></div>`, [], null, ...args);
    }
}

class QuillSeparatorText extends QuillLeafElement {
    constructor(text, ...args) {
        super(
            `<fieldset class="quill-separator-text"><legend>${Util.html_string_from_object(text)}</legend></fieldset>`,
            [],
            null,
            ...args
        );
    }
}
