/* 
    This demo deliberately does not use strict mode, to keep variables local for clarity of the examples.
    It is recommended to use strict mode in your application and define your variables before using them in the UI.
*/

function get_style_editor() {
    const Q = Quill;

    return [
        Q.Separator(),
        Q.Tabs([
            Q.Tab("Sizes", [
                Q.Fieldset("Main", [
                    ...Q.get_size_names().map((property) =>
                        Q.SliderInteger(
                            (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                            { min: 0, max: 20 },
                            (value) => Q.set_size(property, value)
                        ).set_value(Q.get_size(property))
                    ),
                ]),
            ]),
            Q.Tab("Colors", [
                ...Q.get_color_names().map((property) =>
                    Q.ColorPicker(
                        (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                        (value) => Q.set_color(property, value)
                    ).set_value(Q.get_color(property).to_hex())
                ),
            ]),
        ]),
    ];
}

function quill_show_demo() {
    const Q = Quill;

    let recent = null;

    const hex_editor_data = new Uint8Array(513);
    for (let i = 0; i < hex_editor_data.length; i++) {
        const value = Math.random();
        hex_editor_data[i] = value < 0.5 ? value * 512 : 0;
    }

    Q.Panel("Panel 2");

    Q.Panel("Panel 3", { closed: true }, [
        Q.CollapsingHeader("Take a look, why don't you?", [
            Q.Tree("It's in here", [Q.HexEditor(16, 8, hex_editor_data.length, (i) => hex_editor_data[i])]),
        ]),
        Q.MenuBar([Q.MenuItem("HMM", { ctrl_key: "H" }, (element, e) => console.log("Ctrl+H", element, e))]),
    ]);

    Q.Panel("Style editor", { closeable: true, closed: true }, get_style_editor());

    Q.Panel("Quill Demo", { not_closeable: true, closed: true }, [
        Q.CollapsingHeader("Configuration", [
            Q.Tree("Style", [
                Q.InfoTooltip("The same contents can be accessed in the menu under [Tools] -> [Style editor]"),
                ...get_style_editor(),
                Q.Separator(),
            ]),
        ]),
        Q.CollapsingHeader("Widgets", [
            Q.Tree("Basic", [
                Q.Row([
                    Q.Button("Button", () => (text.is_visible() ? text.hide() : text.show())),
                    (text = Q.Text("Thanks for clicking me!")).hide(),
                ]),
                Q.Checkbox("Checkbox").set_checked(true),
                Q.Separator(),
                Q.Row([
                    Q.Dropdown("Dropdown", Q.DropdownOptions(["AAAA", "BBBB", "CCCC", "DDDD", "EEEE", "FFFF"])),
                    Q.InfoTooltip(
                        `Refer to the "Dropdowns" section below for an explanation of how to use the Dropdown API.`
                    ),
                ]),
                Q.InputInteger("Input integer", (value) => console.log(value)).set_value(123),
                Q.InputFloat("Input float", (value) => console.log(value)),
                Q.SliderInteger("Slider integer", (value) => console.log(value)).set_value(25),
                Q.SliderFloat("Slider float", (value) => console.log(value)),
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
                    Q.Text("Pink", { color: Q.Color(255, 0, 255) }),
                    Q.Text("Yellow", { color: Q.Color(255, 255, 0) }),
                    Q.Text("Disabled", { disabled: true }),
                ]),
                Q.Tree("Text wrapping", [
                    Q.Text(
                        "This text should automatically wrap on the edge of the window. The current implementation " +
                            "for text wrapping follows simple rules suitable for English and possibly other languages.",
                        { wrapped: true }
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
                    Q.Dropdown(null, (value) => console.log(value), [
                        Q.DropdownOptions(["AAAA", "BBBB", "CCCC", "DDDD", "EEEE", "FFFF", "GGGG", "HHHH"]),
                    ]),
                    Q.InfoTooltip("Dropdown without a label"),
                ]),
                Q.Dropdown("Dropdown with values", { value: "Option 3" }, (value) => console.log(value), [
                    Q.DropdownOptions([...Q.fill_array(5, (i) => `Option ${i + 1}`)]),
                ]),
                Q.Dropdown("Dropdown with keys and values", (value) => console.log(value), [
                    Q.DropdownOptions({ alice: "aaa", 123: "bbb", cool: "ccc" }),
                ]).set_value("cool"),
                Q.Dropdown("Dropdown with option groups", (value) => console.log(value), [
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
        Q.CollapsingHeader("Modals", [
            Q.Tree("Modals", [
                Q.Text("Modals are like Panels but the user cannot interact outside of them before closing them.", {
                    wrapped: true,
                }),
                Q.Button("Delete...", () => {
                    const modal = Q.Modal("Delete?", { not_closeable: true }, [
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
            (tools = Q.Menu(
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
            )),
        ]),
    ]);

    tools.add_children(
        Object.values(Q.get_panels())
            .filter((panel) => panel.is_closeable())
            .map((panel) => {
                const name = panel.get_name();
                const config = { checkable: true, checked: panel.is_open() };
                const menu_item = Q.MenuItem(name, config, (element) => {
                    element.is_checked() ? panel.open() : panel.close();
                });
                panel.on_close(() => menu_item.set_checked(false));
                return menu_item;
            })
    );
}
