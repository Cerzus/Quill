"use strict";

class QuillColor {
    #rgb;
    #a;

    constructor(r, g, b, a = 1.0) {
        this.#rgb = new Uint8ClampedArray([r, g, b]);
        this.#a = a;
    }

    // Public methods

    to_css = () => `rgba(${this.#rgb[0]},${this.#rgb[1]},${this.#rgb[2]},${this.#a})`;
}
