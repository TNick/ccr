define(['./common_enhance',
        './tbtools',
        'tabber',
        'toastr',
        './ccr',
        'jquery',
        'domReady!'], function (comnEnh,
                                tbtools,
                                Tabber,
                                toastr,
                                ccr_singleton,
                                jquery,
                                document) {

    var itemeditor_tabber;

    var current_index = -1;
    var current_name = '';

    /**
      * Finds the index based on string identifier.
      */
    function tabIndex(tab_name) {
        var tab_index;
        switch (tab_name) {
        case 'vector':
            tab_index = 0;
            break;
        case 'text':
            tab_index = 1;
            break;
        case 'html':
            tab_index = 2;
            break;
        case 'image':
            tab_index = 3;
            break;
        default:
            tab_index = -1;
            break;
        }
        return tab_index;
    }

    function tabName(tab_idx) {
        var tab_name;
        switch (tab_idx) {
        case 0:
            tab_name = 'vector';
            break;
        case 1:
            tab_name = 'text';
            break;
        case 2:
            tab_name = 'html';
            break;
        case 3:
            tab_name = 'image';
            break;
        default:
            tab_name = '';
            break;
        }
        return tab_name;
    }

    function tabClicked(argsObj) {
        var t = argsObj.tabber; /* Tabber object */
        var tab_index = argsObj.index; /* Which tab was clicked (0 is the first tab) */
        current_index = tab_index;
        var tab_name = tabName(tab_index);
        current_name = tab_name;

        ccr_singleton.toolbarDialog().activate('add' + tab_name);

        return true;
    }

    function errorParsing(message) {
        toastr.error(message, "Wrong or incomplete input");
        return false;
    }

    function validateGenericData(output) {
        var edit_box = document.getElementById('itemeditor_box').value;
        if (!edit_box) return errorParsing("A bounding box was not provided");
        var res_array = edit_box.split(";");
        if (res_array.length !== 4) return errorParsing("Bounding box expects left;top;right;bottom");
        output.bbox = {
            left: parseFloat(res_array[0]),
            top: parseFloat(res_array[1]),
            right: parseFloat(res_array[2]),
            bottom: parseFloat(res_array[3]),
        }
        if (isNaN(output.bbox.left) ||
            isNaN(output.bbox.top) ||
            isNaN(output.bbox.right) ||
            isNaN(output.bbox.bottom)) {
            return errorParsing("Bounding box expects left;top;right;bottom as floating point numbers");
        }

        var dom_el = document.getElementById('itemeditor_layer');
        output.layer = parseInt(dom_el.innerText || dom_el.textContent);

        dom_el = document.getElementById('itemeditor_doy');
        output.doy = parseInt(dom_el.innerText || dom_el.textContent);

        if (isNaN(output.layer) || isNaN(output.doy)) {
            return errorParsing("Layer and Date of Year should be intgers");
        }

        return true;
    }

    function validateVectorData(output) {
        // TODO
        errorParsing("Vectors not implemented, yet")

        var color = document.getElementById('itemeditor_vect_back').value;
        if (!color) return errorParsing("We need a color for inside");
        output.color = color;
        var border = document.getElementById('itemeditor_vect_back').value;
        if (!border) return errorParsing("We need a color for border");
        output.border = color;
        var linew = document.getElementById('itemeditor_vect_linew').value;
        if (isNaN(linew)) return errorParsing("Line width must be numeric");
        output.linew = linew;
        output.closed = document.getElementById('itemeditor_text_italic').value;
        return true;
    }

    function validateTextData(output) {
        var text = document.getElementById('itemeditor_text_value').value;
        if (!text) return errorParsing("No text was provided");
        output.text = text;

        var font = document.getElementById('itemeditor_text_font').value;
        if (!font) return errorParsing("No font name was provided");
        output.font = font;

        var color = document.getElementById('itemeditor_text_color').value;
        if (!color) return errorParsing("No color was provided");
        output.color = color;

        output.filled = document.getElementById('itemeditor_text_filled').value;
        output.italic = document.getElementById('itemeditor_text_italic').value ? 'italic' : 'normal';
        output.bold   = document.getElementById('itemeditor_text_bold').value ? 'bold' : 'normal';

        var text_sz = document.getElementById('itemeditor_text_size').value;
        if (!text_sz) return errorParsing("Text size must be provided");
        output.text_sz = text_sz;

        return true;
    }

    function validateHtmlData(output) {
        var text = document.getElementById('itemeditor_html_text').value;
        if (!text) return errorParsing("No content was provided for HTML");
        output.htmltext = text;
        return true;
    }

    function validateImageData(output) {
        var image_url = document.getElementById('itemeditor_image_url').value;
        if (!image_url) return errorParsing("An url for the image must be provided");
        if ((image_url === 'http://') || (image_url === 'https://')) {
            return errorParsing("An url for the image must be provided");
        }
        output.url = image_url;
        return true;
    }

    function createFromDialog() {
        var data_to_send = { type: current_name };
        if (!validateGenericData(data_to_send)) {
            return false;
        }

        switch (current_name) {
        case 'vector':
            if (!validateVectorData(data_to_send)) {
                return false;
            }
            break;
        case 'text':
            if (!validateTextData(data_to_send)) {
                return false;
            }
            break;
        case 'html':
            if (!validateHtmlData(data_to_send)) {
                return false;
            }
            break;
        case 'image':
            if (!validateImageData(data_to_send)) {
                return false;
            }
            break;
        default:
            console.log('Unknown data type: <' + current_name + '>');
            return false;
        }
        toastr.success("Good batch", "Data created");
        console.log(data_to_send);
        var canvas = ccr_singleton.canvas();

        ++canvas.outstanding_requests;
        jquery.ajax({
            async: true,
            cache: false,
            complete: function(xhr,status) {
                --canvas.outstanding_requests;
            },
            contentType: 'JSON', // The content type used when sending data to the server
            data: JSON.stringify({
                kind: 'add',
                object: current_name,
                database: canvas.database,
                data: data_to_send
            }),
            dataType: 'JSON', // The data type expected of the server response.
            error: function(xhr,status,error) {
                toastr.error('Failed to save resource to database: ' + error);
            },
            global: false,
            password: canvas.password,
            processData: true,
            success: function(result_array,status,xhr) {
                toastr.success("data saved");
                console.log(result_array);
                canvas.parseAjaxResponse(result_array);
            },
            timeout: canvas.timeout,
            type: 'POST',
            url: canvas.dataUrl,
            username: canvas.username
       });
    }

    return {
        prepare: function() {

            var itemeditor_options = {
                div: document.getElementById('itemeditor'),
                onClick: tabClicked,
            };
            itemeditor_tabber = new Tabber(itemeditor_options);
            comnEnh.registerEvent(
                        document.getElementById('itemeditor'),
                        'mousedown',
                        function(event){
                            tbtools.dragStart(event, 'itemeditor');
                        });
            // buttons
            comnEnh.registerEvent(
                        document.getElementById('itemeditor_create'),
                        'click',
                        function(event){
                            createFromDialog();
                        });
            comnEnh.registerEvent(
                        document.getElementById('itemeditor_close'),
                        'click',
                        function(event){
                            comnEnh.addClass('itemeditor','hidden');
                            ccr_singleton.canvas().setMouseMode('pan');
                        });

        },
        tabber: function() {
            return itemeditor_tabber;
        },
        tabIndex: tabIndex,
        activateTab: function(tab_text_id) {
            var index = tabIndex(tab_text_id);
            if (index >= 0) {
                itemeditor_tabber.tabShow(index);
            }
        },
        setBox: function(pt1,pt2) {
            var tmp;
            if (pt1.x > pt2.x) {
                tmp = pt2.x; pt2.x = pt1.x; pt1.x = tmp;
            }
            if (pt1.y > pt2.y) {
                tmp = pt2.y; pt2.y = pt1.y; pt1.y = tmp;
            }
            var txt =
                    pt1.x + ";" +
                    pt1.y + ";" +
                    pt2.x + ";" +
                    pt2.y;
            document.getElementById('itemeditor_box').value = txt;
        },
        ackIndexChange: function(new_index) {
            current_index = new_index;
            current_name = tabName(new_index);
        },
        ackNameChange: function(new_name) {
            var repl_name = new_name.replace('add', '');
            current_index = tabIndex(repl_name);
            if (current_index == -1) {
                current_name = '';
            } else {
                current_name = repl_name;
            }
        }

    };
});
