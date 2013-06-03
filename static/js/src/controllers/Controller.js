define(['backbone'], function(Backbone) {
    var Controller = Backbone.View.extend({
        Model: null,
        model: null,

        isCurrentModel: function(id) {
            if (!this.model)
                return false;
            return (this.model.get('id') == id);
        },

        setModel: function(id, callback) {
            if (!this.isCurrentModel(id)) {
                console.log('goto server');
                this.Model.read(id, function(model) {
                    this.model = model;
                    callback();
                }.bind(this));
            }
            else {
                console.log('use cached model');
                _.defer(function() {
                    callback();
                });
            }
        },

        switchView: function(id, view) {
            this.setModel(id, function() {
                this[view]();
            }.bind(this));
        }

    });

    return Controller;

});
