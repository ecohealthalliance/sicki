define(['./Controller', 'sicki/views/login', 'sicki/models/User', 'sicki/utils/ajax'], function(Controller, loginView, User, ajax) {
    var LoginController = Controller.extend({
        events: {
            'submit form': 'loginUser',
            //'click .logout': 'logoutUser'
        },
        view: loginView,

        loginUser: function() {
            var dataPromise = ajax({
                url: 'user/login',
                data: this.$el.find('form').serialize()
            });
            dataPromise.done(function(userModel) {
                User.set(userModel);
            });
            return false;
        }

        /*logoutUser: function() {
            var dataPromise = ajax({
                url: 'user/logout'
            });
            dataPromise.done(function(done) {
                if (done)
                    this.model = null;
                this.render();
            }.bind(this));
            return false;
        }*/
    });

    return LoginController;
});
