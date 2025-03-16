"use strict";

class QuillPanel extends QuillElement {
    constructor(title, children) {
        super(
            `<div class="quill-panel">
                <div class="quill-panel-title-bar">
                    ${title}
                </div>
                <div class="quill-panel-menu-bar-container"></div>
                <div class="quill-panel-content"></div>
                <table class="quill-panel-resizer">
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                </table>
            </div>`
        );
        this.add(children);
    }

    add_child(child) {
        const menu_bar_container_element = this.get_element().querySelector(".quill-panel-menu-bar-container");
        const content_element = this.get_element().querySelector(".quill-panel-content");
        if (child instanceof QuillMenuBar) {
            menu_bar_container_element.append(child.get_element());
        } else {
            content_element.append(child.get_element());
        }
    }

    get_position = () => ({
        top: this.get_element().offsetTop,
        left: this.get_element().offsetLeft,
    });
    get_size = () => ({
        width: this.get_element().offsetWidth,
        height: this.get_element().offsetHeight,
    });
    set_position(position) {
        this.get_element().style.top = `${position.top}px`;
        this.get_element().style.left = `${position.left}px`;
    }
    set_size(size) {
        this.get_element().style.width = `${size.width}px`;
        this.get_element().style.height = `${size.height}px`;
    }
    set_z_index(z_index) {
        this.get_element().style.zIndex = z_index;
    }
}
