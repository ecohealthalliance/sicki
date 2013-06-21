define(['sicki/controllers/Controller', 'sicki/models/utils'], function(Controller, utils) {

    var EIDEventFieldController = Controller.extend({
        field: null,

        events: {
            'click .edit .commit': 'commitChange',
            'click .show-edit': 'toggleEdit'
        },

        initialize: function(options) {
            this.field = options.field;

            /*// Bind change:<field> events to rendering of the view
            var settings = _.extend({
                listeners: {}
            }, options);*/
            //settings.listeners['change:' + this.field.name] = options.model;
            this.model.on('change:' + this.field.name, this.render.bind(this));

            return Controller.prototype.initialize.call(this, options);
        },

        viewArgs: function() {
            return {
                label: utils.label(this.field),
                value: this.model.get(this.field.name),
                field: this.field,
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
        },
        
        toggleEdit: function() {
            this.$el.find('.edit').toggle(200);
        }
    });

    return EIDEventFieldController;

});
