define(function () {


    return {
        /**
         * tell if two rectangles overlap
         */
        rectanglesOverlap: function (r1, r2){
            return !(r2.left > r1.right ||
                     r2.right < r1.left ||
                     r2.top > r1.bottom ||
                     r2.bottom < r1.top);
        }
    };

});
