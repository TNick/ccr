define([
        './common_init',
        './index_init',
        'domReady!'
       ], function (cmnInit,indexInit, document) {

    cmnInit.run();

    var page_n = location.pathname.substring(
        location.pathname.lastIndexOf("/") + 1)
    if (page_n) {
        page_n = page_n.replace('.html', '');
        page_n = page_n.replace('.php', '');
    }
    if ((!page_n) || (page_n === 'index') || (page_n === 'home')) {
        indexInit.run();
    } else {
        // ...
    }

});
