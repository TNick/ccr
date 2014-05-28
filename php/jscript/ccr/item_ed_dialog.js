define(['./common_enhance',
        './tbtools',
        'tabber',
        './ccr',
        'domReady!'], function (comnEnh,
                                tbtools,
                                Tabber,
                                ccr_singleton,
                                document) {

    var itemeditor_tabber;
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
        var tab_name = tabName(tab_index);

        ccr_singleton.toolbarDialog().activate('add' + tab_name);

        return true;
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
                        function(event){ // todo
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
        }
    };
});
