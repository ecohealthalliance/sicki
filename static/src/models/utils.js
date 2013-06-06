/* Utiltiy functions for models */
define(function() {
    return {
        // Get the default value from a field
        defaultValue: function(item) {
            switch(item.type) {
            case 'text': 
                return '';
            case 'model':
                return [];
            case 'select':
                return item.options[0];
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
