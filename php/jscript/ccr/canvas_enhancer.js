define(['./geometry',
        './redraw',
        './month_layouts',
        './common_enhance',
        'i18n!nls/tr'],
function (geometry, redraw, monthLayouts, comnEnh, tr) {

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
                    } else { // if (canvas.config.click_action === 'pan') {
                        startPan(evt);
                    }
                } else if (evt.button === 1) { // middle button
                    startPan(evt);
                }
            });
            comnEnh.registerEvent(canvas, 'mousemove' ,function(evt){
                lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                dragged = true;
                if (dragStart){
                    var pt = ctx.transformedPoint(lastX,lastY);
                    ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
                    redraw.now(canvas, ctx);
                }
            });
            comnEnh.registerEvent(canvas, 'mouseup' ,function(evt){
                comnEnh.remClass('map','mousegrabbing');
                dragStart = null;
            },false);

            var scaleFactor = 1.1;
            var zoom = function(clicks){
                var pt = ctx.transformedPoint(lastX,lastY);
                ctx.translate(pt.x,pt.y);
                var factor = Math.pow(scaleFactor,clicks);
                ctx.scale(factor,factor);
                ctx.translate(-pt.x,-pt.y);
                redraw.now(canvas, ctx);
            }

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
                comnEnh.remClass('toolb_pan','toolb_pressed');
                comnEnh.remClass('toolb_zoomin','toolb_pressed');
                comnEnh.remClass('toolb_zoomout','toolb_pressed');
                comnEnh.addClass('toolb_'+new_mode,'toolb_pressed');
            };

        } // enhance
    };
});
