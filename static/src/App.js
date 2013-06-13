define(['jquery', 'sicki/routes/Router', 'sicki/views/app'], function($, Router, mainView) {

    var App = function(options) {
        var router = new Router({
            root: options.root
        });
        
        var $el = $(mainView());
        $('body').append ($el);
        Backbone.history.start();
    };

    return App;

});
