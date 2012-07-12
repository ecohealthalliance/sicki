def index():
    ''' USAGE example: insert_case(mongo,{'name':"Cambodia 2012", 'pathogen':"Hand, foot, and mouth"})'''
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
#        return(str(form.vars))
        insert_case(form.vars)
    else:
        return(dict(form=form))
