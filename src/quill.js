"use strict";

(function (Quill) {
    Quill.init = (root_element_arg) => {
        // TODO: validate root_element
        if (!Util.error(root_element_arg instanceof Element)) return;

        // Add all public-facing properties

        Quill.Color = (...args) => new QuillColor(...args);
        Quill.Separator = (...args) => new QuillSeparator(...args);
        Quill.SeparatorText = (...args) => new QuillSeparatorText(...args);
        Quill.Spacing = (...args) => new QuillSpacing(...args);
        Quill.InfoTooltip = (...args) => new QuillInfoTooltip(...args);
        Quill.Text = (...args) => new QuillText(...args);
        Quill.TextWrapped = (...args) => new QuillTextWrapped(...args);
        Quill.Panel = (...args) => new Panel(...args);
        Quill.Modal = (...args) => new QuillModal(...args);
        Quill.Popup = (...args) => new QuillPopup(...args);
        Quill.MenuBar = (...args) => new MenuBar(...args);
        Quill.Menu = (...args) => new QuillMenu(...args);
        Quill.MenuItem = (...args) => new QuillMenuItem(...args);
        Quill.TogglePanelMenuItem = (...args) => new QuillTogglePanelMenuItem(...args);
        Quill.FixedCanvas = (...args) => new QuillFixedCanvas(...args);
        Quill.Table = (...args) => new QuillTable(...args);
        Quill.TableHeaderRow = (...args) => new QuillTableHeaderRow(...args);
        Quill.TableRow = (...args) => new QuillTableRow(...args);
        Quill.TableCell = (...args) => new QuillTableCell(...args);
        Quill.TableHeaderCell = (...args) => new QuillTableHeaderCell(...args);
        Quill.CollapsingHeader = (...args) => new QuillCollapsingHeader(...args);
        Quill.Indent = (...args) => new QuillIndent(...args);
        Quill.Tree = (...args) => new QuillTree(...args);
        Quill.Button = (...args) => new QuillButton(...args);
        Quill.Row = (...args) => new QuillRow(...args);
        Quill.Column = (...args) => new QuillColumn(...args);
        Quill.Fieldset = (...args) => new QuillFieldset(...args);
        Quill.CheckboxTree = (...args) => new QuillCheckboxTree(...args);
        Quill.Checkbox = (...args) => new QuillCheckbox(...args);
        Quill.RadioButtons = (...args) => new QuillRadioButtons(...args);
        Quill.RadioButton = (...args) => new QuillRadioButton(...args);
        Quill.Dropdown = (...args) => new QuillDropdown(...args);
        Quill.DropdownOptions = (...args) => new QuillDropdownOptions(...args);
        Quill.InputText = (...args) => new QuillInputText(...args);
        Quill.InputHex = (...args) => new QuillInputBase(16, ...args);
        Quill.InputBin = (...args) => new QuillInputBase(2, ...args);
        Quill.InputByte = (...args) => new QuillInputBytes(1, ...args);
        Quill.InputWord = (...args) => new QuillInputBytes(2, ...args);
        Quill.InputFloat = (...args) => new QuillInputFloat(...args);
        Quill.InputFloat2 = (...args) => new QuillInputMultiComponent(QuillInputFloat, 2, ...args);
        Quill.InputFloat3 = (...args) => new QuillInputMultiComponent(QuillInputFloat, 3, ...args);
        Quill.InputFloat4 = (...args) => new QuillInputMultiComponent(QuillInputFloat, 4, ...args);
        Quill.InputInteger = (...args) => new QuillInputInteger(...args);
        Quill.InputInteger2 = (...args) => new QuillInputMultiComponent(QuillInputInteger, 2, ...args);
        Quill.InputInteger3 = (...args) => new QuillInputMultiComponent(QuillInputInteger, 3, ...args);
        Quill.InputInteger4 = (...args) => new QuillInputMultiComponent(QuillInputInteger, 4, ...args);
        Quill.InputS8 = (...args) => new QuillInputI(-128, 128 - 1, ...args);
        Quill.InputU8 = (...args) => new QuillInputI(0, 256 - 1, ...args);
        Quill.InputS16 = (...args) => new QuillInputI(-32768, 32768 - 1, ...args);
        Quill.InputU16 = (...args) => new QuillInputI(0, 65536 - 1, ...args);
        Quill.InputS32 = (...args) => new QuillInputI(-2147483648, 2147483647, ...args);
        Quill.SliderFloat = (...args) => new QuillSliderFloat(...args);
        Quill.SliderFloat2 = (...args) => new QuillInputMultiComponent(QuillSliderFloat, 2, ...args);
        Quill.SliderFloat3 = (...args) => new QuillInputMultiComponent(QuillSliderFloat, 3, ...args);
        Quill.SliderFloat4 = (...args) => new QuillInputMultiComponent(QuillSliderFloat, 4, ...args);
        Quill.SliderInteger = (...args) => new QuillSliderInteger(...args);
        Quill.SliderInteger2 = (...args) => new QuillInputMultiComponent(QuillSliderInteger, 2, ...args);
        Quill.SliderInteger3 = (...args) => new QuillInputMultiComponent(QuillSliderInteger, 3, ...args);
        Quill.SliderInteger4 = (...args) => new QuillInputMultiComponent(QuillSliderInteger, 4, ...args);
        Quill.SliderS8 = (...args) => new QuillSliderI(-128, 128 - 1, ...args);
        Quill.SliderU8 = (...args) => new QuillSliderI(0, 256 - 1, ...args);
        Quill.SliderS16 = (...args) => new QuillSliderI(-32768, 32768 - 1, ...args);
        Quill.SliderU16 = (...args) => new QuillSliderI(0, 65536 - 1, ...args);
        Quill.DragFloat = (...args) => new QuillDragFloat(...args);
        Quill.DragFloat2 = (...args) => new QuillInputMultiComponent(QuillDragFloat, 2, ...args);
        Quill.DragFloat3 = (...args) => new QuillInputMultiComponent(QuillDragFloat, 3, ...args);
        Quill.DragFloat4 = (...args) => new QuillInputMultiComponent(QuillDragFloat, 4, ...args);
        Quill.DragInteger = (...args) => new QuillDragInteger(...args);
        Quill.DragInteger2 = (...args) => new QuillInputMultiComponent(QuillDragInteger, 2, ...args);
        Quill.DragInteger3 = (...args) => new QuillInputMultiComponent(QuillDragInteger, 3, ...args);
        Quill.DragInteger4 = (...args) => new QuillInputMultiComponent(QuillDragInteger, 4, ...args);
        Quill.DragS8 = (...args) => new QuillDragI(-128, 128 - 1, ...args);
        Quill.DragU8 = (...args) => new QuillDragI(0, 256 - 1, ...args);
        Quill.DragS16 = (...args) => new QuillDragI(-32768, 32768 - 1, ...args);
        Quill.DragU16 = (...args) => new QuillDragI(0, 65536 - 1, ...args);
        Quill.ColorPicker = (...args) => new QuillColorPicker(...args);
        Quill.Tabs = (...args) => new QuillTabs(...args);
        Quill.Tab = (...args) => new QuillTab(...args);
        Quill.DynamicRows = (...args) => new QuillDynamicRows(...args);
        Quill.PlotLines = (...args) => new QuillPlotLines(...args);
        Quill.PlotHistogram = (...args) => new QuillPlotHistogram(...args);
        Quill.ProgressBar = (...args) => new QuillProgressBar(...args);
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
        Quill.get_style_flag_values = get_style_flag_values;
        Quill.set_style_flag = set_style_flag;
        Quill.set_style_config = set_style_config;
        Quill.get_panels = get_panels;
        Quill.open_file_dialog = open_file_dialog;
        Quill.fill_array = Util.fill_array;
        Quill.show_demo = quill_show_demo;

        root_element = root_element_arg;
        content_element = Util.element_from_html(`<div class="quill-content"></div>`);

        root_element.classList.add("quill");
        root_element.append(content_element);

        set_style_config(quill_config.presets.imgui);

        Object.entries(quill_config.fonts).forEach((entry) => apply_font_to_root_element(...entry));
        Object.entries(quill_config.colors).forEach((entry) => apply_color_to_root_element(...entry));
        Object.entries(quill_config.sizes).forEach((entry) => apply_size_to_root_element(...entry));
        Object.entries(quill_config.flags).forEach((entry) => apply_flag_to_root_element(...entry));

        window.addEventListener("mousemove", (e) => {
            if (moving !== null) {
                const size = moving.panel.get_size();
                const content_width = content_element.offsetWidth;
                const content_height = content_element.offsetHeight;
                const x = Math.max(0, Math.min(moving.x + e.screenX, content_width - size.width));
                const y = Math.max(0, Math.min(moving.y + e.screenY, content_height - size.height));
                moving.panel.set_position({ x, y });
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
                    const x = Math.min(resizing.x + e.screenX, position.x + size.width - MIN_WIDTH);
                    position.x = Math.max(0, x);
                    size.width = Math.max(MIN_WIDTH, resizing.width - e.screenX + Math.min(x, 0));
                } else if (resizing.resizer_x === 2) {
                    size.width = Math.min(Math.max(MIN_WIDTH, resizing.width + e.screenX), width - position.x);
                }

                if (resizing.resizer_y === 0) {
                    const y = Math.min(resizing.y + e.screenY, position.y + size.height - MIN_HEIGHT);
                    position.y = Math.max(0, y);
                    size.height = Math.max(MIN_HEIGHT, resizing.height - e.screenY + Math.min(y, 0));
                } else if (resizing.resizer_y === 2) {
                    size.height = Math.min(Math.max(MIN_HEIGHT, resizing.height + e.screenY), height - position.y);
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

        Object.freeze(Quill);
    };

    /* Quill.Panel */

    class Panel extends QuillPanel {
        #id;
        #closed = true;

        constructor(name, ...args) {
            // TODO: validate name
            super(name, false, start_moving_panel, start_resizing_panel, ...args);

            const element = this.get_element();

            this.#create_id(name);
            this.#closed = !!this._get_arg_config().closed;
            Util.add_mouse_down_event_listener(element, () => show_panel_on_top(this));

            const stored_index = quill_panels_order.indexOf(this.#id);
            if (stored_index < 0) {
                const new_index = quill_panels_order.length;
                this.set_position({ x: new_index * 25, y: new_index * 25 });
                this.set_size({ width: 300, height: 200 });
                set_panel_z_index(this, new_index);
                quill_panels_order.push(this.#id);
            } else {
                const config = stored_panels_config_at_init[stored_index];
                // TODO: validate x
                // TODO: validate y
                // TODO: validate width
                // TODO: validate height
                this.set_position({ x: config.x, y: config.y });
                this.set_size({ width: config.width, height: config.height });
                set_panel_z_index(this, stored_index);
                this.#closed = !config.is_open;
            }
            if (this.#closed) this.#close();

            content_element.append(element);
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
            // TODO: validate string
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
            // TODO: validate name
            super(name, true, start_moving_panel, start_resizing_panel, ...args);

            const element = this.get_element();

            const width = 300;
            const height = 200;
            this.set_size({ width, height });
            this.set_position({
                x: (content_element.offsetWidth - width) / 2,
                y: (content_element.offsetHeight - height) / 2,
            });
            element.style.zIndex = 1000;

            content_element.append(element);
        }

        // Public methods

        close = () => this.remove();
    }

    /* Quill.Popup */

    class QuillPopup extends QuillBasePanel {
        constructor(name, x, y, ...args) {
            // TODO: validate name
            // TODO: validate x
            // TODO: validate y
            const foo = Util.config_callback_and_children_from_arguments(...args);
            foo.config.has_title_bar = false;
            foo.config.has_menu_bar = false;
            foo.config.can_move = false;
            foo.config.can_resize = false;
            foo.config.can_close = false;

            super(name, false, start_moving_panel, start_resizing_panel, ...Object.values(foo), ...args.slice(foo.count));

            const element = this.get_element();
            element.classList.add("quill-popup");

            this.set_position({ x, y });
            element.style.zIndex = 10000;

            content_element.append(element);

            active_popup = this;
        }

        // Public methods

        close = () => this.remove();
    }

    /* Quill.MenuBar */

    class MenuBar extends QuillMenuBar {
        constructor(...args) {
            super(`<div class="quill-menu-bar"></div>`, [QuillMenu, QuillMenuItem, QuillSeparator], null, ...args);
            this.add_children(this._get_arg_children());
        }
    }

    /* Quill.MenuItem */

    class QuillMenuItem extends QuillElement {
        static #initialized = false;
        static #ctrl_keys = {};

        #checkbox = null;

        static #init() {
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
            QuillMenuItem.#init();
            super(
                `<label class="quill-menu-item">
                    <div></div>
                    <div>${Util.html_string_from_object(title)}</div>
                    <div></div>
                    <div></div>
                </label>`,
                [],
                null,
                ...args
            );

            const config = this._get_arg_config();
            // TODO: validate checkable
            // TODO: validate checked
            if (!!config.checkable) {
                this.#checkbox = new QuillCheckbox({ checked: !!config.checked }, (_, __, e) => this.#notify_user(e));
                this.get_element().querySelector(":nth-child(1)").append(this.#checkbox.get_element());
            }

            const element = this.get_element();
            // TODO: validate ctrl_key
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
            if (this.#checkbox) this.#checkbox.set_checked(!!checked);
            return this;
        }

        // Private methods

        #notify_user(e) {
            // TODO: validate e
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

    /* Quill.TogglePanelMenuItem */

    class QuillTogglePanelMenuItem extends QuillMenuItem {
        constructor(panel, ...args) {
            const named_args = Util.config_callback_and_children_from_arguments(...args);
            const arg_config = Object.freeze(named_args.config);
            const arg_callback = Object.freeze(named_args.callback);
            const arg_children = Object.freeze(named_args.children);

            const config = { ...arg_config, checkable: true, checked: panel.is_open() };
            panel.on_close(() => this.set_checked(false)); // TODO: do not overwrite possible other function.

            super(panel.get_name(), config, (element, ...args) => {
                element.is_checked() ? panel.open() : panel.close();
                arg_callback(element, ...args), arg_children;
            });
        }
    }

    /* Quill.Menu */

    class QuillMenu extends QuillElement {
        #menu_element;

        constructor(title, ...args) {
            super(
                `<label class="quill-menu-item">
                    <div></div>
                    <div>${Util.html_string_from_object(title)}</div>
                    <div></div>
                    <div></div>
                </label>`,
                [QuillMenu, QuillMenuItem, QuillSeparator],
                (child) => this.#add_child(child),
                ...args
            );

            this.#menu_element = Util.element_from_html(`<div class="quill-menu"></div>`);

            const element = this.get_element();
            Util.add_mouse_down_event_listener(element, () => this.#toggle_parent_menu_bar_active_state());
            Util.add_mouse_down_event_listener(this.#menu_element, () => this.#prevent_from_being_hidden());
            element.addEventListener("mouseenter", () => this.#show_if_menu_bar_active());

            this.add_children(this._get_arg_children());
            content_element.append(this.#menu_element);
            element.querySelector(":nth-child(4)").append(Util.element_from_html(`<div class="quill-arrow-right"></div>`));
        }

        show = () => this.#show();

        hide = () => this.#hide();

        remove() {
            this.#menu_element.remove();
            return super.remove();
        }

        // Private methods

        #add_child(child) {
            this.#menu_element.append(child.get_element());
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
                this.#set_position((position) => (position.y += element.offsetHeight));
            } else {
                this.#menu_element.style.zIndex = +getComputedStyle(parent.#menu_element).zIndex + 1;
                parent.#show?.();
                this.#set_position((position) => (position.x += element.offsetWidth));
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
            // TODO: validate callback
            const content_element_rect = content_element.getBoundingClientRect();
            const element_rect = this.get_element().getBoundingClientRect();
            const position = {
                x: element_rect.left - content_element_rect.left,
                y: element_rect.top - content_element_rect.top,
            };
            callback(position);
            this.#menu_element.style.left = `${position.x}px`;
            this.#menu_element.style.top = `${position.y}px`;
        }
    }

    // Quill.InputBytes

    class QuillInputBytes extends QuillInput {
        constructor(size, ...args) {
            // TODO: validate size
            Util.assert(size === 1 || size === 2);

            const html = `<input class="quill-input" type="text" size="${size * 2}" maxlength="${size * 2}" />`;
            super(html, "change", sanitize_value, [], null, ...args);

            const mask = (0x100 << ((size - 1) * 8)) - 1;

            function sanitize_value(value) {
                // TODO: validate value
                return (value & mask).toString(16).padStart(size * 2, 0);
            }

            function value_to_signed(value) {
                // TODO: validate value
                return value > mask >> 1 ? value - mask - 1 : value;
            }

            function ascii_to_value(ascii) {
                // TODO: validate ascii
                return parseInt(
                    ascii
                        .split("")
                        .map((x) => (x.charCodeAt() & 0xff).toString(16))
                        .join(""),
                    16
                );
            }

            function value_to_ascii(value) {
                // TODO: validate value
                return String.fromCharCode(
                    ...value
                        .toString(16)
                        .padStart(size * 2, 0)
                        .match(/.{2}/g)
                        .map((x) => parseInt(x, 16))
                );
            }

            const input_u = size === 1 ? Quill.InputU8 : Quill.InputU16;
            const input_s = size === 1 ? Quill.InputS8 : Quill.InputS16;

            this._get_input_element().addEventListener("click", () => {
                const update_popup = (value) => {
                    // TODO: validate value
                    const children = popup.get_children();
                    children[0].set_value(value);
                    children[1].set_value(value);
                    children[2].set_value(value);
                    children[3].set_value(value_to_signed(value));
                    children[4].set_value(value_to_ascii(value));
                };
                const update_and_dispatch = (value) => {
                    // TODO: validate value
                    update_popup(value);
                    this.set_value(value);
                    const input_element = this._get_input_element();
                    input_element.dispatchEvent(new Event("input", { bubbles: true }));
                    input_element.dispatchEvent(new Event("change", { bubbles: true }));
                };
                const popup = new QuillPopup("", this.get_page_x_right(), this.get_page_y_bottom(), [
                    Quill.InputHex("Hexadecimal", { length: size * 2 }, update_and_dispatch),
                    Quill.InputBin("Binary", { length: size * 8 }, update_and_dispatch),
                    input_u("Unsigned", update_and_dispatch),
                    input_s("Signed", (value) => update_and_dispatch(value & mask)),
                    Quill.InputText("ASCII", { length: size }, (value) => update_and_dispatch(ascii_to_value(value))),
                ]);

                update_popup(this.get_value());

                const first_input = popup.get_children()[0]._get_input_element();
                first_input.focus();
                first_input.select();
            });
        }

        // Public methods

        get_value = () => parseInt(super.get_value(), 16);
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
            // TODO: validate start_address
            // TODO: validate data_size
            // TODO: validate read_callback
            super(`<div class="quill-hex-editor"></div>`, [], null, ...args);

            const config = this._get_arg_config();
            // TODO: validate number_of_columns
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

            const dynamic_rows_element = this.#dynamic_rows.get_element();
            const write = (e) => {
                const input = e.target;
                const value = (parseInt(input.value, 16) >>> 0) & 0xff;
                input.dataset.value = value;
                input.value = this.#to_hex(value, 2);
                if (this.#show_ascii) {
                    const index = Array.from(input.parentNode.children).indexOf(input);
                    const child_ascii = input.closest(".quill-row").querySelector(".quill-hex-editor-ascii").children[index];
                    child_ascii.dataset.value = child_ascii.firstChild.nodeValue = this.#to_ascii(value);
                }
                this._get_arg_callback()(+input.dataset.address, value);
                focus_next(e);
            };
            const focus_next = (e) =>
                (e.target.nextSibling || e.target.closest(".quill-row").nextSibling?.querySelector("input"))?.focus();

            dynamic_rows_element.addEventListener("input", (e) => (e.target.value.length >= 2 ? focus_next(e) : null));
            dynamic_rows_element.addEventListener("change", write);
            dynamic_rows_element.addEventListener("focusin", (e) => e.target.select());

            const document_fragment = new DocumentFragment();
            document_fragment.append(
                this.#add_event_listeners(this.#create_header_row()),
                this.#add_event_listeners(dynamic_rows_element),
                this.#create_footer_row()
            );
            this.get_element().append(document_fragment);
            this.set_disabled(!!this._get_arg_config().disabled);
        }

        // Public methods

        update() {
            this.#dynamic_rows.update();
            return this;
        }

        set_disabled(disabled) {
            this.#dynamic_rows.set_disabled(!!disabled);
            return this;
        }

        // Private methods

        #set_number_of_columns(number_of_columns) {
            // TODO: validate number_of_columns
            this.#number_of_columns = Math.min(Math.max(0, ~~number_of_columns), 16);
            this.get_element().firstChild.replaceWith(this.#add_event_listeners(this.#create_header_row()));
            this.#dynamic_rows.set_number_of_rows(this.#get_number_of_rows());
        }

        #set_show_ascii(show_ascii) {
            this.#show_ascii = !!show_ascii;
            this.#dynamic_rows.refresh();
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
        }

        #get_number_of_rows() {
            return Math.ceil((this.#end_address - this.#start_address) / this.#number_of_columns);
        }

        #create_header_row() {
            return new QuillRow({ css: { padding: "0 var(--quill-item-padding-size)", paddingBottom: "5px" } }, [
                new QuillNodeElement(
                    `<div class="quill-hex-editor-address"
                          style="width: ${this.#format_address(this.#end_address - 1).length}ch;">
                    </div>`
                ),
                new QuillNodeElement(
                    `<div class="quill-hex-editor-data">${Util.fill_array(
                        this.#number_of_columns,
                        (i) => `<input disabled class="quill-hex-editor-byte" size="1" value="+${this.#to_hex(i, 1)}" />`
                    ).join("")}</div>`
                ),
            ]).get_element();
        }

        #add_event_listeners(element) {
            // TODO: validate element
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
            // TODO: validate value
            // TODO: validate number_of_characters
            const hex = value.toString(16).padStart(number_of_characters, 0);
            return this.#uppercase_hex ? hex.toUpperCase() : hex;
        }

        #to_ascii(value) {
            // TODO: validate value
            return String.fromCharCode(value >= 32 && value < 127 ? value : 46).replaceAll(/\s/g, "\xa0");
        }

        #format_address(address, length = this.#max_addr_length) {
            // TODO: validate address
            // TODO: validate length
            return "0x" + this.#to_hex(address, length);
        }

        #set_hovered_column(n) {
            this.get_element().setAttribute("data-hovered-column", n);
        }

        #address_and_data_from_index(index) {
            // TODO: validate index
            const address = index * this.#number_of_columns + this.#start_address;
            return {
                address,
                data: Array(this.#number_of_columns)
                    .fill()
                    .map((_, i) => (address + i < this.#end_address ? this.#read_callback(address + i) : -1)),
            };
        }

        #update_row_element(index, row) {
            // TODO: validate index
            // TODO: validate row
            const { data } = this.#address_and_data_from_index(index);
            const children_data = row.get_element().querySelector(".quill-hex-editor-data").children;
            const children_ascii = this.#show_ascii
                ? row.get_element().querySelector(".quill-hex-editor-ascii").children
                : null;
            for (const [i, value] of data.entries()) {
                if (value < 0) continue;
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
            // TODO: validate index
            const { address, data } = this.#address_and_data_from_index(index);
            const width = this.#format_address(this.#end_address - 1).length;
            const children = [
                new QuillNodeElement(
                    `<div class="quill-hex-editor-address" style="width: ${width}ch;">${this.#format_address(address)}</div>`
                ),
                new QuillNodeElement(
                    `<div class="quill-hex-editor-data">${this.#create_row_data_html(address, data)}</div>`
                ),
            ];
            if (this.#show_ascii) {
                const html = `<div class="quill-hex-editor-ascii">${this.#create_row_ascii_html(data)}</div>`;
                children.push(new QuillNodeElement(html));
            }
            return children;
        }

        #create_row_data_html(address, data) {
            // TODO: validate address
            // TODO: validate data
            return data
                .map((x, i) => {
                    if (x < 0) {
                        return `<input class="quill-hex-editor-byte" 
                                   size="1"
                                   maxlength="2"
                                   disabled />`;
                    } else {
                        return `<input class="quill-hex-editor-byte" 
                                   size="1"
                                   maxlength="2"
                                   data-address="${address + i}"
                                   data-value="${x}"
                                   value="${this.#to_hex(x, 2)}" />`;
                    }
                })
                .join("");
        }

        #create_row_ascii_html(data) {
            // TODO: validate data
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
        // TODO: validate property
        return quill_config.fonts[property];
    }

    function set_style_font(property, value) {
        // TODO: validate property
        // TODO: validate value
        const msg = `Unknown style font "${property}"`;
        if (!Util.warning(Object.hasOwn(quill_config.fonts, property), msg)) return;
        apply_font_to_root_element(property, value);
        quill_config.fonts[property] = value;
    }

    function get_color_names() {
        return Object.keys(quill_config.colors);
    }

    function get_style_color(property) {
        // TODO: validate property
        return quill_config.colors[property];
    }

    function set_style_color(property, value) {
        // TODO: validate property
        // TODO: validate value
        const msg = `Unknown style color "${property}"`;
        if (!Util.warning(Object.hasOwn(quill_config.colors, property), msg)) return;
        const color = QuillColor.from_hex(value);
        apply_color_to_root_element(property, color);
        quill_config.colors[property] = color;
    }

    function get_size_names() {
        return Object.keys(quill_config.sizes);
    }

    function get_style_size(property) {
        // TODO: validate property
        return quill_config.sizes[property];
    }

    function set_style_size(property, value) {
        // TODO: validate property
        // TODO: validate value
        const msg = `Unknown style size "${property}"`;
        if (!Util.warning(Object.hasOwn(quill_config.sizes, property), msg)) return;
        apply_size_to_root_element(property, value);
        quill_config.sizes[property] = value;
    }

    function get_flag_names() {
        return Object.keys(quill_config.flags);
    }

    function get_style_flag(property) {
        // TODO: validate property
        return quill_config.flags[property].get();
    }

    function get_style_flag_options(property) {
        // TODO: validate property
        return quill_config.flags[property].get_options();
    }

    function get_style_flag_values(property) {
        // TODO: validate property
        return quill_config.flags[property].get_values();
    }

    function set_style_flag(property, value) {
        // TODO: validate property
        // TODO: validate value
        const msg = `Unknown style flag "${property}"`;
        if (!Util.warning(Object.hasOwn(quill_config.flags, property), msg)) return;
        apply_flag_to_root_element(property, quill_config.flags[property].set(value));
    }

    function set_style_config(config) {
        for (const font of Object.entries(config.fonts)) {
            set_style_font(...font);
        }
        for (const color of Object.entries(config.colors)) {
            set_style_color(...color);
        }
        for (const size of Object.entries(config.sizes)) {
            set_style_size(...size);
        }
        for (const flag of Object.entries(config.flags)) {
            set_style_flag(...flag);
        }
    }

    function get_panels() {
        // TODO: copy properly?
        return { ...quill_panels };
    }

    function open_file_dialog(...args) {
        // TODO: validate args
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
        // TODO: validate property
        // TODO: validate font
        Util.add_style_variable_to_element(root_element, property, "-font", font);
    }

    function apply_color_to_root_element(property, color) {
        // TODO: validate property
        // TODO: validate color
        Util.add_style_variable_to_element(root_element, property, "-color", color.to_css());
    }

    function apply_size_to_root_element(property, size) {
        // TODO: validate property
        // TODO: validate size
        if (size instanceof Array) {
            Util.add_style_variable_to_element(root_element, property, "-size", `${size[1]}px ${size[0]}px`);
            Util.add_style_variable_to_element(root_element, property, "-size-x", `${size[0]}px`);
            Util.add_style_variable_to_element(root_element, property, "-size-y", `${size[1]}px`);
        } else {
            Util.add_style_variable_to_element(root_element, property, "-size", `${size}px`);
        }
    }

    function apply_flag_to_root_element(property, flag) {
        // TODO: validate property
        // TODO: validate flag
        Util.add_style_variable_to_element(root_element, property, "", flag.get_value());
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
        // TODO: validate quill_element
        const parent = quill_element.get_parent();
        return parent instanceof QuillMenu ? get_top_most_menu(parent) : quill_element;
    }

    function show_panel_on_top(panel) {
        // TODO: validate panel
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
        // TODO: validate panel
        // TODO: validate z_index
        panel.get_element().style.zIndex = z_index;
    }

    function start_moving_panel(panel, e) {
        // TODO: validate panel
        // TODO: validate e
        if (e.target.classList.contains("quill-close-button")) return;
        if (moving === null && resizing === null) {
            const position = panel.get_position();
            moving = { panel, x: position.x - e.screenX, y: position.y - e.screenY };
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
        // TODO: validate panel
        // TODO: validate e
        if (resizing === null && moving === null) {
            const position = panel.get_position();
            const size = panel.get_size();
            const index = Array.from(e.target.parentNode.children).indexOf(e.target);
            const resizer_x = index % 3;
            const resizer_y = ~~(index / 3);
            resizing = {
                panel,
                x: position.x - e.screenX,
                y: position.y - e.screenY,
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
                return { id, x: position.x, y: position.y, width: size.width, height: size.height, is_open: open };
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
    let root_element;
    let content_element;
    let moving = null;
    let resizing = null;
    let active_popup = null;
    let active_menu_bar = null;
    let active_menu = null;
    let prevent_menu_from_being_hidden = false;
})((window.Quill = window.Quill || {}));
