"use strict";

class QuillMenuItem extends QuillElement {
    static #ctrl_keys = {};
    #toggleable = false;
    #toggled = false;

    static init() {
        window.addEventListener("keydown", (e) => {
            if (e.ctrlKey && QuillMenuItem.#ctrl_keys[e.key]) {
                QuillMenuItem.#ctrl_keys[e.key](e);
                e.preventDefault();
            }
        });
    }

    constructor(title, ...args) {
        super(
            `<label class="quill-menu-item">
                <div></div>
                <div>${title}</div>
                <div></div>
                <div></div>
            </label>`,
            [],
            ...args
        );

        const config = this.get_arg_config();
        this.#set_toggleable(config.toggleable);
        this.#set_toggled_init(config.toggled);
        this.get_element().addEventListener("mouseup", (e) => {
            if (e.button === 0) {
                if (this.#toggleable) this.#set_toggled(!this.#toggled);
                this.get_arg_callback()(this, e);
                e.preventDefault();
            }
        });
        if (config.ctrl_key) {
            QuillMenuItem.#ctrl_keys[config.ctrl_key.toLowerCase()] = (e) => {
                if (this.#toggleable) this.#set_toggled_init(!this.#toggled);
                this.get_arg_callback()(this, e);
            };
            this.get_element().querySelector(":nth-child(3)").innerHTML = `Ctrl+${config.ctrl_key.toUpperCase()}`;
        }
    }

    // Public methods

    is_toggleable = () => this.#toggleable;
    is_toggled = () => this.#toggled;
    set_toggle = (toggle) => this.#set_toggled_init(toggle);

    // Private methods

    #set_toggleable(toggleable) {
        this.#toggleable = !!toggleable;
        if (this.#toggleable) {
            this.get_element()
                .querySelector(":nth-child(1)")
                .append(new QuillElement(`<input type="checkbox" />`).get_element());
        }
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
