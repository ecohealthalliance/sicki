define(['json!api/eid/model.json', 'sicki/models/Model'], function(dataModel, Model) {

    var EIDEvent = Model.extend({
        defaults: dataModel.defaults
    }, {
        endpoint: '/sicki/eid'
    });

    return EIDEvent;

});
