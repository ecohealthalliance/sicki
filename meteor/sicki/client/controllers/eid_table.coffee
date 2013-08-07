Meteor.startup () ->
  FIELDS = @sicki.constants.EID_EVENT_FIELDS
  render = @sicki.render
  TableController = @sicki.controllers.TableController
  eidEventService = @sicki.services.eidEventService
  proposalService = @sicki.services.proposalService
  pathogenService = @sicki.services.pathogenService

  Meteor.subscribe('userData')

  Template.eidTable.fields = () ->
    ({name: name, label: FIELDS[name].label} for name in _.keys(FIELDS))

  Template.eidTable.rows = () ->
    events = eidEventService.read()
    mongoProposals = proposalService.find({accepted: true})
    proposals = {}
    for proposal in mongoProposals
      proposals[proposal._id] = proposal

    rows = []
    for event in events
      row = {_id: event._id, data: []}
      for field in _.keys(FIELDS)
        if event[field]
          eventProposals = (proposals?[proposalId] for proposalId in event[field] when proposals[proposalId])
          lastAcceptedProposal = _.max(eventProposals, (p) -> p?.accepted_date or null)
          if field is 'pathogen'
            pathogen = pathogenService.read(lastAcceptedProposal.value)
            row.data.push({field: field, value: pathogen?.reported_name})
          else
            row.data.push({field: field, value: lastAcceptedProposal?.value})
        else
          row.data.push({field: field, value: ""})
      rows.push(row)
    rows
      
  Template.eidTable.renderHeader = () ->
    Template.eidTableHeader()
    
  Template.eidTableHeader.admin = () ->
    Meteor.user()?.admin

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
    id = $(event.target).parent().attr('data-id')
    Session.set('selectedId', id)
    render()

  setupEvents = () ->
    setupTableEvents = () ->
      if $('.toggle-edit').hasClass('edit-on')
        $('td').each( () ->
          id = $(this).parent().attr('data-id')
          col = $(this).attr('col')
          options = {id: id, name: col}
          if col is 'pathogen'
            options.type = 'select'
            pathogens = pathogenService.read()
            options.data = {}
            options.data[pathogen._id] = pathogen.reported_name for pathogen in pathogens
            options.submit = 'Select'
          $(this).unbind().editable(setter, options)
        )
      else
        $('td').unbind().click(handleNonEditingClick)

    $('.toggle-edit').unbind().click( (event) ->
      if $(event.target).hasClass('edit-on')
        $(event.target).removeClass('edit-on')
        $(event.target).html('Turn On Edit Mode')
      else
        $(event.target).addClass('edit-on')
        $(event.target).html('Turn Off Edit Mode')
      setupTableEvents()
    )

    setupTableEvents()

  controller = new TableController('eidEvents', Template.eidTable, setupEvents)
  controller.start()

