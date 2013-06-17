define(['jquery', 'sicki/routes/Router', 'sicki/controllers/LoginController', 'sicki/views/app'], function($, Router, LoginController, mainView) {

    var App = function(options) {
        var router = new Router({
            root: options.root
        });
        
        var $el = $(mainView());
        $('body').append ($el);

        var loginController = new LoginController({
            el: $el.find('#login')
        });

        Backbone.history.start();
    };

    return App;

});
