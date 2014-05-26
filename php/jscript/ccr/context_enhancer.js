define(['./dynres', 'i18n!nls/tr'],
function (dynres, tr) {



    return {
        enhance: function (canvas, ctx) {

            function checkScaleChange() {
                var new_scale_categ = ctx.getScaleCategory();
                if (new_scale_categ !== canvas.loaded_scale) {
                    dynres.changeScale(canvas, ctx, new_scale_categ);
                }
            }

            var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
            var xform = svg.createSVGMatrix();
            ctx.getTransform = function(){ return xform; };

            var savedTransforms = [];
            var save = ctx.save;
            ctx.save = function(){
                savedTransforms.push(xform.translate(0,0));
                return save.call(ctx);
            };
            var restore = ctx.restore;
            ctx.restore = function(){
                xform = savedTransforms.pop();
                if (!ctx.internal_change) {
                    checkScaleChange();
                }
                return restore.call(ctx);
            };

            var scale = ctx.scale;
            ctx.scale = function(sx,sy){
                xform = xform.scaleNonUniform(sx,sy);
                checkScaleChange();
                return scale.call(ctx,sx,sy);
            };
            var rotate = ctx.rotate;
            ctx.rotate = function(radians){
                xform = xform.rotate(radians*180/Math.PI);
                return rotate.call(ctx,radians);
            };
            var translate = ctx.translate;
            ctx.translate = function(dx,dy){
                xform = xform.translate(dx,dy);
                return translate.call(ctx,dx,dy);
            };
            var transform = ctx.transform;
            ctx.transform = function(a,b,c,d,e,f){
                var m2 = svg.createSVGMatrix();
                m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
                xform = xform.multiply(m2);
                if (!ctx.internal_change) {
                    checkScaleChange();
                }
                return transform.call(ctx,a,b,c,d,e,f);
            };
            var setTransform = ctx.setTransform;
            ctx.setTransform = function(a,b,c,d,e,f){
                xform.a = a;
                xform.b = b;
                xform.c = c;
                xform.d = d;
                xform.e = e;
                xform.f = f;
                if (!ctx.internal_change) {
                    checkScaleChange();
                }
                return setTransform.call(ctx,a,b,c,d,e,f);
            };
            var pt  = svg.createSVGPoint();
            ctx.transformedPoint = function(x,y){
                pt.x=x; pt.y=y;
                return pt.matrixTransform(xform.inverse());
            }
            ctx.getUniformScale = function () {
                return xform.a;
            }
            ctx.getScaleCategory = function () {
                var crt_scale  = xform.a;
                var scale_category;
                if (crt_scale < 4) {
                    scale_category = 1;
                } else if (crt_scale < 15) {
                    scale_category = 2;
                } else if (crt_scale < 30) {
                    scale_category = 3;
                } else if (crt_scale < 60) {
                    scale_category = 4;
                } else { // if (crt_scale < 120) {
                    scale_category = 5;
                }
                // onsole.log(scale_category + ' ' + crt_scale);
                return scale_category;
            }
            ctx.transfRectView = function (canvas) {
                var pt0 = ctx.transformedPoint(0,0);
                var pt1 = ctx.transformedPoint(canvas.width,canvas.height);
                var rectView = {
                    left:   pt0.x,
                    top:    pt0.y,
                    right:  pt1.x,
                    bottom: pt1.y
                };
                return rectView;
            }

        } // enhance
    };
});
