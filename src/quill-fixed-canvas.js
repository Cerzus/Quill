"use strict";

class QuillFixedCanvas extends QuillNodeElement {
    #canvas;
    #context;

    constructor(context_type, context_attributes, ...args) {
        // TODO: validate context_type
        // TODO: validate context_attributes
        super(`<div class="quill-fixed-canvas"></div>`, [], null, ...args);

        const canvas = document.createElement("canvas");
        canvas.tabIndex = null;
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

        const context = canvas.getContext(context_type, context_attributes);

        this.#canvas = canvas;
        this.#context = context;
    }

    // Public methods

    get_canvas = () => this.#canvas;

    get_context = () => this.#context;

    clear(style) {
        if (this.#context instanceof CanvasRenderingContext2D) {
            // TODO: validate style
            this.#context.fillStyle = style;
            this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        }
        return this;
    }
}
