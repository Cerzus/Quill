"use strict";

class Util {
    static element_from_html(html) {
        const template = document.createElement("template");
        template.innerHTML = html;
        return template.content.firstChild;
    }

    static assert(condition, message = "Assertion failed") {
        if (!condition) throw message;
        return condition;
    }
}
