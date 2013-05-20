host_age =[
    '',
    'Adult',
    'Juvenile',
    'Neonate',
    'Unknown'
    ]

host_use=[
    '',
    'Hunted',
    'Eaten',
    'Markets or traded',
    'None',
    'Unknown'
    ]

transition_model=[
    '',
    'Close',
    'Sexual',
    'Vertical',
    'Vector',
    'Unknown'
    ]

zoonotic_type=[
    '',    
    'Zoonotic from wildlife',
    'Zoonotic from domestic',
    'Zoonotic from unknown origin',
    'Non-zoonotic'
    ]

period=[
    '',    
    'Days',
    'Months',
    'Years'
    ]

host_sex=[
    '',    
    'Male',
    'Female',
    'Unknown'
    ]

driver=[
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
    ]

domestication_status=[
    '',    
    'Wild',
    'Domestic',
    'Peri-domestic',
    'Unknown'    
    ]

sample_type=[
    '',    
    'Serology',
    'Direct blood',
    'Direct faecal',
    'Direct other'
    ]

time_period=[
    '',    
    'Days',
    'Months',
    'Years'
    ]

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

event_fields=[
    {'name':'event_name','label':'Event Name','type': 'text', 'required': True},
    {'name':'pathogens','label':'Pathogen(s)', 'type':'list', 'children':
         [{'name':'reported_name','label':'Reported name'},
          {'name':'drug_resistance','label':'Drug resistance'},
          {'name':'authority','label':'Authority'},
          {'name':'tax_order','label':'Taxanomic Order'},
          {'name':'class','label':'Class'},
          {'name':'family','label':'Family'},
          {'name':'genus','label':'Genus', 'primary': True},
          {'name':'species','label':'Species', 'primary': True},
          {'name':'sub_species','label':'Sub-species', 'primary': True},
          {'name':'primary','label':'Primary?'}]
     },
    {'name':'location','label':'Location'},
    {'name':'host','label':'Host'},
    {'name':'disease','label':'Disease'},
    {'name':'start_date','label':'Start Date', 'type': 'date'},
    {'name':'end_date','label':'End Date', 'type': 'date'},
    {'name':'host_age', 'label':'Host Age','type': 'set', 'set':host_age},
    {'name':'host_use','label':'Host Use', 'type': 'set', 'set':host_use},
    {'name':'transition_model','label':'Transition Model', 'type': 'set', 'set':transition_model},
    {'name':'zoonotic_type','label':'Zoonotic Type', 'type': 'set', 'set':zoonotic_type},
    {'name':'number_infected','label':'Number Infected'},
    {'name':'prevalence','label':'Prevalence'},
    {'name':'duration','label':'Duration', 'type': 'value_units', 'units': time_period},
    {'name':'symptoms_reported','label':'Symptoms Reported'},
    {'name':'host_sex','label':'Host Sex', 'type': 'set', 'set':host_sex},
    {'name':'sample_type','label':'Sample Type','set':sample_type},
    {'name':'driver','label':'Driver','type': 'set', 'set':driver},
    {'name':'domestication_status','label':'Domestication Status', 'type': 'set', 'set':domestication_status},
    {'name':'number_deaths','label':'Number of deaths'},
    {'name':'contact','label':'Contact'},
    {'name':'notes','label':'Notes'},
    #{'name':'reference','label':'Reference'},
    {'name':'map', 'label': 'Map', 'type': 'map'},
    {'name':'data_quality_orig', 'type': 'hidden'},
    {'name':'data_quality', 'type': 'hidden'}

    ]

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
    for field in event_fields:
        if field['name'] == name:
            return field
    return None

def get_all_events (sort = None):
    events = []
    results = mongo.events.find ()
    for item in results:
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
    event['_id'] = str (event['_id'])
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
    geodata = mongo.maps.find_one  ({'name': mapname})
    return geodata
