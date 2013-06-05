define({
    load: function(name, req, onload, config) {
        require(['text!' + name], function(data) {
            onload(JSON.parse(data));
        });
    }
});
