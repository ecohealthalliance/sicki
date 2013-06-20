/* A representation of an EID event */
define(['json!eid/model.json', 'sicki/models/Model'], function(dataModel, Model) {

    var EIDEvent = Model.extendModel(dataModel);

    return EIDEvent;

});
