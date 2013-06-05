define(['backbone'], function(Backbone) {
    var Controller = Backbone.View.extend({
        model: null,

        subControllers: {},

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

        render: function() {
            for (var selector in this.subControllers) {
                this.subControllers[selector].setElement(this.$(selector)).render();
            }
            return this;
        }

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
