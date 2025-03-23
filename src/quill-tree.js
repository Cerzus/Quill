"use strict";

class QuillTree extends QuillElement {
    #opened = false;

    constructor(header, ...args) {
        super(
            `<div class="quill-tree">
                <div>
                    <div class="quill-arrow-right"></div>
                    ${header}
                </div>
                <div></div>
            </div>`,
            [QuillTree, QuillTable, QuillInfoTooltip, QuillFixedCanvas, QuillText, QuillButton],
            ...args
        );
        this.add_children(this.get_arg_children());
        this.get_element()
            .querySelector(":nth-child(1)")
            .addEventListener("mousedown", (e) => {
                if (e.button === 0) this.#set_opened(!this.#opened);
            });
    }

    // Public methods

    open = () => this.#set_opened(true);
    close = () => this.#set_opened(false);

    // Private methods

    _add_child(child) {
        this.get_element().querySelector(":nth-child(2)").append(child.get_element());
    }
    #set_opened(opened) {
        this.#opened = opened;
        if (opened) this.get_element().classList.add("opened");
        else this.get_element().classList.remove("opened");
    }
}
