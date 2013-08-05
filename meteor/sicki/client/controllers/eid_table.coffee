# wait til eidTable template loads
Meteor.startup () ->
  FIELDS = @sicki.constants.EID_EVENT_FIELDS
  render = @sicki.render
  eidEventService = @sicki.services.eidEventService
  proposalService = @sicki.services.proposalService
  pathogenService = @sicki.services.pathogenService

  Meteor.subscribe('userData')


  Template.eidTable.fields = () ->
    ({name: name, label: FIELDS[name].label} for name in _.keys(FIELDS))

  Template.eidTable.eidEvents = () ->
    events = eidEventService.read()
    mongoProposals = proposalService.find({accepted: true})
    proposals = {}
    for proposal in mongoProposals
      proposals[proposal._id] = proposal

    eidEvents = []
    for event in events
      eidEvent = {_id: event._id, eventFields: []}
      for field in _.keys(FIELDS)
        if event[field]
          eventProposals = (proposals?[proposalId] for proposalId in event[field] when proposals[proposalId])
          lastAcceptedProposal = _.max(eventProposals, (p) -> p?.accepted_date or null)
          if field is 'pathogen'
            pathogen = pathogenService.read(lastAcceptedProposal.value)
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
    setVal = (val, eventId, field) ->
      proposal =
        value: val,
        date: new Date(),
        source: Meteor.userId()

      proposalId = eidEventService.addProposal(eventId, field, proposal)
      proposalService.accept(proposalId)

    setter = (value,settings) ->
      setVal(value,settings.id,settings.name)
      if settings.name is 'pathogen'
        $(this).find('option:selected').text()
      else
        value

    handleNonEditingClick = (event) ->
      id = $(event.target).parent().attr('id')
      Session.set('selectedId', id)
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
            pathogens = pathogenService.read()
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
            pathogens = pathogenService.read()
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

  eidEventService.ready () ->
    proposalService.ready () ->
      pathogenService.ready () ->
        render()

