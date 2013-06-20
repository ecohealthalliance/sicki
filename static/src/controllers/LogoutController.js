define(['./Controller', 'sicki/views/logout', 'sicki/models/User', 'sicki/utils/ajax'], function(Controller, logoutView, User, ajax) {
    var LogoutController = Controller.extend({
        events: {
            'click .logout': 'logoutUser'
        },
        view: logoutView,

        model: User,

        logoutUser: function() {
            var dataPromise = ajax({
                url: 'user/logout'
            });
            dataPromise.done(function(userModel) {
                User.set(userModel);
            }.bind(this));
            return false;
        }
    });

    return LogoutController;
});
