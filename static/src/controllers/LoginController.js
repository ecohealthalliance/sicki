define(['./Controller', 'sicki/views/login', 'json!api/user', 'sicki/utils/ajax'], function(Controller, loginView, userModel, ajax) {
    var LoginController = Controller.extend({
        events: {
            'submit form': 'loginUser',
            'click .logout': 'logoutUser'
        },
        view: loginView,

        model: userModel ? new Backbone.Model(userModel) : null,

        loginUser: function() {
            var dataPromise = ajax({
                url: 'user/login',
                data: this.$el.find('form').serialize()
            });
            dataPromise.done(function(userModel) {
                if (userModel)
                    this.model = new Backbone.Model(userModel);
                this.render();
            }.bind(this));
            return false;
        },

        logoutUser: function() {
            var dataPromise = ajax({
                url: 'user/logout'
            });
            dataPromise.done(function(done) {
                if (done)
                    this.model = null;
                this.render();
            }.bind(this));
            return false;
        }
    });

    return LoginController;
});
