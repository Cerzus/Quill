"use strict";

class Util {
    static element_from_html(html) {
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    static assert(condition, message = "Assertion failed") {
        if (!condition) throw message;
        return condition;
    }

    static warning(condition, message = "Warning", ...args) {
        if (!condition) console.warn(message, ...args);
        return condition;
    }

    static error(condition, message = "Error") {
        if (!condition) throw message;
        return condition;
    }

    static config_and_callback_from_arguments(...args) {
        const result = { config: {}, callback: () => {} };
        for (let i = 0; i < Math.min(args.length, 2); i++) {
            const arg = args[i];
            if (arg instanceof Function) {
                result.callback = arg;
            } else if (arg instanceof Object) {
                result.config = arg;
            }
        }
        return result;
    }

    static config_callback_and_children_from_arguments(...args) {
        const result = { config: {}, callback: () => {}, children: [] };
        for (let i = 0; i < Math.min(args.length, 3); i++) {
            const arg = args[i];
            if (arg instanceof QuillElement || arg instanceof Array) {
                result.children = arg;
            } else if (arg instanceof Function) {
                result.callback = arg;
            } else if (arg instanceof Object) {
                result.config = arg;
            }
        }
        return result;
    }
}
