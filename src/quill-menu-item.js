"use strict";

class QuillMenuItem extends QuillElement {
    constructor(title, callback) {
        super(`<div class="quill-menu-item">${title}</div>`);
        this.get_element().addEventListener("mouseup", callback);
    }
}
