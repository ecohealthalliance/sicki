EIDEvent = {
    'name': 'eid',
    'fields': [
        {'name':'event_name','type': 'text', 'required': True},
        {'name':'pathogens', 'type':'collection', 'model': Pathogen},
        {'name':'location'},
        {'name':'host'},
        {'name':'disease'},
        {'name':'start_date', 'type': 'date'},
        {'name':'end_date', 'type': 'date'},
        {'name':'host_age', 'type': 'select', 'options': [
                '',
                'Adult',
                'Juvenile',
                'Neonate',
                'Unknown'
                ]},
        {'name':'host_use', 'type': 'select', 'options': [
                '',
                'Hunted',
                'Eaten',
                'Markets or traded',
                'None',
                'Unknown'
                ]},
        {'name':'transition_model', 'type': 'select', 'options': [
                '',
                'Close',
                'Sexual',
                'Vertical',
                'Vector',
                'Unknown'
                ]},
        {'name':'zoonotic_type', 'type': 'select', 'options': [
                '',    
                'Zoonotic from wildlife',
                'Zoonotic from domestic',
                'Zoonotic from unknown origin',
                'Non-zoonotic'
                ]},
        {'name':'number_infected'},
        {'name':'prevalence'},
        {'name':'duration', 'type': 'units', 'units': [
                '',    
                'Days',
                'Months',
                'Years'
                ]},
        {'name':'symptoms_reported'},
        {'name':'host_sex', 'type': 'select', 'options': [
                '',    
                'Male',
                'Female',
                'Unknown'
                ]},
        {'name':'sample_type', 'type': 'select', 'options': [
                '',    
                'Serology',
                'Direct blood',
                'Direct faecal',
                'Direct other'
                ]},
        {'name':'driver','type': 'select', 'options': [
                '',    
                'Human susceptibility to infection',
                'Antimicrobial agent use',
                'Agricultural industry changes',
                'International travel and commerce',
                'War and famine',
                'Medical industry changes',
                'Climate and weather',
                'Human demographics and behaviour',
                'Breakdown of public health measures',
                'Bush meat',
                'Other industries',
                'Unspecified'    
                ]},
        {'name':'domestication_status', 'type': 'select', 'options': [
                '',    
                'Wild',
                'Domestic',
                'Peri-domestic',
                'Unknown'    
                ]},
        {'name':'number_deaths'},
        {'name':'contact'},
        {'name':'notes'},
        {'name':'references', 'type': 'collection', 'model': Reference}
        #{'name':'map', 'type': 'hidden'},
        #{'name':'data_quality_orig', 'type': 'hidden'},
        #{'name':'data_quality', 'type': 'hidden'}
        ]
    }

eidEvents = CRUD(EIDEvent)

## !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
## Everything Below this line is suspect, may need to be refactored
## !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

def upload_map (value):
    filename = value.get ('name')
    geodata = value.get ('map')
    name = value.get ('name')
    ext = value.get ('ext')
    if (not name) or (not ext):
        raise HTTP (400, "Cannot determine upload type")
    if ext == 'json':
        geodata = json.loads (geodata)
    mongo.maps.insert ({
            'name': name,
            'type': ext,
            'map': geodata
            })
    return name



upload_hooks = {
    'map': {
        'pre': upload_map
        }
}

# proposal status constants/enum
PENDING = 'PENDING'
ACCEPTED = 'ACCEPTED'
REJECTED = 'REJECTED'

def get_field (name):
    for field in EIDEvent['fields']:
        if field['name'] == name:
            return field
    return None

