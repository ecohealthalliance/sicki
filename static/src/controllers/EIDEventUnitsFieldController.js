define(['sicki/views/eid/fields/units'], function(unitsView) {
    return {
        view: unitsView,

        getEditValue: function() {
            return {
                text: this.$('.edit .text').val(),
                units: this.$('.edit select').val(),
            };
        }
    };
});
