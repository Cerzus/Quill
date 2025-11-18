"use strict";

class Util {
    static is_plain_object(obj) {
        return obj != null && (Object.getPrototypeOf(obj) === Object.prototype || Object.getPrototypeOf(obj) === null);
    }

    static is_function(obj) {
        return typeof obj === "function";
    }

    static element_from_html(html) {
        // TODO: validate html
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    static error_if_not_number(obj) {
        try {
            +obj;
        } catch {
            return this.assert(false, `Expected number, found ${typeof obj}`);
        }
        return this.assert(!Number.isNaN(+obj), `Expected number, found ${obj}`);
    }

    static #html_symbols = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "\n": "<br>",
    };
    static html_string_from_object(obj) {
        return String(obj).replace(/[<>"'\n]/g, (string) => Util.#html_symbols[string]);
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
        let i = 0;
        if (Util.is_plain_object(args[i])) result.config = args[i++];
        if (Util.is_function(args[i])) result.callback = args[i++];
        return result;
    }

    static config_callback_and_children_from_arguments(...args) {
        const result = { config: {}, callback: () => {}, children: [] };
        let i = 0;
        if (Util.is_plain_object(args[i])) result.config = args[i++];
        if (Util.is_function(args[i])) result.callback = args[i++];
        if (args[i] instanceof QuillElement) result.children = args[i++];
        if (Object.prototype.toString.call(args[i]) === "[object Array]") {
            for (const obj of args[i]) Util.assert(obj instanceof QuillElement);
            result.children = args[i++];
        }
        result.count = i;
        return result;
    }

    static label_config_callback_and_children_from_arguments(...args) {
        const result = { label: "", config: {}, callback: () => {}, children: [] };
        let i = 0;
        if (typeof args[i] === "string" || typeof args[i] === "number") result.label = args[i++];
        if (Util.is_plain_object(args[i])) result.config = args[i++];
        if (Util.is_function(args[i])) result.callback = args[i++];
        if (args[i] instanceof QuillElement) result.children = args[i++];
        if (Object.prototype.toString.call(args[i]) === "[object Array]") {
            for (const obj of args[i]) Util.assert(obj instanceof QuillElement);
            result.children = args[i++];
        }
        result.count = i;
        return result;
    }

    static add_mouse_down_event_listener(element, callback) {
        // TODO: validate element
        // TODO: validate callback
        element.addEventListener("mousedown", (e) => e.button === 0 && callback(e));
    }

    static add_mouse_up_event_listener(element, callback) {
        // TODO: validate element
        // TODO: validate callback
        element.addEventListener("mouseup", (e) => e.button === 0 && callback(e));
    }

    static add_click_event_listener(element, callback) {
        // TODO: validate element
        // TODO: validate callback
        element.addEventListener("click", (e) => e.button === 0 && callback(e));
    }

    static fill_array(length, callback) {
        // TODO: validate length
        // TODO: validate callback
        return new Array(length).fill().map((_, i) => callback(i));
    }

    static add_style_variable_to_element(element, property, suffix, value) {
        // TODO: validate element
        // TODO: validate property
        // TODO: validate suffix
        // TODO: validate value
        element.style.setProperty(`--quill-${property.replaceAll("_", "-")}${suffix}`, value);
    }

    static disable_html_element(html_element, disable) {
        // TODO: validate html_element
        if (!!disable) html_element.setAttribute("disabled", "");
        else html_element.removeAttribute("disabled");
    }
}
