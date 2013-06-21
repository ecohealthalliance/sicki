define(['sicki/controllers/EIDEventFieldController', 'sicki/views/eid/fields/units'], function(EIDEventFieldController, unitsView) {
    return EIDEventFieldController.extend({
        view: unitsView,

        getEditValue: function() {
            return {
                text: this.$('.edit .text').val(),
                units: this.$('.edit select').val(),
            };
        }
    });
});
