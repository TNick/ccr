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
        'jsmenu',
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
                    jsmenu,
                    tr, document, jquery)
       {

           function createMenuView(){
                 var menuView = new jsmenu.JSMenu("View");
                 var ck_toolbar = new jsmenu.JSCheckBox("Toolbar",{
                    checked: true,
                    clickHandler:function(e){
                        if (ck_toolbar.checked) {
                            comnEnh.remClass('toolb','hidden');
                        } else {
                            comnEnh.addClass('toolb','hidden');
                        }
                    }
                 });
                 menuView.add(ck_toolbar);
                 var ck_settings = new jsmenu.JSCheckBox("Settings",{
                    checked: false,
                    clickHandler:function(e){
                        if (ck_settings.checked) {
                            comnEnh.remClass('ccrsettings','hidden');
                        } else {
                            comnEnh.addClass('ccrsettings','hidden');
                        }
                    }
                 });
                 menuView.add(ck_settings);
                 return menuView;
           }


           return {
               /**
                * prepare a page
                */
               run: function (){

                    // adjust menu bar
                   var menuContainer1 = document.getElementById("custom_menu_spot");

                   var jsMenuBar1 = new jsmenu.JSMenuBar({
                        menuBar:{
                            width:"auto",
                            background:"transparent",
                            height:"auto",
                            border:"0px solid #6A8DD9",
                            mozBorderRadius:"0px",
                            webkitBorderRadius:"0px",
                            borderRadius:"0px",
                            padding:"0px 0px",
                            margin:"0 auto"

                        },
                        rootMenuOut:{
                          height:"1.2em",
                          background:"transparent",
                          lineHeight:"1.2em",
                          padding:"0px",
                          width:"6em",
                          color:"white",
                          textAlign:"center",
                          border:"none",
                          fontSize:"0.9em",
                          fontWeight: "bold"
                        },
                        rootMenuOver:{
                           background:"transparent",
                           color:"white",
                            width:"6em",
                            borderLeft:"0px solid #aac5f7",
                            borderRight:"0px solid #aac5f7"
                        },

                        itemMenuOut:{
                            color:"white",
                            fontSize:"0.9em",
                            background:"#f6a828",
                            lineHeight:"normal"
                        },
                        itemMenuOver:{
                           background:"#f6a828",
                           color:"#383838"
                        }

                    });

                    jsMenuBar1.appendTo(menuContainer1);
                    jsMenuBar1.add(createMenuView());

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
                   var itemeditor_options = {
                       div: document.getElementById('itemeditor')
                   };
                   var itemeditor_tabber = new Tabber(itemeditor_options);
                   comnEnh.registerEvent(document.getElementById('itemeditor'),
                                         'mousedown',
                                         function(event){tbtools.dragStart(event, 'itemeditor');});

                   // prepare tabbed display of settings editor
                   var settings_options = {
                       div: document.getElementById('ccrsettings')
                   };
                   var settings_tabber = new Tabber(settings_options);
                   comnEnh.registerEvent(document.getElementById('ccrsettings'),
                                         'mousedown',
                                         function(event){tbtools.dragStart(event, 'ccrsettings');});


                   // and paint it fo the first time
                   redraw.now(canvas, ctx);
                   dynres.changeScale(canvas, ctx, ctx.getScaleCategory());

               }

           };

       });

