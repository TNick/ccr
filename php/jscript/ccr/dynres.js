define(['toastr', './redraw', './DynResText',  './DynResHtml',  './DynResImg',  './DynResVect', 'jquery'],
       function (toastr, redraw, DynResText, DynResHtml, DynResImg, DynResVect, jquery) {


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
                    result_array.forEach(function(result){
                        if (result.kind === 'image') {
                            canvas.sd_images.push(new DynResImg(canvas, result));
                        } else if (result.kind === 'vector') {
                            canvas.sd_vectors.push(new DynResVect(canvas, result));
                        } else if (result.kind === 'html') {
                            canvas.sd_html.push(new DynResHtml(canvas, result));
                        } else if (result.kind === 'text') {
                            canvas.sd_html.push(new DynResText(canvas, result));
                        } else if (result.kind === 'error') {
                            toastr.error('Failed to retreive resource: ' + result.value);
                        }
                        });
                    // schedule an update
                    canvas.scheduleUpdate();
                },
                timeout: 5000,
                type: 'POST',
                url: 'data.php',
                username: canvas.username
           });
        }
    };

});
