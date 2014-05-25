define(['toastr','./DynResBase'], function (toastr, DynResBase) {

    function DynResText(parent_canvas, options) {
        DynResBase.apply(this, [parent_canvas, options]);

        var color = 'black';
        var fill_style = 'fill';
        var text = '';
        var font = 'normal normal 1em Verdana';

        try {
            if (options.style) {
                if (options.style !== 'fill') fill_style = 'stroke';
            }
            if (options.color) {
                fill_style = options.color;
            }
            if (options.value) {
                text = options.value;
            }
            var tmp_font;
            if (options.orient) {
                tmp_font = options.orient;
            } else {
                tmp_font = 'normal';
            }
            if (options.weight) {
                tmp_font = tmp_font + ' ' + options.weight;
            } else {
                tmp_font = tmp_font + ' normal';
            }
            if (options.size) {
                tmp_font = tmp_font + ' ' + options.size;
            } else {
                tmp_font = tmp_font + ' 1em';
            }
            if (options.font) {
                tmp_font = tmp_font + ' ' + options.font;
            } else {
                tmp_font = tmp_font + ' Verdana';
            }
            font = tmp_font;
        } catch(err) {
            toastr.error("Failed to create text object; " + err.message);
        }

        /**
        * draw this item
        */
        this.draw = function (canvas, ctx){
            try {
                ctx.font = font;
                if (fill_style === 'fill') {
                    ctx.fillStyle = color;
                    ctx.fillText(
                                text,
                                this.bbox.left,
                                this.bbox.top,
                                this.bbox.right-this.bbox.left);
                } else {
                    ctx.strokeStyle = color;
                    ctx.strokeText(
                                text,
                                this.bbox.left,
                                this.bbox.top,
                                this.bbox.right-this.bbox.left);
                }
            } catch(err) {}
        };

        /**
        * item will be destroyed
        */
        this.aboutToDie = function (){};

    };

    // do prototype dance to inherit shared properties
    var ProtoCarrier = function () {};
    ProtoCarrier.prototype = DynResBase.prototype;
    DynResText.prototype = new ProtoCarrier;

    return DynResText;
});
