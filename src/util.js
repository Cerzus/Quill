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
        let i = 0;
        if (args[i] instanceof Object && !(args[i] instanceof Function)) result.config = args[i++];
        if (args[i] instanceof Function) result.callback = args[i++];
        return result;
    }

    static config_callback_and_children_from_arguments(...args) {
        const result = { config: {}, callback: () => {}, children: [] };
        let i = 0;
        if (
            args[i] instanceof Object &&
            !(args[i] instanceof Function || args[i] instanceof Array || args[i] instanceof QuillElement)
        ) {
            result.config = args[i++];
        }
        if (args[i] instanceof Function) result.callback = args[i++];
        if (args[i] instanceof Array || args[i] instanceof QuillElement) result.children = args[i++];
        result.count = i;
        return result;
    }

    static label_config_callback_and_children_from_arguments(...args) {
        const result = { label: "", config: {}, callback: () => {}, children: [] };
        let i = 0;
        if (typeof args[i] === "string" || typeof args[i] === "number") result.label = args[i++];
        if (
            args[i] instanceof Object &&
            !(args[i] instanceof Function || args[i] instanceof Array || args[i] instanceof QuillElement)
        ) {
            result.config = args[i++];
        }
        if (args[i] instanceof Function) result.callback = args[i++];
        if (args[i] instanceof Array || args[i] instanceof QuillElement) result.children = args[i++];
        result.count = i;
        return result;
    }

    static add_mouse_down_event_listener(element, callback) {
        element.addEventListener("mousedown", (e) => e.button === 0 && callback(e));
    }

    static add_mouse_up_event_listener(element, callback) {
        element.addEventListener("mouseup", (e) => e.button === 0 && callback(e));
    }

    static add_click_event_listener(element, callback) {
        element.addEventListener("click", (e) => e.button === 0 && callback(e));
    }

    static fill_array(length, callback) {
        return new Array(length).fill().map((_, i) => callback(i));
    }

    static add_style_variable_to_element(element, property, suffix, value) {
        element.style.setProperty(`--quill-${property.replaceAll("_", "-")}${suffix}`, value);
    }
}
