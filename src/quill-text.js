"use strict";

class QuillText extends QuillLeafElement {
    constructor(text, ...args) {
        super(`<div class="quill-text">${text.replaceAll("\n", "<br>")}</div>`, [], ...args);
        const config = this._get_arg_config();
        if (config.color instanceof QuillColor) this.get_element().style.color = config.color.to_css();
        if (!!config.wrapped) this.get_element().classList.add("wrapped");
    }
}
