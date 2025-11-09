"use strict";

class QuillPlot extends QuillLeafElement {
    #shader_program;

    constructor(protected_props, extra_class, ...args) {
        super(`<div class="quill-plot"><canvas></canvas><div></div></div>`, [], ...args);
        this.get_element().classList.add(extra_class);

        const canvas = this.get_element().querySelector("canvas");
        const config = this._get_arg_config();
        if (+config.width) canvas.width = +config.width;
        canvas.height = Math.max(20 /* TODO: get from font size? */, +config.height | 0);
        canvas.style.minWidth = `${(+config.min_scale || 0) * canvas.width}px`;
        const max_scale = +config.max_scale;
        if (max_scale) canvas.style.maxWidth = `${max_scale * canvas.width}px`;
        this.get_element().append(canvas);

        const gl = canvas.getContext("webgl");

        const vert_code = `
            attribute vec2 coordinates;
            
            void main(void) {
                gl_Position = vec4(coordinates, 0.0, 1.0);
            }`;
        const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertex_shader, vert_code);
        gl.compileShader(vertex_shader);

        const frag_code = `
            void main(void) {
                gl_FragColor = vec4(0.8, 0.8, 0.0, 1.0);
            }`;
        const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragment_shader, frag_code);
        gl.compileShader(fragment_shader);

        const shader_program = gl.createProgram();
        gl.attachShader(shader_program, vertex_shader);
        gl.attachShader(shader_program, fragment_shader);
        gl.linkProgram(shader_program);
        gl.useProgram(shader_program);

        this.#shader_program = shader_program;

        protected_props.canvas = canvas;
        protected_props.context = gl;
    }

    update(canvas, gl, vertices) {
        gl.viewport(0, 0, canvas.width, canvas.height);

        const vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        const coord = gl.getAttribLocation(this.#shader_program, "coordinates");
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);

        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}

class QuillPlotLines extends QuillPlot {
    #protected;

    #values_getter;
    #values_count;
    #values_offset;
    #scale_min;
    #scale_max;

