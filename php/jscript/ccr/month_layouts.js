define(['./geometry', 'i18n!nls/tr'],
function (geometry, tr) {

    function drawMonth(canvas, ctx, rectView, kbMonthDrawer, m, pos_x, pos_y){
        var rectMonth = {
            left:   pos_x,
            top:    pos_y,
            right:  pos_x + canvas.config.monthTicketWidth,
            bottom: pos_y + canvas.config.monthTicketHeight
        };
        if (geometry.rectanglesOverlap(rectView, rectMonth)) {
            ctx.translate(pos_x, pos_y);
            kbMonthDrawer(canvas, ctx, m);
            ctx.translate(-pos_x, -pos_y);
        }
    } // drawMonth


    return {

        oneColumn: function (canvas, ctx, kbMonthDrawer){
            var i, m;
            var pos_x = 0.0;
            var pos_y = 0.0;
            m = 1;
            var rectView = ctx.transfRectView(canvas);
            for(i = 0; i < 12; ++i) {
                drawMonth(canvas, ctx, rectView, kbMonthDrawer, m, pos_x, pos_y);
                pos_y += canvas.config.monthTicketHeight;
                ++m;
            }
        }, // oneColumn

        twoColumns: function (canvas, ctx, kbMonthDrawer){
            var i, j, m;
            var pos_x = 0.0;
            var pos_y = 0.0;
            m = 1;
            var rectView = ctx.transfRectView(canvas);
            for(i = 0; i < 6; ++i) {
                for(j = 0; j < 2; ++j) {
                    drawMonth(canvas, ctx, rectView, kbMonthDrawer, m, pos_x, pos_y);
                    pos_x += canvas.config.monthTicketWidth;
                    ++m;
                }
                pos_y += canvas.config.monthTicketHeight;
                pos_x = 0.0;
            }
        }, // twoColumns

        threeColumns: function (canvas, ctx, kbMonthDrawer){
            var i, j, m;
            var pos_x = 0.0;
            var pos_y = 0.0;
            m = 1;
            var rectView = ctx.transfRectView(canvas);
            for(i = 0; i < 4; ++i) {
                for(j = 0; j < 3; ++j) {
                    drawMonth(canvas, ctx, rectView, kbMonthDrawer, m, pos_x, pos_y);
                    pos_x += canvas.config.monthTicketWidth;
                    ++m;
                }
                pos_y += canvas.config.monthTicketHeight;
                pos_x = 0.0;
            }
        }, // threeColumns

        fourColumns: function (canvas, ctx, kbMonthDrawer){
            var i, j, m;
            var pos_x = 0.0;
            var pos_y = 0.0;
            m = 1;
            var rectView = ctx.transfRectView(canvas);
            for(i = 0; i < 3; ++i) {
                for(j = 0; j < 4; ++j) {
                    drawMonth(canvas, ctx, rectView, kbMonthDrawer, m, pos_x, pos_y);
                    pos_x += canvas.config.monthTicketWidth;
                    ++m;
                }
                pos_y += canvas.config.monthTicketHeight;
                pos_x = 0.0;
            }
        } // fourColumns
    };
});
