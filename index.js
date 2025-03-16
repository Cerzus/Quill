"use strict";

document.addEventListener("DOMContentLoaded", () => {
    Quill.init(document.body);

    new Quill.Panel(
        "Panel",
        new Quill.MenuBar(
            new Quill.Menu("File", [
                new Quill.MenuItem("Load...", () => console.log("Load")),
                new Quill.Menu("Recent", [
                    new Quill.MenuItem("1. some_file.txt"),
                    new Quill.MenuItem("2. Another file.txt"),
                    new Quill.MenuItem("3. .yup"),
                ]),
                new Quill.Separator(),
                new Quill.MenuItem("Quit", { toggleable: true, toggled: true }, (element) => {
                    console.log("Quit", element.is_toggled());
                }),
            ])
        )
    );
    new Quill.Panel("Panel 2", [], { closed: true, not_closeable: true });
    new Quill.Panel("Panel 3", { closed: true }, []);

    let panels = null;

    new Quill.Panel("Menu test", { not_closeable: true }, [
        new Quill.MenuBar([
            new Quill.Menu("File", [
                new Quill.MenuItem("Load...", () => console.log("Load")),
                new Quill.Menu("Recent", [
                    new Quill.MenuItem("1. some_file.txt"),
                    new Quill.MenuItem("2. Another file.txt"),
                    new Quill.MenuItem("3. .yup"),
                ]),
                new Quill.Separator(),
                new Quill.MenuItem("Quit", { toggleable: true, toggled: false }, (element) => {
                    console.log("Quit", element.is_toggled());
                }),
            ]),
            new Quill.Menu("Tools", {}, () => {}, [
                new Quill.Menu("File", [
                    new Quill.MenuItem("Load..."),
                    new Quill.Menu("Recent", [
                        new Quill.MenuItem("1. some_file.txt"),
                        new Quill.MenuItem("2. Another file.txt"),
                        new Quill.MenuItem("3. .yup"),
                    ]),
                    new Quill.Separator(),
                    new Quill.MenuItem("Quit"),
                ]),
                new Quill.MenuItem("Load..."),
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
                new Quill.MenuItem("Quit"),
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
