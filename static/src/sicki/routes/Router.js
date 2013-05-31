(function() {

    var Router = Backbone.Router.extend({
        routes: {
            'eid': 'viewEIDList',
            'eid/:eid_id/:view': 'viewEID'
        },

        initialize: function(options) {
            //this.on('route:viewEID', this.viewEID);
        },

        viewEID: function(eid_id, view) {
            sicki.controllers.EIDEventController.switchView(eid_id, view);
        },

        viewEIDList: function() {
            //sicki.controllers.EIDListController.activate();
        }
    });

    sicki.routes.Router = Router;

})();
