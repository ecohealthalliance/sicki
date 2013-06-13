define(['sicki/controllers/Controller', 'sicki/controllers/EIDEventTextFieldController', 'sicki/controllers/EIDEventSelectFieldController', 'sicki/models/utils'], function(Controller, textMixin, selectMixin, utils) {

    var EIDEventFieldController = Controller.extend({
        field: null,

        events: {
            'click .edit .commit': 'commitChange'
        },

        initialize: function(options) {
            this.field = options.field;

            // Mixin the correct template and editing type
            var fieldType = this.field.type;
            if (fieldType == 'text' || fieldType === undefined)
                _.extend(this, textMixin);
            else if (fieldType == 'select')
                _.extend(this, selectMixin);

            // Bind change:<field> events to rendering of the view
            var settings = _.extend({
                listeners: {}
            }, options);
            settings.listeners['change:' + this.field.name] = options.model;

            return Controller.prototype.initialize.call(this, settings);
        },

        viewArgs: function() {
            return {
                label: utils.label(this.field),
                value: this.model.get(this.field.name),
                field: this.field
            };
        },

        view: function() {
            // Temp reminder for types that do not yet have templates
            this.$el.html('<div>No template for type <b>' + this.field.type  + '</b></div>')
        },

        commitChange: function() {
            var editVal = this.getEditValue();
            var updateField = {};
            updateField[this.field.name] = editVal;
            this.model.update(updateField);
        },

        getEditValue: function() {
            return '';
        }
    });

    return EIDEventFieldController;

});
