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


event_fields=[
    {'name':'event_name','label':'Event Name','type': 'hidden', 'required': True},
    {'name':'pathogens','label':'Pathogen(s)', 'type':'list', 'children':
         [{'name':'reported_name','label':'Reported name'},
          {'name':'drug_resistance','label':'Drug resistance'},
          {'name':'authority','label':'Authority'},
          {'name':'tax_order','label':'Taxanomic Order'},
          {'name':'class','label':'Class'},
          {'name':'family','label':'Family'},
          {'name':'genus','label':'Genus'},
          {'name':'species','label':'Species'},
          {'name':'sub_species','label':'Sub-species'},
          {'name':'primary','label':'Primary?'}]
     },
    {'name':'location','label':'Location'},
    {'name':'host','label':'Host'},
    {'name':'disease','label':'Disease'},
    {'name':'start_date','label':'Start Date'},
    {'name':'end_date','label':'End Date'},
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
    {'name':'map', 'type': 'hidden'},
    {'name':'data_quality_orig', 'type': 'hidden'},
    {'name':'data_quality', 'type': 'hidden'}

    ]

def get_all_events (sort = None):
    events = []
    results = mongo.events.find ()
    for item in results:
       events.append (item)

    def key_func (event):
        val = event.get (sort['name'])
        if val:
            val = val.lower ()
        return val

    if sort:
        events.sort (key = key_func)
    return events


def get_event (id):
    event = mongo.events.find_one ({'_id': ObjectId (id)})
    event['_id'] = str (event['_id'])
    event['ref'] = str (event['ref'])
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

def propose_edit (eid_id, field, value):
    return mongo.proposals.insert ({
            'eid': ObjectId (eid_id),
            'field': field,
            'value': value,
            'up': [],
            'down': [],
            })

def get_proposals (eid_id, user_id = None):
    props = mongo.proposals.find ({
            'eid': ObjectId (eid_id)
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

def remove_proposal (prop_id):
    mongo.proposals.remove ({
            '_id': ObjectId (prop_id)
            })
    

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
