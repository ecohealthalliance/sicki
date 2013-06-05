define(function() {
    return {
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

        defaults: function(schema) {
            var defaults = {};
            for (var i = 0; i < schema.length; i ++) {
                defaults[schema[i].name] = this.defaultValue(schema[i]);
            }
            return defaults;
        }
    };
});
