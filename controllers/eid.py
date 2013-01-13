# GET /sicki/eid/
@require_logged_in
def index():
    sort = request.vars.get ('sort') or 'event_name'
    return {'events': get_all_events (sort), 'sort': sort}

@require_logged_in
def fields():
    return {'event_fields': event_fields}

@require_logged_in
def stats():
    eid_id = request.args (0)
    if not eid_id:
        raise HTTP (400, "Missing EID ID")
    return {'event': get_event (eid_id), 'proposals': get_proposals (eid_id, auth.user.id)}

@require_logged_in
def event_map():
    eid_id = request.args (0)
    if not eid_id:
        raise HTTP (400, "Missing EID ID")
    return {'event': get_event (eid_id)}

@require_logged_in
def wiki():
    eid_id = request.args (0)
    if not eid_id:
        raise HTTP (400, "Missing EID ID")
    page = load_page (eid_id)
    if not page:
        insert_page (eid_id)
        page = load_page (eid_id)
    return {'event': get_event (eid_id), 'page': page}

@require_logged_in
def event_refs():
    eid_id = request.args (0)
    if not eid_id:
        raise HTTP (400, "Missing EID ID")
    return {'event': get_event (eid_id)}

# GET /sicki/eid/view/<eid_id>
@require_logged_in
def view():
    eid_id = request.args (0)
    if not eid_id:
        raise HTTP (400, "Missing EID ID")
    #event = get_event (eid_id)
    if request.extension == 'html':
        page = load_page (eid_id)
        if not page:
            insert_page (eid_id)
            page = load_page (eid_id)
        return {'page': page}
    elif request.extension == 'js':
        return {'event': get_event (eid_id)}

# GET /sicki/eid/proposals/<eid_id>
@require_logged_in
def proposals():
    eid_id = request.args (0)
    if not eid_id:
        raise HTTP (400, "Missing EID ID")
    event_proposals = get_proposals (eid_id, auth.user.id)
    return {'event': get_event (eid_id), 'event_proposals': event_proposals}

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

    # Automatically accept proposals by admins
    if has_role (admin_role):
        edit_field (eid_id, field, value)
        return 1
    else:
        prop_id = propose_edit (eid_id, field, value, refs, user, date)
        return prop_id

# POST /sicki/eid/reject/<prop_id>
# Removes a proposal completely from the database
@require_role (admin_role)
def reject():
    prop_id = request.args (0)
    prop = get_proposal (prop_id)
    if not prop:
        raise HTTP (400)
    remove_proposal (prop_id)
    return 1

# POST /sicki/eid/accept/<prop_id>
# Accept a proposal. The proposal is removed and the corresponding field is modified.
@require_role (admin_role)
def accept():
    #require_role (admin_role)
    prop_id = request.args (0)
    prop = get_proposal (prop_id)
    if not prop:
        raise HTTP (400)
    edit_field (str (prop['eid']), prop['field'], prop['value'])
    remove_proposal (prop_id)
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
    return {'refs': mongo.refs.find ()}

@require_logged_in
def ref():
    key = request.args (0);
    result = mongo.refs.find_one ({'key': key})
    del result['_id']
    return json.dumps (result)

@require_logged_in
def eid_map():
    return {}
