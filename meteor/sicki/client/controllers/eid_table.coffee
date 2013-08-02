# wait til eidTable template loads
Meteor.startup () ->
  FIELDS = @sicki.constants.EID_EVENT_FIELDS
  EIDEvents = @sicki.collections.EIDEvents
  Proposals = @sicki.collections.Proposals
  Pathogens = @sicki.collections.Pathogens
  render = @sicki.render

  Meteor.subscribe('Proposals')
  Meteor.subscribe('userData')

  Template.eidTable.fields = () ->
    ({name: name, label: FIELDS[name].label} for name in _.keys(FIELDS))

  Template.eidTable.eidEvents = () ->
    events = EIDEvents.find().fetch()
    mongoProposals = Proposals.find({accepted: true}).fetch()
    proposals = {}
    for proposal in mongoProposals
      proposals[proposal._id.toHexString()] = proposal

    eidEvents = []
    for event in events
      eidEvent = {_id: event._id, eventFields: []}
      for field in _.keys(FIELDS)
        if event[field]
          eventProposals = (proposals?[proposalId.toHexString()] for proposalId in event[field] when proposals[proposalId.toHexString()])
          lastAcceptedProposal = _.max(eventProposals, (p) -> p?.accepted_date or null)
          if field is 'pathogen'
            pathogen = Pathogens.findOne({_id: lastAcceptedProposal.value})
            eidEvent.eventFields.push({field: field, value: pathogen?.reported_name})
          else
            eidEvent.eventFields.push({field: field, value: lastAcceptedProposal?.value})
        else
          eidEvent.eventFields.push({field: field, value: ""})
      eidEvents.push(eidEvent)
    eidEvents
      

  Template.eidTable.admin = () ->
    Meteor.user()?.admin

  loadDataTable = () ->
    setVal = (val,eventId,field) ->
      proposalId = Proposals.insert({
        value: val,
        date: new Date(),
        source: Meteor.userId(),
        accepted: true,
        accepted_by: Meteor.userId(),
        accepted_date: new Date()
      })

      event = EIDEvents.findOne({_id: eventId})
      proposals = {}
      proposals[field] = event[field] or []
      proposals[field].push(proposalId)
      EIDEvents.update({_id: eventId}, {$set: proposals})

    setter = (value,settings) ->
      setVal(value,settings.id,settings.name)
      if settings.name is 'pathogen'
        $(this).find('option:selected').text()
      else
        value

    handleNonEditingClick = (event) ->
      id = $(event.target).parent().attr('id')
      Session.set('selectedEventId', id)
      render()

    $('.toggle-edit').click( (event) ->
      if $(event.target).hasClass('edit-on')
        $('td').unbind('all').click(handleNonEditingClick)
        $(event.target).removeClass('edit-on')
        $(event.target).html('Turn On Edit Mode')
      else
        $('td').each( () ->
          id = $(this).parent().attr('id')
          col = $(this).attr('col')
          options = {id: id, name: col}
          if col is 'pathogen'
            options.type = 'select'
            pathogens = Pathogens.find().fetch()
            options.data = {}
            options.data[pathogen._id] = pathogen.reported_name for pathogen in pathogens
            options.submit = 'Select'
          $(this).unbind('click').editable(setter, options)
        )
        $(event.target).addClass('edit-on')
        $(event.target).html('Turn Off Edit Mode')
    )

    setupEvents = () ->
      if $('.toggle-edit').hasClass('edit-on')
        $('td').each( () ->
          id = $(this).parent().attr('id')
          col = $(this).attr('col')
          options = {id: id, name: col}
          if col is 'pathogen'
            options.type = 'select'
            pathogens = Pathogens.find().fetch()
            options.data = {}
            options.data[pathogen._id] = pathogen.reported_name for pathogen in pathogens
            options.submit = 'Select'
          $(this).unbind('click').editable(setter, options)
        )
      else
        $('td').unbind('all').click(handleNonEditingClick)

    if $('#eidTable').length
      table = $('#eidTable').dataTable
        "sDom": "<'table-controls'<'table-control-row'<'span6'l><'filter-control'f>><'table-control-row'<'column-control'C>>r>t<'row-fluid'<'span6'i><'span6'p>>"
        "sPaginationType": "full_numbers"
        "oLanguage":
          "sLengthMenu": "_MENU_ records per page"
        "fnDrawCallback": setupEvents
        "bAutoWidth": false

      table.fnSetColumnVis(i, false) for i in [5..._.keys(FIELDS).length]

      $('.eid-table-container').show()
      $('.loading-message').hide()

  @sicki.registerRenderCallback(loadDataTable)

  Meteor.subscribe('EIDEvents', render)


