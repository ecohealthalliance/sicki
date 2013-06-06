/* A controller for showing EID event info data with a proposal interface and admin
 * editable interface. Contains subcontrollers for rendering and each field type
 * correctly
 */
define(['sicki/controllers/Controller', 'sicki/controllers/EIDEventFieldController', 'sicki/models/EIDEvent', 'sicki/views/eid/info'], function(Controller, EIDEventFieldController, EIDEvent, eidInfoView) {

    var EIDEventInfoController = Controller.extend({
        initialize: function(options) {
            var Model = EIDEventInfoController.Model;
            // Initialize a subcontroller for each field of the model
            // These subcontrollers will handle events sent by the model and 
            // updates to the editable area.
            Model.fields.forEach(function(field) {
                this.subControllers['.' + field.name] = new EIDEventFieldController({
                    model: this.model,
                    field: field,
                });
            }.bind(this));
            return Controller.prototype.initialize.call(this, options);
        },

        view: eidInfoView,

        // The top level view only needs the main model contructor to render
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
