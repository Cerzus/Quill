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
}
