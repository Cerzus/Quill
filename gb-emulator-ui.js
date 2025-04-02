"use strict";

function create_game_boy_ui() {
    const Q = Quill;

    const game_boy = new GameBoy();
    const inputs = {};

    function update(timestamp) {
        game_boy.randomize();
        update_ui();
        // requestAnimationFrame(update);
    }

    function update_ui() {
        const cpu = game_boy.get_cpu();
        inputs.cpu_a.set_value(cpu.get_a());
        inputs.cpu_f.set_value(cpu.get_f());
        inputs.cpu_b.set_value(cpu.get_b());
        inputs.cpu_c.set_value(cpu.get_c());
        inputs.cpu_d.set_value(cpu.get_d());
        inputs.cpu_e.set_value(cpu.get_e());
        inputs.cpu_h.set_value(cpu.get_h());
        inputs.cpu_l.set_value(cpu.get_l());
        inputs.cpu_sp.set_value(cpu.get_sp());
        inputs.cpu_pc.set_value(cpu.get_pc());
        inputs.cpu_ir.set_value(cpu.get_ir());
        inputs.cpu_z_flag.set_checked(cpu.get_z_flag());
        inputs.cpu_n_flag.set_checked(cpu.get_n_flag());
        inputs.cpu_h_flag.set_checked(cpu.get_h_flag());
        inputs.cpu_c_flag.set_checked(cpu.get_c_flag());
        inputs.cpu_ime.set_checked(cpu.get_ime());
        inputs.cpu_halt.set_checked(cpu.get_halt());
        inputs.cpu_ie_vblank.set_checked(cpu.get_ie_vblank());
        inputs.cpu_ie_stat.set_checked(cpu.get_ie_stat());
        inputs.cpu_ie_timer.set_checked(cpu.get_ie_timer());
        inputs.cpu_ie_serial.set_checked(cpu.get_ie_serial());
        inputs.cpu_ie_joypad.set_checked(cpu.get_ie_joypad());
        inputs.cpu_if_vblank.set_checked(cpu.get_if_vblank());
        inputs.cpu_if_stat.set_checked(cpu.get_if_stat());
        inputs.cpu_if_timer.set_checked(cpu.get_if_timer());
        inputs.cpu_if_serial.set_checked(cpu.get_if_serial());
        inputs.cpu_if_joypad.set_checked(cpu.get_if_joypad());

        const ppu = game_boy.get_ppu();
        inputs.ppu_show_bg_win.set_checked(ppu.get_show_bg_win());
        inputs.ppu_show_obj.set_checked(ppu.get_show_obj());
        inputs.ppu_obj_size.set_value(ppu.get_obj_size());
        inputs.ppu_bg_map.set_value(ppu.get_bg_map());
        inputs.ppu_bg_win_data.set_value(ppu.get_bg_win_data());
        inputs.ppu_show_win.set_checked(ppu.get_show_win());
        inputs.ppu_win_map.set_value(ppu.get_win_map());
        inputs.ppu_enabled.set_checked(ppu.get_enabled());
        inputs.ppu_mode.set_value(ppu.get_mode());
        inputs.ppu_lyc_eq_ly.set_checked(ppu.get_lyc_eq_ly());
        inputs.ppu_mode_0_int.set_checked(ppu.get_mode_0_int());
        inputs.ppu_mode_1_int.set_checked(ppu.get_mode_1_int());
        inputs.ppu_mode_2_int.set_checked(ppu.get_mode_2_int());
        inputs.ppu_lyc_int.set_checked(ppu.get_lyc_int());
        inputs.ppu_scy.set_value(ppu.get_scy());
        inputs.ppu_scx.set_value(ppu.get_scx());
        inputs.ppu_lyc.set_value(ppu.get_lyc());
        inputs.ppu_wy.set_value(ppu.get_wy());
        inputs.ppu_wx.set_value(ppu.get_wx());
        inputs.ppu_scanline.set_value(ppu.get_scanline());
        inputs.ppu_dot.set_value(ppu.get_dot());
        inputs.ppu_frame.set_value(ppu.get_frame());
        inputs.ppu_stat_int_signal.set_checked(ppu.get_stat_int_signal());

        inputs.memory.update();
    }

    function set_property(property, value) {
        const match = property.match(/^[a-z]{1,}_/);
        const component = { cpu_: game_boy.get_cpu(), ppu_: game_boy.get_ppu(), null: game_boy }[match[0]];
        component[`set_${property.substr(match[0]?.length)}`](value);
        update_ui();
    }
    function input_integer(id, label, config) {
        return (inputs[id] = Q.InputInteger(label, config, (value) => set_property(id, value)));
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
    function dropdown(id, label, options) {
        return (inputs[id] = Q.Dropdown(label, (value) => set_property(id, value), Q.DropdownOptions(options)));
    }

    const cpu_panel = Q.Panel("CPU", { closed: true }, [
        Q.Row([
            Q.Fieldset("Registers", [
                ...["a", "f", "b", "c", "d", "e", "h", "l"].map((register) =>
                    input_u8(`cpu_${register}`, register.toUpperCase())
                ),
                input_u16("cpu_sp", "SP"),
                input_u16("cpu_pc", "PC"),
                input_u8("cpu_ir", "IR"),
            ]),
            Q.Fieldset("Flags", [
                ...Object.entries({ z_flag: "Zero", n_flag: "Subtract", h_flag: "Half-carry", c_flag: "Carry" }).map(
                    (flag) => checkbox(`cpu_${flag[0]}`, flag[1])
                ),
            ]),
            Q.Fieldset("Interrupts", [
                ...["halt", "ime"].map((flag) => checkbox(`cpu_${flag}`, flag.toUpperCase())),
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
                            Q.TableColumn(checkbox(`cpu_ie_${source[0]}`, null)),
                            Q.TableColumn(checkbox(`cpu_if_${source[0]}`, null)),
                        ])
                    ),
                ]),
            ]),
        ]),
    ]);

    const ppu_panel = Q.Panel("PPU", { closed: true }, [
        Q.Row([
            Q.Fieldset("Controls", [
                checkbox("ppu_enabled", "Enabled"),
                checkbox("ppu_show_bg_win", "Show BG/Window"),
                checkbox("ppu_show_win", "Show window"),
                checkbox("ppu_show_obj", "Show sprites"),
                dropdown("ppu_obj_size", "Sprite size", { false: "8&times;8", true: "8&times;16" }),
            ]),
            Q.Fieldset("Positioning", [
                input_u8("ppu_scx", "Scroll X"),
                input_u8("ppu_scy", "Scroll Y"),
                input_u8("ppu_wx", "Window X"),
                input_u8("ppu_wy", "Window Y"),
            ]),
            Q.Fieldset("Tiles", [
                dropdown("ppu_bg_map", "BG map", { false: "$9c00", true: "$9800" }),
                dropdown("ppu_win_map", "Window map", { false: "$9c00", true: "$9800" }),
                dropdown("ppu_bg_win_data", "BG/Window data", { false: "$8000", true: "$8800" }),
            ]),
            Q.Fieldset("Status", [
                dropdown("ppu_mode", "Mode", {
                    0: "H-blank (0)",
                    1: "V-blank (1)",
                    2: "OAM-scan (2)",
                    3: "Drawing (3)",
                }),
                checkbox("ppu_lyc_eq_ly", "LYC = LY"),
                checkbox("ppu_mode_0_int", "Mode 0 int."),
                checkbox("ppu_mode_1_int", "Mode 1 int."),
                checkbox("ppu_mode_2_int", "Mode 2 int."),
                checkbox("ppu_lyc_int", "LYC intr."),
            ]),
            Q.Table([
                Q.TableRow(Q.TableColumn(input_integer("ppu_dot", "Dot", { min: 0, max: 455 }))),
                Q.TableRow(Q.TableColumn(input_integer("ppu_scanline", "Line", { min: 0, max: 154 }))),
                Q.TableRow(Q.TableColumn(input_u8("ppu_lyc", "LYC"))),
                Q.TableRow(Q.TableColumn(input_integer("ppu_frame", "Frame no.", { min: 0, max: 99999999 }))),
                Q.TableRow(Q.TableColumn(checkbox("ppu_stat_int_signal", "STAT int. signal"))),
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
                ...[cpu_panel, ppu_panel, memory_panel].map((panel) => {
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
