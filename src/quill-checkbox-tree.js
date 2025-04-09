"use strict";

class QuillCheckboxTree extends QuillInput {
    #checkbox;
    #number_of_events_to_ignore = 0;

    constructor(...args) {
        const { label, config, callback, children, count } = Util.label_config_callback_and_children_from_arguments(
            ...args
        );
        super(
            `<div class="quill-checkbox-tree">
                <div class="quill-checkbox-tree-body quill-indent"></div>
            </div>`,
            "change",
            null,
            [QuillWrapper, QuillCheckboxTree, QuillCheckbox],
            config,
            (_, __, e) => this.#on_change(e.target),
            children,
            ...args.slice(count - 1)
        );

        this.#checkbox = new QuillCheckbox(label);
        this.get_element().prepend(this.#checkbox.get_element());

        this.add_children(this._get_arg_children());
        // const config = this._get_arg_config();
        // if (Object.hasOwn(config, "value")) this.set_value(config.value);
    }

    // Public methods

    get_value = () => this.#checkbox.get_input_element().checked;
    set_value(value) {
        // this.#input_element.value = this.#sanitize_value(value);
        return this;
    }
    is_checked = this.get_value;
    set_checked = this.set_value;
    get_input_element = () => this.#checkbox.get_input_element(); // TODO: Keep public?

    // Private methods

    _add_child(child) {
        this.get_element().querySelector(".quill-checkbox-tree-body").append(child.get_element());
    }
    #on_change(target) {
        if (this.#number_of_events_to_ignore > 0) {
            this.#number_of_events_to_ignore--;
            return;
        }
        if (target === this.#checkbox.get_input_element()) {
            for (const child of this.get_children()) {
                if (child.is_checked() === this.#checkbox.is_checked()) continue;
                const parent = this.get_parent();
                if (parent instanceof QuillCheckboxTree) parent.#number_of_events_to_ignore++;
                this.#number_of_events_to_ignore++;
                child.get_input_element().click();
            }
        } else {
            const tally = { checked: false, unchecked: false };
            (function tally_children_checked_status(parent) {
                for (const child of parent.get_children()) {
                    if (child instanceof QuillCheckboxTree) tally_children_checked_status(child);
                    else child.is_checked() ? (tally.checked = true) : (tally.unchecked = true);
                    if (tally.checked && tally.unchecked) return; // early out
                }
            })(this);
            if (tally.checked && tally.unchecked) {
                this.#checkbox.get_input_element().indeterminate = true;
                this.#checkbox.set_checked(false);
            } else {
                this.#checkbox.get_input_element().indeterminate = false;
                this.#checkbox.set_checked(tally.checked);
            }
        }
    }
}
