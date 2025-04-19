"use strict";

class QuillBasePanel extends QuillElement {
    #name;
    #closeable;
    #on_close_callback;
    #panel_element;

    constructor(name, is_modal, start_moving_panel, start_resizing_panel, ...args) {
        const html = `
            <div class="quill-panel">
                <div class="quill-panel-title-bar"><div>${name}</div></div>
                <div class="quill-panel-menu-bar-container"></div>
                <div class="quill-panel-content"><div></div></div>
                <div class="quill-panel-resizer">
                    <div></div><div></div><div></div>
                    <div></div><div></div><div></div>
                    <div></div><div></div><div></div>
                </div>
            </div>`;
        super(
            is_modal ? `<div class="quill-modal-overlay">${html}</div>` : html,
            [QuillWrapper, QuillNodeElement, QuillMenuBar],
            ...args
        );

        const element = this.get_element();

        this.#name = name;
        this.#closeable = !this._get_arg_config().not_closeable;

        this.#panel_element = is_modal ? element.querySelector("div") : element;

        Util.add_mouse_down_event_listener(element.querySelector(".quill-panel-title-bar"), (e) =>
            start_moving_panel(this, e)
        );
        Util.add_mouse_down_event_listener(element.querySelector(".quill-panel-resizer"), (e) =>
            start_resizing_panel(this, e)
        );

        if (this.#closeable) {
            const close_button = new QuillButton("&times;", { class: "quill-close-button" }, (_, e) => {
                this.close();
                this.#on_close_callback?.(this, e);
            });
            element.querySelector(".quill-panel-title-bar").append(close_button.get_element());
        }

        this.add_children(this._get_arg_children());
    }

    // Public methods

    is_closeable = () => this.#closeable;
    get_name = () => this.#name;
    on_close(callback) {
        this.#on_close_callback = callback;
        return this;
    }
    get_position() {
        const display = this.#panel_element.style.display;
        // Hidden panels return 0 for offsets, so when necessary we temporarily unhide the panel
        this.#panel_element.style.display = "";
        const position = { top: this.#panel_element.offsetTop, left: this.#panel_element.offsetLeft };
        this.#panel_element.style.display = display;
        return position;
    }
    get_size() {
        const display = this.#panel_element.style.display;
        // Hidden panels return 0 for offsets, so when necessary we temporarily unhide the panel
        this.#panel_element.style.display = "";
        const size = { width: this.#panel_element.offsetWidth, height: this.#panel_element.offsetHeight };
        this.#panel_element.style.display = display;
        return size;
    }
    set_position(position) {
        this.#panel_element.style.top = `${position.top}px`;
        this.#panel_element.style.left = `${position.left}px`;
    }
    set_size(size) {
        this.#panel_element.style.width = `${size.width}px`;
        this.#panel_element.style.height = `${size.height}px`;
    }

    // Private methods

    _add_child(child) {
        if (child instanceof QuillMenuBar) {
            this.get_element().querySelector(".quill-panel-menu-bar-container").append(child.get_element());
        } else {
            this.get_element().querySelector(".quill-panel-content > div").append(child.get_element());
        }
    }
}

// Keep this around for now, because QuillElement needs to know about this class.
class QuillPanel extends QuillBasePanel {}
