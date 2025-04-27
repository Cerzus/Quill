"use strict";

document.addEventListener("DOMContentLoaded", () => {
    Quill.init(document.body);

    const demo = Quill.show_demo().on_close(() => checkbox.set_checked(false));

    Quill.Panel("Hello, world!", { can_close: false }, [
        Quill.Text("This is some useful text."),
        (checkbox = Quill.Checkbox("Demo window", { checked: demo.is_open() }, (checked) =>
            checked ? demo.open() : demo.close()
        )),
    ]);

    create_game_boy_ui();
});
