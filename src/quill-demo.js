/* 
    This demo deliberately does not use strict mode, to keep variables local for clarity of the examples.
*/

function get_style_editor() {
    const Q = Quill;

    return Q.Wrapper([
        Q.SeparatorText("General"),
        Q.Dropdown("Select preset", (selected) => Q.set_style_config(QuillConfig.presets[selected]), [
            Q.DropdownOptions({ quill_dark: "Quill dark", quill_light: "Quill light", imgui: "ImGui" }),
        ]).set_selected("imgui"),
        Q.SeparatorText("Details"),
        Q.Tabs([
            Q.Tab("Fonts", [
                ...Q.get_font_names().map((property) =>
                    Q.InputText(
                        (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                        { value: Q.get_style_font(property) },
                        (value) => Q.set_style_font(property, value)
                    )
                ),
            ]),
            Q.Tab("Colors", [
                ...Q.get_color_names().map((property) =>
                    Q.ColorPicker(
                        (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                        { value: Q.get_style_color(property).to_hex() },
                        (value) => Q.set_style_color(property, value)
                    )
                ),
            ]),
            Q.Tab("Sizes", [
                ...Q.get_size_names().map((property) =>
                    (Q.get_style_size(property) instanceof Array ? Q.SliderInteger2 : Q.SliderInteger)(
                        (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                        { min: 0, max: 20, value: Q.get_style_size(property) },
                        (value) => Q.set_style_size(property, value)
                    )
                ),
            ]),
            Q.Tab("Flags", [
                ...Q.get_flag_names().map((property) => {
                    if (Q.get_style_flag_options(property)[0] === false && Q.get_style_flag_options(property)[1] === true) {
                        return Q.Checkbox(
                            (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                            { checked: Q.get_style_flag(property) },
                            (checked) => Q.set_style_flag(property, checked)
                        );
                    } else {
                        return Q.Dropdown(
                            (property.charAt(0).toUpperCase() + property.slice(1)).replaceAll("_", " "),
                            { selected: Q.get_style_flag(property) },
                            (selected) => Q.set_style_flag(property, selected),
                            Q.DropdownOptions(Q.get_style_flag_values(property))
                        );
                    }
                }),
            ]),
        ]),
    ]);
}

function quill_show_demo() {
    const Q = Quill;

    let recent = null;

    const hex_editor_data = new Uint8Array(1000);
    for (let i = 0; i < hex_editor_data.length; i++) {
        const value = Math.random();
        hex_editor_data[i] = value < 0.5 ? value * 512 : 0;
    }

    Q.Panel("Panel 3", { closed: true }, [
        Q.CollapsingHeader("Take a look, why don't you?", [
            Q.Tree("It's in here", [
                Q.HexEditor(
                    0x050,
                    513,
                    (i) => hex_editor_data[i],
                    {
                        number_of_columns: 8,
                        show_ascii: false,
                        grey_out_zeroes: false,
                        uppercase_hex: true,
                    },
                    (i, v) => (hex_editor_data[i] = v)
                ),
            ]),
        ]),
        Q.MenuBar([Q.MenuItem("HMM", { ctrl_key: "H" }, (element, e) => console.log("Ctrl+H", element, e))]),
    ]);

    Q.Panel("Style editor", { closed: true }, get_style_editor());

    return (demo_panel = Q.Panel("Quill Demo", { closed: false }, [
        show_collapsing_header_configuration(),
        show_collapsing_header_window_options(),
        show_collapsing_header_elements(true),
        show_collapsing_header_popups_and_modals(),
        show_collapsing_header_tables(),
        show_menu_bar(),
    ]));

    function show_collapsing_header_configuration(expanded) {
        return Q.CollapsingHeader("Configuration", { expanded }, [
            Q.Tree("Style", [
                Q.InfoTooltip("The same contents can be accessed in the menu under [Tools] -> [Style editor]"),
                get_style_editor(),
                // Q.Separator(),
            ]),
        ]);
    }

    function show_collapsing_header_window_options(expanded) {
        return Q.CollapsingHeader("Window options", { expanded }, [
            Q.Table([
                Q.TableRow([
                    Q.TableCell(Q.Checkbox("Has title bar", { checked: true }, (c) => demo_panel.set_has_title_bar(c))),
                    Q.TableCell(Q.Checkbox("Has menu bar", { checked: true }, (c) => demo_panel.set_has_menu_bar(c))),
                    Q.TableCell(Q.Checkbox("Can move", { checked: true }, (c) => demo_panel.set_can_move(c))),
                ]),
                Q.TableRow([
                    Q.TableCell(Q.Checkbox("Can resize", { checked: true }, (c) => demo_panel.set_can_resize(c))),
                    Q.TableCell(Q.Checkbox("Can close", { checked: true }, (c) => demo_panel.set_can_close(c))),
                ]),
            ]),
        ]);
    }

    function show_collapsing_header_elements(expanded) {
        return Q.CollapsingHeader("Elements", { expanded }, [
            show_tree_basic(),
            show_tree_trees(),
            show_tree_collapsing_headers(),
            show_tree_text(),
            show_tree_dropdowns(),
            show_tree_tabs(),
            show_tree_plotting(),
            show_tree_progress_bars(),
            show_tree_data_types(),
            show_tree_multi_component_elements(),
        ]);

        function show_tree_basic(expanded) {
            return Q.Tree("Basic", { expanded }, [
                Q.SeparatorText("General"),
                Q.Row([
                    Q.Button("Button", () => (text.is_hidden() ? text.show() : text.hide())),
                    (text = Q.Text("Thanks for clicking me!")).hide(),
                ]),
                Q.Checkbox("Checkbox").set_checked(true),
                Q.RadioButtons([Q.RadioButton("Radio a", 0), Q.RadioButton("Radio b", 1), Q.RadioButton("Radio c", 2)]),
                Q.Row(
                    Q.fill_array(7, (i) =>
                        Q.Button("Click", {
                            colors: {
                                input: Q.Color(i * 10, 0, 60 - i * 10),
                                input_hovered: Q.Color(i * 30, 255, 180 - i * 30),
                                button: Q.Color(i * 30, 60, 240 - i * 40),
                                button_hovered: Q.Color(i * 30, 120, 240 - i * 40),
                            },
                        })
                    )
                ),
                // // Use AlignTextToFramePadding() to align text baseline to the baseline of framed widgets elements
                // // (otherwise a Text+SameLine+Button sequence will have the text a little too high by default!)
                // // See 'Demo.Layout.Text Baseline Alignment' for details.
                // Q.AlignTextToFramePadding();
                // Q.Text("Hold to repeat:");
                // Q.SameLine();
                // const counter = STATIC(UNIQUE("counter#26102dc6"), 0);
                // const spacing = Q.GetStyle().ItemInnerSpacing.x;
                // Q.PushButtonRepeat(true);
                // if (Q.ArrowButton("##left", Q.Dir.Left)) {
                //     counter.value--;
                // }
                // Q.SameLine(0.0, spacing);
                // if (Q.ArrowButton("##right", Q.Dir.Right)) {
                //     counter.value++;
                // }
                // Q.PopButtonRepeat();
                // Q.SameLine();
                // Q.Text(`${counter.value}`);
                Q.Button("Tooltip").set_tooltip("I am a tooltip"),
                // Q.LabelText("label", "Value"),
                Q.SeparatorText("Inputs"),
                Q.Row([
                    Q.Dropdown("Dropdown", Q.DropdownOptions(["AAAA", "BBBB", "CCCC", "DDDD", "EEEE", "FFFF"])),
                    Q.InfoTooltip(
                        `Refer to the "Dropdowns" section below for an explanation of how to use the Dropdown API.`
                    ),
                ]),
                Q.InputText("Input text", { value: "Hello, world!" }, (value) => console.log(value)),
                Q.InputText("Input text with placeholder", { placeholder: "Type something" }, (value) => console.log(value)),
                Q.InputInteger("Input integer", { value: 123 }, (value) => console.log(value)),
                Q.InputFloat("Input float", { value: 0.5 }, (value) => console.log(value)),
                Q.DragInteger("Drag integer", { value: 50 }, (value) => console.log(value)),
                Q.DragInteger("Drag integer bounded", { value: 42, min: 0, max: 100, suffix: "%" }, (value) =>
                    console.log(value)
                ),
                Q.DragFloat("Drag float", { step: 0.005, value: 1 }, (value) => console.log(value)).set_value(1),
                Q.DragFloat("Drag float with suffix", { step: 0.0001, suffix: "ns", value: 0.0067 }, (value) =>
                    console.log(value)
                ),
                Q.SliderInteger("Slider integer", { min: -1, max: 3 }, (value) => console.log(value)).set_value(0),
                Q.SliderFloat("Slider float with prefix", { prefix: "ratio = ", value: 0.123, step: 0.001 }, (value) =>
                    console.log(value)
                ),
                Q.SliderInteger("Slider integer with suffix", { suffix: "°", value: 0, min: -360, max: +360 }, (value) =>
                    console.log(value)
                ),
            ]);
        }

        function show_tree_trees(expanded) {
            return Q.Tree("Trees", { expanded }, [
                Q.Tree(
                    "Basic trees",
                    Q.fill_array(5, (i) =>
                        Q.Tree(`Child ${i}`, { expanded: i === 0 }, [Q.Row([Q.Text("blah blah"), Q.Button("button")])])
                    )
                ),
            ]);
        }

        function show_tree_collapsing_headers(expanded) {
            return Q.Tree("Collapsing headers", { expanded }, [
                (checkbox = Q.Checkbox("Show 2nd header", { checked: true }, (checked) =>
                    checked ? header.show() : header.hide()
                )),
                Q.CollapsingHeader(
                    "Header",
                    Q.fill_array(5, (i) => Q.Text(`Some content ${i}`))
                ),
                (header = Q.CollapsingHeader(
                    "Header with a close button",
                    { closeable: true },
                    Q.fill_array(5, (i) => Q.InputText(`Some content ${i}`))
                )).on_close(() => checkbox.set_checked(false)),
            ]);
        }

        function show_tree_text(expanded) {
            return Q.Tree("Text", { expanded }, [
                Q.Tree("Colorful text", [
                    Q.Text("Pink", { colors: { text: Q.Color(255, 0, 255) } }),
                    Q.Text("Yellow", { colors: { text: Q.Color(255, 255, 0) } }),
                    Q.Text("Muted", { muted: true }),
                ]),
                Q.Tree("Text wrapping", [
                    Q.Text(
                        `This text should automatically wrap on the edge of the window. Here, the wrapping is enabled by enabling the "wrap_text" flag manually.`,
                        { flags: { wrap_text: true } }
                    ),
                    Q.TextWrapped(`Here, the wrapping is enabled by using "Quill.TextWrapped" in stead of "Quill.Text".`),
                ]),
                Q.Tree("UTF-8 text", [
                    Q.InfoTooltip(
                        `If this text does not render correctly, you may need to add a <meta charset="utf-8"> tag to the page.`
                    ),
                    Q.Text("Hiragana: かきくけこ (kakikukeko)"),
                    Q.Text("Kanjis: 日本語 (nihongo)"),
                ]),
            ]);
        }

        function show_tree_dropdowns(expanded) {
            return Q.Tree("Dropdowns", { expanded }, [
                Q.Row([
                    Q.Dropdown(
                        (selected) => console.log(selected),
                        [Q.DropdownOptions(["AAAA", "BBBB", "CCCC", "DDDD", "EEEE", "FFFF", "GGGG", "HHHH"])]
                    ),
                    Q.InfoTooltip("Without a label"),
                ]),
                Q.Dropdown("With values", { selected: "Option 3" }, (selected) => console.log(selected), [
                    Q.DropdownOptions([...Q.fill_array(5, (i) => `Option ${i + 1}`)]),
                ]),
                Q.Dropdown("With keys and values", (selected) => console.log(selected), [
                    Q.DropdownOptions({ alice: "aaa", 123: "bbb", cool: "ccc" }),
                ]).set_selected("cool"),
                Q.Dropdown("With option groups", (selected) => console.log(selected), [
                    Q.DropdownOptions("Group 1", { alice: "aaa", 123: "bbb", cool: "ccc" }),
                    Q.DropdownOptions(
                        "Group 2",
                        Q.fill_array(5, (i) => `Option ${i}`)
                    ),
                ]),
            ]);
        }

        function show_tree_tabs(expanded) {
            return Q.Tree("Tabs", { expanded }, [
                Q.Tree("Basic", [
                    Q.Tabs([
                        Q.Tab("Avocado", Q.Text("This is the Avocado tab!\nblah blah blah blah blah")),
                        Q.Tab("Broccoli", Q.Text("This is the Broccoli tab!\nblah blah blah blah blah")),
                        Q.Tab("Cucumber", Q.Text("This is the Cucumber tab!\nblah blah blah blah blah")),
                    ]),
                    Q.Separator(),
                ]),
            ]);
        }

        function show_tree_plotting(expanded) {
            const arr = [0.6, 0.1, 1.0, 0.5, 0.92, 0.1, 0.2];

            let animate = true;
            const values = new Array(90).fill(0);
            let values_offset = 0;
            let phase = 0;

            requestAnimationFrame(function moi() {
                if (animate) {
                    values[values_offset] = Math.cos(phase);
                    values_offset = (values_offset + 1) % values.length;
                    phase += 0.1 * values_offset;
                    plot_lines_2.set_values_offset(values_offset);
                    // Plots can display overlay texts
                    // (in this example, we will display an average value)
                    const average = values.reduce((acc, cur) => acc + cur, 0) / values.length;
                    plot_lines_2.set_overlay_text(`avg ${average.toFixed(6)}`);
                }
                requestAnimationFrame(moi);
            });

            let func_type = "Sin";
            let display_count = 70;
            // Use functions to generate output
            // FIXME: This is rather awkward because current plot API only pass in indices.
            // We probably want an API passing floats and user provide sample rate/count.
            const functions = {
                Sin: (i) => Math.sin(i * 0.1),
                Saw: (i) => (i & 1 ? 1 : -1),
            };
            let func = functions[func_type];

            return Q.Tree("Plotting", { expanded }, [
                Q.Checkbox("Animate", { checked: animate }, (checked) => (animate = checked)),
                Q.Row([Q.PlotLines({ values_getter: (i) => arr[i], values_count: arr.length }), Q.Text("Frame Times")]),
                Q.Row([
                    Q.PlotHistogram({
                        values_getter: (i) => arr[i],
                        values_count: arr.length,
                        scale_min: 0,
                        scale_max: 1,
                        height: 80,
                    }),
                    Q.Text("Histogram"),
                ]),
                Q.Row([
                    (plot_lines_2 = Q.PlotLines({
                        values_getter: (i) => values[i],
                        values_count: values.length,
                        overlay_text: `avg ${(0).toFixed(6)}`,
                        scale_min: -1,
                        scale_max: 1,
                        height: 80,
                    })),
                    Q.Text("Lines"),
                ]),
                Q.SeparatorText("Functions"),
                Q.Row([
                    Q.Dropdown(
                        "Function",
                        { selected: func_type },
                        (selected) => {
                            func_type = selected;
                            func = functions[func_type];
                            plot_lines_1.set_values_getter(func);
                            plot_histogram_1.set_values_getter(func);
                        },
                        [Q.DropdownOptions(["Sin", "Saw"])]
                    ),
                    Q.SliderInteger("Sample count", { min: 2, max: 400, value: display_count }, (value) => {
                        display_count = value;
                        plot_lines_1.set_values_count(display_count);
                        plot_histogram_1.set_values_count(display_count);
                    }),
                ]),
                Q.Row([
                    (plot_lines_1 = Q.PlotLines({
                        values_getter: func,
                        values_count: display_count,
                        scale_min: -1,
                        scale_max: 1,
                        height: 80,
                    })),
                    Q.Text("Lines"),
                ]),
                Q.Row([
                    (plot_histogram_1 = Q.PlotHistogram({
                        values_getter: func,
                        values_count: display_count,
                        scale_min: -1,
                        scale_max: 1,
                        height: 80,
                    })),
                    Q.Text("Histogram"),
                ]),
            ]);
        }

        function show_tree_progress_bars(expanded) {
            let progress = 0;
            let progress_dir = 1;

            requestAnimationFrame(function moi() {
                progress += (progress_dir * 0.4 * 1) / 60;
                if (progress >= +1.1) {
                    progress = +1.1;
                    progress_dir *= -1.0;
                }
                if (progress <= -0.1) {
                    progress = -0.1;
                    progress_dir *= -1.0;
                }
                progress_bar_1.set_fraction(progress);

                const progress_saturated = Math.min(Math.max(0, progress), 1);
                const buf = `${Math.floor(progress_saturated * 1753)}/${1753}`;
                progress_bar_2.set_fraction(progress).set_overlay_text(buf);
                requestAnimationFrame(moi);
            });

            return Q.Tree("Progress Bars", { expanded }, [
                Q.Row([(progress_bar_1 = Q.ProgressBar({ fraction: progress })), Q.Text("Progress Bar")]),
                Q.Row([(progress_bar_2 = Q.ProgressBar({ fraction: progress, overlay_text: "0/1753" }))]),
            ]);
        }

        function show_tree_data_types(expanded) {
            const values_s = [127, 32767, -1];
            const values_u = [255, 65535];
            const s8_inputs = [];
            const u8_inputs = [];
            const s16_inputs = [];
            const u16_inputs = [];
            const s32_inputs = [];
            const update_s8_inputs = (value) => s8_inputs.forEach((x) => x.set_value(value));
            const update_u8_inputs = (value) => u8_inputs.forEach((x) => x.set_value(value));
            const update_s16_inputs = (value) => s16_inputs.forEach((x) => x.set_value(value));
            const update_u16_inputs = (value) => u16_inputs.forEach((x) => x.set_value(value));
            const update_s32_inputs = (value) => s32_inputs.forEach((x) => x.set_value(value));
            return Q.Tree("Data types", { expanded }, [
                Q.SeparatorText("Inputs (decimal)"),
                (s8_inputs[0] = Q.InputS8("InputS8", { value: values_s[0] }, update_s8_inputs)),
                (u8_inputs[0] = Q.InputU8("InputU8", { value: values_u[0] }, update_u8_inputs)),
                (s16_inputs[0] = Q.InputS16("InputS16", { value: values_s[1] }, update_s16_inputs)),
                (u16_inputs[0] = Q.InputU16("InputU16", { value: values_u[1] }, update_u16_inputs)),
                (s32_inputs[0] = Q.InputS32("InputS32", { value: values_s[2] }, update_s32_inputs)),
                Q.SeparatorText("Inputs (hexadecimal)"),
                (s8_inputs[1] = Q.InputHex("InputHex (s8)", { value: values_s[0], length: 2 }, update_s8_inputs)),
                (u8_inputs[1] = Q.InputHex("InputHex (u8)", { value: values_u[0], length: 2 }, update_u8_inputs)),
                (s16_inputs[1] = Q.InputHex("InputHex (s16)", { value: values_s[1], length: 4 }, update_s16_inputs)),
                (u16_inputs[1] = Q.InputHex("InputHex (u16)", { value: values_u[1], length: 4 }, update_u16_inputs)),
                (s32_inputs[1] = Q.InputHex("InputHex (s32)", { value: values_s[2], length: 8 }, update_s32_inputs)),
                Q.SeparatorText("Inputs (binary)"),
                (s8_inputs[2] = Q.InputBin("InputBin (s8)", { value: values_s[0], length: 8 }, update_s8_inputs)),
                (u8_inputs[2] = Q.InputBin("InputBin (u8)", { value: values_u[0], length: 8 }, update_u8_inputs)),
                (s16_inputs[2] = Q.InputBin("InputBin (s16)", { value: values_s[1], length: 16 }, update_s16_inputs)),
                (u16_inputs[2] = Q.InputBin("InputBin (u16)", { value: values_u[1], length: 16 }, update_u16_inputs)),
                (s32_inputs[2] = Q.InputBin("InputBin (s32)", { value: values_s[2], length: 32 }, update_s32_inputs)),
                Q.SeparatorText("Sliders"),
                (s8_inputs[3] = Q.SliderS8("SliderS8", { value: values_s[0] }, update_s8_inputs)),
                (u8_inputs[3] = Q.SliderU8("SliderU8", { value: values_u[0] }, update_u8_inputs)),
                (s16_inputs[3] = Q.SliderS16("SliderS16", { value: values_s[1] }, update_s16_inputs)),
                (u16_inputs[3] = Q.SliderU16("SliderU16", { value: values_u[1] }, update_u16_inputs)),
                Q.SeparatorText("Sliders (reverse)"),
                (s8_inputs[4] = Q.SliderS8("SliderS8 reverse", { value: values_s[0], reverse: true }, update_s8_inputs)),
                (u8_inputs[4] = Q.SliderU8("SliderU8 reverse", { value: values_u[0], reverse: true }, update_u8_inputs)),
                (s16_inputs[4] = Q.SliderS16("SliderS16 reverse", { value: values_s[1], reverse: true }, update_s16_inputs)),
                (u16_inputs[4] = Q.SliderU16("SliderU16 reverse", { value: values_u[1], reverse: true }, update_u16_inputs)),
                Q.SeparatorText("Drags"),
                (s8_inputs[5] = Q.DragS8("DragS8", { value: values_s[0] }, update_s8_inputs)),
                (u8_inputs[5] = Q.DragU8("DragU8", { value: values_u[0], suffix: " ms" }, update_u8_inputs)),
                (s16_inputs[5] = Q.DragS16("DragS16", { value: values_s[1] }, update_s16_inputs)),
                (u16_inputs[5] = Q.DragU16("DragU16", { value: values_u[1], suffix: " ms" }, update_u16_inputs)),
            ]);
        }

        function show_tree_multi_component_elements(expanded) {
            const vec4f = [0.1, 0.2, 0.3, 0.44];
            const vec4i = [1, 5, 100, 255];
            const config_float = { value: vec4f, min: 0, max: 1, step: 0.01 };
            const config_integer = { value: vec4i, min: 0, max: 255, step: 1 };
            const float_inputs = [];
            const integer_inputs = [];
            const update_float_inputs = (value) => float_inputs.forEach((x) => x.set_value(value));
            const update_integer_inputs = (value) => integer_inputs.forEach((x) => x.set_value(value));
            return Q.Tree("Multi-component elements", { expanded }, [
                Q.SeparatorText("2-wide"),
                (float_inputs[0] = Q.InputFloat2("input float2", { value: vec4f }, update_float_inputs)),
                (integer_inputs[0] = Q.InputInteger2("input int2", { value: vec4i }, update_integer_inputs)),
                (float_inputs[3] = Q.DragFloat2("drag float2", config_float, update_float_inputs)),
                (integer_inputs[3] = Q.DragInteger2("drag int2", config_integer, update_integer_inputs)),
                (float_inputs[6] = Q.SliderFloat2("slider float2", config_float, update_float_inputs)),
                (integer_inputs[6] = Q.SliderInteger2("slider int2", config_integer, update_integer_inputs)),
                Q.SeparatorText("3-wide"),
                (float_inputs[1] = Q.InputFloat3("input float3", { value: vec4f }, update_float_inputs)),
                (integer_inputs[1] = Q.InputInteger3("input int3", { value: vec4i }, update_integer_inputs)),
                (float_inputs[4] = Q.DragFloat3("drag float3", config_float, update_float_inputs)),
                (integer_inputs[4] = Q.DragInteger3("drag int3", config_integer, update_integer_inputs)),
                (float_inputs[7] = Q.SliderFloat3("slider float3", config_float, update_float_inputs)),
                (integer_inputs[7] = Q.SliderInteger3("slider int3", config_integer, update_integer_inputs)),
                Q.SeparatorText("4-wide"),
                (float_inputs[2] = Q.InputFloat4("input float4", { value: vec4f }, update_float_inputs)),
                (integer_inputs[2] = Q.InputInteger4("input int4", { value: vec4i }, update_integer_inputs)),
                (float_inputs[5] = Q.DragFloat4("drag float4", config_float, update_float_inputs)),
                (integer_inputs[5] = Q.DragInteger4("drag int4", config_integer, update_integer_inputs)),
                (float_inputs[8] = Q.SliderFloat4("slider float4", config_float, update_float_inputs)),
                (integer_inputs[8] = Q.SliderInteger4("slider int4", config_integer, update_integer_inputs)),
            ]);
        }
    }

    function show_collapsing_header_popups_and_modals(expanded) {
        return Q.CollapsingHeader("Popups & Modals", { expanded }, [show_tree_popups(), show_tree_modals()]);

        function show_tree_popups(expanded) {
            return Q.Tree("Popups", { expanded }, [
                Q.TextWrapped(
                    "When a popup is active, it inhibits interacting with windows that are behind the popup.\nClicking outside the popup closes it."
                ),
                //     const selected_fish = STATIC(UNIQUE("selected_fish#ba576008"), -1);
                //     const names = ["Bream", "Haddock", "Mackerel", "Pollock", "Tilefish"];
                //     const toggles = STATIC_ARRAY(5, UNIQUE("toggles#b168bdf3"), [true, false, false, false, false]);
                //     // Simple selection popup (if you want to show the current selection inside the Button itself,
                //     // you may want to build a string using the "###" operator to preserve a constant ID with a variable label)
                Q.Row([
                    Q.Button("Select...", (_, e) =>
                        Q.Popup("my_select_popup", e.pageX, e.pageY, [
                            Q.Text("my_select_popup"),
                            Q.Text("Aquarium"),
                            //         Q.Separator();
                            //         for (let i = 0; i < Q.ARRAYSIZE(names); i++)
                            //             if (Q.Selectable(names[i]))
                            //                 selected_fish.value = i;
                        ])
                    ),
                    Q.Text("<None>"),
                    //     Q.TextUnformatted(selected_fish.value === -1 ? "<None>" : names[selected_fish.value]);
                ]),
                //     // Showing a menu with toggles
                Q.Button("Toggle...", (_, e) =>
                    Q.Popup("my_toggle_popup", e.pageX, e.pageY, [
                        Q.Text("my_toggle_popup"),
                        //         for (let i = 0; i < Q.ARRAYSIZE(names); i++)
                        //             Q.MenuItem(names[i], "", toggles.access(i));
                        //         if (Q.BeginMenu("Sub-menu")) {
                        //             Q.MenuItem("Click me");
                        //             Q.EndMenu();
                        //         }
                        //         Q.Separator();
                        //         Q.Text("Tooltip here");
                        //         if (Q.IsItemHovered())
                        //             Q.SetTooltip("I am a tooltip over a popup");
                        //         if (Q.Button("Stacked Popup"))
                        //             Q.OpenPopup("another popup");
                        //         if (Q.BeginPopup("another popup")) {
                        //             for (let i = 0; i < Q.ARRAYSIZE(names); i++)
                        //                 Q.MenuItem(names[i], "", toggles.access(i));
                        //             if (Q.BeginMenu("Sub-menu")) {
                        //                 Q.MenuItem("Click me");
                        //                 if (Q.Button("Stacked Popup"))
                        //                     Q.OpenPopup("another popup");
                        //                 if (Q.BeginPopup("another popup")) {
                        //                     Q.Text("I am the last one here.");
                        //                     Q.EndPopup();
                        //                 }
                        //                 Q.EndMenu();
                        //             }
                        //             Q.EndPopup();
                        //         }
                    ])
                ),
                //     // Call the more complete ShowExampleMenuFile which we use in various places of this demo
                Q.Button("With a menu...", (_, e) =>
                    Q.Popup("my_file_popup", e.pageX, e.pageY, [
                        Q.Text("my_file_popup"),
                        //     if (Q.BeginPopup("my_file_popup", Q.WindowFlags.MenuBar)) {
                        //         if (Q.BeginMenuBar()) {
                        //             if (Q.BeginMenu("File")) {
                        //                 ShowExampleMenuFile();
                        //                 Q.EndMenu();
                        //             }
                        //             if (Q.BeginMenu("Edit")) {
                        //                 Q.MenuItem("Dummy");
                        //                 Q.EndMenu();
                        //             }
                        //             Q.EndMenuBar();
                        //         }
                        //         Q.Text("Hello from popup!");
                        //         Q.Button("This is a dummy button..");
                        //     }
                        // }
                    ])
                ),
            ]);
        }

        function show_tree_modals(expanded) {
            return Q.Tree("Modals", { expanded }, [
                Q.TextWrapped("Modals are like Panels but the user cannot interact outside of them before closing them."),
                Q.Button("Delete...", () => {
                    const modal = Q.Modal("Delete?", [
                        Q.Text("All those beautiful files will be deleted.\nThis operation cannot be undone!"),
                        Q.Separator(),
                        Q.Checkbox("Don't ask me next time"),
                        Q.Row([Q.Button("OK", () => modal.close()), Q.Button("Cancel", () => modal.close())]),
                    ]);
                }),
                Q.Button("Stacked modals...", () => {
                    const modal = Q.Modal("Stacked 1", { can_close: false }, [
                        Q.MenuBar(Q.Menu("File", Q.MenuItem("Some menu item"))),
                        Q.Text("Hello from Stacked The First"),
                        Q.Button("Add another modal...", () => {
                            const modal = Q.Modal("Stacked 2", [
                                Q.Text("Hello from Stacked The Second!"),
                                Q.Button("Close", () => modal.close()),
                            ]);
                        }),
                        Q.Button("Close", () => modal.close()),
                    ]);
                }),
            ]);
        }
    }

    function show_collapsing_header_tables(expanded) {
        return Q.CollapsingHeader("Tables", { expanded }, [show_tree_basic(), show_tree_borders()]);

        function show_tree_basic(expanded) {
            return Q.Tree("Basic", { expanded }, [
                Q.InfoTooltip("This table is created with nested Quill.fill_array() calls."),
                Q.Table(Q.fill_array(4, (r) => Q.TableRow(Q.fill_array(3, (c) => Q.TableCell(`R:${r}, C:${c}`))))),
                Q.InfoTooltip("This table is created with Quill.fill_array() for the rows."),
                Q.Table(
                    Q.fill_array(4, (r) =>
                        Q.TableRow([Q.TableCell(`R:${r}`), Q.TableCell(`Some contents`), Q.TableCell(123.456)])
                    )
                ),
                Q.InfoTooltip("This table is created entirely by manually calling Quill.TableRow() and Quill.TableCell()."),
                Q.Table([
                    Q.TableRow([Q.TableCell(0), Q.TableCell(1), Q.TableCell(2)]),
                    Q.TableRow([Q.TableCell(3), Q.TableCell(4), Q.TableCell(5)]),
                    Q.TableRow([Q.TableCell(6), Q.TableCell(7), Q.TableCell(8)]),
                    Q.TableRow([Q.TableCell(9), Q.TableCell(10)]),
                ]),
            ]);
        }

        function show_tree_borders(expanded) {
            return Q.Tree("Borders, background", { expanded }, [
                (row_bg = Q.Checkbox("Row background", { checked: true }, (checked) =>
                    table.set_style_flag("table_row_bg", checked)
                )),
                Q.CheckboxTree("Borders", [
                    (horizontal = Q.CheckboxTree("Horizontal", [
                        Q.Checkbox("Outer", { checked: true }, (c) => table.set_style_flag("table_borders_outer_h", c)),
                        Q.Checkbox("Inner", { checked: true }, (c) => table.set_style_flag("table_borders_inner_h", c)),
                    ])),
                    (vertical = Q.CheckboxTree("Vertical", [
                        Q.Checkbox("Outer", { checked: true }, (c) => table.set_style_flag("table_borders_outer_v", c)),
                        Q.Checkbox("Inner", { checked: true }, (c) => table.set_style_flag("table_borders_inner_v", c)),
                    ])),
                    Q.Checkbox("Outer", { checked: true }, (checked) => {
                        table.set_style_flag("table_borders_outer_h", checked);
                        table.set_style_flag("table_borders_outer_v", checked);
                    }),
                    Q.Checkbox("Inner", { checked: true }, (checked) => {
                        table.set_style_flag("table_borders_inner_h", checked);
                        table.set_style_flag("table_borders_inner_v", checked);
                    }),
                ]),
                // Q.Row([
                //     Q.Text("Cell contents:"),
                //     Q.RadioButtons({ value: "text" }, (value) => console.log(value), [
                //         Q.RadioButton("Button", "button"),
                //         Q.RadioButton("Text", "text"),
                //     ]),
                // ]),
                Q.Checkbox("Display headers", (c) => (c ? table_header.show() : table_header.hide())).set_checked(true),
                (table = Q.Table(
                    {
                        flags: {
                            table_borders_outer_h: horizontal.get_children()[0].is_checked(),
                            table_borders_outer_v: vertical.get_children()[0].is_checked(),
                            table_borders_inner_h: horizontal.get_children()[1].is_checked(),
                            table_borders_inner_v: vertical.get_children()[1].is_checked(),
                            table_row_bg: row_bg.is_checked(),
                        },
                    },
                    [
                        (table_header = Q.TableHeaderRow({ hidden: false }, [
                            Q.TableHeaderCell("One"),
                            Q.TableHeaderCell("Two"),
                            Q.TableHeaderCell("Three"),
                        ])),
                        ...Q.fill_array(5, (r) =>
                            Q.TableRow(Q.fill_array(3, (c) => Q.TableCell(Q.Text(`Hello ${c},${r}`))))
                        ),
                    ]
                )),
            ]);
        }
    }

    function show_menu_bar() {
        return Q.MenuBar([
            Q.Menu("File", {}, () => {}, [
                Q.Menu("File", [Q.MenuItem("Load..."), Q.Separator(), (recent = Q.Menu("Recent"))]),
                Q.MenuItem("Load...", { ctrl_key: "o" }, () =>
                    Q.open_file_dialog({ multiple: true }, (files) => {
                        console.log("Load", files);
                        recent.get_children().forEach((child) => child.remove());
                        recent.add_children([...files].map((file) => Q.MenuItem(file.name)));
                    })
                ),
                Q.Menu("Recent", [
                    Q.MenuItem("1. some_file.txt"),
                    Q.MenuItem("2. Another file.txt"),
                    Q.MenuItem("3. .yup"),
                    Q.Separator(),
                    Q.Menu("Recent", [
                        Q.MenuItem("1. some_file.txt"),
                        Q.MenuItem("2. Another file.txt"),
                        Q.MenuItem("3. .yup"),
                        Q.MenuItem("Load..."),
                        Q.Menu("Recent", [
                            Q.MenuItem("1. some_file.txt"),
                            Q.MenuItem("2. Another file.txt"),
                            Q.MenuItem("3. .yup"),
                        ]),
                        Q.Separator(),
                        Q.MenuItem("Quit"),
                    ]),
                    Q.Separator(),
                    Q.MenuItem("Quit"),
                ]),
                Q.Separator(),
                Q.MenuItem("Quit", { checkable: true, checked: true, ctrl_key: "q" }, (element, e) => {
                    console.log("Quit", element.is_checked(), e);
                }),
            ]),
            Q.MenuItem("Cool"),
            Q.MenuItem("Beans", { checkable: true }),
            Q.Separator(),
            Q.Menu(
                "Tools",
                Q.Menu("File", [
                    Q.MenuItem("Load..."),
                    Q.Menu("Recent", [
                        Q.MenuItem("1. some_file.txt"),
                        Q.MenuItem("2. Another file.txt"),
                        Q.MenuItem("3. .yup"),
                    ]),
                    Q.Separator(),
                    Q.MenuItem("Quit"),
                ])
            ).add_children(
                Object.values(Q.get_panels())
                    .filter((panel) => panel.can_close())
                    .map((panel) => {
                        const name = panel.get_name();
                        const config = { checkable: true, checked: panel.is_open() };
                        const menu_item = Q.MenuItem(name, config, (element) => {
                            element.is_checked() ? panel.open() : panel.close();
                        });
                        panel.on_close(() => menu_item.set_checked(false));
                        return menu_item;
                    })
            ),
        ]);
    }
}
