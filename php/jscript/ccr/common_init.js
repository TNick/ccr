define(['domReady!',
        'toastr',
        'cookies',
        'jscolor',
        'jquery'], function (document, toastr, cookies, jscolor, jquery) {

    return {
        /**
         * prepare a page
         */
        run: function (){

            // as the data volume is quite large, we want agresive caching
            jquery.ajaxSetup ({
               cache: true
            });

            // prepare top menu bar
            var timeout = null;
            var initialMargin = parseInt(jquery("#siteMenuBar").css("margin-top"));
            jquery("#siteMenuBar").hover(
                function() {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    jquery(this).animate({ marginTop: 0 }, 'fast');
                },
                function() {
                    var menuBar = jquery(this);
                    timeout = setTimeout(function() {
                        timeout = null;
                        menuBar.animate({ marginTop: initialMargin }, 'slow');
                    }, 1000);
                }
            );

            // adjust toastr
            toastr.options.closeButton = true;
            toastr.options.showDuration = 400;
            toastr.options.showMethod = 'fadeIn';
            toastr.options.showEasing = 'swing';
            toastr.options.hideMethod = 'fadeOut';
            toastr.options.hideEasing = 'linear';
            toastr.options.hideDuration = 1200;
            toastr.options.timeOut = 6000;
            toastr.options.extendedTimeOut = 2000;

            // prepare color picker
            jscolor.dir = 'img/';
            jscolor.bindClass = 'colorpicker';
            jscolor.init();

            // show cookies warning
            var prev_v = cookies.get('notfirsttimer');
            if (!prev_v) {
                toastr.info("This site uses cookies. By continuing to browse the site, you are agreeing to our use of cookies.", "Take note", {timeOut: 12000});
                cookies.set('notfirsttimer', '1');
            }
        }
    };

});
