"use strict";

class QuillDynamicRows extends QuillNodeElement {
    #row_height;
    #number_of_rows;
    #create_callback;
    #rows = [];
    #extra_rows = 4;
    #unbounded_first_index;

    constructor(number_of_rows, create_callback, ...args) {
        Util.warning(!isNaN(number_of_rows));
        super(
            `<div class="quill-dynamic-rows">
                <div class="quill-dynamic-rows-list">
                    <div class="quill-dynamic-rows-offset"></div>
                </div>
            </div>`,
            [],
            ...args
        );
        this.#number_of_rows = number_of_rows;
        this.#create_callback = create_callback;

        const rows_container_element = this.get_element();
        const rows_element = this.get_element().querySelector(".quill-dynamic-rows-list");
        const offset_element = this.get_element().querySelector(".quill-dynamic-rows-offset");

        const update_row_elements = (refresh) => {
            if (this.#row_height <= 0) return;

            const padding_top = parseFloat(getComputedStyle(rows_container_element).paddingTop);
            const top = rows_container_element.scrollTop - padding_top;
            const bottom = top + rows_container_element.offsetHeight;
            const unbounded_first_index = Math.floor(top / this.#row_height) - this.#extra_rows;
            const unbounded_last_index = Math.ceil(bottom / this.#row_height) + this.#extra_rows - 1;
            const first_index = Math.max(0, unbounded_first_index);
            const last_index = Math.min(this.#number_of_rows - 1, unbounded_last_index);
            const difference = unbounded_first_index - this.#unbounded_first_index;

            offset_element.style.transform = `translateY(${first_index * this.#row_height}px)`;
            this.#unbounded_first_index = unbounded_first_index;

            if (refresh || Math.abs(difference) >= this.#rows.length) {
                this.#rows = [];
                for (let i = first_index; i <= last_index; i++) {
                    this.#rows.push({ index: i, row: this.#create_row(i) });
                }
                offset_element.replaceChildren(...this.#rows.map((x) => x.row.get_element()));
                return;
            }

            const number_of_visible_rows = 1 + last_index - first_index;

            if (difference > 0) {
                while (this.#rows.length > 0 && this.#rows[0].index < first_index) {
                    this.#rows.shift().row.get_element().remove();
                }
                const document_fragment = new DocumentFragment();
                while (this.#rows.length < number_of_visible_rows) {
                    const i = first_index + this.#rows.length;
                    const row = this.#create_row(i);
                    document_fragment.append(row.get_element());
                    this.#rows.push({ index: i, row });
                }
                offset_element.append(document_fragment);
            } else if (difference < 0) {
                while (this.#rows.length > 0 && this.#rows[this.#rows.length - 1].index > last_index) {
                    this.#rows.pop().row.get_element().remove();
                }
                const document_fragment = new DocumentFragment();
                while (this.#rows.length < number_of_visible_rows) {
                    const i = last_index - this.#rows.length;
                    const row = this.#create_row(i);
                    document_fragment.prepend(row.get_element());
                    this.#rows.unshift({ index: i, row });
                }
                offset_element.prepend(document_fragment);
            }
        };

        new ResizeObserver(() => {
            const example_row_element = this.#create_row(null).get_element();
            offset_element.append(example_row_element);
            this.#row_height = Math.ceil(example_row_element.offsetHeight);
            example_row_element.remove();
            rows_element.style.height = `${this.#row_height * this.#number_of_rows}px`;
            update_row_elements(true);
        }).observe(rows_container_element);

        rows_container_element.addEventListener("scroll", () => update_row_elements(false));
    }

    // Public methods

    update() {
        for (const row of this.#rows) this._get_arg_callback()(row.index, row.row);
        return this;
    }

    // Private methods

    #create_row(index) {
        return new QuillRow(
            { css: { height: index === null ? "auto" : `${this.#row_height}px` } },
            this.#create_callback(index)
        );
    }
}
