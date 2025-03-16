"use strict";

(function (Quill) {
    Quill.init = (root_element) => {
        if (!Util.assert(root_element instanceof Element)) {
            return;
        }

        const content_element = Util.element_from_html(`<div class="quill-content"></div>`);

        root_element.classList.add("quill");
        root_element.append(content_element);

        quill_config.root_element = root_element;
        quill_config.content_element = content_element;

        const style = document.createElement("style");
        const config_to_css_var = (x, bar) =>
            `${Object.entries(x)
                .map(([name, value]) => `--quill-${name.replaceAll("_", "-")}-${bar(value)};`)
                .join("\n")}`;
        style.innerHTML = `
            :root {
                ${config_to_css_var(quill_config.fonts, (font) => `font:${font}`)}
                ${config_to_css_var(quill_config.colors, (color) => `color:${color.to_css()}`)}
                ${config_to_css_var(quill_config.sizes, (size) => `size:${size}px`)}
                ${config_to_css_var(quill_config.font_sizes, (font_size) => `font-size:${font_size}em`)}
            }
        `;

        document.head.append(style);

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
                const MIN_HEIGHT = 30;
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

        window.addEventListener("mouseup", (e) => {
            finish_moving_panel(e);
            finish_resizing_panel(e);
        });
    };

    /* Quill.Panel */

    class Panel extends QuillElement {
        #id;
        #name;
        #closeable;
        #closed;
        #on_close_callback;

        constructor(name, ...args) {
            super(
                `<div class="quill-panel">
                    <div class="quill-panel-title-bar"><div>${name}</div></div>
                    <div class="quill-panel-menu-bar-container"></div>
                    <div class="quill-panel-content"></div>
                    <table class="quill-panel-resizer">
                        <tr><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td></tr>
                    </table>
                </div>`,
                ...args
            );
            this.add(this.get_arg_children());

            this.#create_id(name);
            this.#name = name;
            this.#closeable = !this.get_arg_config().not_closeable;
            this.#closed = !!this.get_arg_config().closed;

            const element = this.get_element();
            element.addEventListener("mousedown", (e) => {
                if (e.button === 0) show_panel_on_top(this);
            });
            element.querySelector(".quill-panel-title-bar").addEventListener("mousedown", (e) => {
                if (e.button === 0) start_moving_panel(this, e);
            });
            element.querySelector(".quill-panel-resizer").addEventListener("mousedown", (e) => {
                if (e.button === 0) start_resizing_panel(this, e);
            });

            if (this.#closeable) {
                const close_button = Util.element_from_html(`<div class="quill-close-button"></div>`);
                close_button.addEventListener("click", (e) => {
                    if (e.button === 0) {
                        this.close();
                        this.#on_close_callback?.();
                    }
                });
                element.querySelector(".quill-panel-title-bar").append(close_button);
            }

            const stored_index = quill_panels_order.indexOf(this.#id);
            if (stored_index < 0) {
                const new_index = quill_panels_order.length;
                this.set_position({ top: new_index * 25, left: new_index * 25 });
                this.set_size({ width: 300, height: 200 });
                this.set_z_index(new_index);
                quill_panels_order.push(this.#id);
            } else {
                const config = stored_panels_config_at_init[stored_index];
                this.set_position({ top: config.y, left: config.x });
                this.set_size({ width: config.w, height: config.h });
                this.set_z_index(stored_index);
                this.#closed = !config.o;
            }

            if (this.#closed) this.#close();

            quill_config.content_element.append(this.get_element());
        }

        // Public methods

        get_id = () => this.#id;
        get_name = () => this.#name;
        is_closeable = () => this.#closeable;
        is_open = () => !this.#closed;
        on_close = (callback) => (this.#on_close_callback = callback);
        open() {
            this.#open();
            store_panels_config();
        }
        close() {
            this.#close();
            store_panels_config();
        }
        get_position() {
            // Hidden panels return 0 for offsets, so when necessary we temporarily unhide the panel
            const display = this.get_element().style.display;
            this.get_element().style.display = "";
            const position = { top: this.get_element().offsetTop, left: this.get_element().offsetLeft };
            this.get_element().style.display = display;
            return position;
        }
        get_size() {
            // Hidden panels return 0 for offsets, so when necessary we temporarily unhide the panel
            const display = this.get_element().style.display;
            this.get_element().style.display = "";
            const size = { width: this.get_element().offsetWidth, height: this.get_element().offsetHeight };
            this.get_element().style.display = display;
            return size;
        }
        set_position(position) {
            this.get_element().style.top = `${position.top}px`;
            this.get_element().style.left = `${position.left}px`;
        }
        set_size(size) {
            this.get_element().style.width = `${size.width}px`;
            this.get_element().style.height = `${size.height}px`;
        }
        set_z_index(z_index) {
            this.get_element().style.zIndex = z_index;
        }

        // Private methods

        _add_child(child) {
            const menu_bar_container_element = this.get_element().querySelector(".quill-panel-menu-bar-container");
            const content_element = this.get_element().querySelector(".quill-panel-content");
            if (child instanceof QuillMenuBar) {
                menu_bar_container_element.append(child.get_element());
            } else {
                content_element.append(child.get_element());
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

    /* Quill.Menu */

    class Menu extends QuillMenuItem {
        #menu_element;
        #hover_count = 0;

        constructor(title, ...args) {
            super(`<div>${title}</div><div class="quill-arrow-right"></div>`, ...args);
            this.#menu_element = Util.element_from_html(`<div class="quill-menu"></div>`);
            for (const element of [this.get_element(), this.#menu_element]) {
                element.addEventListener("mouseenter", this.#on_mouseenter.bind(this));
                element.addEventListener("mouseleave", this.#on_mouseleave.bind(this));
            }
            this.add(this.get_arg_children());
            quill_config.content_element.append(this.#menu_element);
        }

        // Private methods

        _add_child(child) {
            this.#menu_element.append(child.get_element());
        }
        #on_mouseenter() {
            this.#hover_count++;
            if (this.get_parent() instanceof Menu) this.get_parent().#on_mouseenter?.();
            this.#show();
        }
        #on_mouseleave() {
            if (this.get_parent() instanceof Menu) this.get_parent().#on_mouseleave?.();
            if (!--this.#hover_count) this.#hide();
        }
        #show() {
            this.get_element().classList.add("active");
            this.#menu_element.classList.add("active");
            if (this.get_parent() instanceof QuillMenuBar) {
                this.#set_position((position) => (position.top += this.get_element().offsetHeight));
            } else {
                this.#menu_element.style.zIndex = +getComputedStyle(this.get_parent().#menu_element).zIndex + 1;
                this.get_parent().#show?.();
                this.#set_position((position) => (position.left += this.get_element().offsetWidth));
            }
        }
        #hide() {
            this.get_element().classList.remove("active");
            this.#menu_element.classList.remove("active");
            for (const child of this.get_children().filter((child) => child instanceof Menu)) {
                child.#hide();
            }
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

    function get_panels() {
        return quill_panels;
    }

    // Helper functions

    function show_panel_on_top(panel) {
        quill_panels_order.push(quill_panels_order.splice(quill_panels_order.indexOf(panel.get_id()), 1)[0]);
        for (let i = 0; i < quill_panels_order.length; i++) {
            quill_panels[quill_panels_order[i]]?.set_z_index(i);
        }
        store_panels_config();
    }

    function start_moving_panel(panel, e) {
        if (moving === null && resizing === null) {
            const position = panel.get_position();
            moving = { panel, top: position.top - e.screenY, left: position.left - e.screenX };
            e.preventDefault();
        }
    }

    function finish_moving_panel(e) {
        if (moving !== null) {
            moving = null;
            store_panels_config();
            e.preventDefault();
        }
    }

    function finish_resizing_panel(e) {
        if (resizing !== null) {
            resizing = null;
            store_panels_config();
            e.preventDefault();
        }
    }

    function start_resizing_panel(panel, e) {
        if (resizing === null && moving === null) {
            const position = panel.get_position();
            const size = panel.get_size();
            const td = e.target;
            const tr = td.parentNode;
            const tbody = tr.parentNode;
            const resizer_x = Array.from(tr.children).indexOf(td);
            const resizer_y = Array.from(tbody.children).indexOf(tr);
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

    Quill.Color = QuillColor;
    Quill.Separator = QuillSeparator;
    Quill.Panel = Panel;
    Quill.MenuBar = QuillMenuBar;
    Quill.Menu = Menu;
    Quill.MenuItem = QuillMenuItem;

    Quill.get_panels = get_panels;
})((window.Quill = window.Quill || {}));
