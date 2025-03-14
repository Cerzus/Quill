"use strict";

(function (Quill) {
    Quill.init = (root_element) => {
        if (!ASSERT(root_element instanceof Element)) {
            return;
        }

        const content_element = element_from_html(`<div class="quill-content"></div>`);

        root_element.classList.add("quill");
        root_element.appendChild(content_element);

        quill_config.root_element = root_element;
        quill_config.content_element = content_element;

        const style = document.createElement("style");
        style.innerHTML = `
            :root {
                ${Object.entries(quill_config.fonts)
                    .map(([name, font]) => `--quill-${name.replaceAll("_", "-")}-font:${font};`)
                    .join("\n")}
                ${Object.entries(quill_config.colors)
                    .map(([name, color]) => `--quill-${name.replaceAll("_", "-")}-color:${color.to_css()};`)
                    .join("\n")}
                ${Object.entries(quill_config.sizes)
                    .map(([name, size]) => `--quill-${name.replaceAll("_", "-")}-size:${size}px;`)
                    .join("\n")}
            }
        `;

        document.head.appendChild(style);

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

    class Panel {
        #id;
        #element;

        constructor(title, config = {}) {
            this.#create_id(title);

            const element = element_from_html(
                `<div class="quill-panel">
                    <div class="quill-panel-title-bar">
                        ${title}
                    </div>
                    <div class="quill-panel-content">
                        Hello, world!
                    </div>
                    <table class="quill-panel-resizer">
                        <tr><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td></tr>
                    </table>
                </div>`
            );

            element.addEventListener("mousedown", (e) => {
                if (e.button === 0) show_panel_on_top(this);
            });
            element.querySelector(".quill-panel-title-bar").addEventListener("mousedown", (e) => {
                if (e.button === 0) start_moving_panel(this, e);
            });
            element.querySelector(".quill-panel-resizer").addEventListener("mousedown", (e) => {
                if (e.button === 0) start_resizing_panel(this, e);
            });

            this.#element = element;

            const stored_index = quill_panels_order.indexOf(this.#id);
            if (stored_index < 0) {
                const new_index = quill_panels_order.length;
                this.set_position({ top: config.top ?? new_index * 25, left: config.left ?? new_index * 25 });
                this.set_size({ width: config.width ?? 300, height: config.height ?? 200 });
                this.set_z_index(new_index);
                quill_panels_order.push(this.#id);
            } else {
                const config = stored_panels_config_at_init[stored_index];
                this.set_position({ top: config.y, left: config.x });
                this.set_size({ width: config.w, height: config.h });
                this.set_z_index(stored_index);
            }

            quill_config.content_element.appendChild(element);
        }

        get_id = () => this.#id;
        get_position = () => ({
            top: this.#element.offsetTop,
            left: this.#element.offsetLeft,
        });
        get_size = () => ({
            width: this.#element.offsetWidth,
            height: this.#element.offsetHeight,
        });
        set_position(position) {
            this.#element.style.top = `${position.top}px`;
            this.#element.style.left = `${position.left}px`;
        }
        set_size(size) {
            this.#element.style.width = `${size.width}px`;
            this.#element.style.height = `${size.height}px`;
        }
        set_z_index(z_index) {
            this.#element.style.zIndex = z_index;
        }

        #create_id(string = "") {
            for (let i = 0; ; i++) {
                const id = string
                    .split("")
                    .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), i)
                    .toString(16);
                if (!quill_panels[id]) {
                    return (quill_panels[(this.#id = id)] = this);
                }
            }
        }
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
                const position = quill_panels[id].get_position();
                const size = quill_panels[id].get_size();
                return { id, x: position.left, y: position.top, w: size.width, h: size.height };
            });
        localStorage.setItem("quill_panels", JSON.stringify(panels_config));
    }

    function load_panels_config() {
        return JSON.parse(localStorage.getItem("quill_panels") ?? "[]");
    }

    function element_from_html(html) {
        const div = document.createElement("div");
        div.innerHTML = html.trim();
        return div.firstChild;
    }

    function ASSERT(condition, message = "Assertion failed") {
        if (!condition) throw message;
        return condition;
    }

    const stored_panels_config_at_init = load_panels_config();
    const quill_config = Config;
    const quill_panels_order = stored_panels_config_at_init.map((panel) => panel.id);
    const quill_panels = {};
    let moving = null;
    let resizing = null;

    Quill.Color = Color;
    Quill.Panel = Panel;
})((window.Quill = window.Quill || {}));
