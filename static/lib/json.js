define(['sicki/utils/ajax'], function (ajax) {
    var load = function(name, req, onload, config) {
        ajax({url: name}).done(onload);
    };

    return { load: load };
});
