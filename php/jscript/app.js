// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'jscript/lib-debug',
    paths: {
        app: '../ccr',
        nls: '../nls',
        toastr: '../toastr',
        jquery: 'jquery-1.11.1'
    }
});

// Start loading the main app file.
requirejs(['jquery', '../ccr/main']);
