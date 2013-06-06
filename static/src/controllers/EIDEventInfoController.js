define(['sicki/controllers/Controller', 'sicki/controllers/EIDEventFieldController', 'sicki/models/EIDEvent', 'sicki/views/eid/info'], function(Controller, EIDEventFieldController, EIDEvent, eidInfoView) {

    var EIDEventInfoController = Controller.extend({
        initialize: function(options) {
            var Model = EIDEventInfoController.Model;
            // Initialize a subcontroller for each field of the model
            Model.fields.forEach(function(field) {
                this.subControllers['.' + field.name] = new EIDEventFieldController({
                    model: this.model,
                    field: field,
                });
            }.bind(this));
            return Controller.prototype.initialize.call(this, options);
        },

        view: eidInfoView,

        viewArgs: function() {
            return {
                Model: EIDEventInfoController.Model
            };
        }

    }, {
        Model: EIDEvent,
    });

    return EIDEventInfoController;

});
