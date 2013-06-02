define(['sicki/controllers/Controller', 'sicki/models/EID'], function(Controller, EID) {

    var EIDEventController = Controller.extend({
        Model: EID,

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
