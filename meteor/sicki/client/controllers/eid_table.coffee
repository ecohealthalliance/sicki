# wait til eidTable template loads
Meteor.startup () ->
  FIELDS = @sicki.EID_EVENT_FIELDS
  EIDEvents = @sicki.EIDEvents
  Proposals = @sicki.Proposals
  render = @sicki.render

  Meteor.subscribe('all_proposals')
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
          proposalValues = (proposals?[proposalId.toHexString()]?.value for proposalId in event[field])
          eidEvent.eventFields.push({field: field, values: (value for value in proposalValues when value)})
        else
          eidEvent.eventFields.push({field: field, values: []})
      eidEvents.push(eidEvent)
    eidEvents
      

  Template.eidTable.admin = () ->
    Meteor.user()?.admin

  loadDataTable = () ->
    setupEvents = () ->
      setVal = (val,eventId,field) ->
        changes = {}
        changes[field] = val
        EIDEvents.update({_id: eventId},{ $set: changes } )

      setter = (value,settings) ->
        setVal(value,settings.id,settings.name)
        value

      handleNonEditingClick = (event) ->
        id = $(event.target).parent().attr('id')
        Session.set('selectedEventId', id)
        render()

      $('td:not(.edit)').click(handleNonEditingClick)

      $('td.edit').click( (event) ->
        if $(event.target).hasClass('editing')
          parent = $(event.target).parent()
          parent.children('td:not(.edit)').unbind('all').click(handleNonEditingClick)
          $(event.target).removeClass('editing')
          $(event.target).html('Edit')
        else
          parent = $(event.target).parent()
          id = $(this).parent().attr('id')
          parent.children('td:not(.edit)').each( () ->
            col = $(this).attr('col')
            $(this).unbind('click').editable(setter , {id: id, name: col} )
          )
          $(event.target).addClass('editing')
          $(event.target).html('Stop editing')
      )

    table = $('#eidTable').dataTable
      "sDom": "<'row-fluid'<'span6'C>><'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>"
      "sPaginationType": "bootstrap"
      "oLanguage":
        "sLengthMenu": "_MENU_ records per page"
      "fnDrawCallback": setupEvents
      "bAutoWidth": false

    table.fnSetColumnVis(i, false) for i in [5..._.keys(FIELDS).length]
    ColVis.fnRebuild(table)

  @sicki.registerRenderCallback(loadDataTable)

  Meteor.subscribe('all_eid_events', render)


