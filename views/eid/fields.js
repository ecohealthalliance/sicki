var event_fields = {{ response.write (json.dumps (event_fields), escape = False) }};

var event_lookup = {};
$.each (event_fields, function (i, field) {
    event_lookup[field.name] = field;
});