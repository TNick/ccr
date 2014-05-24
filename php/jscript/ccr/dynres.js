define(['toastr', './redraw'], function (toastr, redraw) {


    return {
        /**
         * tell if two rectangles overlap
         */
        changeScale: function (canvas, ctx, new_scale_categ){
            // clear resources from previous step
            canvas.sd_images = [];
            canvas.sd_vectors = [];
            canvas.sd_html = [];
            // save new scale category
            canvas.loaded_scale = new_scale_categ;

            ++canvas.outstanding_requests;

            $.ajax({
                async: true,
                cache: true,
                complete: function(xhr,status) {
                    --canvas.outstanding_requests;
                },
                contentType: 'JSON', // The content type used when sending data to the server
                data: {
                    database: canvas.database,
                    scale_categ: new_scale_categ,
                    view: ctx.transfRectView(canvas)
                },
                dataType: 'JSON', // The data type expected of the server response.
                error: function(xhr,status,error) {
                    toastr.error("Failed to retreive resource: " + error);
                },
                global: false,
                password: canvas.password,
                processData: true,
                success: function(result,status,xhr) {
                    //$("#div1").html(result);
                    toastr.success("data back" + result);
                    if (result.kind === 'image') {
                        canvas.sd_images.push(new DynResImg());
                    } else if (result.kind === 'vector') {
                        canvas.sd_vectors.push(new DynResVect());
                    } else if (result.kind === 'html') {
                        canvas.sd_html.push(new DynResHtml());
                    }
                    // schedule an update
                    if (typeof canvas.timer_update_screen === 'undefined') {
                        canvas.timer_update_screen = setTimeout(function(){
                            canvas.timer_update_screen = undefined;
                            redraw.now(canvas, ctx)}, 1000);
                    }
                },
                timeout: 5000,
                type: 'POST',
                url: 'data.php',
                username: canvas.username
           });
        }
    };

});
