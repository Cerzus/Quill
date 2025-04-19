/* 
    This demo deliberately does not use strict mode, to keep variables local for clarity of the examples.
*/

function get_style_editor() {
    const Q = Quill;

    return Q.Wrapper([
        Q.Separator(),
        Q.Tabs([
            Q.Tab("Fonts", [
                Q.Fieldset("Main", [
                    ...Q.get_font_names().map((property) =>
                        Q.InputText(
                            (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                            { value: Q.get_style_font(property) },
                            (value) => Q.set_style_font(property, value)
                        )
                    ),
                ]),
            ]),
            Q.Tab("Colors", [
                Q.Fieldset("Main", [
                    ...Q.get_color_names().map((property) =>
                        Q.ColorPicker(
                            (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                            { value: Q.get_style_color(property).to_hex() },
                            (value) => Q.set_style_color(property, value)
                        )
                    ),
                ]),
            ]),
            Q.Tab("Sizes", [
                Q.Fieldset("Main", [
                    ...Q.get_size_names().map((property) =>
                        Q.SliderInteger(
                            (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                            { min: 0, max: 20, value: Q.get_style_size(property) },
                            (value) => Q.set_style_size(property, value)
                        )
                    ),
                ]),
            ]),
            Q.Tab("Flags", [
                Q.Fieldset("Main", [
                    ...Q.get_flag_names().map((property) => {
                        if (Q.get_style_flag_options(property).length === 2) {
                            return Q.Checkbox(
                                (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                                { checked: Q.get_style_flag(property) },
                                (checked) => Q.set_style_flag(property, checked)
                            );
                        } else {
                            return Q.Dropdown(
                                (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                                { selected: Q.get_style_flag(property) },
                                (selected) => Q.set_style_flag(property, selected),
                                Q.DropdownOptions(Q.get_style_flag_options(property))
                            );
                        }
                    }),
                ]),
            ]),
        ]),
    ]);
}

function quill_show_demo() {
    const Q = Quill;

    let recent = null;

    const hex_editor_data = new Uint8Array(1000);
    for (let i = 0; i < hex_editor_data.length; i++) {
        const value = Math.random();
        hex_editor_data[i] = value < 0.5 ? value * 512 : 0;
    }

    Q.Panel("Panel 2");

    Q.Panel("Panel 3", { closed: true }, [
        Q.CollapsingHeader("Take a look, why don't you?", [
            Q.Tree("It's in here", [
                Q.HexEditor(0x050, 513, (i) => hex_editor_data[i], {
                    number_of_columns: 8,
                    show_ascii: false,
                    grey_out_zeroes: false,
                    uppercase_hex: true,
                }),
            ]),
        ]),
        Q.MenuBar([Q.MenuItem("HMM", { ctrl_key: "H" }, (element, e) => console.log("Ctrl+H", element, e))]),
    ]);

    Q.Panel("Style editor", { closed: true }, get_style_editor());

    const demo_panel = Q.Panel("Quill Demo", { closed: true }, [
        Q.CollapsingHeader("Configuration", [
            Q.Tree("Style", [
                Q.InfoTooltip("The same contents can be accessed in the menu under [Tools] -> [Style editor]"),
                get_style_editor(),
                // Q.Separator(),
            ]),
        ]),
        Q.CollapsingHeader("Window options", [
            Q.Table([
                Q.TableRow([
                    Q.TableColumn(
                        Q.Checkbox("Has title bar", { checked: true }, (c) => demo_panel.set_has_title_bar(c))
                    ),
                    Q.TableColumn(Q.Checkbox("Has menu bar", { checked: true }, (c) => demo_panel.set_has_menu_bar(c))),
                    Q.TableColumn(Q.Checkbox("Can move", { checked: true }, (c) => demo_panel.set_can_move(c))),
                ]),
                Q.TableRow([
                    Q.TableColumn(Q.Checkbox("Can resize", { checked: true }, (c) => demo_panel.set_can_resize(c))),
                    Q.TableColumn(Q.Checkbox("Can close", { checked: true }, (c) => demo_panel.set_can_close(c))),
                ]),
            ]),
        ]),
        Q.CollapsingHeader("Widgets", [
            Q.Tree("Basic", [
                Q.Row([
                    Q.Button("Button", () => (text.is_hidden() ? text.hide() : text.show())),
                    (text = Q.Text("Thanks for clicking me!")).hide(),
                ]),
                Q.Checkbox("Checkbox").set_checked(true),
                Q.RadioButtons([Q.RadioButton("Radio a", 0), Q.RadioButton("Radio b", 1), Q.RadioButton("Radio c", 2)]),
                Q.Separator(),
                Q.Row([
                    Q.Dropdown("Dropdown", Q.DropdownOptions(["AAAA", "BBBB", "CCCC", "DDDD", "EEEE", "FFFF"])),
                    Q.InfoTooltip(
                        `Refer to the "Dropdowns" section below for an explanation of how to use the Dropdown API.`
                    ),
                ]),
                Q.InputText("Input text", { value: "Hello, world!" }, (value) => console.log(value)),
                Q.InputInteger("Input integer", { value: 123 }, (value) => console.log(value)),
                Q.InputFloat("Input float", { value: 0.5 }, (value) => console.log(value)),
                Q.SliderInteger("Slider integer", (value) => console.log(value)).set_value(25),
                Q.SliderFloat("Slider float", (value) => console.log(value)).set_value(0.456),
            ]),
            Q.Tree("Trees", [
                Q.Tree(
                    "Basic trees",
                    Q.fill_array(5, (i) =>
                        Q.Tree(`Child ${i}`, { expanded: i === 0 }, [Q.Row([Q.Text("blah blah"), Q.Button("button")])])
                    )
                ),
            ]),
            Q.Tree("Collapsing headers", [
                (checkbox = Q.Checkbox("Show 2nd header", { checked: true }, (checked) =>
                    checked ? header.show() : header.hide()
                )),
                Q.CollapsingHeader(
                    "Header",
                    Q.fill_array(5, (i) => Q.Text(`Some content ${i}`))
                ),
                (header = Q.CollapsingHeader(
                    "Header with a close button",
                    { closeable: true },
                    Q.fill_array(5, (i) => Q.Text(`Some content ${i}`))
                )).on_close(() => checkbox.set_checked(false)),
            ]),
            Q.Tree("Text", [
                Q.Tree("Colorful text", [
                    Q.Text("Pink", { colors: { text: Q.Color(255, 0, 255) } }),
                    Q.Text("Yellow", { colors: { text: Q.Color(255, 255, 0) } }),
                    Q.Text("Disabled", { disabled: true }),
                ]),
                Q.Tree("Text wrapping", [
                    Q.Text(
                        `This text should automatically wrap on the edge of the window. Here, the wrapping is enabled by enabling the "wrap_text" flag manually.`,
                        { flags: { wrap_text: true } }
                    ),
                    Q.TextWrapped(
                        `Here, the wrapping is enabled by using "Quill.TextWrapped" in stead of "Quill.Text".`
                    ),
                ]),
                Q.Tree("UTF-8 text", [
                    Q.InfoTooltip(
                        `If this text does not render correctly, you may need to add a <meta charset="utf-8"> tag to the page.`
                    ),
                    Q.Text("Hiragana: かきくけこ (kakikukeko)"),
                    Q.Text("Kanjis: 日本語 (nihongo)"),
                ]),
            ]),
            Q.Tree("Dropdowns", [
                Q.Row([
                    Q.Dropdown(
                        (selected) => console.log(selected),
                        [Q.DropdownOptions(["AAAA", "BBBB", "CCCC", "DDDD", "EEEE", "FFFF", "GGGG", "HHHH"])]
                    ),
                    Q.InfoTooltip("Dropdown without a label"),
                ]),
                Q.Dropdown("Dropdown with values", { selected: "Option 3" }, (selected) => console.log(selected), [
                    Q.DropdownOptions([...Q.fill_array(5, (i) => `Option ${i + 1}`)]),
                ]),
                Q.Dropdown("Dropdown with keys and values", (selected) => console.log(selected), [
                    Q.DropdownOptions({ alice: "aaa", 123: "bbb", cool: "ccc" }),
                ]).set_selected("cool"),
                Q.Dropdown("Dropdown with option groups", (selected) => console.log(selected), [
                    Q.DropdownOptions("Group 1", { alice: "aaa", 123: "bbb", cool: "ccc" }),
                    Q.DropdownOptions(
                        "Group 2",
                        Q.fill_array(5, (i) => `Option ${i}`)
                    ),
                ]),
            ]),
            Q.Tree("Tabs", [
                Q.Tree("Basic", [
                    Q.Tabs([
                        Q.Tab("Avocado", Q.Text("This is the Avocado tab!\nblah blah blah blah blah")),
                        Q.Tab("Broccoli", Q.Text("This is the Broccoli tab!\nblah blah blah blah blah")),
                        Q.Tab("Cucumber", Q.Text("This is the Cucumber tab!\nblah blah blah blah blah")),
                    ]),
                    Q.Separator(),
                ]),
            ]),
        ]),
        Q.CollapsingHeader("Popups & Modals", { expanded: 1 }, [
            Q.Tree("Popups", { expanded: 1 }, [
                Q.TextWrapped(
                    "When a popup is active, it inhibits interacting with windows that are behind the popup.\nClicking outside the popup closes it."
                ),
                //     const selected_fish = STATIC(UNIQUE("selected_fish#ba576008"), -1);
                //     const names = ["Bream", "Haddock", "Mackerel", "Pollock", "Tilefish"];
                //     const toggles = STATIC_ARRAY(5, UNIQUE("toggles#b168bdf3"), [true, false, false, false, false]);
                //     // Simple selection popup (if you want to show the current selection inside the Button itself,
                //     // you may want to build a string using the "###" operator to preserve a constant ID with a variable label)
                Q.Row([
                    Q.Button("Select...", (_, e) =>
                        Q.Popup("my_select_popup", e.pageX, e.pageY, [
                            Q.Text("my_select_popup"),
                            Q.Text("Aquarium"),
                            //         Q.Separator();
                            //         for (let i = 0; i < Q.ARRAYSIZE(names); i++)
                            //             if (Q.Selectable(names[i]))
                            //                 selected_fish.value = i;
                        ])
                    ),
                    (text = Q.Text("<None>")),
                    //     Q.TextUnformatted(selected_fish.value === -1 ? "<None>" : names[selected_fish.value]);
                ]),
                //     // Showing a menu with toggles
                Q.Button("Toggle...", (_, e) =>
                    Q.Popup("my_toggle_popup", e.pageX, e.pageY, [
                        Q.Text("my_toggle_popup"),
                        //         for (let i = 0; i < Q.ARRAYSIZE(names); i++)
                        //             Q.MenuItem(names[i], "", toggles.access(i));
                        //         if (Q.BeginMenu("Sub-menu")) {
                        //             Q.MenuItem("Click me");
                        //             Q.EndMenu();
                        //         }
                        //         Q.Separator();
                        //         Q.Text("Tooltip here");
                        //         if (Q.IsItemHovered())
                        //             Q.SetTooltip("I am a tooltip over a popup");
                        //         if (Q.Button("Stacked Popup"))
                        //             Q.OpenPopup("another popup");
                        //         if (Q.BeginPopup("another popup")) {
                        //             for (let i = 0; i < Q.ARRAYSIZE(names); i++)
                        //                 Q.MenuItem(names[i], "", toggles.access(i));
                        //             if (Q.BeginMenu("Sub-menu")) {
                        //                 Q.MenuItem("Click me");
                        //                 if (Q.Button("Stacked Popup"))
                        //                     Q.OpenPopup("another popup");
                        //                 if (Q.BeginPopup("another popup")) {
                        //                     Q.Text("I am the last one here.");
                        //                     Q.EndPopup();
                        //                 }
                        //                 Q.EndMenu();
                        //             }
                        //             Q.EndPopup();
                        //         }
                    ])
                ),
                //     // Call the more complete ShowExampleMenuFile which we use in various places of this demo
                Q.Button("With a menu...", (_, e) =>
                    Q.Popup("my_file_popup", e.pageX, e.pageY, [
                        Q.Text("my_file_popup"),
                        //     if (Q.BeginPopup("my_file_popup", Q.WindowFlags.MenuBar)) {
                        //         if (Q.BeginMenuBar()) {
                        //             if (Q.BeginMenu("File")) {
                        //                 ShowExampleMenuFile();
                        //                 Q.EndMenu();
                        //             }
                        //             if (Q.BeginMenu("Edit")) {
                        //                 Q.MenuItem("Dummy");
                        //                 Q.EndMenu();
                        //             }
                        //             Q.EndMenuBar();
                        //         }
                        //         Q.Text("Hello from popup!");
                        //         Q.Button("This is a dummy button..");
                        //     }
                        // }
                    ])
                ),
            ]),
            Q.Tree("Modals", [
                Q.TextWrapped(
                    "Modals are like Panels but the user cannot interact outside of them before closing them."
                ),
                Q.Button("Delete...", () => {
                    const modal = Q.Modal("Delete?", [
                        Q.Text("All those beautiful files will be deleted.\nThis operation cannot be undone!"),
                        Q.Separator(),
                        Q.Checkbox("Don't ask me next time"),
                        Q.Row([Q.Button("OK", () => modal.close()), Q.Button("Cancel", () => modal.close())]),
                    ]);
                }),
                Q.Button("Stacked modals...", () => {
                    const modal = Q.Modal("Stacked 1", { not_closeable: true }, [
                        Q.MenuBar(Q.Menu("File", Q.MenuItem("Some menu item"))),
                        Q.Text("Hello from Stacked The First"),
                        Q.Button("Add another modal...", () => {
                            const modal = Q.Modal("Stacked 2", [
                                Q.Text("Hello from Stacked The Second!"),
                                Q.Button("Close", () => modal.close()),
                            ]);
                        }),
                        Q.Button("Close", () => modal.close()),
                    ]);
                }),
            ]),
        ]),
        Q.CollapsingHeader("Tables", [
            Q.Tree("Basic", [
                Q.InfoTooltip("This table is created with nested Quill.fill_array() calls."),
                Q.Table(Q.fill_array(4, (r) => Q.TableRow(Q.fill_array(3, (c) => Q.TableColumn(`R:${r}, C:${c}`))))),
                Q.InfoTooltip("This table is created with Quill.fill_array(0) for the rows."),
                Q.Table(
                    Q.fill_array(4, (r) =>
                        Q.TableRow([Q.TableColumn(`R:${r}`), Q.TableColumn(`Some contents`), Q.TableColumn(123.456)])
                    )
                ),
                Q.InfoTooltip(
                    "This table is created entirely by manually calling Quill.TableRow() and Quill.TableColumn()."
                ),
                Q.Table([
                    Q.TableRow([Q.TableColumn(0), Q.TableColumn(1), Q.TableColumn(2)]),
                    Q.TableRow([Q.TableColumn(3), Q.TableColumn(4), Q.TableColumn(5)]),
                    Q.TableRow([Q.TableColumn(6), Q.TableColumn(7), Q.TableColumn(8)]),
                    Q.TableRow([Q.TableColumn(9), Q.TableColumn(10)]),
                ]),
            ]),
            Q.Tree("Borders, background", [
                (row_bg = Q.Checkbox("Row background", { checked: true }, (checked) =>
                    table.set_style_flag("table_row_bg", checked)
                )),
                Q.CheckboxTree("Borders", [
                    (horizontal = Q.CheckboxTree("Horizontal", [
                        Q.Checkbox("Outer", { checked: true }, (c) => table.set_style_flag("table_borders_outer_h", c)),
                        Q.Checkbox("Inner", { checked: true }, (c) => table.set_style_flag("table_borders_inner_h", c)),
                    ])),
                    (vertical = Q.CheckboxTree("Vertical", [
                        Q.Checkbox("Outer", { checked: true }, (c) => table.set_style_flag("table_borders_outer_v", c)),
                        Q.Checkbox("Inner", { checked: true }, (c) => table.set_style_flag("table_borders_inner_v", c)),
                    ])),
                    Q.Checkbox("Outer", { checked: true }, (checked) => {
                        table.set_style_flag("table_borders_outer_h", checked);
                        table.set_style_flag("table_borders_outer_v", checked);
                    }),
                    Q.Checkbox("Inner", { checked: true }, (checked) => {
                        table.set_style_flag("table_borders_inner_h", checked);
                        table.set_style_flag("table_borders_inner_v", checked);
                    }),
                ]),
                // Q.Row([
                //     Q.Text("Cell contents:"),
                //     Q.RadioButtons({ value: "text" }, (value) => console.log(value), [
                //         Q.RadioButton("Button", "button"),
                //         Q.RadioButton("Text", "text"),
                //     ]),
                // ]),
                Q.Checkbox("Display headers", (c) => (c ? table_header.show() : table_header.hide())).set_checked(true),
                (table = Q.Table(
                    {
                        flags: {
                            table_borders_outer_h: horizontal.get_children()[0].is_checked(),
                            table_borders_outer_v: vertical.get_children()[0].is_checked(),
                            table_borders_inner_h: horizontal.get_children()[1].is_checked(),
                            table_borders_inner_v: vertical.get_children()[1].is_checked(),
                            table_row_bg: row_bg.is_checked(),
                        },
                    },
                    [
                        (table_header = Q.TableHeaderRow({ hidden: false }, [
                            Q.TableHeaderColumn("One"),
                            Q.TableHeaderColumn("Two"),
                            Q.TableHeaderColumn("Three"),
                        ])),
                        ...Q.fill_array(5, (r) =>
                            Q.TableRow(Q.fill_array(3, (c) => Q.TableColumn(Q.Text(`Hello ${c},${r}`))))
                        ),
                    ]
                )),
            ]),
        ]),
        Q.MenuBar([
            Q.Menu("File", {}, () => {}, [
                Q.Menu("File", [Q.MenuItem("Load..."), Q.Separator(), (recent = Q.Menu("Recent"))]),
                Q.MenuItem("Load...", { ctrl_key: "L" }, () =>
                    Q.open_file_dialog({ multiple: true }, (files) => {
                        console.log("Load", files);
                        recent.get_children().forEach((child) => child.remove());
                        recent.add_children([...files].map((file) => Q.MenuItem(file.name)));
                    })
                ),
                Q.Menu("Recent", [
                    Q.MenuItem("1. some_file.txt"),
                    Q.MenuItem("2. Another file.txt"),
                    Q.MenuItem("3. .yup"),
                    Q.Separator(),
                    Q.Menu("Recent", [
                        Q.MenuItem("1. some_file.txt"),
                        Q.MenuItem("2. Another file.txt"),
                        Q.MenuItem("3. .yup"),
                        Q.MenuItem("Load..."),
                        Q.Menu("Recent", [
                            Q.MenuItem("1. some_file.txt"),
                            Q.MenuItem("2. Another file.txt"),
                            Q.MenuItem("3. .yup"),
                        ]),
                        Q.Separator(),
                        Q.MenuItem("Quit"),
                    ]),
                    Q.Separator(),
                    Q.MenuItem("Quit"),
                ]),
                Q.Separator(),
                Q.MenuItem("Quit", { checkable: true, checked: true, ctrl_key: "q" }, (element, e) => {
                    console.log("Quit", element.is_checked(), e);
                }),
            ]),
            Q.MenuItem("Cool"),
            Q.MenuItem("Beans", { checkable: true }),
            Q.Separator(),
            Q.Menu(
                "Tools",
                Q.Menu("File", [
                    Q.MenuItem("Load..."),
                    Q.Menu("Recent", [
                        Q.MenuItem("1. some_file.txt"),
                        Q.MenuItem("2. Another file.txt"),
                        Q.MenuItem("3. .yup"),
                    ]),
                    Q.Separator(),
                    Q.MenuItem("Quit"),
                ])
            ).add_children(
                Object.values(Q.get_panels())
                    .filter((panel) => panel.can_close())
                    .map((panel) => {
                        const name = panel.get_name();
                        const config = { checkable: true, checked: panel.is_open() };
                        const menu_item = Q.MenuItem(name, config, (element) => {
                            element.is_checked() ? panel.open() : panel.close();
                        });
                        panel.on_close(() => menu_item.set_checked(false));
                        return menu_item;
                    })
            ),
        ]),
    ]);
}
