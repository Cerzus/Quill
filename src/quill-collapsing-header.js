"use strict";

class QuillCollapsingHeader extends QuillTree {
    #closeable;
    #on_close_callback;

    constructor(...args) {
        super(...args);
        const element = this.get_element();
        element.classList.remove("quill-tree");
        element.classList.add("quill-collapsing-header");

        this.#closeable = !!this.get_arg_config().closeable;
        if (this.#closeable) {
            const close_button = new QuillButton("&times;", { class: "quill-close-button" }, (_, e) => {
                this.hide();
                this.#on_close_callback?.(this, e);
            });
            element.querySelector(":nth-child(1").append(close_button.get_element());
        }
    }

    // Public methods

    on_close(callback) {
        this.#on_close_callback = callback;
        return this;
    }
}
