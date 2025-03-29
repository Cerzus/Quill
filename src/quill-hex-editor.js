"use strict";

class QuillHexEditor extends QuillElement {
    #hovered_column = -1;
    #number_of_columns;
    #max_addr_length;
    #row_height;

    constructor(...args) {
        const number_of_columns = 16;
        const size = 0x10000;
        const max_addr_length = (size - 1).toString(16).length;

        super(
            `<div class="quill-hex-editor">
                <div class="quill-hex-editor-row">
                    <div>
                        ${Array(max_addr_length).fill("&nbsp;").join("")}
                    </div>

                    <div class="quill-hex-editor-row-data">
                        ${Array(number_of_columns)
                            .fill()
                            .map((_, i) => `<div class="bulba">+${i.toString(16)}</div>`)
                            .join("")}
                    </div>
                </div>

                <div class="quill-hex-editor-rows-container">
                    <div class="quill-hex-editor-rows"></div>
                </div>

                <div class="quill-hex-editor-data-editor">
                    [Data editor]
                </div>
            </div>`,
            [],
            ...args
        );
        this.#number_of_columns = number_of_columns;
        this.#max_addr_length = max_addr_length;

        const rows_container_element = this.get_element().querySelector(".quill-hex-editor-rows-container");
        const rows_element = this.get_element().querySelector(".quill-hex-editor-rows");

        // Large list stuff
        const foo = () => {
            // initialization
            if (rows_element.offsetWidth === 0) {
                rows_element.style.width = "";
                const row_element = this.#create_row_element(size - 1, Array(this.#number_of_columns).fill(0));
                row_element.style.position = "relative";
                rows_element.append(row_element);
                this.#row_height = row_element.offsetHeight;
                rows_element.style.width = `${rows_element.offsetWidth}px`;
                row_element.remove();
                rows_element.style.height = `${this.#row_height * Math.ceil(size / this.#number_of_columns)}px`;
            }

            const element = rows_container_element;
            const scroll_top = element.scrollTop;
            const offset_height = element.offsetHeight;

            const first_index = Math.floor(scroll_top / this.#row_height);
            const last_index = Math.ceil((scroll_top + offset_height) / this.#row_height) - 1;

            // remove all children
            while (rows_element.firstChild) {
                rows_element.removeChild(rows_element.lastChild);
            }

            for (let i = first_index; i <= last_index; i++) {
                const data = Array(this.#number_of_columns).fill(0);
                const row = this.#create_row_element(i * this.#number_of_columns, data);
                row.style.top = `${i * this.#row_height}px`;
                rows_element.append(row);
            }
        };
        new ResizeObserver(foo).observe(rows_container_element);
        rows_container_element.addEventListener("scroll", foo);

        //

        const header_row_element = this.get_element().querySelector(".quill-hex-editor-row");
        header_row_element.addEventListener("mouseover", (e) => {
            if (e.target.classList.contains("bulba")) {
                this.#set_hovered_column(Array.from(e.target.parentNode.children).indexOf(e.target));
            }
        });
        header_row_element.addEventListener("mouseout", () => this.#set_hovered_column(-1));
        header_row_element.addEventListener("mouseleave", () => this.#set_hovered_column(-1));

        // for (let i = 0; i < Math.floor(size / this.#number_of_columns); i++) {
        //     const data = Array(this.#number_of_columns)
        //         .fill()
        //         .map(() => {
        //             const r = Math.random();
        //             return r < 0.5 ? ~~(r * 512) : 0;
        //         });
        //     const row = this.#create_row_element(i * this.#number_of_columns, data);
        //     rows_element.append(row);
        // }

        rows_element.addEventListener("mouseover", (e) => {
            if (e.target.classList.contains("bulba")) {
                this.#set_hovered_column(Array.from(e.target.parentNode.children).indexOf(e.target));
            }
        });
        rows_element.addEventListener("mouseout", () => this.#set_hovered_column(-1));
        rows_element.addEventListener("mouseleave", () => this.#set_hovered_column(-1));
    }

    #create_row_element(address, data) {
        const row = Util.element_from_html(
            `<div class="quill-hex-editor-row">
                <div class="quill-hex-editor-row-address">${address
                    .toString(16)
                    .padStart(this.#max_addr_length, 0)}</div>

                <div class="quill-hex-editor-row-data">${data
                    .map(
                        (x) =>
                            `<input class="bulba" type="text" size="1" maxlength="2" value="${x
                                .toString(16)
                                .padStart(2, 0)}" />`
                    )
                    .join("")}</div>

                <div class="quill-hex-editor-row-ascii">${data
                    .map((x) => {
                        return `<div class="bulba">${String.fromCharCode(x >= 32 && x < 127 ? x : 46).replaceAll(
                            /\s/g,
                            "&nbsp;"
                        )}</div>`;
                    })
                    .join("")}</div>
            </div>`
        );
        return row;
    }

    #set_hovered_column = (n) => {
        this.get_element().setAttribute("data-hovered-column", (this.#hovered_column = n));
    };
}
