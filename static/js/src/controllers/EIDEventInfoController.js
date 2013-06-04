define(['jquery', 'sicki/controllers/Controller', 'sicki/models/EIDEvent'], function($, Controller, EIDEvent) {

    var EIDEventInfoController = Controller.extend({
        initialize: function(options) {
            this.render();
        },

        overview: function() {
            console.log('overview', this.model.get('id'));
        },

        render: function() {
            this.$el.html(sicki.views.eid.info({
                eidEvent: this.model.toJSON()
            }));
        }
    }, {
        Model: EIDEvent,
    });

    return EIDEventInfoController;

});
