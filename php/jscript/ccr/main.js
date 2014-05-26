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
        'i18n!nls/tr', 'domReady!'
       ], function (require, geometry, cv_enh, cx_enh, redraw, dynres, toastr, monthLayouts, cookies, tbtools, comnEnh, tr, document) {

    // as the data volume is quite large, we want agresive caching
    $.ajaxSetup ({
       cache: true
    });

    // prepare top menu bar
    var timeout = null;
    var initialMargin = parseInt($("#siteMenuBar").css("margin-top"));
    $("#siteMenuBar").hover(
        function() {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            $(this).animate({ marginTop: 0 }, 'fast');
        },
        function() {
            var menuBar = $(this);
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
