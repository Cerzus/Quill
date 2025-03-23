"use strict";

const QuillConfig = {
    element: null,
    fonts: {
        proportional: "'Open Sans', Arial, Helvetica, sans-serif",
        monospace: "Consolas, 'Courier New', Courier, monospace",
    },
    colors: {
        background: new QuillColor(40, 40, 40),
        panel_title_bar: new QuillColor(20, 20, 20),
        panel_content: new QuillColor(30, 30, 30),
        menu: new QuillColor(50, 50, 50),
        item_hover: new QuillColor(70, 70, 70),
        separator: new QuillColor(255, 255, 255, 0.2),
        text: new QuillColor(255, 255, 255, 0.5),
        scrollbar_thumb: new QuillColor(30, 30, 30),
        scrollbar_track: new QuillColor(50, 50, 50),
    },
    sizes: {
        panel_padding: 5,
        panel_resizer: 5,
        panel_border_radius: 5,
        menu_border_radius: 5,
        menu_padding: 2,
        item_border_radius: 3,
        item_padding: 1,
    },
    font_sizes: {
        panel_title_bar: 1.1,
    },
};
