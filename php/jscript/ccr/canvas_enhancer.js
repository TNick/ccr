define(['./geometry',
        'toastr',
        './redraw',
        './month_layouts',
        'cookies',
        './common_enhance',
        './toolbar_dialog',
        './item_ed_dialog',
        './DynResText',
        './DynResHtml',
        './DynResImg',
        './DynResVect',
        './ccr',
        'i18n!nls/tr'],
function (geometry,
          toastr,
          redraw,
          monthLayouts,
          cookies,
          comnEnh,
          tbDlg,
          itEdDlg,
          DynResText,
          DynResHtml,
          DynResImg,
          DynResVect,
          ccr_singleton,
          tr) {

    function commonResizeOp(canvas) {
        //        canvas.width = canvas.offsetWidth;
        //        canvas.height = canvas.offsetHeight;
        canvas.offsetWidth = window.innerWidth;
        canvas.offsetHeight = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // maybe the transformation gets reset here => improper drawing

        if (canvas.config.monthLayoutOnResize === 'auto' ) {
            if (canvas.width <= 320) {
                canvas.config.monthLayout = monthLayouts.oneColumn;
            } else if (canvas.width <= 640) {
                canvas.config.monthLayout = monthLayouts.twoColumns;
            } else if (canvas.width <= 800) {
                canvas.config.monthLayout = monthLayouts.threeColumns;
            } else {
                canvas.config.monthLayout = monthLayouts.fourColumns;
            }
        }
    }

    return {
        enhance: function (canvas, ctx) {

            window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                          window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

            commonResizeOp(canvas);

            // current chain of scale-dependent resources
            canvas.loaded_scale = -1;
            canvas.sd_images = [];
            canvas.sd_vectors = [];
            canvas.sd_html = [];

            // holds the number of requests currently in the works
            canvas.outstanding_requests = 0;

            // timer event for updating the screen
            canvas.timer_update_screen = undefined;

            var lastX = canvas.width/2, lastY = canvas.height/2;
            var dragStart,dragged;

            function startPan(evt) {
                comnEnh.addClass('map','mousegrabbing');
                document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
                lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                dragStart = ctx.transformedPoint(lastX,lastY);
                dragged = false;
            }

            comnEnh.registerEvent(canvas, 'mousedown' ,function(evt){
                if (evt.button === 0) { // left button
                    if (canvas.config.click_action === 'zoomin') {
                        zoom(evt.shiftKey ? -1 : 1 );
                    } else if (canvas.config.click_action === 'zoomout') {
                        zoom(evt.shiftKey ? 1 : -1 );
                    } else if (canvas.config.click_action.startsWith('add')) {
                        var ev_X = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                        var ev_Y = evt.offsetY || (evt.pageY - canvas.offsetTop);
                        var transf_pt = ctx.transformedPoint(ev_X, ev_Y);
                        if (canvas.add_box_point_1) {
                            // we have our second point
                            ccr_singleton.itemEditorDialog().setBox(
                                        canvas.add_box_point_1,
                                        transf_pt);
                            canvas.add_box_point_1 = undefined;
                            canvas.add_box_point_2 = undefined;
                            comnEnh.remClass('map','mousecrosshair');
                            redraw.now(canvas, ctx);
                        } else {
                            // we're just getting started
                            comnEnh.addClass('map','mousecrosshair');
                            canvas.add_box_point_1 = transf_pt
                            canvas.add_box_point_2 = transf_pt
                            canvas.overlay = function(arg_ctx) {
                                if (!canvas.add_box_point_1) {
                                    canvas.overlay = undefined;
                                } else {
                                    arg_ctx.beginPath();
                                    arg_ctx.rect(canvas.add_box_point_1.x,
                                                 canvas.add_box_point_1.y,
                                                 canvas.add_box_point_2.x - canvas.add_box_point_1.x,
                                                 canvas.add_box_point_2.y - canvas.add_box_point_1.y);
                                    arg_ctx.lineWidth = 1 / ctx.getUniformScale;
                                    arg_ctx.strokeStyle = 'red';
                                    arg_ctx.stroke();
                                }
                            }
                        }
                    } else {
                        startPan(evt);
                    }
                } else if (evt.button === 1) { // middle button
                    startPan(evt);
                }
            });
            comnEnh.registerEvent(
                        canvas,
                        'mousemove',
                        function(evt){
                lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                dragged = true;
                if (dragStart){
                    var pt = ctx.transformedPoint(lastX,lastY);
                    ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
                    redraw.now(canvas, ctx);
                } else if (canvas.add_box_point_1) {
                    canvas.add_box_point_2 = ctx.transformedPoint(lastX,lastY);
                    redraw.now(canvas, ctx);
                }
            });
            comnEnh.registerEvent(
                        canvas,
                        'mouseup' ,
                        function(evt){
                            comnEnh.remClass('map','mousegrabbing');
                            dragStart = null;
                        });

            var scaleFactor = 1.1;
            var zoom = function(clicks) {
                var pt = ctx.transformedPoint(lastX,lastY);
                ctx.translate(pt.x,pt.y);
                var factor = Math.pow(scaleFactor,clicks);
                ctx.scale(factor,factor);
                ctx.translate(-pt.x,-pt.y);
                redraw.now(canvas, ctx);
            };

            var handleScroll = function(evt){
                var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
                if (delta) zoom(delta);
                return evt.preventDefault() && false;
            };

            var handleResize = function(evt){
                commonResizeOp(canvas);

                lastX = canvas.width/2;
                lastY = canvas.height/2;
                redraw.now(canvas, ctx);
            };

            comnEnh.registerEvent(canvas, 'DOMMouseScroll', handleScroll);
            comnEnh.registerEvent(canvas, 'mousewheel', handleScroll);
            comnEnh.registerEvent(window, 'resize', handleResize);

            canvas.scheduleUpdate = function() {
                if (typeof this.timer_update_screen === 'undefined') {
                    this.timer_update_screen = window.setTimeout(function(){
                        canvas.timer_update_screen = undefined;
                        redraw.now(canvas, ctx)}, 1000);
                }
            };

            canvas.setMouseMode = function(new_mode) {
                canvas.config.click_action = new_mode;
                tbDlg.activate(new_mode);
                canvas.saveConfigToCookie(canvas.config);
                itEdDlg.ackNameChange(new_mode);
            };

            canvas.loadConfigFromCookie = function (canvas_options) {
                var prev_v;
                prev_v = cookies.get('canvas_click_action');
                if (prev_v) {
                    canvas_options.click_action = prev_v;
                }
                prev_v = cookies.get('canvas_database');
                if (prev_v) {
                    canvas_options.database = prev_v;
                }
                prev_v = cookies.get('canvas_dataUrl');
                if (prev_v) {
                    canvas_options.dataUrl = prev_v;
                }
                prev_v = cookies.get('canvas_timeout');
                if (prev_v) {
                    canvas_options.timeout = prev_v;
                }
                prev_v = cookies.get('canvas_monthLayoutOnResize');
                if (prev_v) {
                    canvas_options.monthLayoutOnResize = prev_v;
                }
                prev_v = cookies.get('canvas_monthLayout');
                if (prev_v && (canvas_options.monthLayoutOnResize === 'keep')) {
                    if (prev_v === '1') {
                        canvas_options.monthLayout = monthLayouts.oneColumn;
                    } else if (prev_v === '2') {
                        canvas_options.monthLayout = monthLayouts.twoColumns;
                    } else if (prev_v === '3') {
                        canvas_options.monthLayout = monthLayouts.threeColumns;
                    } else if (prev_v === '4') {
                        canvas_options.monthLayout = monthLayouts.fourColumns;
                    }
                }
            };

            canvas.saveConfigToCookie = function(canvas_options) {
                if (canvas_options.click_action.startsWith('add')) {
                    cookies.set('canvas_click_action', 'pan');
                } else {
                    cookies.set('canvas_click_action', canvas_options.click_action);
                }
                cookies.set('canvas_database', canvas_options.database);
                cookies.set('canvas_dataUrl', canvas_options.dataUrl);
                cookies.set('canvas_timeout', canvas_options.timeout);
                cookies.set('canvas_monthLayoutOnResize', canvas_options.monthLayoutOnResize);
                cookies.set('canvas_monthLayout', monthLayouts.columnCount());
            };

            canvas.parseAjaxResponse = function(result_array) {

                result_array.forEach(function(result) {
                    if (result.kind === 'image') {
                        canvas.sd_images.push(new DynResImg(canvas, result));
                    } else if (result.kind === 'vector') {
                        canvas.sd_vectors.push(new DynResVect(canvas, result));
                    } else if (result.kind === 'html') {
                        canvas.sd_html.push(new DynResHtml(canvas, result));
                    } else if (result.kind === 'text') {
                        canvas.sd_html.push(new DynResText(canvas, result));
                    } else if (result.kind === 'error') {
                        toastr.error('Failed to retreive resource: ' + result.value);
                    }
                });

                // schedule an update
                canvas.scheduleUpdate();
            }

        } // enhance
    };
});
