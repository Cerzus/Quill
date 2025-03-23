function create_game_boy_ui() {
    const Q = Quill;

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
            Q.Menu("Tools", [
                Q.MenuItem("CPU viewer", { toggleable: true }),
                Q.MenuItem("PPU viewer", { toggleable: true }),
                Q.MenuItem("APU viewer", { toggleable: true }),
            ]),
        ]),
        Q.FixedCanvas({ width: 160, height: 144, min_scale: 1 }),
    ]);
}
