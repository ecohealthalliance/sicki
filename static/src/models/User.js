define(['json!user'], function(userData) {

    var User = new Backbone.Model(userData);

    return User;
});
