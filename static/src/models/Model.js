/* Base class for all models. Includes CRUD functions for keeping state with the
 * server.
 */ 
define(['backbone', 'sicki/utils/ajax'], function(Backbone, ajax) {

    var Model = Backbone.Model.extend({
        // The api endpoint to contact for CRUD methods
        endpoint: null,

        // Updates the model on the server, and then sets the corresponding
        // attributes on the client
        update: function(attributes, callback) {
            var dataPromise = ajax({
                url: this.constructor.endpoint + '/update/' + this.get('id'),
                type: 'PUT',
                data: attributes
            });
            dataPromise.done(function() {
                this.set(attributes);
                if (callback)
                    callback();
            }.bind(this));
        },

        // Deletes the model from the server
        delete: function() {
            throw "Not Implemented";
        }
    }, {
        // Loads a model from the server and passes it to a callback.
        // This is the prefered way to instantiate models
        read: function(id, callback) {
            var dataPromise = ajax({
                url: this.endpoint + '/read/' + id,
                type: 'GET',
            });
            dataPromise.done(function(data) {
                var model = new this(data);
                if (callback)
                    callback(model);
            }.bind(this));
        },

        // Creates an new instance of the model on the server
        create: function(attributes, callback) {
            var dataPromise = ajax({
                url: this.endpoint + '/create/',
                type: 'POST',
            });
            dataPromise.done(function(id) {
                var settings = {};
                attributes.extend(settings, {id: id});
                var model = new this(settings);
                if (callback)
                    callback(model);
            });
        }
    });

    return Model;

});
