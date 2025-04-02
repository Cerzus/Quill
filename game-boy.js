"use strict";

class GameBoy {
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
    #memory = new Uint8Array(0x10000).fill(0);

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
    get_memory = () => this.#memory.slice();
    read_memory = (address) => this.#memory[address];

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
        for (let i = 0; i < 100; i++) {
            const r = Math.random();
            this.#memory[~~(Math.random() * this.#memory.length)] = r < 0.5 ? r * 0x200 : 0;
        }
    }
}
