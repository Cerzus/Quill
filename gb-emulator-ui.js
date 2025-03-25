function create_game_boy_ui() {
    const Q = Quill;

    const cpu_panel = Q.Panel(
        "CPU",
        { closed: true },
        Q.Row([
            new QuillFieldset("Registers", [
                Q.Table(
                    ["A", "F", "B", "C", "D", "E", "H", "L", "SP", "PC", "IR"].map((register) =>
                        Q.TableRow(Q.TableColumn(register))
                    )
                ),
            ]),
            new QuillFieldset("Flags", [
                Q.Table(
                    ["Zero", "Subtract", "Carry", "Half-carry"].map((flag) =>
                        Q.TableRow(Q.TableColumn(Q.Checkbox(flag, (item) => console.log(flag, item.is_checked()))))
                    )
                ),
            ]),
            new QuillFieldset("Interrupts", [
                Q.Table(
                    ["HALT", "IME"].map((flag) =>
                        Q.TableRow(Q.TableColumn(Q.Checkbox(flag, (item) => console.log(flag, item.is_checked()))))
                    )
                ),
                Q.Separator(),
                Q.Table([
                    Q.TableRow([Q.TableColumn(), Q.TableColumn("IE"), Q.TableColumn("IF")]),
                    ...["V-blank", "Stat", "Timer", "Serial", "Joypad"].map((source) =>
                        Q.TableRow([
                            Q.TableColumn(source),
                            Q.TableColumn(Q.Checkbox(null, (item) => console.log("IE", source, item.is_checked()))),
                            Q.TableColumn(Q.Checkbox(null, (item) => console.log("IF", source, item.is_checked()))),
                        ])
                    ),
                ]),
            ]),
        ])
    );
    const ppu_panel = Q.Panel("PPU", { closed: true });
    const apu_panel = Q.Panel("APU", { closed: true });

    Q.Panel("Game Boy", { not_closeable: true }, [
        Q.MenuBar([
            Q.Menu("File", [
                Q.MenuItem("Open ROM file...", { ctrl_key: "O" }, () => {
                    Q.open_file_dialog({ accept: [".gb", ".gbc"] }, (file) => console.log("Open ROM file", file));
                }),
                Q.Menu(
                    "Open recent ROM",
                    ["zelda.gb", "pokemon.gb", "mario.gb"].map((rom) =>
                        Q.MenuItem(rom, () => console.log("Open recent ROM:", `"${rom}"`))
                    )
                ),
                Q.Separator(),
                Q.MenuItem("Boot ROMs...", () => {
                    Q.Modal("Boot ROMs", [
                        Q.Table(
                            ["DMG0", "DMG", "MGB", "SGB", "SGB2", "CGB0", "CGB"].map((type) =>
                                Q.TableRow([
                                    Q.TableColumn(type),
                                    Q.TableColumn(
                                        Q.Button("Open file...", () => {
                                            Q.open_file_dialog({ accept: [".bin"] }, (file) =>
                                                console.log(`Open BOOT rom file for ${type}`, file)
                                            );
                                        })
                                    ),
                                    Q.TableColumn("boot.bin"),
                                ])
                            )
                        ),
                    ]);
                }),
            ]),
            Q.Menu("Emulation", [Q.MenuItem("Reset console", { ctrl_key: "R" }, () => console.log("Reset console"))]),
            Q.Menu(
                "Tools",
                [cpu_panel, ppu_panel, apu_panel].map((panel) => {
                    const config = { checkable: true, checked: panel.is_open() };
                    const menu_item = Q.MenuItem(panel.get_name(), config, (element) => {
                        element.is_checked() ? panel.open() : panel.close();
                    });
                    panel.on_close(() => menu_item.set_checke(false));
                    return menu_item;
                })
            ),
        ]),
        Q.FixedCanvas({ width: 160, height: 144, min_scale: 1 }),
    ]);
}
