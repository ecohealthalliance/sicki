$ (document).ready (function () {
    {{ eid_id = request.args (0) }}
    
    var event = {{ response.write (json.dumps (event), escape = False) }};

    var event_fields = {{ response.write (json.dumps (event_fields), escape = False) }};
    
    var event_proposals = {{ response.write (json.dumps (proposals), escape = False) }};
    
    var event_lookup = {};
    $.each (event_fields, function (i, field) {
	event_lookup[field.name] = field;
    });

    $.each (event_proposals, function (i, prop) {
	var field = event_lookup[prop.field];
	var template = Template (field, prop.value);

	var refs = $ ('<div class="prop-refs"></div>');
	
	if (prop.refs.length > 0)
	    refs.append ($ ('<div class="prop-refs-title">References</div>'));

	$.each (prop.refs, function (i, ref) {
	    refs.append (($ ('<div class="prop-refs-name"></div>').text (ref.name)));
	});
	    
	var upvote, downvote;

	var up_src = (prop.voted == 1) ? 'upvote_green.png' : 'upvote.png';
	upvote = $ ('<img class="vote" src="/{{= request.application}}/static/images/' + up_src + '" />').click (function () {
	    $.ajax ({
		url: '/{{= request.application }}/eid/upvote/' + prop.id,
		success: function () {
		    upvote.attr ('src', '/{{= request.application}}/static/images/upvote_green.png');
		    downvote.attr ('src', '/{{= request.application}}/static/images/downvote.png');
		}
	    });
	});
	
	var down_src = (prop.voted == -1) ? 'downvote_red.png' : 'downvote.png';
	downvote = $ ('<img class="vote" src="/{{= request.application}}/static/images/' + down_src + '" />').click (function () {
	    $.ajax ({
		url: '/{{= request.application }}/eid/downvote/' + prop.id,
		success: function () {
		    upvote.attr ('src', '/{{= request.application}}/static/images/upvote.png');
		    downvote.attr ('src', '/{{= request.application}}/static/images/downvote_red.png');
		}
	    });
	});

	var votes = $ ('<div class="cell"></div>').append (upvote).append (downvote);
	
	var outer = $ ('<div class="outer"></div>');
	var stat = $ ('<div></div>');
	var wrapper = $ ('<div class="wrapper"></div>').append (template.html ());
	
	var label = $ ('<div class="label"></div>').text (field.label);
	stat.append (votes).append (label).append (wrapper);
	outer.append (stat);
	if (prop.refs.length > 0)
	    outer.append (refs);

	{{ if has_role (admin_role): }}
	var accept = $ ('<div class="accept"></div>').text (prop.up + ' Up, ' + prop.down + 
' Down ').append ('<a href="/{{= request.application }}/eid/accept/' + prop.id + '">Accept Proposal</a>');
	outer.append (accept);
	
	{{ pass }}
	$ ('#props').append (outer);
    });
});
