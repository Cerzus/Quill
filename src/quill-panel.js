"use strict";

class QuillBasePanel extends QuillElement {
    #name;
    #has_title_bar;
    #has_menu_bar;
    #can_move;
    #can_grow;
    #can_shrink;
    #can_resize;
    #can_close;
    #on_close_callback;
    #panel_element;

    constructor(name, is_modal, start_moving_panel, start_resizing_panel, ...args) {
        // TODO: validate name
        // TODO: validate start_moving_panel
        // TODO: validate start_resizing_panel
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
        const is_modal_boolean = !!is_modal;
        super(
            is_modal_boolean ? `<div class="quill-modal-overlay">${html}</div>` : html,
            [QuillWrapper, QuillNodeElement, QuillMenuBar],
            (child) => this.#add_child(child),
            ...args
        );

        const element = this.get_element();

        const close_button = new QuillButton("", { class: "quill-close-button" }, (_, e) => {
            this.close();
            this.#on_close_callback?.(this, e);
        });
        element.querySelector(".quill-panel-title-bar").append(close_button.get_element());

        this.#name = name;

        const config = this._get_arg_config();
        this.set_has_title_bar(Object.hasOwn(config, "has_title_bar") ? !!config.has_title_bar : true);
        this.set_has_menu_bar(Object.hasOwn(config, "has_menu_bar") ? !!config.has_menu_bar : true);
        this.set_can_move(Object.hasOwn(config, "can_move") ? !!config.can_move : true);
        this.set_can_grow(Object.hasOwn(config, "can_grow") ? !!config.can_grow : true);
        this.set_can_shrink(Object.hasOwn(config, "can_shrink") ? !!config.can_shrink : true);
        this.set_can_resize(Object.hasOwn(config, "can_resize") ? !!config.can_resize : true);
        this.set_can_close(Object.hasOwn(config, "can_close") ? !!config.can_close : true);

        this.#panel_element = is_modal_boolean ? element.querySelector("div") : element;

        Util.add_mouse_down_event_listener(element.querySelector(".quill-panel-title-bar"), (e) => {
            if (this.#can_move) start_moving_panel(this, e);
        });
        Util.add_mouse_down_event_listener(element.querySelector(".quill-panel-resizer"), (e) =>
            start_resizing_panel(this, e)
        );

        this.add_children(this._get_arg_children());
    }

    // Public methods

    get_name = () => this.#name;

    has_title_bar = () => this.#has_title_bar;

    has_menu_bar = () => this.#has_menu_bar;

    can_move = () => this.#can_move;

    can_grow = () => this.#can_grow;

    can_shrink = () => this.#can_shrink;

    can_resize = () => this.#can_resize;

    can_close = () => this.#can_close;

    on_close(callback) {
        // TODO: validate callback
        this.#on_close_callback = callback;
        return this;
    }

    set_has_title_bar(has_title_bar) {
        const display = (this.#has_title_bar = !!has_title_bar) ? "" : "none";
        this.get_element().querySelector(".quill-panel-title-bar").style.display = display;
    }

    set_has_menu_bar(has_menu_bar) {
        const display = (this.#has_menu_bar = !!has_menu_bar) ? "" : "none";
        this.get_element().querySelector(".quill-panel-menu-bar-container").style.display = display;
    }

    set_can_move(can_move) {
        this.#can_move = !!can_move;
        const cursor = (this.#can_move = !!can_move) ? "" : "initial";
        this.get_element().querySelector(".quill-panel-title-bar").style.cursor = cursor;
    }

    set_can_grow(can_grow) {
        const max_size = (this.#can_grow = !!can_grow) && this.#can_resize ? "" : "fit-content";
        this.get_element().style.maxWidth = max_size;
        this.get_element().style.maxHeight = max_size;
    }

    set_can_shrink(can_shrink) {
        const min_size = (this.#can_shrink = !!can_shrink) && this.#can_resize ? "" : "fit-content";
        this.get_element().style.minWidth = min_size;
        this.get_element().style.minHeight = min_size;
    }

    set_can_resize(can_resize) {
        const display = (this.#can_resize = !!can_resize) ? "" : "none";
        this.get_element().querySelector(".quill-panel-resizer").style.display = display;
        const max_size = this.#can_grow && this.#can_resize ? "" : "fit-content";
        this.get_element().style.maxWidth = max_size;
        this.get_element().style.maxHeight = max_size;
        const min_size = this.#can_shrink && this.#can_resize ? "" : "fit-content";
        this.get_element().style.minWidth = min_size;
        this.get_element().style.minHeight = min_size;
    }

    set_can_close(can_close) {
        const display = (this.#can_close = !!can_close) ? "" : "none";
        this.get_element().querySelector(".quill-close-button").style.display = display;
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
        // TODO: validate position
        this.#panel_element.style.top = `${position.top}px`;
        this.#panel_element.style.left = `${position.left}px`;
    }

    set_size(size) {
        // TODO: validate size
        this.#panel_element.style.width = `${size.width}px`;
        this.#panel_element.style.height = `${size.height}px`;
    }

    // Private methods

    #add_child(child) {
        // TODO: validate child
        if (child instanceof QuillMenuBar) {
            this.get_element().querySelector(".quill-panel-menu-bar-container").append(child.get_element());
        } else {
            this.get_element().querySelector(".quill-panel-content > div").append(child.get_element());
        }
    }
}

// Keep this around for now, because QuillElement needs to know about this class.
class QuillPanel extends QuillBasePanel {}
