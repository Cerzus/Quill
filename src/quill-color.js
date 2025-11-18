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

    static from_hex(hex) {
        // TODO: validate hex
        return new QuillColor(...hex.match(/[0-9a-z]{2}/gi).map((match) => parseInt(match, 16)));
    }
}
