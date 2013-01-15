var eid_id = '{{= request.args (0) }}';
var eid_event = {{ response.write (json.dumps (event), escape = False) }};

var event_fields = {{ response.write (json.dumps (event_fields), escape = False) }};

var event_lookup = {};
$.each (event_fields, function (i, field) {
    event_lookup[field.name] = field;
});

var user_id = {{= auth.user.id }};
var admin_role = {{= ('true' if has_role (admin_role) else 'false') }};
var application = '{{= request.application }}';

$ (document).ready (function () {
    $ ('div#title').text (eid_event.event_name)
});
