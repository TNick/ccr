define(['./common_enhance',
        './tbtools',
        'tabber',
        'domReady!'], function (comnEnh,
                                tbtools,
                                Tabber,
                                document) {

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
                        function(event){ // todo
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
