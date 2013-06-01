define(['require'], function(require) {

    var Router = Backbone.Router.extend({
        routes: {
            'eid': 'viewEIDList',
            'eid/:eid_id/:view': 'viewEID'
        },

        viewEID: function(eid_id, view) {
            require(['../controllers/EIDEventController'], function(EIDEventController) {
                EIDEventController.switchView(eid_id, view);
            });
        },

        viewEIDList: function() {
            // sicki.controllers.EIDListController.activate();
        }
    });

    return Router;

});
