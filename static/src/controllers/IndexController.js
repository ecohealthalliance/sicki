define(['sicki/controllers/Controller', 'sicki/views/index'], function(Controller, indexView) {
    var IndexController = Controller.extend({
        view: indexView
    });
    
    return IndexController;
});
