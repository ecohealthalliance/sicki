var Template;

(function () {

    var as_text = function (value) {
	if (!value)
	    return '';
	return value;
    };

    var TextTemplate = function (field, value) {

	this.html = function () {
	    return $ ('<span>' + as_text (value) + '</span>');
	};

	this.text = function (value) {
	    return value;
	};

	this.input = function () {
	    return $ ('<input type="text" value="' + as_text (value) + '" />');
	};

	this.val = function (input) {
	    return input.val ();
	};
    };

    var SetTemplate = function (field, value) {
	this.html = function () {
	    return $ ('<span>' + as_text (value) + '</span>');
	};
	
	this.text = function (value) {
	    return value;
	};

	this.input = function () {
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

    var ListTemplate = function (field, value) {

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

	this.html = function () {
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

	// editor for list -> format_list -> format_item gets to children of list
	this.input = function () {
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
	    console.log (input.find ('input'))
	    throw "Not Implemented";
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
	else 
	    template = undefined;
	return template;
    };
}) ();
