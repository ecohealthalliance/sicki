(function () {

    {{ eid_id = request.args (0) }}
    
    var event = {{ response.write (json.dumps (event), escape = False) }};

    var event_fields = {{ response.write (json.dumps (event_fields), escape = False) }};
    
    var event_proposals = {{ response.write (json.dumps (event_proposals), escape = False) }};
    
    var event_lookup = {};
    $.each (event_fields, function (i, field) {
	event_lookup[field.name] = field;
    });

    var format_edit = function () {
	return $ ('<a class="edit" href="#">+</a>');
    };

    /*var format_value = function (field) {
	if (field.type == 'text' || !field.type) {
	    return event[field.name];
	}
	else 
	    return '<div>MISSING</div>';
    };*/

    function format_label (field) {
	var label = field.label;
	if (!label)
	    label = field.name;
	return $ ('<div class="label">' + label + '</div>');
    };

    /*var format_input = function (field, adj) {
	var div = $ ('<div class="editing"></div>')
	if (field.type == 'text' || !field.type) {
	    var input = $ ('<input type="text" value="' + event[field.name] + '" />')
	    var button = $ ('<a class="control" href="#">Submit</a>').click (function () {
		$.ajax ({
		    url: '{{= URL (r = request, c = 'eid', f = 'propose', args = [eid_id]) }}',
		    type: 'POST',
		    data: input.val (),
		    dataType: 'text',
		    success: function (data) {
			div.children ().remove ();
			div.addClass ('ok');
			div.append ('<i>' + input.val () + '</i> has been proposed');
			//adj.removeClass ('greyed');
		    },
		    error: function (xhr, message) {
			console.log (message);
		    }
		});
	    });
	    var cancel = $ ('<a class="control" href="cancel">Cancel</a>').click (function () {
		//adj.removeClass ('greyed');
		div.remove ();
		return false;
	    });
	    div.append (input).append (button). append (cancel);
	    
	}
	else
	    return 'INPUT MISSING';
    };*/
    
    $ (document).ready (function () {

	$ ('#title').text (event['event_name']);

	var scrim = new Scrim (2);

	var map = new wiggle.Map ('#map');

	{{ if event.get ('map'): }}
	$.ajax ({
	    url: '/{{= request.application }}/static/maps/{{= event['map']}}.json',
	    dataType: 'json',
	    success: function (data) {
		var aspect = map.width () / map.height ();

		layer = wiggle.io.GeoJSON (data);
		var bounds = layer.bounds;
		map.vcenter (bounds.centroid ());

		var extent = 4 * Math.max (bounds.width (), bounds.height () * aspect)
		map.extents (Math.min (extent, 360));

		map.append (layer);
	    }
	});
	{{ pass }}
	
	$ ('#submit-prop-wrapper').css ({
	    left: $ (window).innerWidth () / 4,
	    top:  50,
	    height: $ (window).innerHeight () - 100
	});

	var displayField = function (field, value) {
	    var template = Template (field, value);
	    if (!template)
		return '';

	    var elem = template.html ();
	    var edit = $ ('<div class="edit-wrapper"><a class="edit" href="#">+</a></div>');
	    var wrapper = $ ('<div class="wrapper"></div>').append (elem);
	    var stat = $ ('<div class="stat" id="' + field.name + '"></div>').append (edit).append (format_label (field)).append (wrapper);

	    edit.click (function () {
		var input = template.input ();
		var div = $ ('<div class="editing"></div>').append ('<div class="edit-title">' + field.label  + '</div>');
		var submit = $ ('<a class="control" href="#">Submit</a>').click (function () {
		    var val = template.val (input);
		    $.ajax ({
			//url: '{{= URL (r = request, c = 'eid', f = 'propose', args = [eid_id]) }}',
			url: '/{{= request.application }}/eid/propose/{{= eid_id }}/' + field.name,
			type: 'POST',
			data: val,
			dataType: 'text',
			success: function (data) {
			    /*div.children ().remove ();
			      div.addClass ('ok');
			      div.append ('<i>' + template.text (val) + '</i> has been proposed');*/
			    div.remove ();
			    scrim.hide ();
			    $ ('#submit-prop-wrapper').css ('display', 'none');
			},
			error: function (xhr, message) {
			    console.log (message);
			}
		    });
		    return false;
		});
		var cancel = $ ('<a class="control" href="cancel">Cancel</a>').click (function () {
		    div.remove ();
		    scrim.hide ();
		    $ ('#submit-prop-wrapper').css ('display', 'none');
		    return false;
		});
		var wrapper = $ ('<div></div>').append (input);
		var controls = $ ('<div class="controls"></div>').append (submit). append (cancel);
		div.append (wrapper).append (controls);
		$ ('#submit-prop').append (div);
		$ ('#submit-prop-wrapper').css ({
		    'display': 'block'
		});
		scrim.show ()
		return false;
	    });
	    $ ('#stats').append (stat);
	};


	$.each (event_fields, function (i, field) {
	    var stat = displayField (field, event[field.name])
	    if (stat)
		$ ('#stats').append (stat);
	});

	$.each (event_proposals, function (i, prop) {
	    var field = event_lookup[prop.field];
	    var template = Template (field, prop.value);
	    /*var upvote = $ ('<a href="#"><img height="20" src="/{{= request.application}}/static/images/upvote.png" /></a>').click (function () {
		$.ajax ({
		    url: '/{{= request.application }}/eid/upvote/' + prop.id,
		    type: 'POST',
		    success: function () {
			upvote.css ('color', 'red');
			downvote.css ('color', '');
		    }
		    });
		return false;
	    });*/
	    var up_src = (prop.voted == 1) ? 'upvote_green.png' : 'upvote.png';
	    var upvote = $ ('<a href="' + '/{{= request.application }}/eid/upvote/' + prop.id + '"><img class="vote" src="/{{= request.application}}/static/images/' + up_src + '" /></a>');

	    var down_src = (prop.voted == -1) ? 'downvote_red.png' : 'downvote.png';
	    var downvote = $ ('<a href="' + '/{{= request.application }}/eid/downvote/' + prop.id + '"><img class="vote" src="/{{= request.application}}/static/images/' + down_src + '" /></a>');

	    var unvote = $ ('<a href="/{{= request.application }}/eid/unvote/' + prop.id + '">(cancel)</a>')

	    /*var unvote = $ ('<a href="#">X</a>').click (function () {
		$.ajax ({
		    url: '/{{= request.application }}/eid/unvote/' + prop.id,
		    type: 'POST',
		    success: function () {
			downvote.css ('color', '');
			upvote.css ('color', '');
		    }
		    });
		return false;
	    });

	    if (prop.voted == 1)
		upvote.css ('color', 'red');
	    var downvote = $ ('<a href="#">&darr;</a>').click (function () {
		$.ajax ({
		    url: '/{{= request.application }}/eid/downvote/' + prop.id,
		    type: 'POST',
		    success: function () {
			downvote.css ('color', 'red');
			upvote.css ('color', '');
		    }
		    });
		return false;
	    });
	    if (prop.voted == -1)
		downvote.css ('color', 'red');*/
	    
	    {{ if has_role (admin_role): }}
	    var accept = $ ('<a href="/{{= request.application }}/eid/accept/' + prop.id + '">(accept)</a>');
	    {{ pass }}
	    var wrapper = $ ('<div></div>').append (upvote).append (downvote).append (unvote).append ('(' + prop.up + ' up, ' + prop.down + ' down)'){{if has_role (admin_role): }}.append (accept){{ pass }}.append (template.html ());
	    $ ('#proposals').append (wrapper);
	})

	/*$('.edit').click (function () {
	    var parent = $ (this).parent ();
	    //parent.css ('display', 'none');
	    //parent.addClass ('greyed');
	    var name = $(this).parent ().parent ().attr ('id');
	    var field = event_lookup [name];

	    $ (this).parent ().parent ().append (format_input (field, parent));
	    return false;
	});*/
    });
}) ();
