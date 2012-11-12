def insert():
    ''' USAGE example: insert_event (mongo,{'name':"Cambodia 2012", 'pathogen':"Hand, foot, and mouth"})'''
    require_logged_in ()
    id = request.args (0)
    if id:
        event_load = get_event (id)
    else:
        event_load = {}
    event = merge_request_event (event_load)
    '''fields=[]
    for field in event_fields:
        fields.append (LABEL (field.get ('label') or field['name']))
        fields.append (format_input (field, event))
        fields.append (BR ())

    fields.append(INPUT(_value="Enter", _type="submit"))
    form=FORM(fields)
    form_okay = form.accepts(request,session)
    if form_okay  and not id:
        id = insert_event (form.vars)
        redirect ( URL (r = request, f = 'stats', args = [id]))        
    elif form_okay:
        update_event (id, form.vars)
        redirect ( URL (r = request, f = 'stats', args = [id]))
    else:
        return {'form': form}'''
    form_okay = request.vars.get ('submitted') and validate_event (request.vars)
    if form_okay and not id:
        id = insert_event (request.vars)
        redirect ( URL (r = request, f = 'stats', args = [id]))        
    elif form_okay:
        update_event (id, request.vars)
        redirect ( URL (r = request, f = 'stats', args = [id]))
    else:
        return {'event_fields': event_fields,
                'event': event
                }

def delete():
    require_logged_in ()
    id = request.args (0)
    if not id:
        raise HTTP (400, 'Event Id Requied')
    confirm = request.vars.get ('confirm')
    if confirm:
        delete_event (id)
        redirect (URL (r = request, f ='events'))
    else:
        event = get_event (id);
        request.title = 'Delete event %s' % event['event_name']
        return {
            'event': event
            }

def events():
    sort = get_sort_field (request.vars.get ('sort'))
    return {
        'events': get_all_events (sort),
        'sort': sort
        }

def stats():
    id = request.args (0)
    if not id:
        raise HTTP (400, 'Missing Event ID')
    event = get_event (id);
    request.title = 'Stats for %s' % event['event_name']
    page = load_page (id)
    if not page:
        insert_page (id)
        page = load_page (id)
    return {
        'event_fields': event_fields,
        'event': event,
        'page': page
        }

def refs():
    return {'refs': mongo.refs.find ()}

def ref():
    key = request.args (0);
    result = mongo.refs.find_one ({'key': key})
    del result['_id']
    return json.dumps (result)

def event_map():
    return {}

def network():
    return {}

def network_json():
    results = mongo.events.find ({
            'centroid': {'$exists': True}
            })
    layer = []
    '''for item in results:
        neighbors = []
        if len (item['references']):
            results2 = mongo.events.find ({
                    'references': {'$in': item['references']}
                    })
            for item2 in results2:
                if item2['_id'] != item['_id']:
                    neighbors.append (str (item2['_id']))
        layer.append ({
                'id': str (item['_id']),
                'geom': item['centroid'],
                'neighbors': neighbors
                      })'''

    def find_neighbors (refs, self):
        elem = set ()
        for ref in refs:
            for node in lookup[str (ref)]:
                if node != self:
                    elem.add (node)
        return list (elem)

    layer = []
    lookup = {}
    for item in results:
        for ref in item['references']:
            id = str (item['_id'])
            if lookup.has_key (str (ref)):
                lookup[str (ref)].append (id)
            else:
                lookup[str (ref)] = [id]
        layer.append ({
                'id': str (item['_id']),
                'geom': item['centroid'],
                'refs': item['references']
                })

    for feature in layer:
        feature['neighbors'] = find_neighbors (feature['refs'], feature['id'])
        del feature['refs']
    return json.dumps (layer)

def event_field_template():
    key = request.get ('field')
    pass
