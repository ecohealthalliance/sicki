define(['jquery', 'sicki/controllers/Controller', 'sicki/models/EIDEvent'], function($, Controller, EIDEvent) {

    var EIDEventController = Controller.extend({
        Model: EIDEvent,

        overview: function() {
            console.log('overview', this.model.get('id'));
        },

        info: function() {
            $('#main').html(sicki.views.eid.info({
                eidEvent: this.model.toJSON()
            }));
        }
    });

    return new EIDEventController();

});
