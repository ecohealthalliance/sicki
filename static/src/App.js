define(['jquery', 'sicki/routes/Router', 'sicki/views/main'], function($, Router, mainView) {

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

/*(function() {
    var App = function(options) {
        var router = new sicki.routes.Router({
            root: options.root
        });
        
        var $el = $(sicki.views.main());
        $('body').append ($el);
        Backbone.history.start();
    };

    sicki.App = App;

})();*/
