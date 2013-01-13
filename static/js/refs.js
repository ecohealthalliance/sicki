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
