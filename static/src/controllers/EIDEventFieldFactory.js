define(['sicki/controllers/EIDEventFieldController', 'sicki/controllers/EIDEventTextFieldController', 'sicki/controllers/EIDEventSelectFieldController', 'sicki/controllers/EIDEventDateFieldController', 'sicki/controllers/EIDEventUnitsFieldController'], function(Field, Text, Select, Date, Units) {
    return function(field) {
        if (field.type == 'text' || field.type === undefined)
            return Text;
        else if (field.type == 'select')
            return Select;
        else if (field.type == 'date')
            return Date;
        else if (field.type == 'units')
            return Units;
        else
            return Field;
    };
});
