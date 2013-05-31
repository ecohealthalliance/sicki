(function() {
    var EIDEventController = sicki.controllers.Controller.extend({
        Model: sicki.models.EID,

        overview: function() {
            console.log('overview', this.model.get('id'));
        },

        info: function() {
            $('#main').html(sicki.views.eid.info({
                eidEvent: this.model.toJSON()
            }));
        }
    });

    sicki.controllers.EIDEventController = new EIDEventController();

})();
