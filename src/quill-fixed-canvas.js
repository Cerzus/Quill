"use strict";

class QuillFixedCanvas extends QuillNodeElement {
    #canvas;
    #context;

    constructor(...args) {
        super(`<div class="quill-fixed-canvas"></div>`, [], ...args);

        const canvas = document.createElement("canvas");
        const config = this._get_arg_config();
        if (+config.width) canvas.width = +config.width;
        if (+config.height) canvas.height = +config.height;
        canvas.style.minWidth = `${(+config.min_scale || 0) * canvas.width}px`;
        const max_scale = +config.max_scale;
        if (max_scale) canvas.style.maxWidth = `${max_scale * canvas.width}px`;
        this.get_element().append(canvas);

        const context = canvas.getContext("2d");
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);

        this.#canvas = canvas;
        this.#context = context;
    }

    // Public methods

    get_canvas = () => this.#canvas;
    get_context = () => this.#context;
}
