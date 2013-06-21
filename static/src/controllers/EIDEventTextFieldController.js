define(['sicki/controllers/EIDEventFieldController', 'sicki/views/eid/fields/text'], function(EIDEventFieldController, textView) {
    return EIDEventFieldController.extend({
        view: textView,

        getEditValue: function() {
            return this.$('.edit .text').val();
        }
    });
});
