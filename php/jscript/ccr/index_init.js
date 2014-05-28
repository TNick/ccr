define(['require',
        './index_init',
        './common_enhance',
        './geometry',
        './canvas_enhancer',
        './context_enhancer',
        './redraw',
        './dynres',
        'toastr',
        './month_layouts',
        'cookies',
        './tbtools',
        'tabber',
        'jscolor',
        './settings_dialog',
        './toolbar_dialog',
        './item_ed_dialog',
        './topmenu_enhancer',
        './ccr',
        'i18n!nls/tr', 'domReady!', 'jquery'
       ], function (require,
                    indexInit,
                    comnEnh,
                    geometry,
                    cv_enh,
                    cx_enh,
                    redraw,
                    dynres,
                    toastr,
                    monthLayouts,
                    cookies,
                    tbtools,
                    Tabber,
                    jscolor,
                    settDlg,
                    tbDlg,
                    itEdDlg,
                    mmnu_enh,
                    ccr_singleton,
                    tr, document, jquery)
       {

          return {
               /**
                * prepare a page
                */
               run: function (){
                   ccr_singleton.prepare();
                   ccr_singleton.setAll(settDlg, tbDlg, itEdDlg);

                   mmnu_enh.prepare();

                   // prepare canvas for use
                   var canvas = document.getElementById('map');
                   ccr_singleton.setCanvas(canvas);
                   var canvas_options = {
                       monthTicketHeight: 250,
                       monthTicketWidth: 300,
                       monthLayout: monthLayouts.fourColumns,
                       dataUrl: 'data.php',
                       timeout: 5000,
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

                   // prepare our main toolbar, item editor, settings
                   itEdDlg.prepare();
                   settDlg.prepare();
                   tbDlg.prepare(canvas);
                   canvas.setMouseMode(canvas.config.click_action);

                   // and paint it fo the first time
                   redraw.now(canvas, ctx);
                   dynres.changeScale(canvas, ctx, ctx.getScaleCategory());

               }
           };

       });

