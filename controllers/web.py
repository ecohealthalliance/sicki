def insert():
    ''' USAGE example: insert_event (mongo,{'name':"Cambodia 2012", 'pathogen':"Hand, foot, and mouth"})'''
    require_logged_in ()
    fields=[]
    id = request.args (0)
    if id:
        event = get_event (id)
    else:
        event = {}
    for field in event_fields:
        fields.append (LABEL (field.get ('label') or field['name']))
        fields.append (format_input (field, event))
        fields.append (BR ())

        '''if field.has_key('label'):
            label = field['label']
        else:
            label = field['name']
        fields.append(LABEL(label))'''

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
        return {'form': form}

def edit():
    pass

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
