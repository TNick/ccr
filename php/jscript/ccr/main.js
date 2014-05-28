define(['require',
        './geometry',
        './canvas_enhancer',
        './context_enhancer',
        './redraw',
        './dynres',
        'toastr',
        './month_layouts',
        'cookies',
        './tbtools',
        './common_enhance',
        'tabber',
        'jscolor',
        'i18n!nls/tr', 'domReady!', 'jquery'
       ], function (require,
                    geometry,
                    cv_enh,
                    cx_enh,
                    redraw,
                    dynres,
                    toastr,
                    monthLayouts,
                    cookies,
                    tbtools,
                    comnEnh,
                    Tabber,
                    jscolor,
                    tr, document, jquery) {

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

    // prepare canvas for use
    var canvas = document.getElementById('map');
    var canvas_options = {
        monthTicketHeight: 250,
        monthTicketWidth: 300,
        monthLayout: monthLayouts.fourColumns,
        dataUrl: 'data.php',
        database: 'ccr',
        username: '',
        password: '',
        click_action: 'zoomin',
        monthLayoutOnResize: 'keep' // 'auto' to change the shape based on screen size, 'keep' to keep previous shape
    };
    canvas.config = canvas_options;
    var ctx = canvas.getContext('2d');

    // adjust for our usage
    cx_enh.enhance(canvas, ctx);
    cv_enh.enhance(canvas, ctx);
    canvas.loadConfigFromCookie(canvas.config);

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

    // prepare our main toolbar
    var toolb = document.getElementById('toolb');
    comnEnh.registerEvent(toolb, 'mousedown', function(event){tbtools.dragStart(event, 'toolb');});
    comnEnh.registerEvent(document.getElementById('toolb_pan'), 'click', function(event){ canvas.setMouseMode('pan'); });
    comnEnh.registerEvent(document.getElementById('toolb_zoomin'), 'click', function(event){ canvas.setMouseMode('zoomin'); });
    comnEnh.registerEvent(document.getElementById('toolb_zoomout'), 'click', function(event){ canvas.setMouseMode('zoomout'); });
    comnEnh.registerEvent(document.getElementById('toolb_add_vector'), 'click', function(event){});
    comnEnh.registerEvent(document.getElementById('toolb_add_text'), 'click', function(event){});
    comnEnh.registerEvent(document.getElementById('toolb_add_html'), 'click', function(event){});
    comnEnh.registerEvent(document.getElementById('toolb_add_image'), 'click', function(event){});
    canvas.setMouseMode(canvas.config.click_action);

    // prepare tabbed display of item editor
    var tabberOptions = {
        'cookie':"tabber", /* Name to use for the cookie */
        'onLoad': function(argsObj) {
            var t = argsObj.tabber;
            var i;

            /* Optional: Add the id of the tabber to the cookie name to allow
            for multiple tabber interfaces on the site.  If you have
            multiple tabber interfaces (even on different pages) I suggest
            setting a unique id on each one, to avoid having the cookie set
            the wrong tab.
            */
            //            if (t.id) {
            //                t.cookie = t.id + t.cookie;
            //            }

            //            /* If a cookie was previously set, restore the active tab */
            //            i = parseInt(getCookie(t.cookie));
            //            if (isNaN(i)) { return; }
            //            t.tabShow(i);
            //            alert('getCookie(' + t.cookie + ') = ' + i);
        },

        'onClick':function(argsObj) {
            //            var c = argsObj.tabber.cookie;
            //            var i = argsObj.index;
            //            alert('setCookie(' + c + ',' + i + ')');
            //            setCookie(c, i);
        },
        div: document.getElementById('itemeditor')
    };
    var itemeditor_tabber = new Tabber(tabberOptions);
    comnEnh.registerEvent(document.getElementById('itemeditor'),
                          'mousedown',
                          function(event){tbtools.dragStart(event, 'itemeditor');});

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

    // and paint it fo the first time
    redraw.now(canvas, ctx);
    dynres.changeScale(canvas, ctx, ctx.getScaleCategory());
});
