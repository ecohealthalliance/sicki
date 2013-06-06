define(['sicki/controllers/Controller', 'sicki/views/eid/field'], function(Controller, fieldView) {

    var EIDEventFieldController = Controller.extend({
        field: null,

        events: {
            'click .edit .commit': 'commitChange'
        },

        initialize: function(options) {
            this.field = options.field;

            // Bind change:<field> events to rendering of the view
            var settings = _.extend({
                listeners: {}
            }, options);
            settings.listeners['change:' + this.field.name] = options.model;

            return Controller.prototype.initialize.call(this, settings);
        },

        viewArgs: function() {
            return {
                model: this.model.toJSON(),
                field: this.field
            };
        },

        view: fieldView,

        commitChange: function() {
            var textVal = this.$('.edit .text').val();
            var updateField = {};
            updateField[this.field.name] = textVal;
            this.model.update(updateField);
        }
    });

    return EIDEventFieldController;

});
