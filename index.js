"use strict";

document.addEventListener("DOMContentLoaded", () => {
    Quill.init(document.body);

    // new Quill.Panel("Panel");
    // new Quill.Panel("Panel", ["Hello, panel 2!"]);
    // new Quill.Panel("Panel", "Hello, panel 3!");
    // new Quill.Panel("Panel").add(["Hello, panel 4!"]);
    // new Quill.Panel("Panel").add("Hello, panel 5!");
    // new Quill.Panel("Panel", ["Foo", "Bar"]);
    // new Quill.Panel("Panel").add(["Gaz", "Lite"]);

    let tools = null;

    new Quill.Panel("Menu test", [
        new Quill.MenuBar([
            new Quill.Menu("File", [
                new Quill.MenuItem("Load...", () => console.log("Load")),
                new Quill.Menu("Recent", [
                    new Quill.MenuItem("1. some_file.txt"),
                    new Quill.MenuItem("2. Another file.txt"),
                    new Quill.MenuItem("3. .yup"),
                ]),
                new Quill.Separator(),
                new Quill.MenuItem("Quit"),
            ]),
            (tools = new Quill.Menu("Tools")),
            new Quill.MenuItem("Help"),
        ]),
    ]);

    tools.add([
        new Quill.Menu("File", [
            new Quill.MenuItem("Load..."),
            new Quill.Menu("Recent", [
                new Quill.MenuItem("1. some_file.txt"),
                new Quill.MenuItem("2. Another file.txt"),
                new Quill.MenuItem("3. .yup"),
            ]),
            new Quill.Separator(),
            new Quill.MenuItem("Quit"),
        ]),
        new Quill.MenuItem("Load..."),
        new Quill.Menu("Recent", [
            new Quill.MenuItem("1. some_file.txt"),
            new Quill.MenuItem("2. Another file.txt"),
            new Quill.MenuItem("3. .yup"),
            new Quill.Separator(),
            new Quill.Menu("Recent", [
                new Quill.MenuItem("1. some_file.txt"),
                new Quill.MenuItem("2. Another file.txt"),
                new Quill.MenuItem("3. .yup"),
                new Quill.MenuItem("Load..."),
                new Quill.Menu("Recent", [
                    new Quill.MenuItem("1. some_file.txt"),
                    new Quill.MenuItem("2. Another file.txt"),
                    new Quill.MenuItem("3. .yup"),
                ]),
                new Quill.Separator(),
                new Quill.MenuItem("Quit"),
            ]),
            new Quill.Separator(),
            new Quill.MenuItem("Quit"),
        ]),
        new Quill.Separator(),
        new Quill.MenuItem("Quit"),
    ]);
});
