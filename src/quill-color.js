"use strict";

class QuillColor {
    #rgb;

    constructor(r, g, b) {
        Util.error_if_not_number(r);
        Util.error_if_not_number(g);
        Util.error_if_not_number(b);
        this.#rgb = new Uint8ClampedArray([+r, +g, +b]);
    }

    // Public methods

    to_css = () => `rgb(${this.#rgb[0]} ${this.#rgb[1]} ${this.#rgb[2]})`;

    to_hex = () => `#${((this.#rgb[0] << 16) | (this.#rgb[1] << 8) | this.#rgb[2]).toString(16).padStart(6, 0)}`;

    to_u32_rgba = () => (this.#rgb[0] << 24) | (this.#rgb[1] << 16) | (this.#rgb[2] << 8) | 0xff;

    to_u32_abgr = () => 0xff000000 | (this.#rgb[2] << 16) | (this.#rgb[1] << 8) | this.#rgb[0];

    static from_hex(hex) {
        // TODO: validate hex
        return new QuillColor(...hex.match(/[0-9a-z]{2}/gi).map((match) => parseInt(match, 16)));
    }

    static from_u32_rgba(u32_rgba) {
        // TODO: validate u32_rgba
        return new QuillColor((u32_rgba >> 24) & 0xff, (u32_rgba >> 16) & 0xff, (u32_rgba >> 8) & 0xff);
    }

    static from_u32_abgr(u32_abgr) {
        // TODO: validate u32_abgr
        return new QuillColor((u32_abgr >> 0) & 0xff, (u32_abgr >> 8) & 0xff, (u32_abgr >> 16) & 0xff);
    }
}
