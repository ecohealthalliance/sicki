/* This module defines a Controller base class. It handles basic model listening and 
 * rendering of views and subviews. To start a controller, or any of its subclasses 
 * with a model from the server, use the static create method. To correctly subclass 
 * this object, you will need to extend some key properties:
 * 
 * Model, a static property, specifies the constructor for model that this controller 
 * will use
 * 
 * view is the template function. It should return an html string
 * 
 * viewArgs specifies what parameters to pass to the view functions. It returns an 
 * object
 *
 * subControllers defines a mapping between DOM elements in this view and descendant 
 * controllers. These subControllers will be rendered whenever the parent view is
 * rendered
 *
 * listeners is a mapping that defines under what circumstances the view should be 
 * updated
 * 
 */ 
define(['backbone'], function(Backbone) {

    var Controller = Backbone.View.extend({
        // The model this controller uses
        model: null,

        // A mapping between selectors and subcontrollers of the controller
        subControllers: null,

        // A mapping between events's to listen for and objects to listen to
        // listeners: null,

        // Events on the view to listen for and handle
        events: {},

        // The main view of this controller
        // Abstract method: generally this should be changed in subclasses
        view: function() {
            return '';
        },

        // The arguments to pass to the view of this controller
        // The default is a json representation of the model
        viewArgs: function() {
            return {
                model: this.model ? this.model.toJSON() : null
            };
        },

        constructor: function() {
            // Bind default attributes to the instance.
            // This is done because prototypical inheritance would
            // have these objects shared by reference otherwise
            this.subControllers = {};
            //this.listeners = {};
            Backbone.View.apply(this, arguments);
        },

        initialize: function(options) {
            // Allow overrides of options as properties on the controller
            _.extend(this, options);

            /*if (options.model) {
                // Set up listening for changes on models
                for (var event in this.listeners) {
                    this.listeners[event].on(event, function() {
                        this.render();
                    }.bind(this));
                }
            }*/
            this.render();
        },

        // Check if this.model matches an id
        isCurrentModel: function(id) {
            if (!this.model)
                return false;
            return (this.model.get('id') == id);
        },

        // Render this view and all subviews
        render: function() {
            this.$el.html(this.view(this.viewArgs()));
            for (var selector in this.subControllers) {
                this.subControllers[selector].setElement(this.$(selector)).render();
            }
            return this;
        }

    }, {
        // The constructor for this controller's model
        Model: null,

        // Factory method to asynchronously create an instance of this controller
        // with data from the server
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
