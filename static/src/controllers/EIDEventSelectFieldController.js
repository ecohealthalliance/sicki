define(['sicki/controllers/EIDEventFieldController', 'sicki/views/eid/fields/select'], function(EIDEventFieldController, selectView) {
    return EIDEventFieldController.extend ({
        view: selectView,

        getEditValue: function() {
            return this.$('.edit select').val();
        }
    });
});
