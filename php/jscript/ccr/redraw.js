define(['./geometry', 'nls/trdyn', 'i18n!nls/tr'],
function (geometry, trdyn, tr) {


    /**
     * Draws a day
     * @param {canvas} the element from where properties are extracted
     * @param {context} the context where we draw
     * @param {m} month (1 to 12)
     * @param {d} day (1 to 31)
     */
    function drawDay(canvas, context, m, d, w_day, h_day, scale_categ){

        var day_of_year = trdyn.dayOfYear(m, d);
        var val_scale  = context.getUniformScale();

        // day name
        if ((scale_categ < 5) && (val_scale > 0.5)) {
            var day_size = 15 / (val_scale);
            var day_off = 2 / (val_scale);
            context.fillStyle = "white";
            context.font = "bold " + day_size + "px Arial";
            context.fillText("" + d, day_off, day_off+day_size);
        }
    }

    /**
     * Draws a month
     * @param {canvas} the element from where properties are extracted
     * @param {context} the context where we draw
     * @param {m} month (1 to 12)
     */
    function drawMonth(canvas, context, m){

        var scale_categ  = context.getScaleCategory();
        var val_scale  = context.getUniformScale();

        context.strokeStyle = "#0000ff";
        context.lineWidth   = 2 / val_scale;
        context.fillStyle = "#009900";
        context.fillRect(0,0, canvas.config.monthTicketWidth,canvas.config.monthTicketHeight);
        context.strokeRect(0,0, canvas.config.monthTicketWidth,canvas.config.monthTicketHeight);

        // month name
        if (scale_categ < 2) {
            context.fillStyle = "blue";
            context.font = "bold 30px Arial";
            context.fillText(trdyn.monthName(m), 2, 32);
        }

        // dividers for days
        context.strokeStyle = "#00ffff";
        context.lineWidth   = 1 / val_scale;
        var r = 0; var c = 0; var d = 1; var d_lim = trdyn.days(m);
        var h_day = canvas.config.monthTicketHeight / 5;
        var w_day = canvas.config.monthTicketWidth / 7;
        var day_x = w_day; // don't draw first line over previous one
        for (c = 1; c < 7; ++c) {
            context.beginPath();
            context.moveTo(day_x,0);
            context.lineTo(day_x,canvas.config.monthTicketHeight);
            context.stroke();
            day_x += w_day;
        }
        var rectDay = {
            left:   0.0,
            top:    0.0,
            right:  w_day,
            bottom: h_day
        };
        var rectView = context.transfRectView(canvas);
        var d_start = trdyn.dayStart(m);
        var d_fake = 1;
        var month_overflow_d = trdyn.daysOverflow(m);
        for (r = 0; r < 5; ++r) {
            if (r > 0 ) {
                context.beginPath();
                context.moveTo(0,rectDay.top);
                context.lineTo(canvas.config.monthTicketWidth, rectDay.top);
                context.stroke();
            }
            rectDay.left = 0.0;
            rectDay.right = w_day;
            for (c = 0; c < 7; ++c) {
                if (d_fake > d_start) {
                    if (d <= d_lim) {
                        if (geometry.rectanglesOverlap(rectView, rectDay)) {
                            context.translate(rectDay.left, rectDay.top);
                            drawDay(canvas, context, m, d, w_day, h_day, scale_categ);
                            context.translate(-rectDay.left, -rectDay.top);
                        }
                    } else {
                        break;
                    }
                    d = d + 1
                } else if (month_overflow_d > 0) {
                    // we need this trick so that one or two days from previous month are presented in
                    // current month
                    if (geometry.rectanglesOverlap(rectView, rectDay)) {
                        context.translate(rectDay.left, rectDay.top);
                        drawDay(canvas, context, m-1, month_overflow_d, w_day, h_day, scale_categ);
                        context.translate(-rectDay.left, -rectDay.top);
                    }
                    ++month_overflow_d;
                }

                rectDay.left = rectDay.right;
                rectDay.right += w_day;
                d_fake = d_fake + 1
            }
            rectDay.top = rectDay.bottom;
            rectDay.bottom += h_day;
        }
    }

    return {
        now: function (canvas, context) {

            // Clear the entire canvas
            var p1 = context.transformedPoint(0,0);
            var p2 = context.transformedPoint(canvas.width,canvas.height);
            context.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

            canvas.config.monthLayout(canvas, context, drawMonth);

            // images, vectors and text
            canvas.sd_images.forEach(function(item){
                //item.draw(canvas, context);
            });
            canvas.sd_vectors.forEach(function(item){
                //item.draw(canvas, context);
            });
            canvas.sd_html.forEach(function(item){
                //item.draw(canvas, context);
            });

        } // enhance
    };
});
