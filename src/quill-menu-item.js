"use strict";

class QuillMenuItem extends QuillElement {
    #toggleable = false;
    #toggled = false;

    constructor(title) {
        super(`<label class="quill-menu-item">${title}</label>`);

        const add_mouse_up_event_listener = (callback) => {
            this.get_element().addEventListener("mouseup", (e) => {
                if (e.button === 0) {
                    if (this.#toggleable) this.#set_toggled(!this.#toggled);
                    callback(this, e);
                    e.preventDefault();
                    return false;
                }
            });
        };

        if (arguments[1] instanceof Function) {
            add_mouse_up_event_listener(arguments[1]);
        } else if (arguments[1] instanceof Object) {
            const config = arguments[1];
            this.#set_toggleable(config.toggleable);
            this.#set_toggled_init(config.toggled);
            if (arguments[2] instanceof Function) {
                add_mouse_up_event_listener(arguments[2]);
            }
        }
    }

    is_toggleable = () => this.#toggleable;
    is_toggled = () => this.#toggled;
    set_toggle = (toggle) => this.#set_toggled_init(toggle);

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
