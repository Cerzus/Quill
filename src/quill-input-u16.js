"use strict";

class QuillInputU16 extends QuillInputInteger {
    constructor(label, ...args) {
        const { config, callback, children, count } = Util.config_callback_and_children_from_arguments(...args);
        config.min = 0;
        config.max = (1 << 16) - 1;
        super(label, config, callback, children, ...args.slice(count));
    }
}
