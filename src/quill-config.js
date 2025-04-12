"use strict";

class QuillConfigFlag {
    #options;
    #selected;
    #is_true_or_false;

    constructor(options) {
        this.#is_true_or_false = options instanceof Array;
        this.#options = Object.freeze({ ...(this.#is_true_or_false ? options.slice(0, 2) : options) });
        this.#selected = this.get_options()[0];
    }

    get_options = () => (this.#is_true_or_false ? [false, true] : Object.keys(this.#options));
    set(selected) {
        if (!Util.warning(this.get_options().includes(selected), this.get_options(), selected)) return this;
        this.#selected = selected;
        return this;
    }
    get = () => this.#selected;
    get_value(selected = this.#selected) {
        if (!Util.warning(this.get_options().includes(selected), this.get_options(), selected)) return;
        return this.#options[this.#is_true_or_false ? (+selected).toString() : selected];
    }
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
        wrap_text: new QuillConfigFlag(["nowrap", "wrap"]),
        panel_title_bar_text_align: new QuillConfigFlag({ left: "left", center: "center", right: "right" }),
        input_text_align: new QuillConfigFlag({ left: "left", center: "center", right: "right" }),
        fieldset_legend_text_align: new QuillConfigFlag({ left: "left", center: "center", right: "right" }),
        labels_left: new QuillConfigFlag(["row", "row-reverse"]),
        justify_labels: new QuillConfigFlag(["fit-content", "100%"]),
        table_borders_outer_h: new QuillConfigFlag(["none", "solid"]),
        table_borders_outer_v: new QuillConfigFlag(["none", "solid"]),
        table_borders_inner_h: new QuillConfigFlag(["none", "solid"]),
        table_borders_inner_v: new QuillConfigFlag(["none", "solid"]),
        table_row_bg: new QuillConfigFlag(["transparent", "var(--quill-table-row-bg-color)"]),
    },
};
