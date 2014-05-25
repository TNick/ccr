define(['require',
        './geometry',
        './canvas_enhancer',
        './context_enhancer',
        './redraw',
        './dynres',
        'toastr',
        './month_layouts',
        'i18n!nls/tr', 'domReady!'
       ], function (require, geometry, cv_enh, cx_enh, redraw, dynres, toastr, monthLayouts, tr, document) {

   // as the data volume is quite large, we want agresive caching
   $.ajaxSetup ({
       cache: true
   });

    // prepare canvas for use
    var canvas = document.getElementById('map');
    var canvas_options = {
        monthTicketHeight: 250,
        monthTicketWidth: 300,
        monthLayout: monthLayouts.fourColumns,
        dataUrl: 'data.php',
        database: 'ccr',
        username: '',
        password: ''
    };
    canvas.config = canvas_options;
    var ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas. offsetHeight;

    // adjust for our usage
    cx_enh.enhance(canvas, ctx);
    cv_enh.enhance(canvas, ctx);

    // adjust toastr
    toastr.options.closeButton = true;
    toastr.options.showEasing = 'swing';
    toastr.options.hideEasing = 'linear';
    toastr.options.showDuration = 400;
    toastr.options.hideDuration = 1200;
    toastr.options.timeOut = 6000;
    toastr.options.extendedTimeOut = 2000;
    toastr.options.showMethod = 'fadeIn';
    toastr.options.hideMethod = 'fadeOut';

    // and paint it fo the first time
    redraw.now(canvas, ctx);
    dynres.changeScale(canvas, ctx, ctx.getScaleCategory());
});
