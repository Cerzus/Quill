"use strict";

class QuillMenuItem extends QuillElement {
    #toggleable = false;
    #toggled = false;

    constructor(title, ...args) {
        super(`<label class="quill-menu-item">${title}</label>`, ...args);
        this.#set_toggleable(this.get_arg_config().toggleable);
        this.#set_toggled_init(this.get_arg_config().toggled);
        this.get_element().addEventListener("mouseup", (e) => {
            if (e.button === 0) {
                if (this.#toggleable) this.#set_toggled(!this.#toggled);
                this.get_arg_callback()(this, e);
                e.preventDefault();
                return false;
            }
        });
    }

    // Public methods

    is_toggleable = () => this.#toggleable;
    is_toggled = () => this.#toggled;
    set_toggle = (toggle) => this.#set_toggled_init(toggle);

    // Private methods

    #set_toggleable(toggleable) {
        this.#toggleable = !!toggleable;
        if (this.#toggleable) this.get_element().prepend(new QuillElement(`<input type="checkbox" />`).get_element());
    }
    #set_toggled_init(toggled) {
        this.#set_toggled(toggled);
        if (this.#toggleable) {
            const checkbox = this.get_element().querySelector('input[type="checkbox"]');
            checkbox.checked = this.#toggled;
        }
    }
    #set_toggled(toggled) {
        this.#toggled = !!toggled;
    }
}
