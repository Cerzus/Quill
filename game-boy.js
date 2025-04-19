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

    set_a = (value) => (this.#a = Math.min(Math.max(0, ~~value), 255));
    set_f = (value) => {
        this.#zf = value & 0x80;
        this.#nf = value & 0x40;
        this.#hf = value & 0x20;
        this.#cf = value & 0x10;
    };
    set_b = (value) => (this.#b = Math.min(Math.max(0, ~~value), 255));
    set_c = (value) => (this.#c = Math.min(Math.max(0, ~~value), 255));
    set_d = (value) => (this.#d = Math.min(Math.max(0, ~~value), 255));
    set_e = (value) => (this.#e = Math.min(Math.max(0, ~~value), 255));
    set_h = (value) => (this.#h = Math.min(Math.max(0, ~~value), 255));
    set_l = (value) => (this.#l = Math.min(Math.max(0, ~~value), 255));
    set_sp = (value) => (this.#sp = Math.min(Math.max(0, ~~value), 65535));
    set_pc = (value) => (this.#pc = Math.min(Math.max(0, ~~value), 65535));
    set_ir = (value) => (this.#ir = Math.min(Math.max(0, ~~value), 255));
    set_ie = (value) => (this.#ie = Math.min(Math.max(0, ~~value), 255));
    set_if = (value) => (this.#if = Math.min(Math.max(0, ~~value), 255));
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
    set_scy = (value) => (this.#scy = Math.min(Math.max(0, ~~value), 255));
    set_scx = (value) => (this.#scx = Math.min(Math.max(0, ~~value), 255));
    // set_ly = (value) => (this.#ly = Math.min(Math.max(0, ~~value), 255));
    set_lyc = (value) => (this.#lyc = Math.min(Math.max(0, ~~value), 255));
    set_wy = (value) => (this.#wy = Math.min(Math.max(0, ~~value), 255));
    set_wx = (value) => (this.#wx = Math.min(Math.max(0, ~~value), 255));
    set_scanline = (value) => (this.#scanline = Math.min(Math.max(0, ~~value), 154));
    set_dot = (value) => (this.#dot = Math.min(Math.max(0, ~~value), 455));
    set_frame = (value) => (this.#frame = Math.min(Math.max(0, ~~value), 99999999));
    set_stat_int_signal = (value) => (this.#stat_int_signal = !!value);

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

class GameBoy {
    #cpu = new CPU();
    #ppu = new PPU();
    #memory = new Uint8Array(0x10000).fill(0);

    constructor() {
        this.#randomize(this.#memory.length);
    }

    randomize = () => this.#randomize(100);
    get_cpu = () => this.#cpu;
    get_ppu = () => this.#ppu;
    get_memory = () => this.#memory.slice();
    read_memory = (address) => this.#memory[address];

    #randomize(number_of_memory_changes) {
        this.#cpu.randomize();
        this.#ppu.randomize();
        for (let i = 0; i < number_of_memory_changes; i++) {
            const r = Math.random();
            this.#memory[~~(Math.random() * this.#memory.length)] = r < 0.5 ? r * 0x200 : 0;
        }
    }
}
