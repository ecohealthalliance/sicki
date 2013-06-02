define(['text!api/eid/model.json', 'sicki/models/Model'], function(data, Model) {

    console.log(JSON.parse(data));

    var EID = Model.extend({}, {
        endpoint: '/sicki/eid'
    });

    return EID;

});
