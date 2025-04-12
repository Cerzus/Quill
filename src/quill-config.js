"use strict";

class QuillConfigFlag {
    #values;
    #enabled = false;

    constructor(value_when_enabled, value_when_disabled) {
        this.#values = Object.freeze({
            true: value_when_enabled,
            false: value_when_disabled,
        });
    }
    set(enabled) {
        this.#enabled = !!enabled;
        return this;
    }
    is_enabled = () => this.#enabled;
    get_value = (enabled) => this.#values[enabled ?? this.#enabled];
}

const QuillConfig = {
    element: null,
    fonts: {
        proportional: "'Open Sans', Arial, Helvetica, sans-serif",
        monospace: "Consolas, 'Courier New', Courier, monospace",
    },
    colors: {
        background: new QuillColor(40, 40, 40),
        panel_title_bar_bg: new QuillColor(20, 20, 20),
        panel_content_bg: new QuillColor(30, 30, 30),
        menu_bg: new QuillColor(50, 50, 50),
        item_bg: new QuillColor(50, 50, 50),
        item_hovered_bg: new QuillColor(70, 70, 70),
        input_border: new QuillColor(0, 138, 110),
        line: new QuillColor(70, 70, 70),
        text: new QuillColor(150, 150, 150),
        item_hovered: new QuillColor(220, 220, 220),
        input: new QuillColor(0, 190, 255),
        input_hovered: new QuillColor(128, 223, 255),
        scrollbar_thumb: new QuillColor(30, 30, 30),
        scrollbar_track: new QuillColor(50, 50, 50),
        panel_border: new QuillColor(72, 61, 139),
        table_border: new QuillColor(80, 80, 80),
        table_row_bg: new QuillColor(20, 20, 20),
    },
    sizes: {
        font: 16,
        panel_padding: 2,
        panel_gap: 2,
        panel_border: 2,
        panel_border_radius: 0,
        panel_shadow: 0,
        menu_padding: 0,
        menu_gap: 2,
        menu_border: 2,
        menu_border_radius: 0,
        menu_shadow: 0,
        item_padding: 0,
        item_gap: 2,
        item_inner_gap: 2,
        item_border_radius: 0,
        input_border: 2,
        table_primary_border: 2,
        table_secondary_border: 1,
        line: 2,
        indentation: 20,
    },
    flags: {
        wrap_text: new QuillConfigFlag("wrap", "nowrap").set(false),
        labels_left: new QuillConfigFlag("row-reverse", "row").set(false),
        justify_labels: new QuillConfigFlag("100%", "fit-content").set(false),
        table_borders_outer_h: new QuillConfigFlag("solid", "none").set(false),
        table_borders_outer_v: new QuillConfigFlag("solid", "none").set(false),
        table_borders_inner_h: new QuillConfigFlag("solid", "none").set(false),
        table_borders_inner_v: new QuillConfigFlag("solid", "none").set(false),
        table_row_bg: new QuillConfigFlag("var(--quill-table-row-bg-color)", "transparent").set(false),
    },
};
