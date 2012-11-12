# GET /sicki/eid/
def index():
    return {'events': get_all_events ()}

def fields():
    return {'event_fields': event_fields}

# GET /sicki/eid/view/<eid_id>
def view():
    if not auth.user:
        raise HTTP (400)
    eid_id = request.args (0)
    if not eid_id:
        raise HTTP (400, "Missing EID ID")
    #event = get_event (eid_id)
    event_proposals = get_proposals (eid_id, auth.user.id)
    return {'event': get_event (eid_id), 'event_proposals': event_proposals}

# POST /sicki/eid/propose/<eid_id>/<field>
# Propose a change the field of an EID event. The body of the request contains the proposed value.
# return the proposed value's id
def propose():
    eid_id = request.args (0)
    field = request.args (1)
    value = request.body.read ()
    #ensure_prop_eid (eid_id)
    id = propose_edit (eid_id, field, value)
    return id

# POST /sicki/eid/unpropose/<prop_id>
# Removes a proposal completely from the database
def unpropose():
    pass

# POST /sicki/eid/accept/<prop_id>
# Accept a proposal. The proposal is removed and the corresponding field is modified.
def accept():
    prop_id = request.args (0)
    prop = get_proposal (prop_id)
    if not prop:
        raise HTTP (400)
    edit_field (str (prop['eid']), prop['field'], prop['value'])
    remove_proposal (prop_id)
    redirect (URL (r = request, c = 'eid', f = 'view', args = [str (prop['eid'])]))

# POST /sicki/eid/upvote/<prop_id>
def upvote():
    if not auth.user:
        raise HTTP (400)
    prop_id = request.args (0)
    vote (prop_id, auth.user.id, True)
    prop = get_proposal (prop_id)
    redirect (URL (r = request, c = 'eid', f = 'view', args = [str (prop['eid'])]))

# POST /sicki/eid/downvote/<prop_id>
def downvote():
    if not auth.user:
        raise HTTP (400)
    prop_id = request.args (0)
    vote (prop_id, auth.user.id, False)
    prop = get_proposal (prop_id)
    redirect (URL (r = request, c = 'eid', f = 'view', args = [str (prop['eid'])]))

def unvote():
    if not auth.user:
        raise HTTP (400)
    prop_id = request.args (0)
    remove_vote (prop_id, auth.user.id)
    prop = get_proposal (prop_id)
    redirect (URL (r = request, c = 'eid', f = 'view', args = [str (prop['eid'])]))

    

