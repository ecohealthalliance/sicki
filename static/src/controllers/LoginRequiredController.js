define(['sicki/controllers/Controller', 'sicki/models/User', 'sicki/views/login_required'], function(Controller, User, loginRequiredView) {
    var LoginRequiredController = Controller.extend({
        view: loginRequiredView,

        initialize : function (settings) {
            this.listenTo(User, 'change', function () {
                this.stopListening();
                window.location.hash = settings.redirect || '';
            });
            Controller.prototype.initialize.call(this, settings);
        }
    });
    
    return LoginRequiredController;
});
