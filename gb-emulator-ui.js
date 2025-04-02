"use strict";

function create_game_boy_ui() {
    const Q = Quill;

    const game_boy = new GameBoy();
    const inputs = {};

    function update(timestamp) {
        game_boy.randomize();
        update_ui();
        requestAnimationFrame(update);
    }

    function update_ui() {
        inputs.a.set_value(game_boy.get_a());
        inputs.f.set_value(game_boy.get_f());
        inputs.b.set_value(game_boy.get_b());
        inputs.c.set_value(game_boy.get_c());
        inputs.d.set_value(game_boy.get_d());
        inputs.e.set_value(game_boy.get_e());
        inputs.h.set_value(game_boy.get_h());
        inputs.l.set_value(game_boy.get_l());
        inputs.sp.set_value(game_boy.get_sp());
        inputs.pc.set_value(game_boy.get_pc());
        inputs.ir.set_value(game_boy.get_ir());
        inputs.z_flag.set_checked(game_boy.get_z_flag());
        inputs.n_flag.set_checked(game_boy.get_n_flag());
        inputs.h_flag.set_checked(game_boy.get_h_flag());
        inputs.c_flag.set_checked(game_boy.get_c_flag());
        inputs.ime.set_checked(game_boy.get_ime());
        inputs.halt.set_checked(game_boy.get_halt());
        inputs.ie_vblank.set_checked(game_boy.get_ie_vblank());
        inputs.ie_stat.set_checked(game_boy.get_ie_stat());
        inputs.ie_timer.set_checked(game_boy.get_ie_timer());
        inputs.ie_serial.set_checked(game_boy.get_ie_serial());
        inputs.ie_joypad.set_checked(game_boy.get_ie_joypad());
        inputs.if_vblank.set_checked(game_boy.get_if_vblank());
        inputs.if_stat.set_checked(game_boy.get_if_stat());
        inputs.if_timer.set_checked(game_boy.get_if_timer());
        inputs.if_serial.set_checked(game_boy.get_if_serial());
        inputs.if_joypad.set_checked(game_boy.get_if_joypad());
        inputs.memory.update();
    }

    function set_property(property, value) {
        game_boy[`set_${property}`](value);
        update_ui();
    }

    function input_u8(id, label) {
        return (inputs[id] = Q.InputU8(label, (value) => set_property(id, value)));
    }

    function input_u16(id, label) {
        return (inputs[id] = Q.InputU16(label, (value) => set_property(id, value)));
    }

    function checkbox(id, label) {
        return (inputs[id] = Q.Checkbox(label, (checked) => set_property(id, checked)));
    }

    const cpu_panel = Q.Panel("CPU", { closed: true }, [
        Q.Row([
            Q.Fieldset("Registers", [
                ...["a", "f", "b", "c", "d", "e", "h", "l"].map((register) =>
                    input_u8(register, register.toUpperCase())
                ),
                input_u16("sp", "SP"),
                input_u16("pc", "PC"),
                input_u8("ir", "IR"),
            ]),
            Q.Fieldset("Flags", [
                ...Object.entries({ z_flag: "Zero", n_flag: "Subtract", h_flag: "Half-carry", c_flag: "Carry" }).map(
                    (flag) => checkbox(...flag)
                ),
            ]),
            Q.Fieldset("Interrupts", [
                ...["halt", "ime"].map((flag) => checkbox(flag, flag.toUpperCase())),
                Q.Separator(),
                Q.Table([
                    Q.TableRow([Q.TableColumn(), Q.TableColumn("IE"), Q.TableColumn("IF")]),
                    ...Object.entries({
                        vblank: "V-blank",
                        stat: "Stat",
                        timer: "Timer",
                        serial: "Serial",
                        joypad: "Joypad",
                    }).map((source) =>
                        Q.TableRow([
                            Q.TableColumn(source[1]),
                            Q.TableColumn(checkbox(`ie_${source[0]}`, null)),
                            Q.TableColumn(checkbox(`if_${source[0]}`, null)),
                        ])
                    ),
                ]),
            ]),
        ]),
    ]);
    const memory_panel = Q.Panel("Memory", { closed: true }, [
        (inputs.memory = Q.HexEditor(0, 16, game_boy.get_memory().length, (i) => game_boy.read_memory(i))),
    ]);

    Q.Panel("Game Boy", { not_closeable: true }, [
        Q.MenuBar([
            Q.Menu("File", [
                Q.MenuItem("Open ROM file...", { ctrl_key: "O" }, () => {
                    Q.open_file_dialog({ accept: [".gb", ".gbc"] }, (file) => console.log("Open ROM file", file));
                }),
                Q.Menu("Open recent ROM", [
                    ...["zelda.gb", "pokemon.gb", "mario.gb"].map((rom) =>
                        Q.MenuItem(rom, () => console.log("Open recent ROM:", `"${rom}"`))
                    ),
                ]),
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
                ...[cpu_panel, memory_panel].map((panel) => {
                    const config = { checkable: true, checked: panel.is_open() };
                    const menu_item = Q.MenuItem(panel.get_name(), config, (element) =>
                        element.is_checked() ? panel.open() : panel.close()
                    );
                    panel.on_close(() => menu_item.set_checked(false));
                    return menu_item;
                }),
            ]),
        ]),
        Q.FixedCanvas({ width: 160, height: 144, min_scale: 1 }),
    ]);

    update();
}
