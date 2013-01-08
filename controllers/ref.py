@require_logged_in
def query():
    import re
    q = request.vars.get ('q')
    ql = q.split (' ')
    mq = []
    for item in ql:
        regex = re.compile (item, re.IGNORECASE)
        mq.append ({
                'title': {'$regex': regex}
                })
    result = mongo.refs.find ({'$and': mq}).limit (10)
    result_list = []
    for item in result:
        result_list.append ({
                'name': item['title'],
                'id': str (item['_id'])
                })
    return json.dumps (result_list)

@require_logged_in
def append():
    event_id = request.vars.get ('event_id')
    ref_id = request.vars.get ('ref_id')
    
    if mongo.events.find ({
            '_id': ObjectId (event_id),
            'references': ObjectId (ref_id)
            }).count ():
        raise HTTP (400)
    else:
        mongo.events.update ({
                '_id': ObjectId (event_id)
                }, {
                '$push': {
                    'references': ObjectId (ref_id)
                    }
                })
    
    return 1

@require_logged_in
def remove():
    event_id = request.vars.get ('event_id')
    ref_id = request.vars.get ('ref_id')

    if not mongo.events.find ({
            '_id': ObjectId (event_id),
            'references': ObjectId (ref_id)
            }).count ():
        raise HTTP (400)
    else:
        mongo.events.update ({
                '_id': ObjectId (event_id)
                }, {
                '$pull': {
                    'references': ObjectId (ref_id)
                    }
                })
