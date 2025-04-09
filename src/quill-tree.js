"use strict";

class QuillTree extends QuillBranchElement {
    #expanded = false;

    constructor(header, ...args) {
        super(
            `<div class="quill-tree">
                <div class="quill-tree-header">
                    <div class="quill-arrow-right"></div>
                    <div>${header}</div>
                </div>
                <div class="quill-tree-body quill-indent"></div>
            </div>`,
            [QuillWrapper, QuillNodeElement],
            ...args
        );
        this.add_children(this._get_arg_children());
        Util.add_mouse_down_event_listener(this.get_element().querySelector(".quill-tree-header"), (e) => {
            if (e.target.classList.contains("quill-close-button")) return;
            this.#set_expanded(!this.#expanded);
        });
        this.#set_expanded(!!this._get_arg_config().expanded);
    }

    // Public methods

    expand = () => this.#set_expanded(true);
    collapse = () => this.#set_expanded(false);

    // Private methods

    _add_child(child) {
        this.get_element().querySelector(".quill-tree-body").append(child.get_element());
    }
    #set_expanded(expanded) {
        this.get_element().classList[(this.#expanded = expanded) ? "add" : "remove"]("expanded");
        return this;
    }
}
