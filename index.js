"use strict";

document.addEventListener("DOMContentLoaded", () => {
    Quill.init(document.body);

    new Quill.Panel("Game Boy", { not_closeable: true }, [
        new Quill.MenuBar([
            new Quill.Menu("File", [
                new Quill.MenuItem("Open ROM file...", { ctrl_key: "O" }, () => {
                    Quill.open_file_dialog({ accept: [".gb", ".gbc"] }, (file) => console.log("Open ROM file", file));
                }),
                new Quill.Menu("Open recent ROM", [
                    new Quill.MenuItem("zelda.gb"),
                    new Quill.MenuItem("pokemon.gb"),
                    new Quill.MenuItem("mario.gb"),
                ]),
                new Quill.Separator(),
                new Quill.MenuItem("Boot ROMs...", () => {}),
            ]),
            new Quill.Menu("Tools", [
                new Quill.MenuItem("CPU viewer", { toggleable: true }),
                new Quill.MenuItem("PPU viewer", { toggleable: true }),
                new Quill.MenuItem("APU viewer", { toggleable: true }),
            ]),
        ]),
    ]);

    new Quill.Panel("Panel 2", []);
    new Quill.Panel("Panel 3", { closed: true }, []);

    let panels = null;
    let recent = null;

    new Quill.Panel("Menu test", { not_closeable: true, closed: true }, [
        new Quill.MenuBar([
            new Quill.Menu("File", [
                new Quill.MenuItem("Load..."),
                (recent = new Quill.Menu("Recent")),
                new Quill.Separator(),
                new Quill.MenuItem("Quit"),
            ]),
            new Quill.Menu("Tools", {}, () => {}, [
                new Quill.Menu("File", [
                    new Quill.MenuItem("Load..."),
                    new Quill.Separator(),
                    new Quill.Menu("Recent", [
                        new Quill.MenuItem("1. some_file.txt"),
                        new Quill.MenuItem("2. Another file.txt"),
                        new Quill.MenuItem("3. .yup"),
                    ]),
                ]),
                new Quill.MenuItem("Load...", { ctrl_key: "L" }, (element) =>
                    Quill.open_file_dialog(
                        (files) => {
                            console.log("Load", files);
                            recent.remove(recent.get_children());
                            recent.add([...files].map((file) => new Quill.MenuItem(file.name)));
                        },
                        { multiple: true }
                    )
                ),
                new Quill.Menu("Recent", [
                    new Quill.MenuItem("1. some_file.txt"),
                    new Quill.MenuItem("2. Another file.txt"),
                    new Quill.MenuItem("3. .yup"),
                    new Quill.Separator(),
                    new Quill.Menu("Recent", [
                        new Quill.MenuItem("1. some_file.txt"),
                        new Quill.MenuItem("2. Another file.txt"),
                        new Quill.MenuItem("3. .yup"),
                        new Quill.MenuItem("Load..."),
                        new Quill.Menu("Recent", [
                            new Quill.MenuItem("1. some_file.txt"),
                            new Quill.MenuItem("2. Another file.txt"),
                            new Quill.MenuItem("3. .yup"),
                        ]),
                        new Quill.Separator(),
                        new Quill.MenuItem("Quit"),
                    ]),
                    new Quill.Separator(),
                    new Quill.MenuItem("Quit"),
                ]),
                new Quill.Separator(),
                new Quill.MenuItem("Quit", { toggleable: true, toggled: true, ctrl_key: "q" }, (element, e) => {
                    console.log("Quit", element.is_toggled(), e);
                }),
            ]),
            (panels = new Quill.Menu(
                "Panels",
                new Quill.Menu("File", [
                    new Quill.MenuItem("Load..."),
                    new Quill.Menu("Recent", [
                        new Quill.MenuItem("1. some_file.txt"),
                        new Quill.MenuItem("2. Another file.txt"),
                        new Quill.MenuItem("3. .yup"),
                    ]),
                    new Quill.Separator(),
                    new Quill.MenuItem("Quit"),
                ])
            )),
        ]),
    ]);

    panels.add(
        Object.values(Quill.get_panels())
            .filter((panel) => panel.is_closeable())
            .map((panel) => {
                const name = panel.get_name();
                const config = { toggleable: true, toggled: panel.is_open() };
                const menu_item = new Quill.MenuItem(name, config, (element) => {
                    element.is_toggled() ? panel.open() : panel.close();
                });
                panel.on_close(() => menu_item.set_toggle(false));
                return menu_item;
            })
    );
});
