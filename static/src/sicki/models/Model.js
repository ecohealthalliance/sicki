(function() {

    var Model = Backbone.Model.extend({
        update: function(attributes, callback) {
            $.ajax({
                url: this.constructor.endpoint + '/update/' + this.get('id'),
                type: 'POST',
                data: attributes
            }).done(function() {
                this.set(attributes);
                if (callback)
                    callback();
            }.bind(this)).fail(function() {
                throw "Update of model on server failed";
            });
        },

        delete: function() {
            throw "Not Implemented";
        }
    }, {
        read: function(id, callback) {
            $.ajax({
                url: this.endpoint + '/read/' + id,
                dataType: 'json'
            }).done(function(data) {
                var model = new this(data);
                if (callback)
                    callback(model);
            }.bind(this));
        },
        create: function(attributes, callback) {
            $.ajax({
                url: this.endpoint + '/update/' + id,
                dataType: 'json'
            }).done(function(id) {
                var settings = {};
                attributes.extend(settings, {id: id});
                var model = new this(settings);
                if (callback)
                    callback(model);
            }).fail(function() {
                throw "Create of model on server failed";
            });
        }
    });

    sicki.models.Model = Model;

}());
