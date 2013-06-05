define(['backbone'], function(Backbone) {
    var Controller = Backbone.View.extend({
        model: null,

        initialize: function(options) {
            if (options.model)
                options.model.on('change', function() {
                    this.render();
                }.bind(this));
            this.render();
        },

        isCurrentModel: function(id) {
            if (!this.model)
                return false;
            return (this.model.get('id') == id);
        },

        render: function() {}

    }, {
        Model: null,

        create: function(id, options, callback) {
            this.Model.read(id, function(model) {
                var settings = {model: model};
                _.extend(settings, options);
                var controller = new this(settings);
                callback(controller);
            }.bind(this))
        }
    });

    return Controller;

});
