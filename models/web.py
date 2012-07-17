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
    {'name':'event_name','label':'Event Name','required':True},
    {'name':'pathogen','label':'Pathogen'},
    {'name':'coinfection','label':'Co-Infection'},
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
    {'name':'duration','label':'Duration', 'type': 'value_units', 'units':time_period},
    {'name':'symptoms_reported','label':'Symptoms Reported'},
    {'name':'host_sex','label':'Host Sex', 'type': 'set', 'set':host_sex},
    {'name':'sample_type','label':'Sample Type','set':sample_type},
    {'name':'driver','label':'Driver','type': 'set', 'set':driver},
    {'name':'domestication_status','label':'Domestication Status', 'type': 'set', 'set':domestication_status},
    {'name':'number_deaths','label':'Number of deaths'},
    {'name':'contact','label':'Contact'},
    {'name':'notes','label':'Notes'},
    {'name':'reference','label':'Reference'}
    ]

def get_sort_field (name):
    for field in event_fields:
        if name == field['name']:
            return field
    return None

def get_event_fields ():
    return event_fields

def get_all_events (sort = None):
    events = []
    results = mongo.event.find ()
    for item in results:
       events.append (item)
    if sort:
        events.sort (key = lambda event: event[sort['name']])
    return events

def get_event (id):
    return mongo.event.find_one ({'_id': ObjectId (id)})

def format_input (field, event = {}):
    field_type = field.get ('type')    
    if field_type == 'set':
        options = map(lambda x : OPTION(x,_value=x),field['set'])
        return SELECT(options, _name = field['name'])
    elif field_type == 'value_units':
        if event[field['name']]:
            val = event[field['name']].get ('value')
            units = event[field['name']].get ('units')
        else:
            val = None
            units = None
        def map_units (x):
            if x == units:
                return  OPTION (x, _value=x, _selected = 'selected')
            else:
                return  OPTION (x, _value=x)

        value = INPUT (_name = field['name'], _type='text', _value = val)
        options = map (map_units, field['units'])
        units = SELECT (options, _name = field['name'] + '_units')        
        return SPAN (value, units)
    else:
        return INPUT(_name=field['name'],_type='text', _value = event.get (field['name']) or '')

def format_field (field, value):
    field_type = field.get ('type')
    if field_type == 'set':
        return str (value)
    elif field_type == 'value_units':
        return value['value'] + ' ' + value['units']
    else:
        return str (value)

def format_event (attr):
    values= {}
    for field in event_fields:
        key = field['name']
        if attr.has_key(field['name']):
            if field.has_key('units'):            
                values[field['name']] = {'value':attr.get(key),'units':attr.get(key+'_units')}
            else:
                values[field['name']] = attr.get(key)
        else:
            values[field['name']]=None
    return values

def insert_event (attr):
    values = format_event (attr)
    return mongo.event.insert (values)

def delete_event (id):
    mongo.event.remove ({'_id': ObjectId (id)})

def update_event (id, attr):
    values = format_event (attr)
    mongo.event.update ({'_id': ObjectId (id)}, {'$set': values})


