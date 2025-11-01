"use strict";

class CPU {
    #a = 0;
    #zf = 0;
    #nf = 0;
    #hf = 0;
    #cf = 0;
    #b = 0;
    #c = 0;
    #d = 0;
    #e = 0;
    #h = 0;
    #l = 0;
    #sp = 0;
    #pc = 0;
    #ir = 0;
    #ie = 0;
    #if = 0;
    #ime = 0;
    #halt = 0;

    get_a = () => this.#a;
    get_f = () => this.#zf | this.#nf | this.#hf | this.#cf;
    get_b = () => this.#b;
    get_c = () => this.#c;
    get_d = () => this.#d;
    get_e = () => this.#e;
    get_h = () => this.#h;
    get_l = () => this.#l;
    get_sp = () => this.#sp;
    get_pc = () => this.#pc;
    get_ir = () => this.#ir;
    get_ie = () => this.#ie;
    get_if = () => this.#if;
    get_ime = () => this.#ime;
    get_halt = () => this.#halt;
    get_z_flag = () => !!this.#zf;
    get_n_flag = () => !!this.#nf;
    get_h_flag = () => !!this.#hf;
    get_c_flag = () => !!this.#cf;
    get_ie_vblank = () => !!(this.#ie & 0x01);
    get_ie_stat = () => !!(this.#ie & 0x02);
    get_ie_timer = () => !!(this.#ie & 0x04);
    get_ie_serial = () => !!(this.#ie & 0x08);
    get_ie_joypad = () => !!(this.#ie & 0x10);
    get_if_vblank = () => !!(this.#if & 0x01);
    get_if_stat = () => !!(this.#if & 0x02);
    get_if_timer = () => !!(this.#if & 0x04);
    get_if_serial = () => !!(this.#if & 0x08);
    get_if_joypad = () => !!(this.#if & 0x10);

    set_a = (value) => (this.#a = value & 0xff);
    set_f = (value) => {
        this.#zf = value & 0x80;
        this.#nf = value & 0x40;
        this.#hf = value & 0x20;
        this.#cf = value & 0x10;
    };
    set_b = (value) => (this.#b = value & 0xff);
    set_c = (value) => (this.#c = value & 0xff);
    set_d = (value) => (this.#d = value & 0xff);
    set_e = (value) => (this.#e = value & 0xff);
    set_h = (value) => (this.#h = value & 0xff);
    set_l = (value) => (this.#l = value & 0xff);
    set_sp = (value) => (this.#sp = value & 0xffff);
    set_pc = (value) => (this.#pc = value & 0xffff);
    set_ir = (value) => (this.#ir = value & 0xff);
    set_ie = (value) => (this.#ie = value & 0xff);
    set_if = (value) => (this.#if = value & 0xff);
    set_ime = (value) => (this.#ime = !!value);
    set_halt = (value) => (this.#halt = !!value);
    set_z_flag = (value) => (this.#zf = value ? 0x80 : 0);
    set_n_flag = (value) => (this.#nf = value ? 0x40 : 0);
    set_h_flag = (value) => (this.#hf = value ? 0x20 : 0);
    set_c_flag = (value) => (this.#cf = value ? 0x10 : 0);
    set_ie_vblank = (value) => (this.#ie = (this.#ie & ~0x01) | (!!value ? 0x01 : 0));
    set_ie_stat = (value) => (this.#ie = (this.#ie & ~0x02) | (!!value ? 0x02 : 0));
    set_ie_timer = (value) => (this.#ie = (this.#ie & ~0x04) | (!!value ? 0x04 : 0));
    set_ie_serial = (value) => (this.#ie = (this.#ie & ~0x08) | (!!value ? 0x08 : 0));
    set_ie_joypad = (value) => (this.#ie = (this.#ie & ~0x10) | (!!value ? 0x10 : 0));
    set_if_vblank = (value) => (this.#if = (this.#if & ~0x01) | (!!value ? 0x01 : 0));
    set_if_stat = (value) => (this.#if = (this.#if & ~0x02) | (!!value ? 0x02 : 0));
    set_if_timer = (value) => (this.#if = (this.#if & ~0x04) | (!!value ? 0x04 : 0));
    set_if_serial = (value) => (this.#if = (this.#if & ~0x08) | (!!value ? 0x08 : 0));
    set_if_joypad = (value) => (this.#if = (this.#if & ~0x10) | (!!value ? 0x10 : 0));

    randomize() {
        this.#a = ~~(Math.random() * 0x100);
        this.#zf = Math.random() < 0.5 ? 0x80 : 0;
        this.#nf = Math.random() < 0.5 ? 0x40 : 0;
        this.#hf = Math.random() < 0.5 ? 0x20 : 0;
        this.#cf = Math.random() < 0.5 ? 0x10 : 0;
        this.#b = ~~(Math.random() * 0x100);
        this.#c = ~~(Math.random() * 0x100);
        this.#d = ~~(Math.random() * 0x100);
        this.#e = ~~(Math.random() * 0x100);
        this.#h = ~~(Math.random() * 0x100);
        this.#l = ~~(Math.random() * 0x100);
        this.#sp = ~~(Math.random() * 0x10000);
        this.#pc = ~~(Math.random() * 0x10000);
        this.#ir = ~~(Math.random() * 0x100);
        this.#ie = ~~(Math.random() * 0x100);
        this.#if = ~~(Math.random() * 0x100);
        this.#ime = !!(Math.random() < 0.5);
        this.#halt = !!(Math.random() < 0.5);
    }
}

class PPU {
    #lcdc;
    #stat;
    #scy;
    #scx;
    // #ly;
    #lyc;
    // #dma;
    // #bgp;
    // #obp0;
    // #obp1;
    #wy;
    #wx;

    #scanline;
    #dot;
    #frame;
    #stat_int_signal;

    get_show_bg_win = () => !!(this.#lcdc & 0x01);
    get_show_obj = () => !!(this.#lcdc & 0x02);
    get_obj_size = () => !!(this.#lcdc & 0x04);
    get_bg_map = () => !!(this.#lcdc & 0x08);
    get_bg_win_data = () => !!(this.#lcdc & 0x10);
    get_show_win = () => !!(this.#lcdc & 0x20);
    get_win_map = () => !!(this.#lcdc & 0x40);
    get_enabled = () => !!(this.#lcdc & 0x80);
    get_mode = () => this.#stat & 0x03;
    get_lyc_eq_ly = () => !!(this.#stat & 0x04);
    get_mode_0_int = () => !!(this.#stat & 0x08);
    get_mode_1_int = () => !!(this.#stat & 0x10);
    get_mode_2_int = () => !!(this.#stat & 0x20);
    get_lyc_int = () => !!(this.#stat & 0x40);
    get_scy = () => this.#scy;
    get_scx = () => this.#scx;
    // get_ly = () => this.#ly;
    get_lyc = () => this.#lyc;
    get_wy = () => this.#wy;
    get_wx = () => this.#wx;
    get_scanline = () => this.#scanline;
    get_dot = () => this.#dot;
    get_frame = () => this.#frame;
    get_stat_int_signal = () => this.#stat_int_signal;

    set_show_bg_win = (value) => (this.#lcdc = (this.#lcdc & ~0x01) | (!!value ? 0x01 : 0));
    set_show_obj = (value) => (this.#lcdc = (this.#lcdc & ~0x02) | (!!value ? 0x02 : 0));
    set_obj_size = (value) => (this.#lcdc = (this.#lcdc & ~0x04) | (!!value ? 0x04 : 0));
    set_bg_map = (value) => (this.#lcdc = (this.#lcdc & ~0x08) | (!!value ? 0x08 : 0));
    set_bg_win_data = (value) => (this.#lcdc = (this.#lcdc & ~0x10) | (!!value ? 0x10 : 0));
    set_show_win = (value) => (this.#lcdc = (this.#lcdc & ~0x20) | (!!value ? 0x20 : 0));
    set_win_map = (value) => (this.#lcdc = (this.#lcdc & ~0x40) | (!!value ? 0x40 : 0));
    set_enabled = (value) => (this.#lcdc = (this.#lcdc & ~0x80) | (!!value ? 0x80 : 0));
    set_mode = (value) => (this.#stat = (this.#stat & ~0x03) | (value & 0x03));
    set_lyc_eq_ly = (value) => (this.#stat = (this.#stat & ~0x04) | (!!value ? 0x04 : 0));
    set_mode_0_int = (value) => (this.#stat = (this.#stat & ~0x08) | (!!value ? 0x08 : 0));
    set_mode_1_int = (value) => (this.#stat = (this.#stat & ~0x10) | (!!value ? 0x10 : 0));
    set_mode_2_int = (value) => (this.#stat = (this.#stat & ~0x20) | (!!value ? 0x20 : 0));
    set_lyc_int = (value) => (this.#stat = (this.#stat & ~0x40) | (!!value ? 0x40 : 0));
    set_scy = (value) => (this.#scy = value & 0xff);
    set_scx = (value) => (this.#scx = value & 0xff);
    // set_ly = (value) => (this.#ly = value&0xff);
    set_lyc = (value) => (this.#lyc = value & 0xff);
    set_wy = (value) => (this.#wy = value & 0xff);
    set_wx = (value) => (this.#wx = value & 0xff);
    // set_scanline = (value) => (this.#scanline = Math.min(Math.max(0, ~~value), 154));
    // set_dot = (value) => (this.#dot = Math.min(Math.max(0, ~~value), 455));
    // set_frame = (value) => (this.#frame = Math.min(Math.max(0, ~~value), 99999999));
    // set_stat_int_signal = (value) => (this.#stat_int_signal = !!value);

    randomize() {
        this.#lcdc = ~~(Math.random() * 0x100);
        this.#stat = ~~(Math.random() * 0x100);
        this.#scy = ~~(Math.random() * 0x100);
        this.#scx = ~~(Math.random() * 0x100);
        this.#lyc = ~~(Math.random() * 0x100);
        this.#wy = ~~(Math.random() * 0x100);
        this.#wx = ~~(Math.random() * 0x100);

        this.#scanline = ~~(Math.random() * 155);
        this.#dot = ~~(Math.random() * 456);
        this.#frame = ~~(Math.random() * 100000000);
        this.#stat_int_signal = !!(Math.random() < 0.5);
    }
}

class APU {
    #nr10_ch1_sweep;
    #nr11_ch1_length_and_duty;
    #nr12_ch1_volume_and_envelope;
    #nr13_ch1_period_low;
    #nr14_ch1_period_high_and_control;
    #nr21_ch2_length_and_duty;
    #nr22_ch2_volume_and_envelope;
    #nr23_ch2_period_low;
    #nr24_ch2_period_high_and_control;
    #nr30_ch3_dac;
    #nr31_ch3_length;
    #nr32_ch3_volume_setting;
    #nr33_ch3_period_low;
    #nr34_ch3_period_high_and_control;
    #nr41_ch4_length;
    #nr42_ch4_volume_and_envelope;
    #nr43_ch4_frequency_and_randomness;
    #nr44_ch4_control;
    #nr50_master_volume;
    #nr51_master_panning;
    #nr52_master_control;

    #div_apu;
    #clock_bit;
    #ch1_length_counter;
    #ch2_length_counter;
    #ch3_length_counter;
    #ch4_length_counter;
    #ch1_sweep_enabled;
    #ch1_sweep_timer;
    #ch1_sweep_frequency_period;
    #ch1_neg_sweep_calculated;
    #ch1_sweep_disable_delay;
    #ch1_reload_sweep_frequency_period_delay;
    #ch1_volume;
    #ch1_envelope_timer;
    #ch1_frequency_timer;
    #ch1_waveform_index;
    #ch1_triggered;
    #ch1_waveform_ready;
    #ch1_output;
    #ch2_volume;
    #ch2_envelope_timer;
    #ch2_volume_just_written;
    #ch2_frequency_timer;
    #ch2_waveform_index;
    #ch2_triggered;
    #ch2_waveform_ready;
    #ch2_output;
    #ch3_position_counter;
    #ch3_frequency_timer;
    #ch3_wave_ram_just_read;
    #ch3_reload_sample_delay;
    #ch3_cpu_wave_pattern_write;
    #ch3_cpu_wave_pattern_byte;
    #ch3_sample;
    #ch3_output;
    #ch4_volume;
    #ch4_envelope_timer;
    #ch4_frequency_timer;
    #ch4_lfsr;
    #ch4_output;

    get_enabled = () => !!(this.#nr52_master_control & 0x80);
    get_volume_left = () => (this.#nr50_master_volume >> 4) & 7;
    get_volume_right = () => (this.#nr50_master_volume >> 0) & 7;
    get_frame_sequencer_step = () => this.#div_apu;
    get_ch1_enabled = () => !!(this.#nr52_master_control & 1);
    get_ch1_dac_enabled = () => !!(this.#nr12_ch1_volume_and_envelope & 0xf8);
    get_ch1_panning_left = () => !!(this.#nr51_master_panning & 0x10);
    get_ch1_panning_right = () => !!(this.#nr51_master_panning & 0x01);
    get_ch1_length_enable = () => !!(this.#nr14_ch1_period_high_and_control & 0x40);
    get_ch1_length_counter = () => this.#ch1_length_counter;
    get_ch2_enabled = () => !!(this.#nr52_master_control & 2);
    get_ch2_dac_enabled = () => !!(this.#nr22_ch2_volume_and_envelope & 0xf8);
    get_ch2_panning_left = () => !!(this.#nr51_master_panning & 0x20);
    get_ch2_panning_right = () => !!(this.#nr51_master_panning & 0x02);
    get_ch2_length_enable = () => !!(this.#nr24_ch2_period_high_and_control & 0x40);
    get_ch2_length_counter = () => this.#ch2_length_counter;
    get_ch3_enabled = () => !!(this.#nr52_master_control & 4);
    get_ch3_dac_enabled = () => !!(this.#nr30_ch3_dac & 0xf0);
    get_ch3_panning_left = () => !!(this.#nr51_master_panning & 0x40);
    get_ch3_panning_right = () => !!(this.#nr51_master_panning & 0x04);
    get_ch3_length_enable = () => !!(this.#nr34_ch3_period_high_and_control & 0x40);
    get_ch3_length_counter = () => this.#ch3_length_counter;
    get_ch4_enabled = () => !!(this.#nr52_master_control & 8);
    get_ch4_dac_enabled = () => !!(this.#nr42_ch4_volume_and_envelope & 0xf8);
    get_ch4_panning_left = () => !!(this.#nr51_master_panning & 0x80);
    get_ch4_panning_right = () => !!(this.#nr51_master_panning & 0x08);
    get_ch4_length_enable = () => !!(this.#nr44_ch4_control & 0x40);
    get_ch4_length_counter = () => this.#ch4_length_counter;
    get_ch1_envelope_starting_volume = () => this.#nr12_ch1_volume_and_envelope >> 4;
    get_ch1_envelope_increase = () => !!(this.#nr12_ch1_volume_and_envelope & 8);
    get_ch1_envelope_period = () => this.#nr12_ch1_volume_and_envelope & 7;
    get_ch1_envelope_timer = () => this.#ch1_envelope_timer;
    get_ch1_envelope_volume = () => this.#ch1_volume;
    get_ch2_envelope_starting_volume = () => this.#nr22_ch2_volume_and_envelope >> 4;
    get_ch2_envelope_increase = () => !!(this.#nr22_ch2_volume_and_envelope & 8);
    get_ch2_envelope_period = () => this.#nr22_ch2_volume_and_envelope & 7;
    get_ch2_envelope_timer = () => this.#ch2_envelope_timer;
    get_ch2_envelope_volume = () => this.#ch2_volume;
    get_ch4_envelope_starting_volume = () => this.#nr42_ch4_volume_and_envelope >> 4;
    get_ch4_envelope_increase = () => !!(this.#nr42_ch4_volume_and_envelope & 8);
    get_ch4_envelope_period = () => this.#nr42_ch4_volume_and_envelope & 7;
    get_ch4_envelope_timer = () => this.#ch4_envelope_timer;
    get_ch4_envelope_volume = () => this.#ch4_volume;
    get_ch1_sweep_enabled = () => !!this.#ch1_sweep_enabled;
    get_ch1_sweep_shift = () => this.#nr10_ch1_sweep & 7;
    get_ch1_sweep_negate = () => !!(this.#nr10_ch1_sweep & 8);
    get_ch1_sweep_period = () => (this.#nr10_ch1_sweep >> 4) & 7;
    get_ch1_sweep_timer = () => this.#ch1_sweep_timer;
    get_ch1_sweep_frequency_period = () => this.#ch1_sweep_frequency_period;
    get_ch1_frequency_period = () => ((this.#nr14_ch1_period_high_and_control & 7) << 8) | this.#nr13_ch1_period_low;
    get_ch1_frequency_timer = () => this.#ch1_frequency_timer;
    get_ch1_duty = () => this.#nr11_ch1_length_and_duty >> 6;
    get_ch1_waveform_index = () => this.#ch1_waveform_index;
    get_ch2_frequency_period = () => ((this.#nr24_ch2_period_high_and_control & 7) << 8) | this.#nr23_ch2_period_low;
    get_ch2_frequency_timer = () => this.#ch2_frequency_timer;
    get_ch2_duty = () => this.#nr21_ch2_length_and_duty >> 6;
    get_ch2_waveform_index = () => this.#ch2_waveform_index;
    get_ch3_frequency_period = () => ((this.#nr34_ch3_period_high_and_control & 7) << 8) | this.#nr33_ch3_period_low;
    get_ch3_frequency_timer = () => this.#ch3_frequency_timer;
    get_ch3_sample_buffer = () => this.#ch3_sample;
    get_ch3_position_counter = () => this.#ch3_position_counter;
    get_ch3_volume_setting = () => (this.#nr32_ch3_volume_setting >> 5) & 3;
    get_ch4_clock_shift = () => this.#nr43_ch4_frequency_and_randomness & 7;
    get_ch4_clock_divider = () => this.#nr43_ch4_frequency_and_randomness >> 4;
    get_ch4_frequency_timer = () => this.#ch4_frequency_timer;
    get_ch4_lfsr_width = () => !!(this.#nr43_ch4_frequency_and_randomness & 8);
    get_ch4_lfsr = () => this.#ch4_lfsr;

    set_enabled = (value) => (this.#nr52_master_control = (this.#nr52_master_control & ~0x80) | (!!value ? 0x80 : 0));
    set_volume_left = (value) => (this.#nr50_master_volume = (this.#nr50_master_volume & ~0x70) | ((value & 7) << 4));
    set_volume_right = (value) => (this.#nr50_master_volume = (this.#nr50_master_volume & ~0x07) | ((value & 7) << 0));
    set_frame_sequencer_step = (value) => (this.#div_apu = value & 7);
    set_ch1_enabled = (value) => (this.#nr52_master_control = (this.#nr52_master_control & ~1) | (!!value ? 1 : 0));
    // set_ch1_dac_enabled = (value) => (this.#nr12_ch1_volume_and_envelope = (this.#nr12_ch1_volume_and_envelope&~0xff)|( !!value?0xff:0));
    set_ch1_panning_left = (value) =>
        (this.#nr51_master_panning = (this.#nr51_master_panning & ~0x10) | (!!value ? 0x10 : 0));
    set_ch1_panning_right = (value) =>
        (this.#nr51_master_panning = (this.#nr51_master_panning & ~0x01) | (!!value ? 0x01 : 0));
    set_ch1_length_enable = (value) =>
        (this.#nr14_ch1_period_high_and_control =
            (this.#nr14_ch1_period_high_and_control & ~0x40) | (!!value ? 0x40 : 0));
    set_ch1_length_counter = (value) => (this.#ch1_length_counter = value & 0x3f);
    set_ch2_enabled = (value) => (this.#nr52_master_control = (this.#nr52_master_control & ~2) | (!!value ? 2 : 0));
    // set_ch2_dac_enabled = (value) => (this.#nr22_ch2_volume_and_envelope = (this.#nr22_ch2_volume_and_envelope&~0xff)|( !!value?0xff:0));
    set_ch2_panning_left = (value) =>
        (this.#nr51_master_panning = (this.#nr51_master_panning & ~0x20) | (!!value ? 0x20 : 0));
    set_ch2_panning_right = (value) =>
        (this.#nr51_master_panning = (this.#nr51_master_panning & ~0x02) | (!!value ? 0x02 : 0));
    set_ch2_length_enable = (value) =>
        (this.#nr24_ch2_period_high_and_control =
            (this.#nr24_ch2_period_high_and_control & ~0x40) | (!!value ? 0x40 : 0));
    set_ch2_length_counter = (value) => (this.#ch2_length_counter = value & 0x3f);
    set_ch3_enabled = (value) => (this.#nr52_master_control = (this.#nr52_master_control & ~4) | (!!value ? 4 : 0));
    // set_ch3_dac_enabled = (value) => (this.#nr30_ch3_dac = (this.#nr30_ch3_dac&~0xff)|( !!value?0xff:0));
    set_ch3_panning_left = (value) =>
        (this.#nr51_master_panning = (this.#nr51_master_panning & ~0x40) | (!!value ? 0x40 : 0));
    set_ch3_panning_right = (value) =>
        (this.#nr51_master_panning = (this.#nr51_master_panning & ~0x04) | (!!value ? 0x04 : 0));
    set_ch3_length_enable = (value) =>
        (this.#nr34_ch3_period_high_and_control =
            (this.#nr34_ch3_period_high_and_control & ~0x40) | (!!value ? 0x40 : 0));
    set_ch3_length_counter = (value) => (this.#ch3_length_counter = value & 0xff);
    set_ch4_enabled = (value) => (this.#nr52_master_control = (this.#nr52_master_control & ~8) | (!!value ? 8 : 0));
    // set_ch4_dac_enabled = (value) => (this.#nr42_ch4_volume_and_envelope = (this.#nr42_ch4_volume_and_envelope&~0xff)|( !!value?0xff:0));
    set_ch4_panning_left = (value) =>
        (this.#nr51_master_panning = (this.#nr51_master_panning & ~0x80) | (!!value ? 0x80 : 0));
    set_ch4_panning_right = (value) =>
        (this.#nr51_master_panning = (this.#nr51_master_panning & ~0x08) | (!!value ? 0x08 : 0));
    set_ch4_length_enable = (value) =>
        (this.#nr44_ch4_control = (this.#nr44_ch4_control & ~0x40) | (!!value ? 0x40 : 0));
    set_ch4_length_counter = (value) => (this.#ch4_length_counter = value & 0x3f);
    set_ch1_envelope_starting_volume = (value) =>
        (this.#nr12_ch1_volume_and_envelope = (this.#nr12_ch1_volume_and_envelope & ~0xf0) | ((value & 15) << 4));
    set_ch1_envelope_increase = (value) =>
        (this.#nr12_ch1_volume_and_envelope = (this.#nr12_ch1_volume_and_envelope & ~8) | (!!value ? 8 : 0));
    set_ch1_envelope_period = (value) =>
        (this.#nr12_ch1_volume_and_envelope = (this.#nr12_ch1_volume_and_envelope & ~7) | (value & 7));
    set_ch1_envelope_timer = (value) => (this.#ch1_envelope_timer = value & 7);
    set_ch1_envelope_volume = (value) => (this.#ch1_volume = value & 15);
    set_ch2_envelope_starting_volume = (value) =>
        (this.#nr22_ch2_volume_and_envelope = (this.#nr22_ch2_volume_and_envelope & ~0xf0) | ((value & 15) << 4));
    set_ch2_envelope_increase = (value) =>
        (this.#nr22_ch2_volume_and_envelope = (this.#nr22_ch2_volume_and_envelope & ~8) | (!!value ? 8 : 0));
    set_ch2_envelope_period = (value) =>
        (this.#nr22_ch2_volume_and_envelope = (this.#nr22_ch2_volume_and_envelope & ~7) | (value & 7));
    set_ch2_envelope_timer = (value) => (this.#ch2_envelope_timer = value & 7);
    set_ch2_envelope_volume = (value) => (this.#ch2_volume = value & 15);
    set_ch4_envelope_starting_volume = (value) =>
        (this.#nr42_ch4_volume_and_envelope = (this.#nr42_ch4_volume_and_envelope & ~0xf0) | ((value & 15) << 4));
    set_ch4_envelope_increase = (value) =>
        (this.#nr42_ch4_volume_and_envelope = (this.#nr42_ch4_volume_and_envelope & ~8) | (!!value ? 8 : 0));
    set_ch4_envelope_period = (value) =>
        (this.#nr42_ch4_volume_and_envelope = (this.#nr42_ch4_volume_and_envelope & ~7) | (value & 7));
    set_ch4_envelope_timer = (value) => (this.#ch4_envelope_timer = value & 7);
    set_ch4_envelope_volume = (value) => (this.#ch4_volume = value & 15);
    set_ch1_sweep_enabled = (value) => (this.#ch1_sweep_enabled = !!value);
    set_ch1_sweep_shift = (value) => (this.#nr10_ch1_sweep = (this.#nr10_ch1_sweep & ~7) | (value & 7));
    set_ch1_sweep_negate = (value) => (this.#nr10_ch1_sweep = (this.#nr10_ch1_sweep & ~8) | (!!value ? 8 : 0));
    set_ch1_sweep_period = (value) => (this.#nr10_ch1_sweep = (this.#nr10_ch1_sweep & ~0x70) | ((value & 7) << 4));
    set_ch1_sweep_timer = (value) => (this.#ch1_sweep_timer = value & 7);
    set_ch1_sweep_frequency_period = (value) => (this.#ch1_sweep_frequency_period = value & 0x7ff);
    set_ch1_frequency_period = (value) => {
        this.#nr13_ch1_period_low = value & 0xff;
        this.#nr14_ch1_period_high_and_control = (this.#nr14_ch1_period_high_and_control & ~7) | ((value >> 8) & 7);
    };
    set_ch1_frequency_timer = (value) => (this.#ch1_frequency_timer = value & 0x7ff);
    set_ch1_duty = (value) =>
        (this.#nr11_ch1_length_and_duty = (this.#nr11_ch1_length_and_duty & 0xc0) | ((value & 3) << 6));
    set_ch1_waveform_index = (value) => (this.#ch1_waveform_index = value & 7);
    set_ch2_frequency_period = (value) => {
        this.#nr23_ch2_period_low = value & 0xff;
        this.#nr24_ch2_period_high_and_control = (this.#nr24_ch2_period_high_and_control & ~7) | ((value >> 8) & 7);
    };
    set_ch2_frequency_timer = (value) => (this.#ch2_frequency_timer = value & 0x7ff);
    set_ch2_duty = (value) =>
        (this.#nr21_ch2_length_and_duty = (this.#nr21_ch2_length_and_duty & 0xc0) | ((value & 3) << 6));
    set_ch2_waveform_index = (value) => (this.#ch2_waveform_index = value & 7);
    set_ch3_frequency_period = (value) => {
        this.#nr33_ch3_period_low = value & 0xff;
        this.#nr34_ch3_period_high_and_control = (this.#nr34_ch3_period_high_and_control & ~7) | ((value >> 8) & 7);
    };
    set_ch3_frequency_timer = (value) => (this.#ch3_frequency_timer = value & 0x7ff);
    set_ch3_sample_buffer = (value) => (this.#ch3_sample = value & 15);
    set_ch3_position_counter = (value) => (this.#ch3_position_counter = value & 31);
    set_ch3_volume_setting = (value) =>
        (this.#nr32_ch3_volume_setting = (this.#nr32_ch3_volume_setting & ~0x60) | ((value & 3) << 5));
    set_ch4_clock_shift = (value) =>
        (this.#nr43_ch4_frequency_and_randomness =
            (this.#nr43_ch4_frequency_and_randomness & ~0xf0) | ((value & 15) << 4));
    set_ch4_clock_divider = (value) =>
        (this.#nr43_ch4_frequency_and_randomness = (this.#nr43_ch4_frequency_and_randomness & ~7) | (value & 7));
    set_ch4_frequency_timer = (value) => (this.#ch4_frequency_timer = Math.min(Math.max(0, value), 7 << 17));
    set_ch4_lfsr_width = (value) =>
        (this.#nr43_ch4_frequency_and_randomness = (this.#nr43_ch4_frequency_and_randomness & ~8) | (!!value ? 8 : 0));
    set_ch4_lfsr = (value) => (this.#ch4_lfsr = value & 0x7fff);

    randomize() {
        this.#nr10_ch1_sweep = ~~(Math.random() * 0x100);
        this.#nr11_ch1_length_and_duty = ~~(Math.random() * 0x100);
        this.#nr12_ch1_volume_and_envelope = ~~(Math.random() * 0x100);
        this.#nr13_ch1_period_low = ~~(Math.random() * 0x100);
        this.#nr14_ch1_period_high_and_control = ~~(Math.random() * 0x100);
        this.#nr21_ch2_length_and_duty = ~~(Math.random() * 0x100);
        this.#nr22_ch2_volume_and_envelope = ~~(Math.random() * 0x100);
        this.#nr23_ch2_period_low = ~~(Math.random() * 0x100);
        this.#nr24_ch2_period_high_and_control = ~~(Math.random() * 0x100);
        this.#nr30_ch3_dac = ~~(Math.random() * 0x100);
        this.#nr31_ch3_length = ~~(Math.random() * 0x100);
        this.#nr32_ch3_volume_setting = ~~(Math.random() * 0x100);
        this.#nr33_ch3_period_low = ~~(Math.random() * 0x100);
        this.#nr34_ch3_period_high_and_control = ~~(Math.random() * 0x100);
        this.#nr41_ch4_length = ~~(Math.random() * 0x100);
        this.#nr42_ch4_volume_and_envelope = ~~(Math.random() * 0x100);
        this.#nr43_ch4_frequency_and_randomness = ~~(Math.random() * 0x100);
        this.#nr44_ch4_control = ~~(Math.random() * 0x100);
        this.#nr50_master_volume = ~~(Math.random() * 0x100);
        this.#nr51_master_panning = ~~(Math.random() * 0x100);
        this.#nr52_master_control = ~~(Math.random() * 0x100);

        this.#div_apu = ~~(Math.random() * 8);
        // this.#clock_bit = ~~(Math.random() * 100);
        this.#ch1_length_counter = ~~(Math.random() * 64);
        this.#ch2_length_counter = ~~(Math.random() * 64);
        this.#ch3_length_counter = ~~(Math.random() * 256);
        this.#ch4_length_counter = ~~(Math.random() * 64);
        this.#ch1_sweep_enabled = !!(this.#nr10_ch1_sweep & 0b1110111); // TODO
        this.#ch1_sweep_timer = this.#nr10_ch1_sweep & 0x30 ? (this.#nr10_ch1_sweep >> 4) & 7 : 8; // TODO
        this.#ch1_sweep_frequency_period = ~~(Math.random() * 2048);
        // this.#ch1_neg_sweep_calculated = ~~(Math.random() * 100);
        // this.#ch1_sweep_disable_delay = ~~(Math.random() * 100);
        // this.#ch1_reload_sweep_frequency_period_delay = ~~(Math.random() * 100);
        this.#ch1_volume = ~~(Math.random() * 16);
        this.#ch1_envelope_timer = ~~(Math.random() * 8);
        this.#ch1_frequency_timer = ~~(Math.random() * 2048);
        this.#ch1_waveform_index = ~~(Math.random() * 8);
        // this.#ch1_triggered = ~~(Math.random() * 100);
        // this.#ch1_waveform_ready = ~~(Math.random() * 100);
        // this.#ch1_output = ~~(Math.random() * 100);
        this.#ch2_volume = ~~(Math.random() * 16);
        this.#ch2_envelope_timer = ~~(Math.random() * 8);
        // this.#ch2_volume_just_written = ~~(Math.random() * 100);
        this.#ch2_frequency_timer = ~~(Math.random() * 2048);
        this.#ch2_waveform_index = ~~(Math.random() * 8);
        // this.#ch2_triggered = ~~(Math.random() * 100);
        // this.#ch2_waveform_ready = ~~(Math.random() * 100);
        // this.#ch2_output = ~~(Math.random() * 100);
        this.#ch3_position_counter = ~~(Math.random() * 32);
        this.#ch3_frequency_timer = ~~(Math.random() * 2048);
        // this.#ch3_wave_ram_just_read = ~~(Math.random() * 100);
        // this.#ch3_reload_sample_delay = ~~(Math.random() * 100);
        // this.#ch3_cpu_wave_pattern_write = ~~(Math.random() * 100);
        // this.#ch3_cpu_wave_pattern_byte = ~~(Math.random() * 100);
        this.#ch3_sample = ~~(Math.random() * 16);
        // this.#ch3_output = ~~(Math.random() * 100);
        this.#ch4_volume = ~~(Math.random() * 16);
        this.#ch4_envelope_timer = ~~(Math.random() * 8);
        this.#ch4_frequency_timer = ~~(Math.random() * ((7 << 17) + 1));
        this.#ch4_lfsr = ~~(Math.random() * 0x8000);
        // this.#ch4_output = ~~(Math.random() * 100);
    }
}

class GameBoy {
    #cpu = new CPU();
    #ppu = new PPU();
    #apu = new APU();
    #memory = new Uint8Array(0x10000).fill(0);

    constructor() {
        this.#randomize(this.#memory.length);
    }

    randomize = () => this.#randomize(100);
    get_cpu = () => this.#cpu;
    get_ppu = () => this.#ppu;
    get_apu = () => this.#apu;
    get_memory = () => this.#memory.slice();
    read_memory = (address) => this.#memory[address];

    #randomize(number_of_memory_changes) {
        this.#cpu.randomize();
        this.#ppu.randomize();
        this.#apu.randomize();
        for (let i = 0; i < number_of_memory_changes; i++) {
            const r = Math.random();
            this.#memory[~~(Math.random() * this.#memory.length)] = r < 0.5 ? r * 0x200 : 0;
        }
    }
}
