define(['sicki/views/eid/fields/select'], function(selectView) {
    return {
        view: selectView,

        getEditValue: function() {
            return this.$('.edit select').val();
        }
    };
});
