"use strict";

class QuillText extends QuillLeafElement {
    constructor(text, ...args) {
        super(`<div class="quill-text"></div>`, [], null, ...args);
        if (!!this._get_arg_config().muted) this.get_element().setAttribute("muted", "");
        this.set_text(text);
    }

    // Public methods

    set_text(text) {
        this.get_element().innerHTML = Util.html_string_from_object(text);
        return this;
    }
}

class QuillTextWrapped extends QuillText {
    constructor(text, ...args) {
        // TODO: this is a lot of code just to add one flag
        const foo = Util.config_callback_and_children_from_arguments(...args);
        foo.config.flags ? (foo.config.flags.wrap_text = true) : (foo.config.flags = { wrap_text: true });
        super(text, ...Object.values(foo), ...args.slice(foo.count));
    }
}
