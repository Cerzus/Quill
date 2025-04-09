"use strict";

(function (Quill) {
    Quill.init = (root_element) => {
        if (!Util.error(root_element instanceof Element)) return;

        // Add all public-facing properties

        Quill.Color = (...args) => new QuillColor(...args);
        Quill.Separator = (...args) => new QuillSeparator(...args);
        Quill.InfoTooltip = (...args) => new QuillInfoTooltip(...args);
        Quill.Text = (...args) => new QuillText(...args);
        Quill.Modal = (...args) => new QuillModal(...args);
        Quill.Panel = (...args) => new Panel(...args);
        Quill.MenuBar = (...args) => new QuillMenuBar(...args);
        Quill.Menu = (...args) => new QuillMenu(...args);
        Quill.MenuItem = (...args) => new QuillMenuItem(...args);
        Quill.FixedCanvas = (...args) => new QuillFixedCanvas(...args);
        Quill.Table = (...args) => new QuillTable(...args);
        Quill.TableRow = (...args) => new QuillTableRow(...args);
        Quill.TableColumn = (...args) => new QuillTableColumn(...args);
        Quill.CollapsingHeader = (...args) => new QuillCollapsingHeader(...args);
        Quill.Tree = (...args) => new QuillTree(...args);
        Quill.Button = (...args) => new QuillButton(...args);
        Quill.Row = (...args) => new QuillRow(...args);
        Quill.Fieldset = (...args) => new QuillFieldset(...args);
        Quill.Checkbox = (...args) => new QuillCheckbox(...args);
        Quill.Dropdown = (...args) => new QuillDropdown(...args);
        Quill.DropdownOptions = (...args) => new QuillDropdownOptions(...args);
        Quill.InputText = (...args) => new QuillInputText(...args);
        Quill.InputFloat = (...args) => new QuillInputFloat(...args);
        Quill.InputInteger = (...args) => new QuillInputInteger(...args);
        Quill.InputU8 = (...args) => new QuillInputU8(...args);
        Quill.InputU16 = (...args) => new QuillInputU16(...args);
        Quill.SliderFloat = (...args) => new QuillSliderFloat(...args);
        Quill.SliderInteger = (...args) => new QuillSliderInteger(...args);
        Quill.ColorPicker = (...args) => new QuillColorPicker(...args);
        Quill.Tabs = (...args) => new QuillTabs(...args);
        Quill.Tab = (...args) => new QuillTab(...args);
        Quill.Wrapper = (...args) => new QuillWrapper(...args);
        Quill.HexEditor = (...args) => new QuillHexEditor(...args);

        Quill.get_color_names = get_color_names;
        Quill.get_color = get_color;
        Quill.set_color = set_color;
        Quill.get_font_names = get_font_names;
        Quill.get_font = get_font;
        Quill.set_font = set_font;
        Quill.get_size_names = get_size_names;
        Quill.get_size = get_size;
        Quill.set_size = set_size;
        Quill.get_flag_names = get_flag_names;
        Quill.get_flag = get_flag;
        Quill.set_flag = set_flag;
        Quill.get_panels = get_panels;
        Quill.open_file_dialog = open_file_dialog;
        Quill.fill_array = Util.fill_array;
        Quill.show_demo = quill_show_demo;

        const content_element = Util.element_from_html(`<div class="quill-content"></div>`);

        root_element.classList.add("quill");
        root_element.append(content_element);

        quill_config.root_element = root_element;
        quill_config.content_element = content_element;

        Object.entries(quill_config.fonts).forEach((entry) => apply_font_to_root_element(...entry));
        Object.entries(quill_config.colors).forEach((entry) => apply_color_to_root_element(...entry));
        Object.entries(quill_config.sizes).forEach((entry) => apply_size_to_root_element(...entry));
        Object.entries(quill_config.flags).forEach((entry) => apply_flag_to_content_element(...entry));

        window.addEventListener("mousemove", (e) => {
            if (moving !== null) {
                const size = moving.panel.get_size();
                const content_width = content_element.offsetWidth;
                const content_height = content_element.offsetHeight;
                const top = Math.max(0, Math.min(moving.top + e.screenY, content_height - size.height));
                const left = Math.max(0, Math.min(moving.left + e.screenX, content_width - size.width));
                moving.panel.set_position({ top, left });
                e.preventDefault();
            }

            if (resizing !== null) {
                const MIN_WIDTH = 100;
                const MIN_HEIGHT = 20;
                const position = resizing.panel.get_position();
                const size = resizing.panel.get_size();
                const width = content_element.offsetWidth;
                const height = content_element.offsetHeight;

                if (resizing.resizer_x === 0) {
                    const left = Math.min(resizing.left + e.screenX, position.left + size.width - MIN_WIDTH);
                    position.left = Math.max(0, left);
                    size.width = Math.max(MIN_WIDTH, resizing.width - e.screenX + Math.min(left, 0));
                } else if (resizing.resizer_x === 2) {
                    size.width = Math.min(Math.max(MIN_WIDTH, resizing.width + e.screenX), width - position.left);
                }

                if (resizing.resizer_y === 0) {
                    const top = Math.min(resizing.top + e.screenY, position.top + size.height - MIN_HEIGHT);
                    position.top = Math.max(0, top);
                    size.height = Math.max(MIN_HEIGHT, resizing.height - e.screenY + Math.min(top, 0));
                } else if (resizing.resizer_y === 2) {
                    size.height = Math.min(Math.max(MIN_HEIGHT, resizing.height + e.screenY), height - position.top);
                }

                resizing.panel.set_position(position);
                resizing.panel.set_size(size);
                e.preventDefault();
            }
        });

        Util.add_mouse_up_event_listener(window, (e) => {
            finish_moving_panel(e);
            finish_resizing_panel(e);
            prevent_menu_from_being_hidden = false;
        });

        Util.add_mouse_down_event_listener(
            content_element,
            () => !prevent_menu_from_being_hidden && hide_active_menu_bar()
        );

        QuillMenuItem.init();

        Object.freeze(Quill);
    };

    /* Quill.Panel */

    class Panel extends QuillPanel {
        #id;
        #name;
        #closeable = true;
        #closed = true;
        #on_close_callback;
        #modal = false;
        #panel_element;

        constructor(name, ...args) {
            const { config } = Util.config_callback_and_children_from_arguments(...args);
            const modal = !!config.modal;
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
                modal ? `<div class="quill-modal-overlay">${html}</div>` : html,
                [QuillWrapper, QuillNodeElement, QuillMenuBar],
                ...args
            );

            const element = this.get_element();

            this.#modal = modal;
            this.#name = name;
            this.#closeable = !this._get_arg_config().not_closeable;
            this.#panel_element = modal ? element.querySelector("div") : element;

            if (!this.#modal) {
                this.#create_id(name);
                this.#closed = !!this._get_arg_config().closed;
                Util.add_mouse_down_event_listener(element, () => show_panel_on_top(this));
            }
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

            if (this.#modal) {
                const width = 300;
                const height = 200;
                this.set_size({ width, height });
                this.set_position({
                    top: (quill_config.content_element.offsetHeight - height) / 2,
                    left: (quill_config.content_element.offsetWidth - width) / 2,
                });
                element.style.zIndex = 1000;
            } else {
                const stored_index = quill_panels_order.indexOf(this.#id);
                if (stored_index < 0) {
                    const new_index = quill_panels_order.length;
                    this.set_position({ top: new_index * 25, left: new_index * 25 });
                    this.set_size({ width: 300, height: 200 });
                    set_panel_z_index(this, new_index);
                    quill_panels_order.push(this.#id);
                } else {
                    const config = stored_panels_config_at_init[stored_index];
                    this.set_position({ top: config.y, left: config.x });
                    this.set_size({ width: config.w, height: config.h });
                    set_panel_z_index(this, stored_index);
                    this.#closed = !config.o;
                }
                if (this.#closed) this.#close();
            }

            this.add_children(this._get_arg_children());

            quill_config.content_element.append(element);
        }

        // Public methods

        get_name = () => this.#name;
        get_id = () => this.#id; // TODO: what if modal?
        is_closeable = () => this.#closeable; // TODO: what if modal?
        is_open = () => !(this.#closeable && this.#closed); // TODO: what if modal?
        is_closed = () => this.#closed; // TODO: what if modal?
        on_close(callback) {
            this.#on_close_callback = callback;
            return this;
        }
        open() {
            if (!this.#modal) {
                this.#open();
                store_panels_config();
            } else {
                // TODO: what?
            }
            return this;
        }
        close() {
            if (this.#modal) {
                this.remove();
            } else {
                this.#close();
                store_panels_config();
            }
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
        #open() {
            if (this.#closeable) {
                this.#closed = false;
                this.get_element().style.display = "";
                show_panel_on_top(this);
            }
        }
        #close() {
            if (this.#closeable) {
                this.#closed = true;
                this.get_element().style.display = "none";
            }
        }
        #create_id(string = "") {
            for (let i = 0; ; i++) {
                const id = string
                    .split("")
                    .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), i)
                    .toString(16);
                if (!quill_panels[id]) return (quill_panels[(this.#id = id)] = this);
            }
        }
    }

    /* Quill.Modal */

    class QuillModal extends Panel {
        constructor(name, ...args) {
            const { config, callback, children, count } = Util.config_callback_and_children_from_arguments(...args);
            config.modal = true;
            super(name, config, callback, children, ...args.slice(count));
        }
    }

    /* Quill.MenuBar */

    class QuillMenuBar extends QuillElement {
        constructor(...args) {
            super(`<div class="quill-menu-bar"></div>`, [QuillMenu, QuillMenuItem, QuillSeparator], ...args);
            this.add_children(this._get_arg_children());
        }

        // Private methods

        _add_child(child) {
            this.get_element().append(child.get_element());
        }
    }

    /* Quill.MenuItem */

    class QuillMenuItem extends QuillElement {
        static #ctrl_keys = {};
        static #initialized = false;
        #checkbox = null;

        // TODO: Make private somehow
        static init() {
            if (QuillMenuItem.#initialized) return;
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

            const config = this._get_arg_config();
            if (!!config.checkable) {
                this.#checkbox = new QuillCheckbox({ checked: !!config.checked }, (_, __, e) => this.#notify_user(e));
                this.get_element().querySelector(":nth-child(1)").append(this.#checkbox.get_element());
            }

            const element = this.get_element();
            if (config.ctrl_key) {
                QuillMenuItem.#ctrl_keys[config.ctrl_key.toLowerCase()] = (e) => {
                    if (!this.get_panel().is_open()) return;
                    this.set_checked(!this.is_checked());
                    this._get_arg_callback()(this, e);
                };
                element.querySelector(":nth-child(3)").innerHTML = `Ctrl+${config.ctrl_key.toUpperCase()}`;
            }
            if (!this.is_checkable()) Util.add_mouse_up_event_listener(element, (e) => this.#notify_user(e));

            element.addEventListener("mouseenter", () => this.#show_parent_menu_if_menu_bar_active());
        }

        // Public methods

        is_checkable = () => this.#checkbox !== null;
        is_checked = () => this.is_checkable() && this.#checkbox.is_checked();
        set_checked(checked) {
            this.#checkbox?.set_checked(checked);
            return this;
        }

        // Private methods

        #notify_user(e) {
            this._get_arg_callback()(this, e);
            hide_active_menu_bar();
        }
        #show_parent_menu_if_menu_bar_active() {
            if (active_menu_bar !== get_top_most_menu(this).get_parent()) return;
            hide_active_menu();
            const parent = this.get_parent();
            if (parent instanceof QuillMenu) {
                parent.show();
                active_menu = parent;
            }
        }
    }

    /* Quill.Menu */

    class QuillMenu extends QuillElement {
        #menu_element;

        constructor(title, ...args) {
            super(
                `<label class="quill-menu-item">
                    <div></div>
                    <div>${title}</div>
                    <div></div>
                    <div></div>
                </label>`,
                [QuillMenu, QuillMenuItem, QuillSeparator],
                ...args
            );

            this.#menu_element = Util.element_from_html(`<div class="quill-menu"></div>`);

            const element = this.get_element();
            Util.add_mouse_down_event_listener(element, () => this.#toggle_parent_menu_bar_active_state());
            Util.add_mouse_down_event_listener(this.#menu_element, () => this.#prevent_from_being_hidden());
            element.addEventListener("mouseenter", () => this.#show_if_menu_bar_active());

            this.add_children(this._get_arg_children());
            quill_config.content_element.append(this.#menu_element);
            element
                .querySelector(":nth-child(4)")
                .append(Util.element_from_html(`<div class="quill-arrow-right"></div>`));
        }

        show = () => this.#show();
        hide = () => this.#hide();

        // Private methods

        _add_child(child) {
            this.#menu_element.append(child.get_element());
        }
        _remove() {
            this.#menu_element.remove();
        }
        #toggle_parent_menu_bar_active_state() {
            this.#prevent_from_being_hidden();
            const parent = this.get_parent();
            if (!(parent instanceof QuillMenuBar)) return;
            if (active_menu_bar === parent) {
                active_menu_bar = null;
                prevent_menu_from_being_hidden = false;
            } else {
                active_menu_bar = parent;
                this.#show_if_menu_bar_active();
            }
        }
        #show_if_menu_bar_active() {
            if (active_menu_bar !== get_top_most_menu(this).get_parent()) return;
            hide_active_menu();
            this.#show();
            active_menu = this;
        }
        #prevent_from_being_hidden() {
            prevent_menu_from_being_hidden = true;
        }
        #show() {
            const element = this.get_element();
            const parent = this.get_parent();
            element.classList.add("active");
            this.#menu_element.classList.add("active");
            if (parent instanceof QuillMenuBar) {
                this.#set_position((position) => (position.top += element.offsetHeight));
            } else {
                this.#menu_element.style.zIndex = +getComputedStyle(parent.#menu_element).zIndex + 1;
                parent.#show?.();
                this.#set_position((position) => (position.left += element.offsetWidth));
            }
            return this;
        }
        #hide() {
            this.get_element().classList.remove("active");
            this.#menu_element.classList.remove("active");
            for (const child of this.get_children().filter((child) => child instanceof QuillMenu)) {
                child.#hide();
            }
            return this;
        }
        #set_position(callback) {
            const content_element_rect = quill_config.content_element.getBoundingClientRect();
            const element_rect = this.get_element().getBoundingClientRect();
            const position = {
                left: element_rect.left - content_element_rect.left,
                top: element_rect.top - content_element_rect.top,
            };
            callback(position);
            this.#menu_element.style.top = `${position.top}px`;
            this.#menu_element.style.left = `${position.left}px`;
        }
    }

    // Public methods

    function get_font_names() {
        return Object.keys(quill_config.fonts);
    }
    function get_font(property) {
        return quill_config.fonts[property];
    }
    function set_font(property, value) {
        if (Object.hasOwn(quill_config.fonts, property)) {
            quill_config.fonts[property] = value;
            apply_font_to_root_element(property, value);
        }
    }
    function get_color_names() {
        return Object.keys(quill_config.colors);
    }
    function get_color(property) {
        return quill_config.colors[property];
    }
    function set_color(property, value) {
        if (Object.hasOwn(quill_config.colors, property)) {
            const color = QuillColor.from_hex(value);
            quill_config.colors[property] = color;
            apply_color_to_root_element(property, color);
        }
    }
    function get_size_names() {
        return Object.keys(quill_config.sizes);
    }
    function get_size(property) {
        return quill_config.sizes[property];
    }
    function set_size(property, value) {
        if (Object.hasOwn(quill_config.sizes, property)) {
            quill_config.sizes[property] = value;
            apply_size_to_root_element(property, value);
        }
    }
    function get_flag_names() {
        return Object.keys(quill_config.flags);
    }
    function get_flag(property) {
        return quill_config.flags[property];
    }
    function set_flag(property, value) {
        if (Object.hasOwn(quill_config.flags, property)) {
            quill_config.flags[property] = value;
            apply_flag_to_content_element(property, value);
        }
    }
    function get_panels() {
        // TODO: copy properly?
        return { ...quill_panels };
    }
    function open_file_dialog(...args) {
        const { config, callback } = Util.config_and_callback_from_arguments(...args);
        const input = document.createElement("input");
        input.type = "file";
        if (config.accept) input.accept = config.accept.join();
        if (config.multiple) input.multiple = true;
        input.addEventListener("change", (e) => callback(input.multiple ? input.files : input.files[0], e));
        input.click();
    }

    // Helper functions

    function apply_font_to_root_element(property, font) {
        quill_config.root_element.style.setProperty(`--quill-${property.replaceAll("_", "-")}-font`, font);
    }
    function apply_color_to_root_element(property, color) {
        quill_config.root_element.style.setProperty(`--quill-${property.replaceAll("_", "-")}-color`, color.to_css());
    }
    function apply_size_to_root_element(property, size) {
        quill_config.root_element.style.setProperty(`--quill-${property.replaceAll("_", "-")}-size`, `${size}px`);
    }
    function apply_flag_to_content_element(flag, is_set) {
        quill_config.content_element.classList[is_set ? "add" : "remove"](`quill-${flag.replaceAll("_", "-")}`);
    }

    function hide_active_menu_bar() {
        hide_active_menu();
        active_menu_bar = null;
    }
    function hide_active_menu() {
        if (active_menu !== null) get_top_most_menu(active_menu).hide();
        active_menu = null;
    }
    function get_top_most_menu(quill_element) {
        const parent = quill_element.get_parent();
        return parent instanceof QuillMenu ? get_top_most_menu(parent) : quill_element;
    }
    function show_panel_on_top(panel) {
        quill_panels_order.push(quill_panels_order.splice(quill_panels_order.indexOf(panel.get_id()), 1)[0]);
        // Remove any id's of Panels not currently known (Panels created dynamically after page load)
        for (let i = quill_panels_order.length - 1; i >= 0; i--) {
            if (!quill_panels[quill_panels_order[i]]) quill_panels_order.splice(i, 1);
        }
        for (let i = 0; i < quill_panels_order.length; i++) {
            set_panel_z_index(quill_panels[quill_panels_order[i]], i);
        }
        store_panels_config();
    }
    function set_panel_z_index(panel, z_index) {
        panel.get_element().style.zIndex = z_index;
    }
    function start_moving_panel(panel, e) {
        if (e.target.classList.contains("quill-close-button")) return;
        if (moving === null && resizing === null) {
            const position = panel.get_position();
            moving = { panel, top: position.top - e.screenY, left: position.left - e.screenX };
        }
    }
    function finish_moving_panel() {
        if (moving !== null) store_panels_config();
        moving = null;
    }
    function finish_resizing_panel() {
        if (resizing !== null) store_panels_config();
        resizing = null;
    }
    function start_resizing_panel(panel, e) {
        if (resizing === null && moving === null) {
            const position = panel.get_position();
            const size = panel.get_size();
            const index = Array.from(e.target.parentNode.children).indexOf(e.target);
            const resizer_x = index % 3;
            const resizer_y = ~~(index / 3);
            resizing = {
                panel,
                top: position.top - e.screenY,
                left: position.left - e.screenX,
                width: size.width + (1 - resizer_x) * e.screenX,
                height: size.height + (1 - resizer_y) * e.screenY,
                resizer_x,
                resizer_y,
            };
            e.preventDefault();
        }
    }
    function store_panels_config() {
        const panels_config = quill_panels_order
            .filter((id) => quill_panels[id])
            .map((id) => {
                const panel = quill_panels[id];
                const position = panel.get_position();
                const size = panel.get_size();
                const open = panel.is_open();
                return { id, x: position.left, y: position.top, w: size.width, h: size.height, o: open };
            });
        localStorage.setItem("quill_panels", JSON.stringify(panels_config));
    }
    function load_panels_config() {
        return JSON.parse(localStorage.getItem("quill_panels") ?? "[]");
    }

    const stored_panels_config_at_init = load_panels_config();
    const quill_config = QuillConfig;
    const quill_panels_order = stored_panels_config_at_init.map((panel) => panel.id);
    const quill_panels = {};
    let moving = null;
    let resizing = null;
    let active_menu_bar = null;
    let active_menu = null;
    let prevent_menu_from_being_hidden = false;
})((window.Quill = window.Quill || {}));
