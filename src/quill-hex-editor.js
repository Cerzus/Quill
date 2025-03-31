"use strict";

class QuillHexEditor extends QuillElement {
    #number_of_columns;
    #max_addr_length;
    #row_height;
    #read_callback;
    #data_size;

    constructor(min_height, number_of_columns, data_size, read_callback, ...args) {
        const max_addr_length = (data_size - 1).toString(16).length;

        super(
            `<div class="quill-hex-editor">
                <div class="quill-hex-editor-row">
                    <div>${Array(max_addr_length).fill("\xa0").join("")}</div>
                    <div class="quill-hex-editor-row-data">
                        ${Util.fill_array(
                            number_of_columns,
                            (i) => `<div class="quill-hex-editor-byte">
                                        +${i.toString(16)}
                                    </div>`
                        ).join("")}
                    </div>
                    <div>${Array(number_of_columns).fill("<div>\xa0</div>").join("")}</div>
                </div>
                <div class="quill-hex-editor-rows-container" style="height: ${+min_height}em;">
                    <div class="quill-hex-editor-rows"></div>
                </div>
            </div>`,
            [],
            ...args
        );
        this.#data_size = data_size;
        this.#read_callback = read_callback;
        this.#number_of_columns = number_of_columns;
        this.#max_addr_length = max_addr_length;
        this.rows = [];

        const header_row_element = this.get_element().querySelector(".quill-hex-editor-row");
        const rows_container_element = this.get_element().querySelector(".quill-hex-editor-rows-container");
        const rows_element = this.get_element().querySelector(".quill-hex-editor-rows");

        // Large list stuff
        const update_row_elements = () => {
            // initialization
            if (rows_element.offsetWidth === 0) {
                const style = getComputedStyle(header_row_element);
                const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
                const borderY = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
                this.#row_height = header_row_element.offsetHeight - paddingY - borderY;
                rows_element.style.height = `${this.#row_height * Math.ceil(data_size / this.#number_of_columns)}px`;
            }

            const scroll_top = rows_container_element.scrollTop;
            const offset_height = rows_container_element.offsetHeight;
            const first_index = Math.max(0, Math.floor(scroll_top / this.#row_height) - 0);
            this.foo = first_index;
            const last_index = Math.min(
                Math.ceil(this.#data_size / this.#number_of_columns) - 1,
                Math.ceil((scroll_top + offset_height) / this.#row_height) - 1 + 0
            );

            // TODO: Make more efficient than removing all and adding all new ones back.
            if (false) {
                while (rows_element.firstChild) {
                    rows_element.removeChild(rows_element.lastChild);
                }
                const document_fragment = new DocumentFragment();
                for (let i = first_index; i <= last_index; i++) {
                    const row = this.#create_row_element(i * this.#number_of_columns);
                    if (i === first_index) row.style.marginTop = `${i * this.#row_height}px`;
                    document_fragment.append(row);
                }
                rows_element.append(document_fragment);
            } else {
                if (this.rows.length > 0) this.rows[0].row_element.removeAttribute("style");
                // Remove from the start
                while (this.rows.length > 0 && this.rows[0].index < first_index) {
                    rows_element.removeChild(this.rows[0].row_element);
                    this.rows.shift();
                }
                // Remove from the end
                while (this.rows.length > 0 && this.rows[this.rows.length - 1].index > last_index) {
                    rows_element.removeChild(this.rows[this.rows.length - 1].row_element);
                    this.rows.pop();
                }
                // Add to the end
                const document_fragment = new DocumentFragment();
                const foo = this.rows.length > 0 ? this.rows[this.rows.length - 1].index + 1 : 0;
                for (let i = Math.max(first_index, foo); i <= last_index; i++) {
                    const row_element = this.#create_row_element(i * this.#number_of_columns);
                    document_fragment.append(row_element);
                    this.rows.push({ index: i, row_element });
                }
                rows_element.append(document_fragment);
                // Add to the start
                const document_fragment2 = new DocumentFragment();
                const bar = this.rows.length > 0 ? this.rows[0].index - 1 : 0;
                for (let i = Math.min(last_index, bar); i >= first_index; i--) {
                    const row_element = this.#create_row_element(i * this.#number_of_columns);
                    document_fragment2.prepend(row_element);
                    this.rows.unshift({ index: i, row_element });
                }
                rows_element.prepend(document_fragment2);
                //
                this.rows[0].row_element.style.marginTop = `${first_index * this.#row_height}px`;
            }
        };
        new ResizeObserver(() => {
            update_row_elements();
        }).observe(rows_container_element);
        rows_container_element.addEventListener("scroll", update_row_elements);

        //

        header_row_element.addEventListener("mouseover", (e) => {
            if (e.target.classList.contains("quill-hex-editor-byte")) {
                this.#set_hovered_column(Array.from(e.target.parentNode.children).indexOf(e.target));
            }
        });
        header_row_element.addEventListener("mouseout", () => this.#set_hovered_column(-1));
        header_row_element.addEventListener("mouseleave", () => this.#set_hovered_column(-1));

        rows_element.addEventListener("mouseover", (e) => {
            if (e.target.classList.contains("quill-hex-editor-byte")) {
                this.#set_hovered_column(Array.from(e.target.parentNode.children).indexOf(e.target));
            }
        });
        rows_element.addEventListener("mouseout", () => this.#set_hovered_column(-1));
        rows_element.addEventListener("mouseleave", () => this.#set_hovered_column(-1));
    }

    #set_hovered_column(n) {
        return this.get_element().setAttribute("data-hovered-column", n);
    }

    #create_row_element(address) {
        const data = Array(this.#number_of_columns)
            .fill()
            .map((_, i) => (address + i < this.#data_size ? this.#read_callback(address + i) : -1));
        return Util.element_from_html(
            `<div class="quill-hex-editor-row">
                <div class="quill-hex-editor-row-address">
                    ${address.toString(16).padStart(this.#max_addr_length, 0)}
                </div>
                <!--<div class="quill-hex-editor-row-data">${this.#create_row_data_html(data).join("")}</div>-->
                <div class="quill-hex-editor-row-ascii">${this.create_row_ascii_html(data).join("")}</div>
            </div>`
        );
    }

    #create_row_data_html(data) {
        return data.map((x) =>
            x < 0 || x >= 0
                ? `<div>\xa0\xa0</div>`
                : `<input class="quill-hex-editor-byte"
                      type="text"
                      size="1"
                      maxlength="2"
                      value="${x.toString(16).padStart(2, 0)}"
                   />`
        );
    }

    create_row_ascii_html(data) {
        return data.map((x) =>
            x < 0 || x >= 0
                ? `<div>\xa0</div>`
                : `<div class="quill-hex-editor-byte">
                       ${String.fromCharCode(x >= 32 && x < 127 ? x : 46).replaceAll(/\s/g, "\xa0")}
                   </div>`
        );
    }
}
