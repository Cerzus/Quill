"use strict";

(function (Quill) {
    Quill.init = (root_element) => {
        if (!Util.error(root_element instanceof Element)) return;

        // Add all public-facing properties

        Quill.Color = (...args) => new QuillColor(...args);
        Quill.Separator = (...args) => new QuillSeparator(...args);
        Quill.InfoTooltip = (...args) => new QuillInfoTooltip(...args);
        Quill.Text = (...args) => new QuillText(...args);
        Quill.TextWrapped = (...args) => new QuillTextWrapped(...args);
        Quill.Panel = (...args) => new Panel(...args);
        Quill.Modal = (...args) => new QuillModal(...args);
        Quill.Popup = (...args) => new QuillPopup(...args);
        Quill.MenuBar = (...args) => new MenuBar(...args);
        Quill.Menu = (...args) => new QuillMenu(...args);
        Quill.MenuItem = (...args) => new QuillMenuItem(...args);
        Quill.FixedCanvas = (...args) => new QuillFixedCanvas(...args);
        Quill.Table = (...args) => new QuillTable(...args);
        Quill.TableHeaderRow = (...args) => new QuillTableHeaderRow(...args);
        Quill.TableRow = (...args) => new QuillTableRow(...args);
        Quill.TableColumn = (...args) => new QuillTableColumn(...args);
        Quill.TableHeaderColumn = (...args) => new QuillTableHeaderColumn(...args);
        Quill.CollapsingHeader = (...args) => new QuillCollapsingHeader(...args);
        Quill.Indent = (...args) => new QuillIndent(...args);
        Quill.Tree = (...args) => new QuillTree(...args);
        Quill.Button = (...args) => new QuillButton(...args);
        Quill.Row = (...args) => new QuillRow(...args);
        Quill.Fieldset = (...args) => new QuillFieldset(...args);
        Quill.CheckboxTree = (...args) => new QuillCheckboxTree(...args);
        Quill.Checkbox = (...args) => new QuillCheckbox(...args);
        Quill.RadioButtons = (...args) => new QuillRadioButtons(...args);
        Quill.RadioButton = (...args) => new QuillRadioButton(...args);
        Quill.Dropdown = (...args) => new QuillDropdown(...args);
        Quill.DropdownOptions = (...args) => new QuillDropdownOptions(...args);
        Quill.InputText = (...args) => new QuillInputText(...args);
        Quill.InputFloat = (...args) => new QuillInputFloat(...args);
        Quill.InputInteger = (...args) => new QuillInputInteger(...args);
        Quill.InputU8 = (...args) => new QuillInputU8(...args);
        Quill.InputU16 = (...args) => new QuillInputU16(...args);
        Quill.SliderFloat = (...args) => new QuillSliderFloat(...args);
        Quill.SliderInteger = (...args) => new QuillSliderInteger(...args);
        Quill.DragFloat = (...args) => new QuillDragFloat(...args);
        Quill.DragInteger = (...args) => new QuillDragInteger(...args);
        Quill.ColorPicker = (...args) => new QuillColorPicker(...args);
        Quill.Tabs = (...args) => new QuillTabs(...args);
        Quill.Tab = (...args) => new QuillTab(...args);
        Quill.DynamicRows = (...args) => new QuillDynamicRows(...args);
        Quill.Wrapper = (...args) => new QuillWrapper(...args);
        Quill.HexEditor = (...args) => new QuillHexEditor(...args);

        Quill.get_color_names = get_color_names;
        Quill.get_style_color = get_style_color;
        Quill.set_style_color = set_style_color;
        Quill.get_font_names = get_font_names;
        Quill.get_style_font = get_style_font;
        Quill.set_style_font = set_style_font;
        Quill.get_size_names = get_size_names;
        Quill.get_style_size = get_style_size;
        Quill.set_style_size = set_style_size;
        Quill.get_flag_names = get_flag_names;
        Quill.get_style_flag = get_style_flag;
        Quill.get_style_flag_options = get_style_flag_options;
        Quill.set_style_flag = set_style_flag;
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
        Object.entries(quill_config.flags).forEach((entry) => apply_flag_to_root_element(...entry));

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

        Util.add_mouse_down_event_listener(content_element, (e) => {
            if (e.target.closest(".quill-popup") === null) close_popup();
            if (!prevent_menu_from_being_hidden) hide_active_menu_bar();
        });

        QuillMenuItem.init();
        QuillDrag.init();

        Object.freeze(Quill);
    };

    /* Quill.Panel */

    class Panel extends QuillPanel {
        #id;
        #closed = true;

        constructor(name, ...args) {
            super(name, false, start_moving_panel, start_resizing_panel, ...args);

            const element = this.get_element();

            this.#create_id(name);
            this.#closed = !!this._get_arg_config().closed;
            Util.add_mouse_down_event_listener(element, () => show_panel_on_top(this));

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

            quill_config.content_element.append(element);
        }

        // Public methods

        get_id = () => this.#id;
        is_open = () => !(this.can_close() && this.#closed);
        is_closed = () => this.#closed;

        open() {
            this.#open();
            store_panels_config();
            return this;
        }
        close() {
            this.#close();
            store_panels_config();
            return this;
        }

        // Private methods

        #open() {
            if (this.can_close()) {
                this.#closed = false;
                this.get_element().style.display = "";
                show_panel_on_top(this);
            }
        }
        #close() {
            if (this.can_close()) {
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

    class QuillModal extends QuillBasePanel {
        constructor(name, ...args) {
            super(name, true, start_moving_panel, start_resizing_panel, ...args);

            const element = this.get_element();

            const width = 300;
            const height = 200;
            this.set_size({ width, height });
            this.set_position({
                top: (quill_config.content_element.offsetHeight - height) / 2,
                left: (quill_config.content_element.offsetWidth - width) / 2,
            });
            element.style.zIndex = 1000;

            quill_config.content_element.append(element);
        }

        // Public methods

        close() {
            this.remove();
            return this;
        }
    }

    /* Quill.Popup */

    class QuillPopup extends QuillBasePanel {
        constructor(name, left, top, ...args) {
            const foo = Util.config_callback_and_children_from_arguments(...args);
            foo.config.has_title_bar = false;
            foo.config.has_menu_bar = false;
            foo.config.can_move = false;
            foo.config.can_resize = false;
            foo.config.can_close = false;

            super(
                name,
                false,
                start_moving_panel,
                start_resizing_panel,
                ...Object.values(foo),
                ...args.slice(foo.count)
            );

            const element = this.get_element();
            element.classList.add("quill-popup");

            this.set_position({ top, left });
            element.style.zIndex = 10000;

            quill_config.content_element.append(element);

            active_popup = this;
        }

        // Public methods

        close() {
            this.remove();
            return this;
        }
    }

    /* Quill.MenuBar */

    class MenuBar extends QuillMenuBar {
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
        static #initialized = false;
        static #ctrl_keys = {};
        #checkbox = null;

        // TODO: Make private somehow
        static init() {
            if (QuillMenuItem.#initialized) return;
            QuillMenuItem.#initialized = true;
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

    // Quill.HexEditor

    class QuillHexEditor extends QuillNodeElement {
        #number_of_columns;
        #show_ascii;
        #grey_out_zeroes;
        #uppercase_hex;

        #start_address;
        #end_address;
        #read_callback;
        #max_addr_length;
        #dynamic_rows;

        constructor(start_address, data_size, read_callback, ...args) {
            super(`<div class="quill-hex-editor"></div>`, [], ...args);

            const config = this._get_arg_config();
            this.#number_of_columns = Object.hasOwn(config, "number_of_columns")
                ? Math.min(Math.max(0, ~~config.number_of_columns), 16)
                : 16;
            this.#show_ascii = Object.hasOwn(config, "show_ascii") ? !!config.show_ascii : true;
            this.#set_grey_out_zeroes(Object.hasOwn(config, "grey_out_zeroes") ? !!config.grey_out_zeroes : true);
            this.#uppercase_hex = Object.hasOwn(config, "uppercase_hex") ? !!config.uppercase_hex : false;

            this.#start_address = start_address;
            this.#end_address = start_address + data_size;
            this.#read_callback = read_callback;
            this.#max_addr_length = this.#to_hex(this.#end_address - 1).length;
            this.#dynamic_rows = new QuillDynamicRows(
                this.#get_number_of_rows(),
                (index) => this.#create_row_element(index),
                (...args) => this.#update_row_element(...args)
            );

            const document_fragment = new DocumentFragment();
            document_fragment.append(
                this.#add_event_listeners(this.#create_header_row()),
                this.#add_event_listeners(this.#dynamic_rows.get_element()),
                this.#create_footer_row()
            );
            this.get_element().append(document_fragment);
        }

        // Public methods

        update() {
            this.#dynamic_rows.update();
            return this;
        }

        // Private methods

        #set_number_of_columns(number_of_columns) {
            this.#number_of_columns = Math.min(Math.max(0, ~~number_of_columns), 16);
            this.get_element().firstChild.replaceWith(this.#add_event_listeners(this.#create_header_row()));
            this.#dynamic_rows.set_number_of_rows(this.#get_number_of_rows());
        }
        #set_show_ascii(show_ascii) {
            this.#show_ascii = !!show_ascii;
            this.#dynamic_rows.refresh();
            return this;
        }
        #set_grey_out_zeroes(grey_out_zeroes) {
            this.#grey_out_zeroes = !!grey_out_zeroes;
            if (this.#grey_out_zeroes) this.get_element().classList.add("quill-grey-out-zeroes");
            else this.get_element().classList.remove("quill-grey-out-zeroes");
        }
        #set_uppercase_hex(uppercase_hex) {
            this.#uppercase_hex = !!uppercase_hex;
            const element = this.get_element();
            element.firstChild.remove();
            element.prepend(this.#create_header_row());
            element.lastChild.remove();
            element.append(this.#create_footer_row());
            this.#dynamic_rows.refresh();
            return this;
        }
        #get_number_of_rows() {
            return Math.ceil((this.#end_address - this.#start_address) / this.#number_of_columns);
        }
        #create_header_row() {
            return new QuillRow({ css: { paddingBottom: "5px" } }, [
                new QuillNodeElement(
                    `<div class="quill-hex-editor-address"
                          style="width: ${this.#format_address(this.#end_address - 1).length}ch;">
                    </div>`
                ),
                new QuillNodeElement(
                    `<div class="quill-hex-editor-data">${Util.fill_array(
                        this.#number_of_columns,
                        (i) =>
                            `<input disabled class="quill-hex-editor-byte" size="1" value="+${this.#to_hex(i, 1)}" />`
                    ).join("")}</div>`
                ),
            ]).get_element();
        }
        #add_event_listeners(element) {
            element.addEventListener("mouseover", (e) => {
                if (e.target.classList.contains("quill-hex-editor-byte")) {
                    this.#set_hovered_column(Array.from(e.target.parentNode.children).indexOf(e.target));
                }
            });
            element.addEventListener("mouseout", () => this.#set_hovered_column(-1));
            element.addEventListener("mouseleave", () => this.#set_hovered_column(-1));
            return element;
        }
        #create_footer_row() {
            return new QuillRow([
                new QuillButton("Options", (button) => {
                    return new QuillPopup("", button.get_page_x(), button.get_page_y_bottom(), [
                        new QuillDragInteger("Columns", { min: 1, max: 16, value: this.#number_of_columns }, (value) =>
                            this.#set_number_of_columns(value)
                        ),
                        new QuillCheckbox("Show ASCII", { checked: this.#show_ascii }, (checked) =>
                            this.#set_show_ascii(checked)
                        ),
                        new QuillCheckbox("Grey out zeroes", { checked: this.#grey_out_zeroes }, (checked) =>
                            this.#set_grey_out_zeroes(checked)
                        ),
                        new QuillCheckbox("Uppercase hex", { checked: this.#uppercase_hex }, (checked) =>
                            this.#set_uppercase_hex(checked)
                        ),
                    ]);
                }),
                new QuillText(
                    this.#format_address(this.#start_address) + " ... " + this.#format_address(this.#end_address - 1)
                ),
                new QuillButton("", { css: { width: "100px" } }),
            ]).get_element();
        }
        #to_hex(value, number_of_characters) {
            const hex = value.toString(16).padStart(number_of_characters, 0);
            return this.#uppercase_hex ? hex.toUpperCase() : hex;
        }
        #to_ascii(value) {
            return String.fromCharCode(value >= 32 && value < 127 ? value : 46).replaceAll(/\s/g, "\xa0");
        }
        #format_address(address, length = this.#max_addr_length) {
            return "0x" + this.#to_hex(address, length);
        }
        #set_hovered_column(n) {
            this.get_element().setAttribute("data-hovered-column", n);
        }
        #address_and_data_from_index(index) {
            const address = index * this.#number_of_columns + this.#start_address;
            return {
                address,
                data: Array(this.#number_of_columns)
                    .fill()
                    .map((_, i) => (address + i < this.#end_address ? this.#read_callback(address + i) : -1)),
            };
        }
        #update_row_element(index, row) {
            const { data } = this.#address_and_data_from_index(index);
            const children_data = row.get_element().querySelector(".quill-hex-editor-data").children;
            const children_ascii = row.get_element().querySelector(".quill-hex-editor-ascii").children;
            for (const [i, value] of data.entries()) {
                const child_data = children_data[i];
                if (child_data.dataset.value !== value) {
                    child_data.value = this.#to_hex(value, 2);
                    child_data.dataset.value = value;
                    if (this.#show_ascii) {
                        const child_ascii = children_ascii[i];
                        child_ascii.dataset.value = child_ascii.firstChild.nodeValue = this.#to_ascii(value);
                    }
                }
            }
        }
        #create_row_element(index) {
            const { address, data } = this.#address_and_data_from_index(index);
            const children = [
                new QuillNodeElement(`<div class="quill-hex-editor-address">${this.#format_address(address)}</div>`),
                new QuillNodeElement(`<div class="quill-hex-editor-data">${this.#create_row_data_html(data)}</div>`),
            ];
            if (this.#show_ascii) {
                const html = `<div class="quill-hex-editor-ascii">${this.#create_row_ascii_html(data)}</div>`;
                children.push(new QuillNodeElement(html));
            }
            return children;
        }
        #create_row_data_html(data) {
            return data
                .map((x) => {
                    if (x < 0) {
                        return `<input class="quill-hex-editor-byte" 
                                   size="1"
                                   maxlength="2"
                                   disabled />`;
                    } else {
                        return `<input class="quill-hex-editor-byte" 
                                   size="1"
                                   maxlength="2"
                                   data-value="${x}"
                                   value="${this.#to_hex(x, 2)}" />`;
                    }
                })
                .join("");
        }
        #create_row_ascii_html(data) {
            return data
                .map((x) => {
                    if (x < 0) {
                        return `<div class="quill-hex-editor-byte">\xa0</div>`;
                    } else {
                        const ascii = this.#to_ascii(x);
                        return `<div class="quill-hex-editor-byte" data-value="${ascii}">${ascii}</div>`;
                    }
                })
                .join("");
        }
    }

    // Public methods

    function get_font_names() {
        return Object.keys(quill_config.fonts);
    }
    function get_style_font(property) {
        return quill_config.fonts[property];
    }
    function set_style_font(property, value) {
        const msg = `Unknown style font "${property}"`;
        if (!Util.warning(Object.hasOwn(quill_config.fonts, property), msg)) return;
        quill_config.fonts[property] = value;
        apply_font_to_root_element(property, value);
    }
    function get_color_names() {
        return Object.keys(quill_config.colors);
    }
    function get_style_color(property) {
        return quill_config.colors[property];
    }
    function set_style_color(property, value) {
        const msg = `Unknown style color "${property}"`;
        if (!Util.warning(Object.hasOwn(quill_config.colors, property), msg)) return;
        const color = QuillColor.from_hex(value);
        quill_config.colors[property] = color;
        apply_color_to_root_element(property, color);
    }
    function get_size_names() {
        return Object.keys(quill_config.sizes);
    }
    function get_style_size(property) {
        return quill_config.sizes[property];
    }
    function set_style_size(property, value) {
        const msg = `Unknown style size "${property}"`;
        if (!Util.warning(Object.hasOwn(quill_config.sizes, property), msg)) return;
        apply_size_to_root_element(property, (quill_config.sizes[property] = value));
    }
    function get_flag_names() {
        return Object.keys(quill_config.flags);
    }
    function get_style_flag(property) {
        return quill_config.flags[property].get();
    }
    function get_style_flag_options(property) {
        return quill_config.flags[property].get_options();
    }
    function set_style_flag(property, value) {
        const msg = `Unknown style flag "${property}"`;
        if (!Util.warning(Object.hasOwn(quill_config.flags, property), msg)) return;
        apply_flag_to_root_element(property, quill_config.flags[property].set(value));
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
        Util.add_style_variable_to_element(quill_config.root_element, property, "-font", font);
    }
    function apply_color_to_root_element(property, color) {
        Util.add_style_variable_to_element(quill_config.root_element, property, "-color", color.to_css());
    }
    function apply_size_to_root_element(property, size) {
        Util.add_style_variable_to_element(quill_config.root_element, property, "-size", `${size}px`);
    }
    function apply_flag_to_root_element(property, flag) {
        Util.add_style_variable_to_element(quill_config.root_element, property, "", flag.get_value());
    }

    function close_popup() {
        if (active_popup !== null) active_popup.close();
        active_popup = null;
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
    let active_popup = null;
    let active_menu_bar = null;
    let active_menu = null;
    let prevent_menu_from_being_hidden = false;
})((window.Quill = window.Quill || {}));
