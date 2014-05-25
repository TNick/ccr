define(['toastr','./DynResBase'], function (toastr, DynResBase) {

    function DynResVect(parent_canvas, options) {
        DynResBase.apply(this, [parent_canvas, options]);

        /**
        * draw this item
        */
        this.draw = function (canvas, ctx){

            if (options.line_width) {
                ctx.lineWidth = options.line_width;
            } else {
                ctx.lineWidth = 1;
            }
            var closed = true;
            if (options.closed) {
                if (options.closed === 'true') {
                    closed = true;
                } else {
                    closed = false;
                }
            }
            var filled = false;
            if (options.fill) {
                if (options.fill === 'transparent') {
                    filled = false;
                } else {
                    filled = true;
                }
            }
            var color = 'black';
            if (options.color) {
                color = options.color;
            }
            ctx.strokeStyle = color;
            ctx.beginPath();
            var x_comp = undefined;
            var b_first = true;
            options.vert.forEach(function(item){
                if (x_comp) {
                    if (b_first) {
                        ctx.moveTo(x_comp,item);
                        b_first = undefined;
                    } else {
                        ctx.lineTo(x_comp,item);
                    }
                    x_comp = undefined;
                } else {
                    x_comp = item;
                }
            });
            if (closed) {
                ctx.closePath();
            }
            if (filled) {
                ctx.fillStyle = options.fill;
                ctx.fill();
            }
            ctx.stroke();
        };

        /**
        * item will be destroyed
        */
        this.aboutToDie = function (){

        };

    };

    // do prototype dance to inherit shared properties
    var ProtoCarrier = function () {};
    ProtoCarrier.prototype = DynResBase.prototype;
    DynResVect.prototype = new ProtoCarrier;

    return DynResVect;
});
