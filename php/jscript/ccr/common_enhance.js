define(function () {


    return {
        /**
         * add event
         */
        registerEvent: function (item,ev_name,func){
            if (item.attachEvent) {
                item.attachEvent('on'+ev_name, func);
            } else if (item.addEventListener) {
                item.addEventListener(ev_name, func, false);
            } else {
                // The browser does not support Javascript event binding
            }
        },

        /**
         * add class
         */
        addClass: function (item_id,cl_name){
            // TODO remove jQuery dependency
            $('#'+item_id).addClass(cl_name);
        },

        /**
         * remove class
         */
        remClass: function (item_id,cl_name){
            // TODO remove jQuery dependency
            $('#'+item_id).removeClass(cl_name);
        }
    };

});
