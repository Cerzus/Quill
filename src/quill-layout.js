"use strict";

class QuillRow extends QuillNodeElement {
    constructor(...args) {
        super(`<fieldset class="quill-layout quill-row"></fieldset>`, [QuillWrapper, QuillNodeElement], null, ...args);
        this.add_children(this._get_arg_children());
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        Util.disable_html_element(this.get_element(), !!disabled);
        return this;
    }
}

class QuillColumn extends QuillNodeElement {
    constructor(...args) {
        super(`<fieldset class="quill-layout quill-column"></fieldset>`, [QuillWrapper, QuillNodeElement], null, ...args);
        this.add_children(this._get_arg_children());
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        Util.disable_html_element(this.get_element(), !!disabled);
        return this;
    }
}

class QuillGrid extends QuillNodeElement {
    constructor(columns, ...args) {
        // TODO: validate columns
        super(
            `<fieldset class="quill-layout quill-grid" style="grid-template-columns: repeat(${columns}, 1fr);"></fieldset>`,
            [QuillWrapper, QuillNodeElement],
            null,
            ...args
        );
        this.add_children(this._get_arg_children());
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        Util.disable_html_element(this.get_element(), !!disabled);
        return this;
    }
}
