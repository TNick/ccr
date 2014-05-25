define(['./geometry', './redraw', 'i18n!nls/tr'],
function (geometry, redraw, tr) {
    return {
        enhance: function (canvas, ctx) {

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas. offsetHeight;

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

            canvas.addEventListener('mousedown',function(evt){
                if (evt.button === 0) { // left button
                    zoom(evt.shiftKey ? -1 : 1 );
                } else if (evt.button === 1) { // middle button
                    $('#map').addClass('mousegrabbing');
                    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
                    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                    dragStart = ctx.transformedPoint(lastX,lastY);
                    dragged = false;
                }
            },false);
            canvas.addEventListener('mousemove',function(evt){
                lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                dragged = true;
                if (dragStart){
                    var pt = ctx.transformedPoint(lastX,lastY);
                    ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
                    redraw.now(canvas, ctx);
                }
            },false);
            canvas.addEventListener('mouseup',function(evt){
                $('#map').removeClass('mousegrabbing');
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
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas. offsetHeight;
                lastX = canvas.width/2;
                lastY = canvas.height/2;
                redraw.now(canvas, ctx);
            };

            canvas.addEventListener('DOMMouseScroll',handleScroll,false);
            canvas.addEventListener('mousewheel',handleScroll,false);

            if (window.attachEvent) {
                window.attachEvent('onresize', handleResize);
            } else if (window.addEventListener) {
                window.addEventListener('resize', handleResize, false);
            } else {
                //The browser does not support Javascript event binding
            }

            canvas.scheduleUpdate = function() {
                if (typeof this.timer_update_screen === 'undefined') {
                    this.timer_update_screen = window.setTimeout(function(){
                        canvas.timer_update_screen = undefined;
                        redraw.now(canvas, ctx)}, 1000);
                }
            };

        } // enhance
    };
});
