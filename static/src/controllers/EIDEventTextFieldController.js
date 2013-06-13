define(['sicki/views/eid/fields/text'], function(textView) {
    return {
        view: textView,

        getEditValue: function() {
            return this.$('.edit .text').val();
        }
    };
});
