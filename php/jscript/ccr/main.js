define(['require',
        './geometry',
        './canvas_enhancer',
        './context_enhancer',
        './redraw',
        './month_layouts',
        'i18n!nls/tr', 'domReady!'
       ], function (require, geometry, cv_enh, cx_enh, redraw, monthLayouts, tr, document) {

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

    // and paint it fo the first time
    redraw.now(canvas, ctx);
});
