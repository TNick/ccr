define(['./common_enhance',
        './tbtools',
        'tabber',
        './ccr',
        'domReady!'], function (comnEnh,
                                tbtools,
                                Tabber,
                                ccr_singleton,
                                document) {


    function parseDialog() {// todo
        // ccr_singleton.canvas()
        //        gensett_resize
        //        gensett_layout
        //        advsett_dataurl
        //        advsett_timeout
        //        advsett_database
        //        advsett_scales

    }

    return {
        prepare: function() {

            // prepare tabbed display of settings editor
            var settings_options = {
                div: document.getElementById('ccrsettings')
            };
            var settings_tabber = new Tabber(settings_options);
            comnEnh.registerEvent(
                        document.getElementById('ccrsettings'),
                        'mousedown',
                        function(event){
                            tbtools.dragStart(event, 'ccrsettings');
                        });

            // buttons
            comnEnh.registerEvent(
                        document.getElementById('ccrsettings_apply'),
                        'click',
                        function(event){
                            parseDialog();
                        });
            comnEnh.registerEvent(
                        document.getElementById('ccrsettings_close'),
                        'click',
                        function(event){
                            comnEnh.addClass('ccrsettings','hidden');
                        });
        }
    };
});
