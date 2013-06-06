/* This module defines a Controller base class. To subclass, you will need to extend
 * some key properties.
 *
 * 
 * Model, a static property, specifies the constructor for model that this controller 
 * will use
 * 
 * view is the template function. It should return and html string
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
        subControllers: {},

        // A mapping between events's to listen for and objects to listen to
        listeners: {},

        // The main view of this controller
        view: function() {
            return '';
        },

        // the arguments to pass to the view of this controller
        viewArgs: function() {
            return {
                model: model.toJSON()
            };
        },

        initialize: function(options) {
            _.extend(this, options);
            if (options.model) {
                for (var event in this.listeners) {
                    this.listeners[event].on(event, function() {
                        this.render();
                    }.bind(this));
                }
            }
            this.render();
        },

        isCurrentModel: function(id) {
            if (!this.model)
                return false;
            return (this.model.get('id') == id);
        },

        render: function() {
            this.$el.html(this.view(this.viewArgs()));
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
