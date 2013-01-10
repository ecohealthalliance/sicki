{{ if sort: }}
{{ modified_events = map (lambda event: {'event_name': event['event_name'], sort: event.get (sort), 'id': str (event['_id']) }, events) }}
var events = {{ response.write (json.dumps (modified_events), escape = False) }};
{{ else: }}
{{ modified_events = map (lambda event: {'event_name': event['event_name'], 'id': str (event['_id']) }, events) }}
var events = {{ response.write (json.dumps (modified_events), escape = False) }};
{{ pass }}
var base = '{{= URL (r = request, c = 'eid', f = 'view.html') }}';

$ (document).ready (function () {
    $ ('#sort_events').change (function () {
	var val = $ (this).val ();
	var base = window.location.origin + window.location.pathname;
	if (val.length)
	    base += '?sort=' + val;
	window.location.href = base;
    });

    $.each (events, function (index, item) {
	var a = $ ('<a></a>').text (item['event_name']).attr ('href', base + '/' + item.id)
	var wrapper = $ ('<p></p>').append (a);
	$ ('.main').append (wrapper);
    });
});