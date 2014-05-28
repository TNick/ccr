define(['./common_enhance',
        './tbtools',
        './item_ed_dialog',
        'domReady!'], function (comnEnh,
                                tbtools,
                                itEdDlg,
                                document) {

    return {
        activate: function(partial_text_id) {
            comnEnh.remClass('toolb_pan','toolb_pressed');
            comnEnh.remClass('toolb_zoomin','toolb_pressed');
            comnEnh.remClass('toolb_zoomout','toolb_pressed');
            comnEnh.remClass('toolb_addvector','toolb_pressed');
            comnEnh.remClass('toolb_addtext','toolb_pressed');
            comnEnh.remClass('toolb_addhtml','toolb_pressed');
            comnEnh.remClass('toolb_addimage','toolb_pressed');

            comnEnh.addClass('toolb_'+partial_text_id,'toolb_pressed');
        },
        prepare: function(canvas) {

            comnEnh.registerEvent(
                        document.getElementById('toolb'),
                        'mousedown',
                        function(event){
                            tbtools.dragStart(event, 'toolb');
                        });
            comnEnh.registerEvent(
                        document.getElementById('toolb_pan'),
                        'click',
                        function(event){
                            canvas.setMouseMode('pan');
                        });
            comnEnh.registerEvent(
                        document.getElementById('toolb_zoomin'),
                        'click',
                        function(event){
                            canvas.setMouseMode('zoomin');
                        });
            comnEnh.registerEvent(
                        document.getElementById('toolb_zoomout'),
                        'click',
                        function(event){
                            canvas.setMouseMode('zoomout');
                        });
            comnEnh.registerEvent(
                        document.getElementById('toolb_addvector'),
                        'click',
                        function(event){
                            canvas.setMouseMode('addvector');
                            comnEnh.remClass('itemeditor','hidden');
                            itEdDlg.activateTab('vector');
                        });
            comnEnh.registerEvent(
                        document.getElementById('toolb_addtext'),
                        'click',
                        function(event){
                            canvas.setMouseMode('addtext');
                            comnEnh.remClass('itemeditor','hidden');
                            itEdDlg.activateTab('text');
                        });
            comnEnh.registerEvent(
                        document.getElementById('toolb_addhtml'),
                        'click',
                        function(event){
                            canvas.setMouseMode('addhtml');
                            comnEnh.remClass('itemeditor','hidden');
                            itEdDlg.activateTab('html');
                        });
            comnEnh.registerEvent(
                        document.getElementById('toolb_addimage'),
                        'click',
                        function(event){
                            canvas.setMouseMode('addimage');
                            comnEnh.remClass('itemeditor','hidden');
                            itEdDlg.activateTab('image');
                        });

        }
    };
});
