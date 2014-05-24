define(['./geometry', './redraw', 'i18n!nls/tr'],
function (geometry, redraw, tr) {
    return {
        enhance: function (canvas, ctx) {

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
                document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
                lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                dragStart = ctx.transformedPoint(lastX,lastY);
                dragged = false;
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
                dragStart = null;
                if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
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
            canvas.addEventListener('DOMMouseScroll',handleScroll,false);
            canvas.addEventListener('mousewheel',handleScroll,false);

        } // enhance
    };
});
