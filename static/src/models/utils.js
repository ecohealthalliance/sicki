/* Utiltiy functions for models */
define(function() {
    return {
        label: function(field) {
            var nameParts = field.name.split('_');
            var labelParts = nameParts.map(function(name) {
                return name.charAt(0).toUpperCase() + name.slice(1);
            });
            return labelParts.join(' ');
        },

        // Get the default value from a field
        defaultValue: function(field) {
            switch(field.type) {
            case 'text': 
                return '';
            case 'model':
                return [];
            case 'select':
                return field.options[0];
            case 'units':
                return {
                    value: null,
                    units: null
                };
            default:
                return '';
            }
        },

        // Get an object representing all of the default values of a model
        defaults: function(schema) {
            var defaults = {};
            for (var i = 0; i < schema.length; i ++) {
                defaults[schema[i].name] = this.defaultValue(schema[i]);
            }
            return defaults;
        }
    };
});
