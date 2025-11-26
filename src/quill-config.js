"use strict";

class QuillConfigFlag {
    #options;
    #selected;
    #is_true_or_false;

    constructor(options) {
        // TODO: validate options
        this.#is_true_or_false = options instanceof Array;
        this.#options = Object.freeze({ ...(this.#is_true_or_false ? options.slice(0, 2) : options) });
        this.#selected = this.get_options()[0];
    }

    // Public methods

    get_options = () => (this.#is_true_or_false ? [false, true] : Object.keys(this.#options));

    set(selected) {
        // TODO: validate selected
        if (!Util.warning(this.get_options().includes(selected), this.get_options(), selected)) return this;
        this.#selected = selected;
        return this;
    }

    get = () => this.#selected;

    get_value(selected = this.#selected) {
        // TODO: validate selected
        if (!Util.warning(this.get_options().includes(selected), this.get_options(), selected)) return;
        return this.#options[this.#is_true_or_false ? (+selected).toString() : selected];
    }
}

const QuillConfig = {
    fonts: {
        proportional: null,
        monospace: null,
    },
    colors: new Proxy(
        {
            background: null,

            text: null,
            text_disabled: null,

            item_hovered: null,
            input: null,
            input_disabled: null,
            input_hovered: null,

            panel_content_bg: null,

            border: null,

            item_bg: null,
            item_hovered_bg: null,
            item_disabled_bg: null,

            panel_title_bar_bg: null,

            menu_bg: null,

            scrollbar_thumb: null,
            scrollbar_track: null,

            checkmark: null,
            checkmark_hovered: null,

            slidergrab: null,
            slidergrab_hovered: null,

            button: null,
            button_hovered: null,

            header: null,
            header_hovered: null,

            separator: null,

            tab: null,
            tab_selected: null,
            tab_hovered: null,

            plot_lines: null,
            plot_histogram: null,

            table_header_bg: null,
            table_border_strong: null,
            table_border_light: null,
            table_row_bg: null,
        },
        {
            set: function (target, property, value) {
                target[property] = value;

                // TODO: only update when the color hasn't been overridden
                if (property === "plot_lines") {
                    QuillConfig.plots.filter((x) => x instanceof QuillPlotLines).forEach((x) => x.update());
                } else if (property === "plot_histogram") {
                    QuillConfig.plots
                        .filter((x) => x instanceof QuillPlotHistogram || x instanceof QuillProgressBar)
                        .forEach((x) => x.update());
                }

                return true;
            },
        }
    ),
    sizes: {
        font: null,

        panel_padding: new Array(2),
        title_bar_padding: null,
        menu_padding: null,
        menu_item_padding: null,
        item_padding: null,
        panel_gap: null,
        menu_gap: null,
        item_gap: null,
        item_inner_gap: null,
        indentation: null,

        panel_border: null,
        menu_border: null,
        input_border: null,
        separator: null,
        table_border_strong: null,
        table_border_light: null,

        panel_rounding: null,
        menu_rounding: null,
        item_rounding: null,
        input_rounding: null,
        grab_rounding: null,

        tab_border: null,
        tab_bar_border: null,
        tab_rounding: null,

        separator_text_border: null,
        separator_text_padding: null,
        shadow: null,
    },
    flags: {
        wrap_text: new QuillConfigFlag(["nowrap", "wrap"]),
        panel_title_bar_text_align: new QuillConfigFlag({ Left: "left", Center: "center", Right: "right" }),
        input_text_align: new QuillConfigFlag({ Left: "left", Center: "center", Right: "right" }),
        fieldset_legend_text_align: new QuillConfigFlag({ Left: "left", Center: "center", Right: "right" }),
        labels_left: new QuillConfigFlag(["row", "row-reverse"]),
        justify_labels: new QuillConfigFlag(["fit-content", "100%"]),
        table_borders_outer_h: new QuillConfigFlag(["none", "solid"]),
        table_borders_outer_v: new QuillConfigFlag(["none", "solid"]),
        table_borders_inner_h: new QuillConfigFlag(["none", "solid"]),
        table_borders_inner_v: new QuillConfigFlag(["none", "solid"]),
        table_row_bg: new QuillConfigFlag(["transparent", "var(--quill-table-row-bg-color)"]),
        scrollbar_width: new QuillConfigFlag({ Normal: "auto", Thin: "thin" }),
        separator_text_align: new QuillConfigFlag({ Left: "left", Center: "center", Right: "right" }),
    },

    plots: [],
    presets: {
        ...(() => {
            const get_quill_style = (colors) => ({
                fonts: {
                    proportional:
                        "system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
                    monospace: "Consolas, 'Courier New', Courier, monospace",
                },
                colors: (() => {
                    return {
                        background: colors.shades[1],

                        text: colors.text,
                        text_disabled: colors.text_muted,

                        item_hovered: colors.text_highlight,
                        input: colors.accent,
                        input_disabled: colors.text_muted,
                        input_hovered: colors.accent_highlight,

                        panel_content_bg: colors.shades[2],

                        border: colors.border,

                        item_bg: colors.shades[3],
                        item_hovered_bg: colors.shades[4],
                        item_disabled_bg: colors.shades[0],

                        panel_title_bar_bg: colors.shades[2],

                        menu_bg: colors.shades[3],

                        scrollbar_thumb: colors.shades[0],
                        scrollbar_track: colors.shades[2],

                        checkmark: colors.accent,
                        checkmark_hovered: colors.accent_highlight,

                        slidergrab: colors.accent,
                        slidergrab_hovered: colors.accent_highlight,

                        button: colors.shades[3],
                        button_hovered: colors.shades[4],

                        header: colors.shades[3],
                        header_hovered: colors.shades[4],

                        separator: colors.border,

                        tab: colors.shades[1],
                        tab_selected: colors.shades[2],
                        tab_hovered: colors.shades[2],

                        plot_lines: colors.accent,
                        plot_histogram: colors.accent,

                        table_header_bg: colors.shades[3],
                        table_border_strong: colors.shades[0],
                        table_border_light: colors.shades[0],
                        table_row_bg: colors.shades[1],
                    };
                })(),
                sizes: {
                    font: 14,

                    panel_padding: [15, 15],
                    title_bar_padding: [10, 10],
                    menu_padding: [5, 5],
                    menu_item_padding: [5, 5],
                    item_padding: [2, 2],
                    panel_gap: 5,
                    menu_gap: 2,
                    item_gap: 5,
                    item_inner_gap: 5,
                    indentation: 20,

                    panel_border: 0,
                    menu_border: 0,
                    input_border: 0,
                    separator: 1,
                    table_border_strong: 2,
                    table_border_light: 1,

                    panel_rounding: 15,
                    menu_rounding: 20,
                    item_rounding: 20,
                    input_rounding: 20,
                    grab_rounding: 20,

                    tab_border: 0,
                    tab_bar_border: 5,
                    tab_rounding: 10,

                    separator_text_border: 3,
                    separator_text_padding: [20, 3],

                    shadow: 3,
                },
                flags: {
                    wrap_text: false,
                    panel_title_bar_text_align: "Left",
                    input_text_align: "Left",
                    fieldset_legend_text_align: "Left",
                    labels_left: false,
                    justify_labels: false,
                    table_borders_outer_h: false,
                    table_borders_outer_v: false,
                    table_borders_inner_h: false,
                    table_borders_inner_v: false,
                    table_row_bg: false,
                    scrollbar_width: "Thin",
                    separator_text_align: "Left",
                },
            });
            return {
                quill_light: get_quill_style({
                    text: new QuillColor(80, 80, 80).to_hex(),
                    text_highlight: new QuillColor(30, 30, 30).to_hex(),
                    text_muted: new QuillColor(160, 160, 160).to_hex(),
                    border: new QuillColor(128, 128, 128).to_hex(),

                    accent: new QuillColor(100, 100, 255).to_hex(),
                    accent_highlight: new QuillColor(50, 50, 255).to_hex(),

                    shades: [0, 1, 2, 3, 4].map((i) => {
                        const c = 195 + 15 * i;
                        return new QuillColor(c, c, c).to_hex();
                    }),
                }),
                quill_dark: get_quill_style({
                    text: new QuillColor(180, 180, 180).to_hex(),
                    text_highlight: new QuillColor(230, 230, 230).to_hex(),
                    text_muted: new QuillColor(80, 80, 80).to_hex(),
                    border: new QuillColor(128, 128, 128).to_hex(),

                    accent: new QuillColor(150, 150, 255).to_hex(),
                    accent_highlight: new QuillColor(200, 200, 255).to_hex(),

                    shades: [0, 1, 2, 3, 4].map((i) => {
                        const c = 30 + 10 * i;
                        return new QuillColor(c, c, c).to_hex();
                    }),
                }),
            };
        })(),

        imgui: {
            fonts: {
                proportional: "DroidSans",
                monospace: "DroidSans",
            },
            colors: {
                background: new QuillColor(0, 0, 0).to_hex(),

                text: new QuillColor(255, 255, 255).to_hex(),
                text_disabled: new QuillColor(128, 128, 128).to_hex(),

                item_hovered: new QuillColor(255, 255, 255).to_hex(),
                input: new QuillColor(255, 255, 255).to_hex(),
                input_disabled: new QuillColor(49, 104, 170).to_hex(),
                input_hovered: new QuillColor(255, 255, 255).to_hex(),

                panel_content_bg: new QuillColor(14, 14, 14).to_hex(),

                border: new QuillColor(110, 110, 128).to_hex(),

                item_bg: new QuillColor(29, 47, 73).to_hex(),
                item_hovered_bg: new QuillColor(53, 69, 109).to_hex(),
                item_disabled_bg: new QuillColor(23, 34, 50).to_hex(),

                panel_title_bar_bg: new QuillColor(10, 10, 10).to_hex(),

                menu_bg: new QuillColor(36, 36, 36).to_hex(),

                scrollbar_thumb: new QuillColor(79, 79, 79).to_hex(),
                scrollbar_track: new QuillColor(0, 0, 0).to_hex(),

                checkmark: new QuillColor(66, 150, 250).to_hex(),
                checkmark_hovered: new QuillColor(66, 150, 250).to_hex(),

                slidergrab: new QuillColor(61, 133, 224).to_hex(),
                slidergrab_hovered: new QuillColor(61, 133, 224).to_hex(),

                button: new QuillColor(35, 69, 109).to_hex(),
                button_hovered: new QuillColor(66, 150, 250).to_hex(),

                header: new QuillColor(31, 57, 88).to_hex(),
                header_hovered: new QuillColor(56, 123, 203).to_hex(),

                separator: new QuillColor(110, 110, 128).to_hex(),

                tab: new QuillColor(42, 79, 130).to_hex(),
                tab_selected: new QuillColor(51, 105, 173).to_hex(),
                tab_hovered: new QuillColor(56, 123, 204).to_hex(),

                plot_lines: new QuillColor(151, 156, 156).to_hex(),
                plot_histogram: new QuillColor(230, 179, 0).to_hex(),

                table_header_bg: new QuillColor(48, 48, 51).to_hex(),
                table_border_strong: new QuillColor(79, 79, 89).to_hex(),
                table_border_light: new QuillColor(59, 59, 64).to_hex(),
                table_row_bg: new QuillColor(29, 29, 29).to_hex(),
            },
            sizes: {
                font: 13,

                panel_padding: [8, 8],
                title_bar_padding: [3, 3],
                menu_padding: [0, 0],
                menu_item_padding: [3, 3],
                item_padding: [3, 3],
                panel_gap: 4,
                menu_gap: 4,
                item_gap: 4,
                item_inner_gap: 4,
                indentation: 21,

                panel_border: 1,
                menu_border: 1,
                input_border: 0,
                separator: 1,
                table_border_strong: 1,
                table_border_light: 1,

                panel_rounding: 0,
                menu_rounding: 0,
                item_rounding: 0,
                input_rounding: 0,
                grab_rounding: 0,

                tab_border: 0,
                tab_bar_border: 1,
                tab_rounding: 5,

                separator_text_border: 3,
                separator_text_padding: [20, 3],

                shadow: 0,
            },
            flags: {
                wrap_text: false,
                panel_title_bar_text_align: "Left",
                input_text_align: "Left",
                fieldset_legend_text_align: "Left",
                labels_left: false,
                justify_labels: false,
                table_borders_outer_h: false,
                table_borders_outer_v: false,
                table_borders_inner_h: false,
                table_borders_inner_v: false,
                table_row_bg: false,
                scrollbar_width: "Normal",
                separator_text_align: "Left",
            },
        },
    },
};
