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
    {'name':'host_age', 'label':'Host Age','set':host_age},
    {'name':'host_use','label':'Host Use', 'set':host_use},
    {'name':'transition_model','label':'Transition Model','set':transition_model},
    {'name':'zoonotic_type','label':'Zoonotic Type', 'set':zoonotic_type},
    {'name':'number_infected','label':'Number Infected'},
    {'name':'prevalence','label':'Prevalence'},
    {'name':'duration','label':'Duration', 'units':time_period},
    {'name':'symptoms_reported','label':'Symptoms Reported'},
    {'name':'host_sex','label':'Host Sex', 'set':host_sex},
    {'name':'sample_type','label':'Sample Type','set':sample_type},
    {'name':'driver','label':'Driver','set':driver},
    {'name':'domestication_status','label':'Domestication Status','set':domestication_status},
    {'name':'number_deaths','label':'Number of deaths'},
    {'name':'contact','label':'Contact'},
    {'name':'notes','label':'Notes'},
    {'name':'reference','label':'Reference'}
    ]


def insert_case(attr):
    values={}
    
    for field in event_fields:
        key = field['name']
        if attr.has_key(field['name']):
            if field.has_key('units'):            
                values[field['name']] = {'value':attr.get(key),'units':attr.get(key+'_units')}
            else:
                values[field['name']] = attr.get(key)
        else:
            values[field['name']]=None
    mongo.event.insert(values)


