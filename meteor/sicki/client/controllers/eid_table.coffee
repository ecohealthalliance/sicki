# wait til eidTable template loads
Meteor.startup () ->
  EIDEvents = @sicki.EIDEvents
  render = @sicki.render

  Template.eidTable.eidEvents = () ->
    EIDEvents.find()

  loadDataTable = () ->
    $('#eidTable').dataTable
      "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>"
      "sPaginationType": "bootstrap"
      "oLanguage":
        "sLengthMenu": "_MENU_ records per page"

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

  @sicki.registerRenderCallback(loadDataTable)

  Meteor.subscribe('all_eid_events', render)


