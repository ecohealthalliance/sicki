define(['jquery', 'sicki/routes/Router', 'sicki/controllers/LoginController', 'sicki/views/app'], function($, Router, LoginController, mainView) {

    var App = function(options) {
        var $el = $(mainView());
        $('body').append ($el);

        var router = new Router({
            root: options.root
        });

        Backbone.history.start({
            pushState: false
        });
    };

    return App;

});
