setVal = (val,eventId,field) ->
  changes = {}
  changes[field] = val
  @sicki.EIDEvents.update({_id: eventId},{ $set: changes } )

# wait til eidTable template loads
Meteor.startup () ->
  Template.eidTable.eidEvents = () ->
    @sicki.EIDEvents.find()

  rend = () ->
    @sicki.render()

    $('#eidTable').dataTable
      "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>"
      "sPaginationType": "bootstrap"
      "oLanguage":
        "sLengthMenu": "_MENU_ records per page"

    setter = (value,settings) ->
      setVal(value,settings.id,settings.name)
      value

    $('td').each( () ->
      id = $(this).parent().attr('id')
      col = $(this).attr('col')
      if col != 'open'
        $(this).editable(setter , {id: id, name: col} )
      else
        $(this).click( (event) ->
          Session.set('selectedEventId', id)
          rend()
        )
      )

  Meteor.subscribe('all_eid_events', _.bind(rend, this))


