define(['./Model'], function(Model) {

    var EID = Model.extend({}, {
        endpoint: '/sicki/eid'
    });

    return EID;

});
