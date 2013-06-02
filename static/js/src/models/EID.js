define(['text!api/eid/model.json', 'sicki/models/Model'], function(data, Model) {

    var dataModel = JSON.parse(data);

    var EID = Model.extend({
        defaults: dataModel.defaults
    }, {
        endpoint: '/sicki/eid'
    });

    return EID;

});
