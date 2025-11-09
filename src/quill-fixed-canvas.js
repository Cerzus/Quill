"use strict";

class QuillFixedCanvas extends QuillNodeElement {
    #canvas;
    #context;

    constructor(...args) {
        // TODO: validate args
        super(`<div class="quill-fixed-canvas"></div>`, [], ...args);

        const canvas = document.createElement("canvas");
        const config = this._get_arg_config();
        // TODO: validate width
        if (+config.width) canvas.width = +config.width;
        // TODO: validate height
        if (+config.height) canvas.height = +config.height;
        // TODO: validate min_scale
        canvas.style.minWidth = `${(+config.min_scale || 0) * canvas.width}px`;
        // TODO: validate max_scale
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
