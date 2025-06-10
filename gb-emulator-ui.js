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
        inputs.ppu_obj_size.set_value(+ppu.get_obj_size());
        inputs.ppu_bg_map.set_value(+ppu.get_bg_map());
        inputs.ppu_bg_win_data.set_value(+ppu.get_bg_win_data());
        inputs.ppu_show_win.set_checked(ppu.get_show_win());
        inputs.ppu_win_map.set_value(+ppu.get_win_map());
        inputs.ppu_enabled.set_checked(ppu.get_enabled());
        inputs.ppu_mode.set_value(+ppu.get_mode());
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

        const apu = game_boy.get_apu();
        inputs.apu_enabled.set_checked(apu.get_enabled());
        inputs.apu_volume_left.set_value(apu.get_volume_left());
        inputs.apu_volume_right.set_value(apu.get_volume_right());
        inputs.apu_frame_sequencer_step.set_value(apu.get_frame_sequencer_step());
        inputs.apu_ch1_enabled.set_checked(apu.get_ch1_enabled());
        inputs.apu_ch1_dac_enabled.set_checked(apu.get_ch1_dac_enabled());
        inputs.apu_ch1_panning_left.set_checked(apu.get_ch1_panning_left());
        inputs.apu_ch1_panning_right.set_checked(apu.get_ch1_panning_right());
        inputs.apu_ch1_length_enable.set_checked(apu.get_ch1_length_enable());
        inputs.apu_ch1_length_counter.set_value(apu.get_ch1_length_counter());
        inputs.apu_ch2_enabled.set_checked(apu.get_ch2_enabled());
        inputs.apu_ch2_dac_enabled.set_checked(apu.get_ch2_dac_enabled());
        inputs.apu_ch2_panning_left.set_checked(apu.get_ch2_panning_left());
        inputs.apu_ch2_panning_right.set_checked(apu.get_ch2_panning_right());
        inputs.apu_ch2_length_enable.set_checked(apu.get_ch2_length_enable());
        inputs.apu_ch2_length_counter.set_value(apu.get_ch2_length_counter());
        inputs.apu_ch3_enabled.set_checked(apu.get_ch3_enabled());
        inputs.apu_ch3_dac_enabled.set_checked(apu.get_ch3_dac_enabled());
        inputs.apu_ch3_panning_left.set_checked(apu.get_ch3_panning_left());
        inputs.apu_ch3_panning_right.set_checked(apu.get_ch3_panning_right());
        inputs.apu_ch3_length_enable.set_checked(apu.get_ch3_length_enable());
        inputs.apu_ch3_length_counter.set_value(apu.get_ch3_length_counter());
        inputs.apu_ch4_enabled.set_checked(apu.get_ch4_enabled());
        inputs.apu_ch4_dac_enabled.set_checked(apu.get_ch4_dac_enabled());
        inputs.apu_ch4_panning_left.set_checked(apu.get_ch4_panning_left());
        inputs.apu_ch4_panning_right.set_checked(apu.get_ch4_panning_right());
        inputs.apu_ch4_length_enable.set_checked(apu.get_ch4_length_enable());
        inputs.apu_ch4_length_counter.set_value(apu.get_ch4_length_counter());
        inputs.apu_ch1_envelope_starting_volume.set_value(apu.get_ch1_envelope_starting_volume());
        inputs.apu_ch1_envelope_increase.set_checked(apu.get_ch1_envelope_increase());
        inputs.apu_ch1_envelope_period.set_value(apu.get_ch1_envelope_period());
        inputs.apu_ch1_envelope_timer.set_value(apu.get_ch1_envelope_timer());
        inputs.apu_ch1_envelope_volume.set_value(apu.get_ch1_envelope_volume());
        inputs.apu_ch2_envelope_starting_volume.set_value(apu.get_ch2_envelope_starting_volume());
        inputs.apu_ch2_envelope_increase.set_checked(apu.get_ch2_envelope_increase());
        inputs.apu_ch2_envelope_period.set_value(apu.get_ch2_envelope_period());
        inputs.apu_ch2_envelope_timer.set_value(apu.get_ch2_envelope_timer());
        inputs.apu_ch2_envelope_volume.set_value(apu.get_ch2_envelope_volume());
        inputs.apu_ch4_envelope_starting_volume.set_value(apu.get_ch4_envelope_starting_volume());
        inputs.apu_ch4_envelope_increase.set_checked(apu.get_ch4_envelope_increase());
        inputs.apu_ch4_envelope_period.set_value(apu.get_ch4_envelope_period());
        inputs.apu_ch4_envelope_timer.set_value(apu.get_ch4_envelope_timer());
        inputs.apu_ch4_envelope_volume.set_value(apu.get_ch4_envelope_volume());
        inputs.apu_ch1_sweep_enabled.set_checked(apu.get_ch1_sweep_enabled());
        inputs.apu_ch1_sweep_shift.set_value(apu.get_ch1_sweep_shift());
        inputs.apu_ch1_sweep_negate.set_checked(apu.get_ch1_sweep_negate());
        inputs.apu_ch1_sweep_period.set_value(apu.get_ch1_sweep_period());
        inputs.apu_ch1_sweep_timer.set_value(apu.get_ch1_sweep_timer());
        inputs.apu_ch1_sweep_frequency_period.set_value(apu.get_ch1_sweep_frequency_period());
        inputs.apu_ch1_frequency_period.set_value(apu.get_ch1_frequency_period());
        inputs.apu_ch1_frequency_timer.set_value(apu.get_ch1_frequency_timer());
        inputs.apu_ch1_duty.set_value(apu.get_ch1_duty());
        inputs.apu_ch1_waveform_index.set_value(apu.get_ch1_waveform_index());
        inputs.apu_ch2_frequency_period.set_value(apu.get_ch2_frequency_period());
        inputs.apu_ch2_frequency_timer.set_value(apu.get_ch2_frequency_timer());
        inputs.apu_ch2_duty.set_value(apu.get_ch2_duty());
        inputs.apu_ch2_waveform_index.set_value(apu.get_ch2_waveform_index());
        inputs.apu_ch3_frequency_period.set_value(apu.get_ch3_frequency_period());
        inputs.apu_ch3_frequency_timer.set_value(apu.get_ch3_frequency_timer());
        inputs.apu_ch3_sample_buffer.set_value(apu.get_ch3_sample_buffer());
        inputs.apu_ch3_position_counter.set_value(apu.get_ch3_position_counter());
        inputs.apu_ch3_volume_setting.set_value(apu.get_ch3_volume_setting());
        inputs.apu_ch4_clock_shift.set_value(apu.get_ch4_clock_shift());
        inputs.apu_ch4_clock_divider.set_value(apu.get_ch4_clock_divider());
        inputs.apu_ch4_frequency_timer.set_value(apu.get_ch4_frequency_timer());
        inputs.apu_ch4_lfsr_width.set_value(+apu.get_ch4_lfsr_width());
        inputs.apu_ch4_lfsr.set_value(apu.get_ch4_lfsr());

        inputs.memory.update();
    }

    function set_property(property, value) {
        const match = property.match(/^[a-z]{1,}_/);
        const component = {
            cpu_: game_boy.get_cpu(),
            ppu_: game_boy.get_ppu(),
            apu_: game_boy.get_apu(),
            null: game_boy,
        }[match[0]];
        component[`set_${property.substr(match[0]?.length)}`](value);
        update_ui();
    }
    function input_bin(id, label, config) {
        return (inputs[id] = Q.InputBin(label, config, (value) => set_property(id, value)));
    }
    function input_integer(id, label, config) {
        return (inputs[id] = Q.InputInteger(label, config, (value) => set_property(id, value)));
    }
    function input_u8(id, label) {
        return (inputs[id] = Q.InputU8(label, (value) => set_property(id, value)));
    }
    function input_byte(id, label) {
        return (inputs[id] = Q.InputByte(label, (value) => set_property(id, value)));
    }
    function input_word(id, label) {
        return (inputs[id] = Q.InputWord(label, (value) => set_property(id, value)));
    }
    function checkbox(id, label) {
        return (inputs[id] = Q.Checkbox(label, (checked) => set_property(id, checked)));
    }
    function dropdown(id, label, options) {
        return (inputs[id] = Q.Dropdown(label, (value) => set_property(id, +value), Q.DropdownOptions(options)));
    }

    const cpu_panel = Q.Panel("CPU", { closed: true }, [
        Q.Row([
            Q.Fieldset("Registers", [
                ...["a", "f", "b", "c", "d", "e", "h", "l"].map((register) =>
                    input_byte(`cpu_${register}`, register.toUpperCase())
                ),
                input_word("cpu_sp", "SP"),
                input_word("cpu_pc", "PC"),
                input_byte("cpu_ir", "IR"),
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
                dropdown("ppu_obj_size", "Sprite size", { 0: "8&times;8", 1: "8&times;16" }),
            ]),
            Q.Fieldset("Positioning", [
                input_u8("ppu_scx", "Scroll X"),
                input_u8("ppu_scy", "Scroll Y"),
                input_u8("ppu_wx", "Window X"),
                input_u8("ppu_wy", "Window Y"),
            ]),
            Q.Fieldset("Tiles", [
                dropdown("ppu_bg_map", "BG map", { 0: "$9c00", 1: "$9800" }),
                dropdown("ppu_win_map", "Window map", { 0: "$9c00", 1: "$9800" }),
                dropdown("ppu_bg_win_data", "BG/Window data", { 0: "$8000", 1: "$8800" }),
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

    const apu_panel = Q.Panel("APU", { closed: true }, [
        Q.Row([
            Q.Fieldset("Global controls", [
                checkbox("apu_enabled", "Enabled"),
                input_integer("apu_volume_left", "Volume left", { min: 0, max: 7 }),
                input_integer("apu_volume_right", "Volume right", { min: 0, max: 7 }),
                input_integer("apu_frame_sequencer_step", "Sequencer step", { min: 0, max: 7 }),
            ]),
            Q.Fieldset("Channel 1 - Pulse", [
                checkbox("apu_ch1_enabled", "Enabled"),
                checkbox("apu_ch1_dac_enabled", "DAC"),
                checkbox("apu_ch1_panning_left", "Panning left"),
                checkbox("apu_ch1_panning_right", "Panning right"),
                checkbox("apu_ch1_length_enable", "Length enable"),
                input_integer("apu_ch1_length_counter", "Length counter", { min: 0, max: 63 }),
                Q.Fieldset("Waveform", [
                    input_integer("apu_ch1_frequency_period", "Freq. period", { min: 0, max: 2047 }),
                    input_integer("apu_ch1_frequency_timer", "Freq. timer", { min: 0, max: 2047 }),
                    input_integer("apu_ch1_duty", "Duty", { min: 0, max: 3 }),
                    input_integer("apu_ch1_waveform_index", "Index", { min: 0, max: 7 }),
                ]),
                Q.Fieldset("Envelope", [
                    input_integer("apu_ch1_envelope_timer", "Timer", { min: 0, max: 7 }),
                    input_integer("apu_ch1_envelope_period", "Period", { min: 0, max: 7 }),
                    checkbox("apu_ch1_envelope_increase", "Increase"),
                    input_integer("apu_ch1_envelope_starting_volume", "Starting volume", { min: 0, max: 15 }),
                    input_integer("apu_ch1_envelope_volume", "Volume", { min: 0, max: 15 }),
                ]),
                Q.Fieldset("Frequency sweep", [
                    checkbox("apu_ch1_sweep_enabled", "Enabled"),
                    input_integer("apu_ch1_sweep_period", "Period", { min: 0, max: 7 }),
                    input_integer("apu_ch1_sweep_timer", "Timer", { min: 0, max: 7 }),
                    input_integer("apu_ch1_sweep_shift", "Shift", { min: 0, max: 7 }),
                    checkbox("apu_ch1_sweep_negate", "Negate"),
                    input_integer("apu_ch1_sweep_frequency_period", "Freq. period", { min: 0, max: 2047 }),
                ]),
            ]),
            Q.Fieldset("Channel 2 - Pulse", [
                checkbox("apu_ch2_enabled", "Enabled"),
                checkbox("apu_ch2_dac_enabled", "DAC"),
                checkbox("apu_ch2_panning_left", "Panning left"),
                checkbox("apu_ch2_panning_right", "Panning right"),
                checkbox("apu_ch2_length_enable", "Length enable"),
                input_integer("apu_ch2_length_counter", "Length counter", { min: 0, max: 63 }),
                Q.Fieldset("Waveform", [
                    input_integer("apu_ch2_frequency_period", "Freq. period", { min: 0, max: 2047 }),
                    input_integer("apu_ch2_frequency_timer", "Freq. timer", { min: 0, max: 2047 }),
                    input_integer("apu_ch2_duty", "Duty", { min: 0, max: 3 }),
                    input_integer("apu_ch2_waveform_index", "Index", { min: 0, max: 7 }),
                ]),
                Q.Fieldset("Envelope", [
                    input_integer("apu_ch2_envelope_timer", "Timer", { min: 0, max: 7 }),
                    input_integer("apu_ch2_envelope_period", "Period", { min: 0, max: 7 }),
                    checkbox("apu_ch2_envelope_increase", "Increase"),
                    input_integer("apu_ch2_envelope_starting_volume", "Starting volume", { min: 0, max: 15 }),
                    input_integer("apu_ch2_envelope_volume", "Volume", { min: 0, max: 15 }),
                ]),
            ]),
            Q.Fieldset("Channel 3 - Wave", [
                checkbox("apu_ch3_enabled", "Enabled"),
                checkbox("apu_ch3_dac_enabled", "DAC"),
                checkbox("apu_ch3_panning_left", "Panning left"),
                checkbox("apu_ch3_panning_right", "Panning right"),
                checkbox("apu_ch3_length_enable", "Length enable"),
                input_integer("apu_ch3_length_counter", "Length counter", { min: 0, max: 255 }),
                Q.Fieldset("Waveform", [
                    input_integer("apu_ch3_frequency_period", "Freq. period", { min: 0, max: 2047 }),
                    input_integer("apu_ch3_frequency_timer", "Freq. timer", { min: 0, max: 2047 }),
                    input_integer("apu_ch3_sample_buffer", "Sample buffer", { min: 0, max: 15 }),
                    input_integer("apu_ch3_position_counter", "Position counter", { min: 0, max: 31 }),
                ]),
                dropdown("apu_ch3_volume_setting", "Volume setting", {
                    0: "0% (0)",
                    1: "100% (1)",
                    2: "50% (2)",
                    3: "25% (3)",
                }),
            ]),
            Q.Fieldset("Channel 4 - Noise", [
                checkbox("apu_ch4_enabled", "Enabled"),
                checkbox("apu_ch4_dac_enabled", "DAC"),
                checkbox("apu_ch4_panning_left", "Panning left"),
                checkbox("apu_ch4_panning_right", "Panning right"),
                checkbox("apu_ch4_length_enable", "Length enable"),
                input_integer("apu_ch4_length_counter", "Length counter", { min: 0, max: 63 }),
                Q.Fieldset("Waveform", [
                    input_integer("apu_ch4_clock_divider", "Clock divider", { min: 0, max: 7 }),
                    input_integer("apu_ch4_clock_shift", "Clock shift", { min: 0, max: 15 }),
                    input_integer("apu_ch4_frequency_timer", "Freq. timer", { min: 0, max: 7 << 17 }),
                    dropdown("apu_ch4_lfsr_width", "LFSR width", {
                        0: "15-bit",
                        1: "7-bit",
                    }),
                    input_bin("apu_ch4_lfsr", "LFSR", { length: 15 }),
                ]),
                Q.Fieldset("Envelope", [
                    input_integer("apu_ch4_envelope_timer", "Timer", { min: 0, max: 7 }),
                    input_integer("apu_ch4_envelope_period", "Period", { min: 0, max: 7 }),
                    checkbox("apu_ch4_envelope_increase", "Increase"),
                    input_integer("apu_ch4_envelope_starting_volume", "Starting volume", { min: 0, max: 15 }),
                    input_integer("apu_ch4_envelope_volume", "Volume", { min: 0, max: 15 }),
                ]),
            ]),
        ]),
    ]);

    const memory_panel = Q.Panel("Memory", { closed: true, css: { maxWidth: "fit-content" } }, [
        (inputs.memory = Q.HexEditor(0, game_boy.get_memory().length, (i) => game_boy.read_memory(i))),
    ]);

    const disassembly_panel = Q.Panel("Disassembly", { closed: true }, [
        Q.Row([Q.Button("Copy"), Q.Button("Go to PC"), Q.Checkbox("Follow PC")]),
        Q.DynamicRows(
            100000,
            (i) => [Q.Text("Row " + (i + 1))],
            (i, row) => row.get_children()[0].set_text("dffg")
        ),
        Q.Text("Below DynamicRows"),
    ]);
    requestAnimationFrame(() => requestAnimationFrame(() => disassembly_panel.get_children()[1].update()));

    Q.Panel("Game Boy", { can_close: false }, [
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
                ...[cpu_panel, ppu_panel, apu_panel, memory_panel, disassembly_panel].map((panel) => {
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
