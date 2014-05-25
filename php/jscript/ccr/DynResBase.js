define(['toastr'], function (toastr) {
    return function DynResBase(parent_canvas, options) {
        try {
            this.bbox = {
                left:   options.box[0],
                top:    options.box[1],
                right:  options.box[2],
                bottom: options.box[3]
            };
        } catch(err) {
            toastr.error("Failed to create basic dynamic object; " + err.message);
            this.bbox = {
                left:   0.0,
                top:    0.0,
                right:  1.0,
                bottom: 1.0
            };
        }

        this.boundingBox = function () {
            return bbox;
        }

    };
});
