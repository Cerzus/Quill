"use strict";

class QuillDropdown extends QuillInput {
    constructor(...args) {
        // TODO: validate args
        super(`<select class="quill-select"></select>`, "change", null, [QuillWrapper, QuillDropdownOptions], ...args);
        this.add_children(this._get_arg_children());
        const config = this._get_arg_config();
        // TODO: validate value
        if (Object.hasOwn(config, "value")) this.set_value(config.value);
        // TODO: validate selected
        if (Object.hasOwn(config, "selected")) this.set_selected(config.selected);
    }

    // Public methods

    get_gelected = this.get_value;

    set_selected = this.set_value;

    // Protected methods

    _add_child(options) {
        // TODO: validate child
        const element = options.get_element();
        if (element.hasAttribute("label")) this.get_input_element().append(element);
        else for (const option of element.querySelectorAll("option")) this.get_input_element().append(option);
    }
}

class QuillDropdownOptions extends QuillWrappableElement {
    constructor(...args) {
        // TODO: validate args
        const label = typeof args[0] === "string" || typeof args[0] === "number" ? new String(args[0]) : null;
        const options = label instanceof String ? args[1] : args[0];
        super(`<optgroup ${label ? `label="${label}"` : ``}></optgroup`, [], ...args.slice(label instanceof String ? 2 : 1));
        const element = this.get_element();
        if (options instanceof Array) {
            for (const option of options) {
                element.append(Util.element_from_html(`<option>${option}</option>`));
            }
        } else if (options instanceof Object) {
            for (const [value, text] of Object.entries(options)) {
                element.append(Util.element_from_html(`<option value="${value}">${text}</option>`));
            }
        }
    }
}
