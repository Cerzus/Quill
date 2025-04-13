"use strict";

class QuillDynamicRows extends QuillNodeElement {
    #row_height;
    #number_of_rows;
    #create_callback;
    #rows = [];

    constructor(number_of_rows, create_callback, ...args) {
        super(
            `<div class="quill-dynamic-rows">
                <div class="quill-dynamic-rows-list"></div>
            </div>`,
            [],
            ...args
        );
        this.#number_of_rows = number_of_rows;
        this.#create_callback = create_callback;

        const rows_container_element = this.get_element();
        const rows_element = this.get_element().querySelector(".quill-dynamic-rows-list");

        const update_row_elements = () => {
            if (this.#row_height <= 0) return;

            const paddingTop = parseFloat(getComputedStyle(rows_container_element).paddingTop);
            const scroll_top = rows_container_element.scrollTop - paddingTop;
            const offset_height = rows_container_element.offsetHeight;
            const first_index = Math.max(0, Math.floor(scroll_top / this.#row_height) - 0);
            const last_index = Math.min(
                this.#number_of_rows - 1,
                Math.ceil((scroll_top + offset_height) / this.#row_height) - 1 + 0
            );

            if (this.#rows.length > 0) this.#rows[0].row.get_element().removeAttribute("style");

            // Remove from the end
            while (this.#rows.length > 0 && this.#rows[this.#rows.length - 1].index > last_index) {
                rows_element.removeChild(this.#rows[this.#rows.length - 1].row.get_element());
                this.#rows.pop();
            }

            // Remove from the start
            while (this.#rows.length > 0 && this.#rows[0].index < first_index) {
                rows_element.removeChild(this.#rows[0].row.get_element());
                this.#rows.shift();
            }

            // Just skip the rest if no rows will be displayed anyway
            if (last_index < first_index) return;

            // Append to the end
            {
                const document_fragment = new DocumentFragment();
                const last_existing_index = this.#rows.length > 0 ? this.#rows[this.#rows.length - 1].index + 1 : 0;
                for (let i = Math.max(first_index, last_existing_index); i <= last_index; i++) {
                    const row = this.#create_row(i);
                    document_fragment.append(row.get_element());
                    this.#rows.push({ index: i, row });
                }
                rows_element.append(document_fragment);
            }

            // Prepend to the start
            {
                const document_fragment = new DocumentFragment();
                const first_existing_index = this.#rows.length > 0 ? this.#rows[0].index - 1 : 0;
                for (let i = Math.min(last_index, first_existing_index); i >= first_index; i--) {
                    const row = this.#create_row(i);
                    document_fragment.prepend(row.get_element());
                    this.#rows.unshift({ index: i, row });
                }
                rows_element.prepend(document_fragment);
            }

            this.#rows[0].row.get_element().style.marginTop = `${first_index * this.#row_height}px`;
        };

        new ResizeObserver(() => {
            const example_row_element = this.#create_row(0).get_element();
            rows_element.append(example_row_element);
            this.#row_height = example_row_element.offsetHeight;
            example_row_element.remove();
            rows_element.style.height = `${this.#row_height * this.#number_of_rows}px`;
            update_row_elements();
        }).observe(rows_container_element);

        rows_container_element.addEventListener("scroll", update_row_elements);
    }

    // Public methods

    update() {
        for (const row of this.#rows) this._get_arg_callback()(row.index, row.row);
        return this;
    }

    // Private methods

    #create_row(index) {
        return new QuillRow(this.#create_callback(index));
    }
}
