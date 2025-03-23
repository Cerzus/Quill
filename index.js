"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const Q = Quill;
    Q.init(document.body);

    Q.Panel("Game Boy", { not_closeable: true }, [
        Q.MenuBar([
            Q.Menu("File", [
                Q.MenuItem("Open ROM file...", { ctrl_key: "O" }, () => {
                    Q.open_file_dialog({ accept: [".gb", ".gbc"] }, (file) => console.log("Open ROM file", file));
                }),
                Q.Menu("Open recent ROM", [Q.MenuItem("zelda.gb"), Q.MenuItem("pokemon.gb"), Q.MenuItem("mario.gb")]),
                Q.Separator(),
                Q.MenuItem("Boot ROMs...", () => {
                    Q.Panel("Boot ROMS configuration").on_close((panel) => panel.remove());
                }),
            ]),
            Q.Menu("Emulation", [Q.MenuItem("Reset console", { ctrl_key: "R" }, () => console.log("Reset console"))]),
            Q.Menu("Tools", [
                Q.MenuItem("CPU viewer", { toggleable: true }),
                Q.MenuItem("PPU viewer", { toggleable: true }),
                Q.MenuItem("APU viewer", { toggleable: true }),
            ]),
        ]),
        Q.FixedCanvas({ width: 160, height: 144, min_scale: 1 }),
    ]);

    let panels = null;
    let recent = null;

    Q.Panel("Table Panel", [
        Q.Tree("Basic", [
            Q.InfoTooltip("This table is created with nested Quill.create_array calls."),
            Q.Table(Q.create_array(4, (r) => Q.TableRow(Q.create_array(3, (c) => Q.TableColumn(`R:${r}, C:${c}`))))),
            Q.InfoTooltip("This table is created with Quill.create_array for the rows."),
            Q.Table(
                Q.create_array(4, (r) =>
                    Q.TableRow([Q.TableColumn(`R:${r}`), Q.TableColumn(`Some contents`), Q.TableColumn(123.456)])
                )
            ),
            Q.InfoTooltip(
                "This table is created entirely out of manually calling Quill.TableRow and Quill.TableColumn"
            ),
            Q.Table([
                Q.TableRow([Q.TableColumn(0), Q.TableColumn(1), Q.TableColumn(2)]),
                Q.TableRow([Q.TableColumn(3), Q.TableColumn(4), Q.TableColumn(5)]),
                Q.TableRow([Q.TableColumn(6), Q.TableColumn(7), Q.TableColumn(8)]),
                Q.TableRow([Q.TableColumn(9), Q.TableColumn(10)]),
            ]),
        ]),
    ]);

    Q.Panel("Panel 3", { closed: true }, [
        Q.MenuBar([Q.MenuItem("HMM", { ctrl_key: "H" }, (element, e) => console.log("Ctrl+H", element, e))]),
    ]);

    Q.Panel("Test panel", { not_closeable: true, closed: true }, [
        Q.FixedCanvas({ min_scale: 1, max_scale: 1.5 }),
        Q.MenuBar([
            Q.Menu("File", [Q.MenuItem("Load..."), (recent = Q.Menu("Recent")), Q.Separator(), Q.MenuItem("Quit")]),
            Q.Menu("Tools", {}, () => {}, [
                Q.Menu("File", [
                    Q.MenuItem("Load..."),
                    Q.Separator(),
                    Q.Menu("Recent", [
                        Q.MenuItem("1. some_file.txt"),
                        Q.MenuItem("2. Another file.txt"),
                        Q.MenuItem("3. .yup"),
                    ]),
                ]),
                Q.MenuItem("Load...", { ctrl_key: "L" }, () =>
                    Q.open_file_dialog(
                        (files) => {
                            console.log("Load", files);
                            recent.get_children().forEach((child) => child.remove());
                            recent.add_children([...files].map((file) => Q.MenuItem(file.name)));
                        },
                        { multiple: true }
                    )
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
                Q.MenuItem("Quit", { toggleable: true, toggled: true, ctrl_key: "q" }, (element, e) => {
                    console.log("Quit", element.is_toggled(), e);
                }),
            ]),
            Q.MenuItem("Cool"),
            Q.MenuItem("Beans", { toggleable: true }),
            (panels = Q.Menu(
                "Panels",
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

    panels.add_children(
        Object.values(Q.get_panels())
            .filter((panel) => panel.is_closeable())
            .map((panel) => {
                const name = panel.get_name();
                const config = { toggleable: true, toggled: panel.is_open() };
                const menu_item = Q.MenuItem(name, config, (element) => {
                    element.is_toggled() ? panel.open() : panel.close();
                });
                panel.on_close(() => menu_item.set_toggle(false));
                return menu_item;
            })
    );
});
