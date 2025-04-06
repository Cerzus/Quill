"use strict";

class QuillTabs extends QuillBranchElement {
    #header_element;
    constructor(...args) {
        super(
            `<div class="quill-tabs">
                <div class="quill-tabs-header"></div>
                <div class="quill-tabs-body"></div>
            </div>`,
            [QuillTab],
            ...args
        );
        this.#header_element = this.get_element().querySelector(".quill-tabs-header");
        Util.add_mouse_down_event_listener(this.#header_element, (e) => {
            if (!e.target.classList.contains("quill-header-tab")) return;
            for (const child of this.get_children()) {
                if (child.get_name() === e.target.dataset.name) this.#activate_child(child);
                else this.#deactivate_child(child);
            }
        });
        this.add_children(this._get_arg_children());
    }

    // Private methods

    _add_child(child) {
        const name = child.get_name();
        const header_tab = Util.element_from_html(`<div class="quill-header-tab" data-name="${name}">${name}</div>`);
        this.#header_element.append(header_tab);
        this.get_element().querySelector(".quill-tabs-body").append(child.get_element());
        if (this.get_children().length === 0) this.#activate_child(child);
    }
    #activate_child(child) {
        const header_tab = this.#header_element.querySelector(`[data-name=${child.get_name()}]`);
        header_tab.classList.add("active");
        child.get_element().classList.add("active");
    }
    #deactivate_child(child) {
        const header_tab = this.#header_element.querySelector(`[data-name=${child.get_name()}]`);
        header_tab.classList.remove("active");
        child.get_element().classList.remove("active");
    }
}

class QuillTab extends QuillElement {
    #name;

    constructor(name, ...args) {
        super(`<div class="quill-tab" data-name="${name}"></div>`, [QuillNodeElement], ...args);
        this.#name = name;
        this.add_children(this._get_arg_children());
    }

    // Public methods

    get_name = () => this.#name;

    // Private methods

    _add_child(child) {
        this.get_element().append(child.get_element());
    }
    _remove() {
        // TODO: remove tab from parent Tabs
    }
}
