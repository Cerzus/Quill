"use strict";

class QuillCheckboxTree extends QuillNodeElement {
    #checkbox;
    #number_of_events_to_ignore = 0;

    constructor(label, ...args) {
        super(
            `<div class="quill-checkbox-tree">
                <div class="quill-checkbox-tree-body quill-indent"></div>
            </div>`,
            [QuillWrapper, QuillCheckboxTree, QuillCheckbox],
            ...args
        );
        this.get_element().addEventListener("change", (e) => this.#on_change(e));
        this.#checkbox = new QuillCheckbox(label);
        this.get_element().prepend(this.#checkbox.get_element());
        this.add_children(this._get_arg_children());
    }

    // Private methods

    _add_child(child) {
        this.get_element().querySelector(".quill-checkbox-tree-body").append(child.get_element());
    }
    #on_change(e) {
        if (this.#number_of_events_to_ignore > 0) {
            this.#number_of_events_to_ignore--;
            return;
        }
        // TODO: Take Wrapper element into account when traversing up or down
        if (e.target === this.#checkbox.get_input_element()) {
            for (const child of this.get_children()) {
                const checkbox = child instanceof QuillCheckboxTree ? child.#checkbox : child;
                if (checkbox.is_checked() === this.#checkbox.is_checked()) continue;
                (function increase_number_of_events_to_ignore(tree) {
                    tree.#number_of_events_to_ignore++;
                    const parent = tree.get_parent();
                    if (parent instanceof QuillCheckboxTree) increase_number_of_events_to_ignore(parent);
                })(this);
                checkbox.get_input_element().click();
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
