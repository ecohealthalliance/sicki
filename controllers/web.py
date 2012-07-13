def insert():
    ''' USAGE example: insert_event (mongo,{'name':"Cambodia 2012", 'pathogen':"Hand, foot, and mouth"})'''
    require_logged_in ()
    fields=[]
    for field in event_fields:
        if field.has_key('label'):
            label = field['label']
        else:
            label = field['name']
        fields.append(LABEL(label))

        if field.has_key('set'):
            options = map(lambda x : OPTION(x,_value=x),field['set'])
            fields.append(SELECT(options,_name=field['name']))
        elif field.has_key('units'):
            fields.append(INPUT(_name=field['name'],_type='text'))
            options = map(lambda x : OPTION(x,_value=x),field['units'])
            fields.append(SELECT(options,_name=field['name']+'_units'))
        else:
            fields.append(INPUT(_name=field['name'],_type='text'))


        fields.append(BR())
    fields.append(INPUT(_value="Enter", _type="submit"))
    form=FORM(fields)
    if form.accepts(request,session):
        insert_event (form.vars)
        return "OK"
    else:
        return {'form': form}

def events():
    return {'events': get_all_events ()}


def stats():
    id = request.args (0)
    if not id:
        raise HTTP (400, 'Missing Event ID')
    event = get_event (id);
    request.title = 'Stats for %s' % event['event_name']
    return {
        'event_fields': event_fields,
        'event': event
        }