def get_all_events (sort = None):
    'returns all events, _id hex objId -> id string, orig_event objId taken out'
    events = []
    # results is a mongo lazy cursor - not a list
    # filtering out orig_event, dont need and its hex doesnt dump to json
    results = mongo.events.find ({}, {'orig_event': 0})
    for item in results: # iterate on cursor
        # convert binary/hex to string
        item['id'] = str(item['_id'])
        # drop _id - dont need it anymore
        del item['_id']
        events.append (item)

    if sort:
        sort_field = get_field (sort)
        def key_func (event):
            val = event.get (sort)
            if val:
                val = unicode (val).lower ()
            return val
        events.sort (key = key_func)
        
    return events

def get_all_events_json (sort = None):
    events = get_all_events(sort)
    return json.dumps(events)


def get_event (eid_id):
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
    event['orig_event'] = str (event['orig_event'])
    event['references'] = map (str, event['references'])
        
    return event

def edit_field (eid_id, field, value):
    mongo.events.update ({
            '_id': ObjectId (eid_id)
            }, {
            '$set': {
                field: value
                }
            })

'''def format_label (field):
    return field.get ('label') or field['name']

def format_field (field, event):
    return str (event.get (field['name']) or '')'''

'''def ensure_prop_eid (eid_id):
    if not mongo.proposals.find ({'eid': ObjectId (eid_id)}).count ():
        mongo.proposals.insert ({
                'eid': ObjectId (eid_id),
                'props': []
                })'''

def propose_edit (eid_id, field, value, refs, user, date):
    return str (mongo.proposals.insert ({
            'eid': ObjectId (eid_id),
            'field': field,
            'value': value,
            'refs': refs,
            'up': [],
            'down': [],
            'user': user,
            'date': date,
            'status': PENDING
            }))

def get_proposals (eid_id, user_id):
    props = mongo.proposals.find ({
            'eid': ObjectId (eid_id),
            'status': PENDING
            })
    if not props.count ():
        return []
    else:
        result = []
        for prop in props:
            voted = 0
            if user_id in prop['up']:
                voted = 1
            elif user_id in prop['down']:
                voted = -1
            result.append ({
                    'field': prop['field'],
                    'value': prop['value'],
                    'refs': prop.get ('refs') or [],
                    'up': len (prop['up']),
                    'down': len (prop['down']),
                    'id': str (prop['_id']),
                    'voted': voted,
                    'ratio': float (len (prop['up']) + 1) / float (len (prop['down']) + 1)
                    })
        result.sort (key = lambda x: x['ratio'], reverse = True)
        return result

def get_proposal (prop_id):
    return mongo.proposals.find_one ({
            '_id': ObjectId (prop_id)
            })

def update_proposal_status(prop_id,status):
    mongo.proposals.update({'_id': ObjectId(prop_id)},{'$set': {'status':status}})
    

def vote (prop_id, user_id, val):
    remove_vote (prop_id, user_id)
    set_vote (prop_id, user_id, val)


def remove_vote (prop_id, user_id):
    mongo.proposals.update ({
            '_id': ObjectId (prop_id)
            }, {
            '$pull': {
                'up': user_id,
                'down': user_id
                }
            })

def set_vote (prop_id, user_id, val):
    if val:
        key = 'up'
    else:
        key = 'down'
    mongo.proposals.update ({
            '_id': ObjectId (prop_id)}, {
             '$push': {key: user_id}
            })

def get_ref_names (eid_id = None):
    if not eid_id:
        result = mongo.refs.find ()
    else:
        event = get_event (eid_id)
        result = []
        for ref in event['references']:
            result.append (mongo.refs.find_one ({'_id': ref}))
        
    refs = []
    for item in result:
        refs.append ({
                'id': str (item['_id']),
                'title': item.get ('title')
                })
    return refs

def add_refs (eid_id, refs):
    event = get_event (eid_id)
    current = set (event['references'])
    for ref in refs:
        if not ref['_id'] in current:
            mongo.events.update ({
                    '_id': ObjectId (eid_id)
                    }, {
                    '$push': {'references': ref['_id']}
                    })

def get_map (mapname):
    geodata = mongo.maps.find_one({'name': mapname})
    return geodata
