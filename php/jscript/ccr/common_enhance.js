define(['jquery'], function (jquery) {


    return {
        /**
         * add event
         */
        registerEvent: function (item,ev_name,func){
            try{
            if (item.attachEvent) {
                item.attachEvent('on'+ev_name, func);
            } else if (item.addEventListener) {
                item.addEventListener(ev_name, func, false);
            } else {
                // The browser does not support Javascript event binding
            }
            } catch(exc) {
                console.log(exc);
            };
        },

        /**
         * remove event
         */
        unregisterEvent: function (item,ev_name,func){
            if (item.detachEvent) {
                item.detachEvent('on'+ev_name, func);
            } else if (item.removeEventListener) {
                item.removeEventListener(ev_name, func, false);
            } else {
                // The browser does not support Javascript event binding
            }
        },

        /**
         * add class
         */
        addClass: function (item_id,cl_name){
            // TODO remove jQuery dependency
            jquery('#'+item_id).addClass(cl_name);
        },

        /**
         * remove class
         */
        remClass: function (item_id,cl_name){
            // TODO remove jQuery dependency
            jquery('#'+item_id).removeClass(cl_name);
        }
    };

});
