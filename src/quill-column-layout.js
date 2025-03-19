"use strict";

class QuillColumnLayout extends QuillElement {
    constructor(...args) {
        super(
            `<div class="quill-column-layout"></div>`,
            [QuillColumnLayout, QuillRowLayout, QuillFixedCanvas, QuillText],
            ...args
        );
        this.add_children(this.get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
}
