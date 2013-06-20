define(['sicki/views/eid/fields/date'], function(dateView) {
    return {
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
    };
});
