"use strict";

class QuillTree extends QuillElement {
    #expanded = false;

    constructor(header, ...args) {
        super(
            `<div class="quill-tree">
                <div class="quill-tree-header">
                    <div class="quill-arrow-right"></div>
                    <div>${header}</div>
                </div>
                <div class="quill-tree-body"></div>
            </div>`,
            [
                QuillTree,
                QuillTable,
                QuillInfoTooltip,
                QuillFixedCanvas,
                QuillText,
                QuillButton,
                QuillRow,
                QuillCheckbox,
                QuillSeparator,
            ],
            ...args
        );
        this.add_children(this.get_arg_children());
        Util.add_mouse_down_event_listener(this.get_element().querySelector(".quill-tree-header"), (e) => {
            if (e.target.classList.contains("quill-close-button")) return;
            this.#set_expanded(!this.#expanded);
        });
        this.#set_expanded(!!this.get_arg_config().expanded);
    }

    // Public methods

    expand = () => this.#set_expanded(true);
    collapse = () => this.#set_expanded(false);

    // Private methods

    _add_child(child) {
        this.get_element().querySelector(".quill-tree-body").append(child.get_element());
    }
    #set_expanded(expanded) {
        this.#expanded = expanded;
        if (expanded) this.get_element().classList.add("expanded");
        else this.get_element().classList.remove("expanded");
        return this;
    }
}
