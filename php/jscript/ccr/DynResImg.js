define(['toastr','./DynResBase'], function (toastr, DynResBase) {

    function DynResImg(parent_canvas, options) {
        DynResBase.apply(this, [parent_canvas, options]);

        try {
            // create associated image object
            this.imageObj = new Image();
            this.imageObj.onload = function() {
                parent_canvas.scheduleUpdate();
            };
            this.imageObj.src = options.url;
        } catch(err) {
            toastr.error("Failed to create image object; " + err.message);
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
                              this.bbox.bottom-this.bbox.top );
            }
        };

        /**
        * item will be destroyed
        */
        this.aboutToDie = function () {
            if (this.imageObj) this.imageObj = undefined;
        };
    }

    // do prototype dance to inherit shared properties
    var ProtoCarrier = function () {};
    ProtoCarrier.prototype = DynResBase.prototype;
    DynResImg.prototype = new ProtoCarrier;

    return DynResImg;
});
