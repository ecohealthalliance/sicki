define(['require', 'backbone'], function(require, Backbone) {

    var Router = Backbone.Router.extend({
        routes: {
            'eid': 'viewEIDList',
            'eid/:eid_id/:view': 'viewEID'
        },

        viewEID: function(eid_id, view) {
            if (this.controller)
                this.controller.remove();

            if (view == 'info') {
                require(['sicki/models/EIDEvent', 'sicki/controllers/EIDEventInfoController'], function(EIDEvent, EIDEventInfoController) {
                    EIDEventInfoController.create(eid_id, {
                        el: '#main'
                    }, function(controller) {
                        this.controller = controller;
                        output = controller;
                    }.bind(this));
                });
            }
            else
                throw "Not Implemented";
        },

        viewEIDList: function() {
            // sicki.controllers.EIDListController.activate();
        }
    });

    return Router;

});