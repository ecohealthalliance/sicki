/* A representation of an EID event */
define(['json!api/eid/model.json', 'sicki/models/Model', 'sicki/models/utils'], function(dataModel, Model, utils) {

    var defaultModel = utils.defaults(dataModel);

    var EIDEvent = Model.extend({
        defaults: defaultModel
    }, {
        endpoint: '/sicki/eid',
        fields: dataModel
    });

    return EIDEvent;

});
