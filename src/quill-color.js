"use strict";

class QuillColor {
    #rgb;

    constructor(r, g, b) {
        this.#rgb = new Uint8ClampedArray([r, g, b]);
    }

    // Public methods

    to_css = () => `rgb(${this.#rgb[0]} ${this.#rgb[1]} ${this.#rgb[2]})`;
    to_hex = () => `#${((this.#rgb[0] << 16) | (this.#rgb[1] << 8) | this.#rgb[2]).toString(16).padStart(6, 0)}`;
    static from_hex(hex) {
        return new QuillColor(...hex.match(/[0-9a-z]{2}/gi).map((match) => parseInt(match, 16)));
    }
}
