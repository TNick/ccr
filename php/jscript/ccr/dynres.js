define(['toastr', './redraw', 'jquery'],
       function (toastr, redraw, jquery) {


    return {
        /**
         * tell if two rectangles overlap
         */
        changeScale: function (canvas, ctx, new_scale_categ){
            // inform objects that they are being released
            canvas.sd_images.forEach(function(item){
                item.aboutToDie();
            });
            canvas.sd_vectors.forEach(function(item){
                item.aboutToDie();
            });
            canvas.sd_html.forEach(function(item){
                item.aboutToDie();
            });

            // clear resources from previous step
            canvas.sd_images = [];
            canvas.sd_vectors = [];
            canvas.sd_html = [];
            // save new scale category
            canvas.loaded_scale = new_scale_categ;

            ++canvas.outstanding_requests;

            jquery.ajax({
                async: true,
                cache: true,
                complete: function(xhr,status) {
                    --canvas.outstanding_requests;
                },
                contentType: 'JSON', // The content type used when sending data to the server
                data: JSON.stringify({
                    kind: 'request',
                    database: canvas.database,
                    scale_categ: new_scale_categ,
                    view: ctx.transfRectView(canvas)
                }),
                dataType: 'JSON', // The data type expected of the server response.
                error: function(xhr,status,error) {
                    toastr.error('Failed to retreive resource: ' + error);
                },
                global: false,
                password: canvas.password,
                processData: true,
                success: function(result_array,status,xhr) {
                    toastr.success("data back");
                    console.log(result_array);
                    canvas.parseAjaxResponse(result_array);
                },
                timeout: 5000,
                type: 'POST',
                url: 'data.php',
                username: canvas.username
           });
        }
    };

});
