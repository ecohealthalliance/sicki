define(['jquery', 'sicki/controllers/Controller', 'sicki/models/EIDEvent', 'sicki/views/eid/info'], function($, Controller, EIDEvent, eidInfoView) {

    var EIDEventInfoController = Controller.extend({
        render: function() {
            this.$el.html(eidInfoView({
                eidEvent: this.model.toJSON()
            }));
        }
    }, {
        Model: EIDEvent,
    });

    return EIDEventInfoController;

});
