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
    {'name':'pathogens','label':'Pathogen(s)', 'type':'nested', 'children':
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

def get_sort_field (name):
    for field in event_fields:
        if name == field['name']:
            return field
    return None

def get_event_fields ():
    return event_fields

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
    return mongo.events.find_one ({'_id': ObjectId (id)})

def merge_request_event (attr):
    vals = {}
    for field in event_fields:
        key = field['name']
        if request.vars.has_key (key):
            vals[key] = pack_field (field, request.vars)
        elif attr.has_key (key):
            vals[key] = attr[key]
    vals['references'] = attr.get ('references') or []
    return vals

def format_input (field, event = {}):
    key = field['name']
    field_type = field.get ('type')    
    if field_type == 'set':
        options = map(lambda x : OPTION(x,_value=x),field['set'])
        return SELECT(options, _name = key)
    elif field_type == 'value_units':
        if event.get (key):
            val = event[key].get ('value') or ''
            units = event[key].get ('units') or ''
        else:
            val = ''
            units = ''

        def map_units (x):
            if x == units:
                return  OPTION (x, _value=x, _selected = 'selected')
            else:
                return  OPTION (x, _value=x)

        value = INPUT (_name = field['name'], _type='text', _value = val)
        options = map (map_units, field['units'])
        units = SELECT (options, _name = field['name'] + '_units')        
        return SPAN (value, units)
    elif field_type == 'nested':
        i = 0

        if event.get (key):
            children = event[key]
        else:
            children = []

        def format_nested (x, i):
            sub_inputs = []
            sub_inputs.append (INPUT (_type="hidden", _name="%s_%d" % (field['name'], i), _value="true"))
            for sub_field in field['children']:
                sub_key = '%s_%s_%d' % (field['name'], sub_field['name'], i)
                sub_inputs.append(LABEL(sub_field.get('label') or sub_field['name']))
                sub_inputs.append(INPUT(_name=sub_key,_type='text',_value = x.get(sub_field['name']) or ''))
                sub_inputs.append(BR())
            
            return DIV (sub_inputs, _class = "nested")

        child_list = [A ("Add  Sub Item", _href="#", _class="append_field"), INPUT(_name="%s_num" % field['name'], _type="hidden", _value=len (children))]
        for i, child in enumerate(children):
            child_list.append(format_nested (child, i))

        #i += 1
        #child_list.append (format_nested ({}, i))
        return DIV(child_list)

    else:
        val = event.get (key) or ''
        return INPUT(_name=field['name'],_type='text', _value = val)

def validate_event (attr):
    for field in event_fields:
        key = field['name']
        if field.get ('required') and not attr.get (key):
            return False
    return True            

def format_field (field, value):
    if not value:
        return ''
    field_type = field.get ('type')
    if field_type == 'set':
        return unicode (value)
    elif field_type == 'value_units':
        return value['value'] + ' ' + value['units']
    elif field_type == 'nested':
        items = []
        for val in value:
            item = []
            for sub_field in field['children']:
                key = sub_field['name']
                item.append (DIV (B (sub_field.get ('label') or sub_field['name']), val.get(sub_field['name']) or ''))
            items.append (DIV (item, _class="nested"))
        return DIV (items)
    else:
        return unicode (value)

def pack_field (field, attr):
    key = field['name']
    if attr.has_key(field['name']):
        if field.has_key('units'):            
            return {'value': attr.get(key), 'units': attr.get (key + '_units')}
        else:
            return attr.get(key)

    if field.get ('type') == 'nested':
        def field_exists (i):
            for sub_field in field['children']:
                if attr.get('%s_%s_%d' % (field['name'], sub_field['name'], i)):
                    return True
            return False

        def add_item (item, i):
            for sub_field in field['children']:
                item[sub_field['name']] = attr.get ('%s_%s_%d' % (field['name'], sub_field['name'], i))

        values = []
        i = 0
        for i in range (0, int (attr['%s_num' % field['name']])):
            if field_exists (i):
                item = {}
                add_item (item, i)
                values.append (item)
        return values
    else:
        return None

def format_event (attr):
    values= {}
    for field in event_fields:
        values[field['name']] = pack_field (field, attr)
    return values

def insert_event (attr):
    values = format_event (attr)
    return mongo.events.insert (values)

def delete_event (id):
    mongo.events.remove ({'_id': ObjectId (id)})

def update_event (id, attr):
    values = format_event (attr)
    mongo.events.update ({'_id': ObjectId (id)}, {'$set': values})
