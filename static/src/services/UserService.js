define(['json!api/user'], function(initialUserModel) {
    
    var UserService = {
        userModel: null,
        getUser: function() {
            return this.userModel;
        },
        removeUser: function() {
            this.userModel = null;
        },
        setUser: function(userModel) {
            this.userModel = new Backbone.Model(userModel);
        }
    };
    
    if (initialUserModel)
        UserService.setUser(initialUserModel);

    return UserService;
});
