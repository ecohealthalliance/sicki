@require_logged_in
# return hash of proposals keyed on status PENDING ACCEPTED REJECTED
def user_proposals():
    props = get_all_user_proposals(auth.user_id)
    result = {}
    pending = []
    accepted = []
    rejected = []
    
    for prop in props:
        webprop = mongo2web_proposal(prop,auth.user_id)
        if prop['status'] == PENDING:
            pending.append(prop)
        elif prop['status'] == ACCEPTED:
            accepted.append(prop)
        else:
            rejected.append(prop)

    return {'pending':pending, 'accepted':accepted, 'rejected':rejected}

