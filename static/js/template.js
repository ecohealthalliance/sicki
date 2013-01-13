var Template;

function format_label (field) {
    var label = field.label;
    if (!label)
	label = field.name;
    return $ ('<div class="title">' + label + '</div>');
};

(function () {

    var as_text = function (value) {
	if (!value)
	    return '';
	return value;
    };

    var TextTemplate = function (field) {

	this.html = function (value) {
	    return $ ('<span>' + as_text (value) + '</span>');
	};

	this.text = function (value) {
	    return value;
	};

	this.input = function (value) {
	    //return $ ('<input type="text" value="' + as_text (value) + '" />').addClass ('text');
	    return $ ('<textarea>' + as_text (value) + '</textarea>').css ({
		width: '95%',
		height: 100
	    });
	};

	this.val = function (input) {
	    return input.val ();
	};
    };

    var SetTemplate = function (field) {
	this.html = function (value) {
	    return $ ('<span>' + as_text (value) + '</span>');
	};
	
	this.text = function (value) {
	    return value;
	};

	this.input = function (value) {
	    var select = $ ("<select></select>");
	    $.each (field.set, function (i, val) {
		var name = as_text (val);
		var option = $ ('<option>' + name + '</option>');
		if (name == value)
		    option.attr ('selected', 'selected');
		select.append (option);
	    });
	    return select; 
	};

	this.val = function (input) {
	    return input.val ();
	};
    };

    var ListTemplate = function (field) {

	var format_label = function (field) {
	    var label = field.label;
	    if (!label)
		label = field.name;
	    return $ ('<div class="sublabel">' + label + '</div>');
	};

	// if field has children iterates and appends elements for each kid using subformt fn
	var format_item = function (field, item, subformat) {
	    var elem =  $ ('<div class="sublist"></div>');
	    // j is the array index - not used
	    $.each (field.children, function (j, subfield) {
		    elem.append (format_label (subfield)).append (subformat  (item, subfield.name));
	    });
	    return elem;
	};

	var format_list = function (field, value, subformat) {
	    var val_list = $ ('<div></div>');
	    $.each (value, function (i, item) {
		var elem = format_item (field, item, subformat);
		val_list.append (elem);
	    });
	    return val_list;
	};

	this.html = function (value) {
	    var format_val = function (item, key) {
		if (!(key in item))
		    return '';
		else
		    return '<div class="subitem">' + item[key] + '</div>';
	    };
	    
	    var val_list = format_list (field, value, format_val);
	    return $ ('<span></span>').append (val_list);
	};

	this.text = function (value) {
	    throw "Not Implemented";
	};

	// editor for list -> format_list -> format_item puts up forms for children of list
	this.input = function (value) {
	    // function for input layout for kids
	    var format_input = function (item, key) {
		var val;
		if (!(key in item))
		    val = '';
		else
		     val = item[key];
		// create & return the input element
		var inp_html = '<input class="' + key + '" type="text" value="' + val + '" ';
		inp_html += 'placeholder="Enter value" />';
		return $(inp_html);
	    };
	    
	    var wrapper = $ ('<div></div>');
	    var val_list = format_list (field, value, format_input);
	    var add_item = $ ('<a href="#">Add Item</a>').click (function () {
		val_list.append (format_item (field, {}, format_input));
		return false;
	    });
	    wrapper.append (val_list).append (add_item);
	    return wrapper;
	};

	this.val = function (input) {
	    throw "Not Implemented";
	};
    };

    var DateTemplate = function (field) {
	var month_name = {
	    1: 'Jan',
	    2: 'Feb',
	    3: 'Mar',
	    4: 'Apr',
	    5: 'May',
	    6: 'Jun',
	    7: 'Jul',
	    8: 'Aug',
	    9: 'Sep',
	    10: 'Oct',
	    11: 'Nov',
	    12: 'Dec',
	};
	var format_date = function (day, month, year) {
	    return $.map ([month_name[month], day, year], function (item) {
		return as_text (item);
	    }).join (' ');
	};
	
	this.html = function (value) {
	    if (!value)
		value = {};
	    return $ ('<span>' + format_date (value.day, value.month, value.year) + '</span>');
	};

	this.text = function (value) {
	    if (!value)
		value = {};
	    return format_date (value.day, value.month, value.year);
	};

	this.input = function (value) {
	    var month_picker = $ ('<select><option value=""></option></select>').addClass ('month');
	    for (var key in month_name) {
		var month = $ ('<option></option>').text (month_name[key]).attr ('value', key);
		if (key == value.month)
		    month.attr ('selected', 'selected');
		month_picker.append (month);
	    }
	    //return $ ('<input type="text" value="' + as_text (value) + '" />');
	    var year_picker = $ ('<input type="text"  maxlength="4" size="4" />').addClass ('year').val (as_text (value.year));
	    var day_picker = $ ('<input type="text"  maxlength="2" size="2" />').addClass ('day').val (as_text (value.day));
	    return $ ('<span></span>').append (month_picker).append (day_picker).append (year_picker);
	};

	this.val = function (input) {
	    return {
		year: input.children ('.year').val (),
		month: input.children ('.month').val (),
		day: input.children ('.day').val ()
	    };
	};	
    };

    var UnitTemplate = function (field) {

	this.html = function (value) {
	    return $ ('<span>' + this.text (value) + '</span>');
	};
	
	this.text = function (value) {
	    if (!value)
		value = {};
	    return as_text (value.val)  + ' ' + as_text (value.units);
	};
	
	this.input = function (value) {
	    var select = $ ("<select></select>").addClass ('units');
	    $.each (field.units, function (i, val) {
		var name = as_text (val);
		var option = $ ('<option>' + name + '</option>');
		if (name == value.units)
		    option.attr ('selected', 'selected');
		select.append (option);
	    });
	    var text_field = $ ('<input type="text" />').addClass ('val').attr ('value', value.val);
	    return $('<span></span>').append (text_field).append (select);
	};

	this.val = function (input) {
	    return {
		val: input.children ('.val').val (),
		units: input.children ('.units').val ()
	    };
	};
    };

    // return different template according to field type
    Template = function (field, value) {
	var template;
	if (field.type == 'text' || !field.type)
	    template = new TextTemplate (field, value);
	else if (field.type == 'set')
	    template = new SetTemplate (field, value);
	else if (field.type == 'list')
	    template = new ListTemplate (field, value);
	else if (field.type == 'date')
	    template = new DateTemplate (field, value);
	else if (field.type == 'value_units')
	    template = new UnitTemplate (field, value);
	else 
	    template = undefined;
	return template;
    };
}) ();
