define(['backbone', 'sicki/views/eid/field'], function(Backbone, fieldView) {

    var EIDEventFieldController = Backbone.View.extend({
        field: null,

        initialize: function(options) {
            this.field = options.field;
        },

        render: function() {
            this.$el.html(fieldView({
                model: this.model,
                field: this.field
            }))
        }
    });

    return EIDEventFieldController;

});
