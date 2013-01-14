function ReferenceList (app, input, result) {

    var current = {};
    
    input.keyup (function () {
	var query = $(this).val ();

	if (!query) {
	    current = {};
	    result.children ().remove ();
	    return false;
	}

	$.ajax ({
	    url: '/' + app + '/ref/query',
	    dataType: 'json',
	    data: {
		q: query
	    },
	    success: function (data) {
		result.children ().remove ();
		for (var i = 0; i < data.length; i ++) {
		    var elem = $ ('<p><a href="#" class="add_ref"> + </a>' + data[i].name + '</p>')
		    if (data[i].id in current)
			elem.css('background-color', '#fff77d');
		    elem.data ('ref', data[i]);
		    elem.data ('added', (data[i].id in current));
		    result.append (elem);
		}

		$ ('.add_ref').click (function () {
		    var ref = $(this).parent ().data ('ref');

		    if (! $(this).parent ().data ('added')) {
			//$ (this).text (' - ');
			current[ref.id] = ref;
			$ (this).parent (). css ('background-color', '#fff77d');
			$(this).parent ().data ('added', true);
		    }
		    else {
			//$ (this).text (' + ');
			delete current[ref.id];
			$ (this).parent (). css ('background-color', '');
			$(this).parent ().data ('added', false);
		    }
		    return false;
		});
	    }
	});
    });
    
    this.reset = function () {
	current = {};
	result.children ().remove ();
	input.val ('');
    };

    this.selected = function () {
	var seq = [];
	$.each (current, function (key, ref) {
	    seq.push (ref);
	});
	return seq;
    };
};

function ReferenceCollection (refs) {
    var main = $ ('<div></div>');
    $.each (refs, function (i, ref) {
	var expanded = false;
	var expand_ref = $ ('<div></div>').css ('display', 'none');
	var ln = $ ('<a href="#"></a>').text (ref.title).addClass (ref.id).click (function (event) {
	    var format_data = function (key, value) {
		if (key == 'creators') {
		    var authors = [];
		    for (var i = 0; i < value.length; i ++) {
			authors.push (value[i]['firstName'] + ' ' + value[i]['lastName'])
		    }
		    return '<p><b>' + key + ':</b> ' + authors.join (', ') + '</p>';
		}
		else if (key == 'tags') {
		    var tags = [];
		    for (var i = 0; i < value.length; i ++) {
			tags.push (value[i].tag)
		    }
		    return '<p><b>' + key + ':</b> ' + tags.join (', ') + '</p>';
		}
		else {
		    return '<p><b>' + key + ':</b> ' + value + '</p>';
		}
	    };
            //var link = $ (this);
            // if we are not yet expand, then expand, else collapse
            //if (link.parent ().next ().attr ('class').search('expanded-ref') == -1) {
	    if (!expanded) {
                //var style = link.parent().attr('class');
                $.ajax ({
		    url: '/' + application + '/eid/ref/' + ref.id,
		    dataType: 'json',
		    success: function (data) {
			//var div = $('<div class="'+style+' expanded-ref"></div>');
			for (var key in data) {
			    //div.append (format_data (key, data[key]));
			    expand_ref.append (format_data (key, data[key]));
			}
			//link.parent ().after (div);
			expand_ref.toggle (400);
			expanded = true;
		    }
		});
            }
            // collapse
	    else {
		//link.parent ().next ().toggle (400);
		expand_ref.toggle (400);
	    }
	    event.preventDefault ();
	    return false;
	});
	var container = $ ('<div></div>').append (ln).append (expand_ref).addClass ((i % 2) ? 'even' : 'odd').addClass ('reference');
	main.append (container);
    });
    
    this.append = function (selector) {
	$ (selector).append (main);
    };
};
