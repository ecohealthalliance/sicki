{{ if sort: }}
{{ modified_events = map (lambda event: {'event_name': event['event_name'], 'sort': event.get (sort), 'id': str (event['_id']) }, events) }}
var events = {{ response.write (json.dumps (modified_events), escape = False) }};
{{ else: }}
{{ modified_events = map (lambda event: {'event_name': event['event_name'], 'id': str (event['_id']) }, events) }}
var events = {{ response.write (json.dumps (modified_events), escape = False) }};
{{ pass }}
var base = '{{= URL (r = request, c = 'eid', f = 'stats.html') }}';
var sort_field = '{{= sort }}';

$ (document).ready (function () {
    $ ('#sort_events').change (function () {
	var val = $ (this).val ();
	var base = window.location.origin + window.location.pathname;
	if (val.length)
	    base += '?sort=' + val;
	window.location.href = base;
    });

    $.each (events, function (index, item) {
	var text = '';
	if (item.sort && (sort_field != 'event_name')) {
	    var val = item.sort;
	    var template = Template (event_lookup[sort_field]);
	    if (template)
		text = template.text (item.sort);
	}
	var caption = $ ('<span class="caption"></span>').text (text);
	var a = $ ('<a></a>').text (item['event_name']).attr ('href', base + '/' + item.id)
	var wrapper = $ ('<p></p>').append (caption).append (a);
	$ ('.main').append (wrapper);
    });
});