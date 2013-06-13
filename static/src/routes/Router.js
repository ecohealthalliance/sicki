define(['require', 'backbone'], function(require, Backbone) {

    var Router = Backbone.Router.extend({
        routes: {
            '': 'viewIndex',
            'eid': 'viewEIDList',
            'eid/:eid_id/:view': 'viewEID'
        },

        viewIndex: function() {
            require(['sicki/controllers/IndexController'], function(IndexController) {
                if (this.controller)
                    this.controller.remove();
                this.controller = new IndexController({
                    el: '#main'
                });
            });
        },

        viewEID: function(eid_id, view) {
            if (this.controller)
                this.controller.remove();

            if (view == 'info') {
                require(['sicki/models/EIDEvent', 
                         'sicki/controllers/EIDEventInfoController'], 
                        function(EIDEvent, EIDEventInfoController) {
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
            // Todo
        }
    });

    return Router;

});
