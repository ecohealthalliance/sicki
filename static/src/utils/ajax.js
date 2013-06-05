(function() {

    var ajax = function (options) {

        return $.ajax(options).fail(function(error) {
            console.log(error);
        });

    };

    sicki.utils.ajax = ajax;

})();
