define(['toastr','./DynResBase'], function (toastr, DynResBase) {

    function DynResHtml(parent_canvas, options) {
        DynResBase.apply(this, [parent_canvas, options]);
        var svg;
        try {
            // create svg on the fly
            var data   = '<svg xmlns="http://www.w3.org/2000/svg" width="' +
                        (options.box[2]-options.box[0]) +
                        '" height="' + (options.box[3]-options.box[1]) + '">' +
                           '<foreignObject width="100%" height="100%">' +
                             '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:1em">' +
                               options.value +
                             '</div>' +
                           '</foreignObject>' +
                         '</svg>';
            this.DOMURL = window.URL || window.webkitURL || window;
            this.imageObj = new Image();
            svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
            this.svg_url = this.DOMURL.createObjectURL(svg);
            this.imageObj.onload = function () {
                parent_canvas.scheduleUpdate();
            }
            this.imageObj.src = this.svg_url;
        } catch(err) {
            toastr.error("Failed to create html object; " + err.message);
        }

        /**
        * draw this item
        */
        this.draw = function (canvas, ctx){
            if (this.imageObj && this.imageObj.complete) {
                ctx.drawImage(this.imageObj,
                              this.bbox.left,
                              this.bbox.top,
                              this.bbox.right-this.bbox.left,
                              this.bbox.bottom-this.bbox.top);
            }
        };

        /**
        * item will be destroyed
        */
        this.aboutToDie = function (){
            if (this.DOMURL && this.svg_url) {
                this.DOMURL.revokeObjectURL(this.svg_url);
                this.imageObj = undefined;
            }
            svg = undefined;
        };
    };

    // do prototype dance to inherit shared properties
    var ProtoCarrier = function () {};
    ProtoCarrier.prototype = DynResBase.prototype;
    DynResHtml.prototype = new ProtoCarrier;

    return DynResHtml;
});
