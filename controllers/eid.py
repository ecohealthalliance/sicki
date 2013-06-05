@require_logged_in
def model():
    return json.dumps(EIDEvent)


@require_role(admin_role)
def create():
    pass


@require_logged_in
def read():
    eid_id = request.args(0)
    if not eid_id:
        raise HTTP (400, "Missing EID ID")
    try:
        o_eid_id = ObjectId (eid_id)
    except:
        raise HTTP (400, "Bad EID ID")
    event = mongo.events.find_one ({'_id': o_eid_id})

    if not event:
        raise HTTP (400, "EID Event Not Found")

    event['id'] = str (event['_id'])
    del event['_id']

    del event['orig_event']
    # Join on all references
    #event['references'] = map (str, event['references'])
    return json.dumps(event)


@require_role(admin_role)
def update():
    eid_id = request.args(0)
    if not eid_id:
        raise HTTP(400, eid_id)
    for field, value in request.post_vars.iteritems():
        edit_field (eid_id, field, value)
    return json.dumps(True)


@require_role(admin_role)
def delete():
    pass


## !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
## Everything Below this line is suspect, may need to be refactored
## !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


# GET /sicki/eid/
@require_logged_in
def index():
    sort = request.vars.get ('sort') or 'event_name'
    return {'events': get_all_events (sort), 'sort': sort}

# GET /sicki/eid/events api call returns all events as JSON string.
def events():
    return get_all_events_json('event_name')

@require_logged_in
def view():
    eid_id = request.args (0)
    event = get_event (eid_id)
    return {'event': event, 'references': get_ref_names (eid_id), 'geodata': get_map (event.get ('map'))}

@require_logged_in
def fields():
    return {'event_fields': event_fields}

@require_logged_in
def stats():
    eid_id = request.args (0)
    return {'event': get_event (eid_id), 'proposals': get_proposals (eid_id, auth.user.id)}

@require_logged_in
def event_map():
    eid_id = request.args (0)
    event = get_event (eid_id)
    geodata = mongo.maps.find_one  ({'name': event.get ('map')})
    return {'event': event, 'geodata': geodata}

@require_logged_in
def wiki():
    eid_id = request.args (0)
    page = load_page (eid_id)
    if not page:
        insert_page (eid_id)
        page = load_page (eid_id)
    return {'event': get_event (eid_id), 'page': page}

@require_logged_in
def event_refs():
    eid_id = request.args (0)
    return {'event': get_event (eid_id), 'refs': get_ref_names (eid_id)}

# GET /sicki/eid/proposals/<eid_id>
@require_logged_in
def proposals():
    return stats()

# POST /sicki/eid/propose/<eid_id>/<field>
# Propose a change the field of an EID event. The body of the request contains the proposed value.
# return the proposed value's id
@require_logged_in
def propose():
    eid_id = request.args (0)
    field = request.args (1)
    
    value = json.loads (request.vars.get ('value'))
    refs = json.loads (request.vars.get ('refs'))
    user = json.loads (request.vars.get('user'))
    date = json.loads (request.vars.get('date'))

    event_field = get_field (field)

    # Perform any pre-hooks or mappings before adding the value to the db
    if upload_hooks.get (event_field['name']):
        if upload_hooks.get (event_field['name']).get ('pre'):
            value = upload_hooks.get (event_field['name']).get ('pre') (value)

    # Automatically accept proposals by admins
    if has_role (admin_role):
        edit_field (eid_id, field, value)
        add_refs (eid_id, refs)
        prop_id = 1
    else:
        prop_id = propose_edit (eid_id, field, value, refs, user, date)

    if upload_hooks.get (event_field['name']):
        if upload_hooks.get (event_field['name']).get ('post'):
            value = upload_hooks.get (event_field['name']).get ('post') (value)

    return json.dumps ({
        'id': prop_id,
        'value': value
        })

# POST /sicki/eid/reject/<prop_id>
# The proposal gets status REJECTED, and modification does not happen
@require_role (admin_role)
def reject():
    prop_id = request.args (0)
    prop = get_proposal (prop_id)
    if not prop:
        raise HTTP (400)
    update_proposal_status(prop_id,REJECTED)
    return 1

# POST /sicki/eid/accept/<prop_id>
# Accept a proposal. The proposal get status ACCEPTED and the corresponding field is modified.
@require_role (admin_role)
def accept():
    prop_id = request.args (0)
    prop = get_proposal (prop_id)
    if not prop:
        raise HTTP (400)
    edit_field (str (prop['eid']), prop['field'], prop['value'])
    add_refs (str (prop['eid']), prop['refs'])
    update_proposal_status(prop_id,ACCEPTED)
    #redirect (URL (r = request, c = 'eid', f = 'view', args = [str (prop['eid'])]))
    return 1

# POST /sicki/eid/upvote/<prop_id>
@require_logged_in
def upvote():
    prop_id = request.args (0)
    vote (prop_id, auth.user.id, True)
    prop = get_proposal (prop_id)
    #redirect (URL (r = request, c = 'eid', f = 'view', args = [str (prop['eid'])]))
    return True

# POST /sicki/eid/downvote/<prop_id>
@require_logged_in
def downvote():
    prop_id = request.args (0)
    vote (prop_id, auth.user.id, False)
    prop = get_proposal (prop_id)
    #redirect (URL (r = request, c = 'eid', f = 'view', args = [str (prop['eid'])]))
    return True

@require_logged_in
def unvote():
    prop_id = request.args (0)
    remove_vote (prop_id, auth.user.id)
    prop = get_proposal (prop_id)
    #redirect (URL (r = request, c = 'eid', f = 'view', args = [str (prop['eid'])]))
    return True

@require_logged_in
def refs():
    return {'refs': get_ref_names ()}

@require_logged_in
def ref():
    id = request.args (0);
    result = mongo.refs.find_one ({'_id': id})
    del result['_id']
    return json.dumps (result)

def load_map():
    name = request.vars.get ('name')
    geodata = mongo.maps.find_one ({'name': name})
    return json.dumps (geodata)

@require_logged_in
def eid_map():
    return {}
