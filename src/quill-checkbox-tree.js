"use strict";

class QuillCheckboxTree extends QuillNodeElement {
    #checkbox;
    #number_of_events_to_ignore = 0;

    constructor(label, ...args) {
        super(
            `<fieldset class="quill-checkbox-tree">
                <div class="quill-checkbox-tree-body quill-indent"></div>
            </fieldset>`,
            [QuillWrapper, QuillCheckboxTree, QuillCheckbox],
            ...args
        );
        this.get_element().addEventListener("change", (e) => this.#on_change(e));
        this.#checkbox = new QuillCheckbox(label);
        this.get_element().prepend(this.#checkbox.get_element());
        this.add_children(this._get_arg_children());
        this.set_disabled(!!this._get_arg_config().disabled);
    }

    // Public methods

    set_disabled(disabled) {
        Util.disable_html_element(this.get_element(), disabled);
        return this;
    }
    // Private methods

    _add_child(child) {
        this.get_element().querySelector(".quill-checkbox-tree-body").append(child.get_element());
        this.#set_status_based_on_children([child, ...this.get_children()]);
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
            this.#set_status_based_on_children(this.get_children());
        }
    }
    #set_status_based_on_children(children) {
        const tally = { checked: false, unchecked: false };
        (function tally_children_checked_status(children) {
            for (const child of children) {
                if (child instanceof QuillCheckboxTree) {
                    if (child.#checkbox.is_indeterminate()) tally.checked = tally.unchecked = true;
                    else tally_children_checked_status(child.get_children());
                } else {
                    tally.checked |= child.is_checked() | child.is_indeterminate();
                    tally.unchecked |= !child.is_checked() | child.is_indeterminate();
                }
                if (tally.checked && tally.unchecked) return;
            }
        })(children);
        if (tally.checked && tally.unchecked) this.#checkbox.set_indeterminate();
        else this.#checkbox.set_checked(tally.checked);
    }
}