    constructor(...args) {
        const protected_props = {};
        super(protected_props, "quill-plot-lines", ...args);
        this.#protected = protected_props;

        const config = this._get_arg_config();

        this.#values_getter = config.values_getter;
        this.#values_count = config.values_count;
        this.#values_offset = config.values_offset | 0;
        this.#scale_min = Object.hasOwn(config, "scale_min") ? +config.scale_min : null;
        this.#scale_max = Object.hasOwn(config, "scale_max") ? +config.scale_max : null;
        this.set_overlay_text(config.overlay_text ?? null);

        new ResizeObserver(() => this.update()).observe(this.#protected.canvas);
    }

    // Public methods

    set_values_getter(n) {
        this.#values_getter = n;
        this.update();
        return this;
    }
    set_values_count(n) {
        this.#values_count = Math.max(0, ~~n);
        this.update();
        return this;
    }
    set_values_offset(n) {
        this.#values_offset = Math.max(0, ~~n);
        this.update();
        return this;
    }
    set_overlay_text(n) {
        this.get_element().querySelector("div").innerHTML = n;
        return this;
    }
    update() {
        const canvas = this.#protected.canvas;

        const values = [];
        for (let i = 0; i < this.#values_count; i++) {
            values.push(this.#values_getter((i + this.#values_offset) % this.#values_count));
        }

        const scale_min = this.#scale_min === null ? Math.min(...values) : this.#scale_min;
        const scale_max = this.#scale_max === null ? Math.max(...values) : this.#scale_max;

        const scale = (value) =>
            ((2 - 2 / canvas.height) * (value - scale_min)) / (scale_max - scale_min) -
            (1 - 1 / this.#protected.canvas.height);

        const vertices = [];
        for (let i = 0; i < this.#values_count; i++) {
            vertices.push(-1 + (2 / (this.#values_count - 1)) * i, scale(values[i]));
        }

        const gl = this.#protected.context;
        super.update(canvas, gl, vertices);
        gl.lineWidth(1.0);
        gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
    }
}

class QuillPlotHistogram extends QuillPlot {
    #protected;

    #values_getter;
    #values_count;
    #values_offset;
    #scale_min;
    #scale_max;

    constructor(...args) {
        const protected_props = {};
        super(protected_props, "quill-plot-histogram", ...args);
        this.#protected = protected_props;

        const config = this._get_arg_config();

        this.#values_getter = config.values_getter;
        this.#values_count = config.values_count;
        this.#values_offset = config.values_offset | 0;
        this.#scale_min = Object.hasOwn(config, "scale_min") ? +config.scale_min : null;
        this.#scale_max = Object.hasOwn(config, "scale_max") ? +config.scale_max : null;
        this.set_overlay_text(config.overlay_text ?? null);

        new ResizeObserver(() => this.update()).observe(this.#protected.canvas);
    }

    // Public methods

    set_values_getter(n) {
        this.#values_getter = n;
        this.update();
        return this;
    }
    set_values_count(n) {
        this.#values_count = Math.max(0, ~~n);
        this.update();
        return this;
    }
    set_values_offset(n) {
        this.#values_offset = Math.max(0, ~~n);
        this.update();
        return this;
    }
    set_overlay_text(n) {
        this.get_element().querySelector("div").innerHTML = n;
        return this;
    }
    update() {
        const canvas = this.#protected.canvas;

        const values = [];
        for (let i = 0; i < this.#values_count; i++) {
            values.push(this.#values_getter((i + this.#values_offset) % this.#values_count));
        }

        const scale_min = this.#scale_min === null ? Math.min(...values) : this.#scale_min;
        const scale_max = this.#scale_max === null ? Math.max(...values) : this.#scale_max;

        const scale = (value) => (2 * (value - scale_min)) / (scale_max - scale_min) - 1;

        const vertices = [];
        for (let i = 0; i < this.#values_count; i++) {
            const x1 = -1 + (2 / this.#values_count) * (i + 0) + 1 / canvas.width;
            const x2 = Math.max(-1 + (2 / this.#values_count) * (i + 1) - 1 / canvas.width, x1 + 2 / canvas.width);
            const y1 = scale(0);
            const y2 = scale(values[i]);
            vertices.push(x1, y2, x1, y1, x2, y2);
            vertices.push(x2, y1, x1, y1, x2, y2);
        }

        const gl = this.#protected.context;
        super.update(canvas, gl, vertices);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
    }
}

class QuillProgressBar extends QuillPlot {
    #protected;

    #fraction;
    #overlay_text;

    constructor(...args) {
        const protected_props = {};
        super(protected_props, "quill-progress-bar", ...args);
        this.#protected = protected_props;

        const config = this._get_arg_config();

        this.#fraction = Object.hasOwn(config, "fraction") ? +config.fraction : 0.5;
        this.get_element().querySelector("div").innerHTML = Math.round(this.#fraction * 100) + "%";
        if (Object.hasOwn(config, "overlay_text")) this.set_overlay_text(config.overlay_text);

        new ResizeObserver(() => this.update()).observe(this.#protected.canvas);
    }

    // Public methods

    set_fraction(n) {
        this.#fraction = Math.min(Math.max(0, +n), 1);
        if (typeof this.#overlay_text === "undefined") {
            this.get_element().querySelector("div").innerHTML = Math.round(this.#fraction * 100) + "%";
        }
        this.update();
        return this;
    }
    set_overlay_text(n) {
        this.#overlay_text = n;
        this.get_element().querySelector("div").innerHTML = n;
        return this;
    }
    update() {
        const x = this.#fraction * 2 - 1;
        const vertices = [-1, -1, x, -1, -1, +1, x, +1];

        const gl = this.#protected.context;
        super.update(this.#protected.canvas, gl, vertices);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);
    }
}
