define(['jquery', 'underscore'], function($, _) {

    var UNAUTHORIZED_STATUS = 401;

    var ajax = function (options) {

        var settings = _.extend({dataType: 'json'}, options);

        return $.ajax(settings).fail(function(error) {
            if (error.status === UNAUTHORIZED_STATUS) {
                window.location.hash = 'login/' + window.location.hash;
                window.location.reload();
            } else {
                console.log(error);
            }
        });

    };

    return ajax;

});
