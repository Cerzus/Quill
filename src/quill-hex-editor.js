"use strict";

class QuillHexEditor extends QuillNodeElement {
    #number_of_columns;
    #start_address;
    #end_address;
    #read_callback;
    #max_addr_length;
    #dynamic_rows;

    constructor(min_height, number_of_columns, start_address, data_size, read_callback, ...args) {
        const end_address = start_address + data_size;
        const max_addr_length = (end_address - 1).toString(16).length;

        super(
            `<div class="quill-hex-editor">
                <div class="quill-row">
                    <div class="quill-hex-editor-address" style="width: ${max_addr_length}ch;"></div>
                    <div class="quill-hex-editor-data">
                        ${Util.fill_array(
                            number_of_columns,
                            (i) =>
                                `<input disabled class="quill-hex-editor-byte" size="1" value=
                                    "+${i.toString(16)}"
                                />`
                        ).join("")}
                    </div>
                </div>
            </div>`,
            [],
            ...args
        );
        this.#number_of_columns = number_of_columns;
        this.#start_address = start_address;
        this.#end_address = end_address;
        this.#read_callback = read_callback;
        this.#max_addr_length = max_addr_length;
        this.#dynamic_rows = new QuillDynamicRows(
            Math.ceil((end_address - start_address) / number_of_columns),
            (index) => this.#create_row_element(index),
            (...args) => this.#update_row_element(...args)
        );

        const document_fragment = new DocumentFragment();
        document_fragment.append(
            this.#dynamic_rows.get_element(),
            // new QuillSeparator().get_element(),
            new QuillRow([
                new QuillButton("Options"),
                new QuillText(
                    `Range ${this.#format_address(this.#start_address)}` +
                        `...${this.#format_address(this.#end_address - 1)}`
                ),
                new QuillButton("", { css: { width: "100px" } }),
            ]).get_element()
        );
        this.get_element().append(document_fragment);

        const header_row_element = this.get_element().querySelector(".quill-row");
        header_row_element.addEventListener("mouseover", (e) => {
            if (e.target.classList.contains("quill-hex-editor-byte")) {
                this.#set_hovered_column(Array.from(e.target.parentNode.children).indexOf(e.target));
            }
        });
        header_row_element.addEventListener("mouseout", () => this.#set_hovered_column(-1));
        header_row_element.addEventListener("mouseleave", () => this.#set_hovered_column(-1));

        const rows_element = this.get_element().querySelector(".quill-dynamic-rows-list");
        rows_element.addEventListener("mouseover", (e) => {
            if (e.target.classList.contains("quill-hex-editor-byte")) {
                this.#set_hovered_column(Array.from(e.target.parentNode.children).indexOf(e.target));
            }
        });
        rows_element.addEventListener("mouseout", () => this.#set_hovered_column(-1));
        rows_element.addEventListener("mouseleave", () => this.#set_hovered_column(-1));
    }

    // Public methods

    update() {
        this.#dynamic_rows.update();
        return this;
    }

    // Private methods

    #to_hex(value) {
        return value.toString(16).padStart(2, 0);
    }
    #to_ascii(value) {
        return String.fromCharCode(value >= 32 && value < 127 ? value : 46).replaceAll(/\s/g, "\xa0");
    }
    #format_address(address) {
        return address.toString(16).padStart(this.#max_addr_length, 0);
    }
    #set_hovered_column(n) {
        this.get_element().setAttribute("data-hovered-column", n);
    }
    #address_and_data_from_index(index) {
        const address = index * this.#number_of_columns + this.#start_address;
        return {
            address,
            data: Array(this.#number_of_columns)
                .fill()
                .map((_, i) => (address + i < this.#end_address ? this.#read_callback(address + i) : -1)),
        };
    }
    #update_row_element(index, row) {
        const { data } = this.#address_and_data_from_index(index);
        const children_data = row.get_element().querySelector(".quill-hex-editor-data").children;
        const children_ascii = row.get_element().querySelector(".quill-hex-editor-ascii").children;
        for (const [i, value] of data.entries()) {
            const child_data = children_data[i];
            if (child_data.dataset.value !== value) {
                child_data.value = this.#to_hex(value);
                child_data.dataset.value = value;
                const child_ascii = children_ascii[i];
                child_ascii.dataset.value = child_ascii.firstChild.nodeValue = this.#to_ascii(value);
            }
        }
    }
    #create_row_element(index) {
        const { address, data } = this.#address_and_data_from_index(index);
        return [
            new QuillNodeElement(`<div class="quill-hex-editor-address">${this.#format_address(address)}</div>`),
            new QuillNodeElement(`<div class="quill-hex-editor-data">${this.#create_row_data_html(data)}</div>`),
            new QuillNodeElement(`<div class="quill-hex-editor-ascii">${this.#create_row_ascii_html(data)}</div>`),
        ];
    }
    #create_row_data_html(data) {
        return data
            .map((x) => {
                if (x < 0) {
                    return `<input class="quill-hex-editor-byte" 
                               size="1"
                               maxlength="2"
                               disabled />`;
                } else {
                    return `<input class="quill-hex-editor-byte" 
                               size="1"
                               maxlength="2"
                               data-value="${x}"
                               value="${this.#to_hex(x)}" />`;
                }
            })
            .join("");
    }
    #create_row_ascii_html(data) {
        return data
            .map((x) => {
                if (x < 0) {
                    return `<div class="quill-hex-editor-byte">\xa0</div>`;
                } else {
                    const ascii = this.#to_ascii(x);
                    return `<div class="quill-hex-editor-byte" data-value="${ascii}">${ascii}</div>`;
                }
            })
            .join("");
    }
}
