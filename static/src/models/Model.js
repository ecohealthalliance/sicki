/* Base class for all models. Includes CRUD functions for keeping state with the
 * server.
 */ 
define(['backbone', 'sicki/utils/ajax', 'sicki/models/utils'], function(Backbone, ajax, utils) {

    var Model = Backbone.Model.extend({
        // Updates the model on the server, and then sets the corresponding
        // attributes on the client
        update: function(attributes, callback) {
            var dataPromise = ajax({
                url: this.constructor.getEndpoint('update', this.get('id')),
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
                url: this.getEndpoint('read', id),
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
                url: this.getEndpoint('create'),
                type: 'POST',
            });
            dataPromise.done(function(id) {
                var settings = {};
                attributes.extend(settings, {id: id});
                var model = new this(settings);
                if (callback)
                    callback(model);
            });
        },
        
        // Subclass this model, generally from definition from the server
        // This custom extend method does some of the legwork in putting
        // the server side definitions into the right fields
        extendModel: function(dataModel) {
            var options = {};
            var classOptions = {};
            var defaultModel = utils.defaults(dataModel.fields);
            options.defaults = defaultModel;
            classOptions.fields = dataModel.fields;
            classOptions.uri = dataModel.uri;
            return this.extend(options, classOptions);
        },

        // Get the CRUD endpoint on the server for this resource
        getEndpoint: function(action, id) {
            // If there is a trailing slash on the pathname, web2py has serious
            // problems, so replace it if needed
            var pathname = window.location.pathname.replace(/\/$/, '')
            var url = [pathname, this.uri];
            if (action) {
                url.push(action);
                if (id)
                    url.push(id);
            }
            return url.join('/');
        }
    });

    return Model;

});
