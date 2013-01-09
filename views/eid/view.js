(function () {

    // templating from web2py, since we are in views directy
    {{ eid_id = request.args (0) }}
    
    // turn python event(which came from mongo) into json
    var event = {{ response.write (json.dumps (event), escape = False) }};

    // python model globally accessible and dumping into json list
    // event fields is the schema for mongo, meta data of what it is and whats editable
    var event_fields = {{ response.write (json.dumps (event_fields), escape = False) }};
    
    // turns event_fields list into a hash keyed on the name of the field
    var event_lookup = {};
    $.each (event_fields, function (i, field) {
	event_lookup[field.name] = field;
    });

    // util function for making links with class edit with '+' to click on
    var format_edit = function () {
	return $ ('<a class="edit" href="#">+</a>');
    };

    // util function for label divs
    function format_label (field) {
	var label = field.label;
	if (!label)
	    label = field.name;
	return $ ('<div class="label">' + label + '</div>');
    };

    // This loads after the page is loaded. This is really the start of things
    // and loads up the whole page
    $ (document).ready (function () {

	// putting the event name title into the div, div is in view.html
	$ ('#title').text (event['event_name']);

	// util for greying out screen & prevent scrolling
	var scrim = new Scrim (2);

	// sending the map div to wiggle.Map constructor, using dims of #map
	var map = new wiggle.Map ('#map');

	// python check if we have a map make asynchronous ajax to load map up
	// and let page load carry on
	{{ if event.get ('map'): }}
	$.ajax ({
	    // get map file using event[map]
	    url: '/{{= request.application }}/static/maps/{{= event['map']}}.json',
	    dataType: 'json',
	    // callback from ajax with data as geoJson polygon of coords
	    success: function (data) {
		var aspect = map.width () / map.height ();

		// wigglemaps/js/geojson.js takes in geoJson data and returns
		// a javascript representation of the layer. a layer is a collection of
		// polygons to trasnparently draw on map
		layer = wiggle.io.GeoJSON (data);
		var bounds = layer.bounds;
		// center map view on the center of the layer
		map.vcenter (bounds.centroid ());

		// how much of the world to look at
		var extent = 4 * Math.max (bounds.width (), bounds.height () * aspect)
		map.extents (Math.min (extent, 360));

		map.append (layer);
	    }
	});
	// end of if python statement above
	{{ pass }}
	
	$ ('#submit-prop-wrapper').css ({
	    left: $ (window).innerWidth () / 4,
	    top:  50,
	    height: $ (window).innerHeight () - 100
	});

	ref_list = new ReferenceList ('{{= request.application }}', $ ('#ref-query'), $ ('#ref-results'));

	var displayField = function (field, value) {
	    var template = Template (field, value);
	    if (!template)
		return '';

	    var elem = template.html ();
	    var edit = $ ('<div class="edit-wrapper"><a class="edit" href="#">+</a></div>');
	    var wrapper = $ ('<div class="wrapper"></div>').append (elem);
	    var stat = $ ('<div class="stat" id="' + field.name + '"></div>').append (edit).append (format_label (field)).append (wrapper);

	    edit.click (function () {
		ref_list.reset ();
		var input = template.input ();
		var div = $ ('<div class="editing"></div>').append ('<div class="edit-title">' + field.label  + '</div>');
		var submit = $ ('<a class="control" href="#">Submit</a>').click (function () {
		    var val = template.val (input);
		    $.ajax ({
			//url: '{{= URL (r = request, c = 'eid', f = 'propose', args = [eid_id]) }}',
			url: '/{{= request.application }}/eid/propose/{{= eid_id }}/' + field.name,
			type: 'POST',
			data: {
			    val: val,
			    refs: JSON.stringify (ref_list.selected ())
			},
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

	/*$.each (event_proposals, function (i, prop) {
	    var field = event_lookup[prop.field];
	    var template = Template (field, prop.value);
	    var up_src = (prop.voted == 1) ? 'upvote_green.png' : 'upvote.png';
	    var upvote = $ ('<a href="' + '/{{= request.application }}/eid/upvote/' + prop.id + '"><img class="vote" src="/{{= request.application}}/static/images/' + up_src + '" /></a>');

	    var down_src = (prop.voted == -1) ? 'downvote_red.png' : 'downvote.png';
	    var downvote = $ ('<a href="' + '/{{= request.application }}/eid/downvote/' + prop.id + '"><img class="vote" src="/{{= request.application}}/static/images/' + down_src + '" /></a>');

	    var unvote = $ ('<a href="/{{= request.application }}/eid/unvote/' + prop.id + '">(cancel)</a>')
	    
	    {{ if has_role (admin_role): }}
	    var accept = $ ('<a href="/{{= request.application }}/eid/accept/' + prop.id + '">(accept)</a>');
	    {{ pass }}
	    var wrapper = $ ('<div></div>').append (upvote).append (downvote).append (unvote).append ('(' + prop.up + ' up, ' + prop.down + ' down)'){{if has_role (admin_role): }}.append (accept){{ pass }}.append (template.html ());
	    $ ('#proposals').append (wrapper);
	})*/

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
