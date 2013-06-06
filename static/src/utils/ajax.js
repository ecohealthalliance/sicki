define(['jquery', 'underscore'], function($, _) {

    var ajax = function (options) {

        var settings = _.extend({dataType: 'json'}, options);

        return $.ajax(settings).fail(function(error) {
            console.log(error);
        });

    };

    return ajax;

});
