define(['sicki/controllers/Controller', 'sicki/controllers/EIDEventFieldController', 'sicki/models/EIDEvent', 'sicki/views/eid/info'], function(Controller, EIDEventFieldController, EIDEvent, eidInfoView) {

    var EIDEventInfoController = Controller.extend({
        initialize: function(options) {
            for (var i = 0; i < EIDEventInfoController.Model.fields.length; i ++) {
                var field = EIDEventInfoController.Model.fields[i];
                this.subControllers['.' + field.name] = new EIDEventFieldController({
                    model: this.model.toJSON(),
                    field: field
                });
            }
            return Controller.prototype.initialize.call(this, options);
        },

        render: function() {
            this.$el.html(eidInfoView({
                Model: EIDEventInfoController.Model
            }));
            return Controller.prototype.render.call(this);
        }
    }, {
        Model: EIDEvent,
    });

    return EIDEventInfoController;

});
