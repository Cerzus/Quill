"use strict";

class QuillCollapsingHeader extends QuillTree {
    constructor(...args) {
        super(...args);
        const element = this.get_element();
        element.classList.remove("quill-tree");
        element.classList.add("quill-collapsing-header");
    }
}
