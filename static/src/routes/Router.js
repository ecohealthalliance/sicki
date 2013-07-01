define(['require', 'backbone', 'sicki/models/User'], function(require, Backbone, User) {

    var Router = Backbone.Router.extend({
        routes: {
            '': 'viewIndex',
            'login/*redirect': 'viewLoginRequired',
            'eid': 'viewEIDList',
            'eid/:eid_id/:view': 'viewEID'
        },

        initialize: function() {
            User.on('change:loggedIn', this.viewUser.bind(this));
            this.viewUser();
        },

        viewUser: function() {
            require(['sicki/controllers/LoginController', 'sicki/controllers/LogoutController'], function(LoginController, LogoutController) {
                if (!User.get('loggedIn')) {
                    this.userController = new LoginController({
                        el: $('#login')
                    });
                }
                else {
                    this.userController = new LogoutController({
                        el: $('#login')
                    });
                }
            });
        },

        viewLoginRequired : function (redirect) {
            require(['sicki/controllers/LoginRequiredController'], function (LoginRequiredController) {
                if (this.controller) {
                    this.controller.stopListening();
                }

                this.controller = new LoginRequiredController({
                    el: '#main',
                    redirect: redirect
                });
            });
        },

        viewIndex: function() {
            require(['sicki/controllers/IndexController'], function(IndexController) {
                if (this.controller)
                    this.controller.stopListening();

                this.controller = new IndexController({
                    el: '#main'
                });
            });
        },

        viewEID: function(eid_id, view) {
            if (this.controller)
                this.controller.stopListening();

            if (view == 'info') {
                require(['sicki/controllers/EIDEventInfoController'],
                        function(EIDEventInfoController) {
                            EIDEventInfoController.create(eid_id, {
                                el: '#main'
                            }, function(controller) {
                                this.controller = controller;
                            }.bind(this));
                        });
            }
            else
                throw "Not Implemented";
        },

        viewEIDList: function() {
            if (this.controller)
                this.controller.stopListening();
            
            require(['sicki/controllers/EIDEventListController'], function(EIDEventListController) {
                this.controller = new EIDEventListController({
                    el: '#main'
                });
            }.bind(this));
        }
    });

    return Router;

});
