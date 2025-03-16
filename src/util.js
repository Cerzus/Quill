"use strict";

class Util {
    static element_from_html(html) {
        const div = document.createElement("div");
        div.innerHTML = html.trim();
        return div.firstChild;
    }

    static assert(condition, message = "Assertion failed") {
        if (!condition) throw message;
        return condition;
    }
}
