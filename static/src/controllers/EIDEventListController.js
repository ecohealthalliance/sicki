define(['sicki/utils/ajax', 'sicki/views/eid/index'], function(ajax, eidListView) {
    var EIDEventListController = Backbone.View.extend({
        models: null,

        constructor: function() {
            this.models = new Backbone.Collection();
            Backbone.View.apply(this, arguments);
        },

        initialize: function(options) {
            var dataPromise = ajax({
                url: 'eid/read_all',
                dataType: 'json',
                data: {
                    fields: JSON.stringify(['event_name'])
                }
            });
            dataPromise.done(function(events) {
                this.models.add(events);
                this.ready();
            }.bind(this));
        },

        ready: function() {
            this.models.on('add', function() {
                this.render();
            }.bind(this));

            this.render();
        },

        render: function() {
            this.$el.html(eidListView({
                models: this.models.toJSON()
            }));
        }
    });

    return EIDEventListController;
});
