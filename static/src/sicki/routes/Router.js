(function() {

    var Router = Backbone.Router.extend({
        routes: {
            'eid': 'viewEIDList',
            'eid/:eid_id/:view': 'viewEID'
        },

        viewEID: function(eid_id, view) {
            sicki.controllers.EIDEventController.switchView(eid_id, view);
        },

        viewEIDList: function() {
            // sicki.controllers.EIDListController.activate();
        }
    });

    sicki.routes.Router = Router;

})();
