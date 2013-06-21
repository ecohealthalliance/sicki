define(['sicki/controllers/EIDEventFieldController', 'sicki/views/eid/fields/date'], function(EIDEventFieldController, dateView) {
    return EIDEventFieldController.extend({
        view: dateView,

        getEditValue: function() {
            var emptyOrNum = function(value) {
                var num = parseInt(value);
                if (isNaN(num))
                    return '';
                else
                    return num;
            };
            return {
                year: emptyOrNum(this.$('.edit .year').val()),
                month: emptyOrNum(this.$('.edit .month').val()),
                day: emptyOrNum(this.$('.edit .day').val())
            }
        }
    });
});
