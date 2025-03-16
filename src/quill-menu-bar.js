"use strict";

class QuillMenuBar extends QuillElement {
    constructor(children) {
        super(`<div class="quill-menu-bar"></div>`);
        this.add(children);
    }

    add_child(child) {
        this.get_element().append(child.get_element());
    }
}
